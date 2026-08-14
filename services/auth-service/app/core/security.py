"""
Core cryptographic operations for the Auth Service: password hashing,
JWT access/refresh token issuance, and MFA (TOTP) secret handling.

This is the ONLY service that ever creates tokens; every other service
only validates them via libs/auth_client.
"""
from __future__ import annotations

import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Literal

import pyotp
from jose import jwt
from passlib.context import CryptContext

from app.core.config import get_settings

settings = get_settings()

# bcrypt is deliberately slow — that is the point, for password storage.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

TokenType = Literal["access", "refresh", "mfa_challenge"]


# ---------------------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------------------
def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)


# ---------------------------------------------------------------------------
# JWT issuance
# ---------------------------------------------------------------------------
def _create_token(
    subject: str,
    token_type: TokenType,
    expires_delta: timedelta,
    extra_claims: dict | None = None,
) -> tuple[str, str, datetime]:
    """Returns (encoded_jwt, jti, expires_at). jti is stored server-side for
    refresh tokens so they can be individually revoked (Redis denylist)."""
    now = datetime.now(timezone.utc)
    expires_at = now + expires_delta
    jti = str(uuid.uuid4())

    payload = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": expires_at,
        "jti": jti,
        **(extra_claims or {}),
    }
    encoded = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded, jti, expires_at


def create_access_token(user_id: str, email: str, role: str, org_id: str) -> tuple[str, datetime]:
    token, _jti, expires_at = _create_token(
        subject=user_id,
        token_type="access",
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        extra_claims={"email": email, "role": role, "org_id": org_id},
    )
    return token, expires_at


def create_refresh_token(user_id: str) -> tuple[str, str, datetime]:
    """Returns (token, jti, expires_at) — the caller persists jti so the
    token can be revoked (rotation-on-use, logout, or admin-forced logout)."""
    return _create_token(
        subject=user_id,
        token_type="refresh",
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )


def create_mfa_challenge_token(user_id: str) -> str:
    """Short-lived token issued after correct password but before MFA is
    verified; the frontend's Two-Factor page submits this + the OTP code."""
    token, _jti, _exp = _create_token(
        subject=user_id, token_type="mfa_challenge", expires_delta=timedelta(minutes=5)
    )
    return token


def decode_token(token: str) -> dict:
    """Raises jose.JWTError on invalid/expired/tampered tokens — callers
    catch this and translate to a 401 via libs.common.UnauthorizedError."""
    return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])


# ---------------------------------------------------------------------------
# MFA (TOTP)
# ---------------------------------------------------------------------------
def generate_mfa_secret() -> str:
    return pyotp.random_base32()


def get_mfa_provisioning_uri(secret: str, email: str) -> str:
    return pyotp.totp.TOTP(secret).provisioning_uri(name=email, issuer_name=settings.MFA_ISSUER_NAME)


def verify_totp_code(secret: str, code: str) -> bool:
    return pyotp.totp.TOTP(secret).verify(code, valid_window=1)


# ---------------------------------------------------------------------------
# Password reset / email verification tokens (single-use, random, not JWT —
# these are looked up against a DB row so they can be marked used/expired
# independent of any signature check)
# ---------------------------------------------------------------------------
def generate_secure_token() -> str:
    return secrets.token_urlsafe(32)
