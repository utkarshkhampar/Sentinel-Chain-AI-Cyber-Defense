from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone

import redis
from sqlalchemy import select
from sqlalchemy.orm import Session

from common import UnauthorizedError, ValidationAppError, ConflictError
from events import Topics, AuditLogEvent
from events.kafka_client import EventPublisher

from app.core import security
from app.core.config import get_settings
from app.models.user import User, RefreshToken, PasswordResetToken, EmailVerificationToken

settings = get_settings()
_redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
_publisher = EventPublisher()


def _audit(actor: str, action: str, target: str, result: str, ip_address: str | None = None) -> None:
    _publisher.publish(
        Topics.AUDIT_LOG,
        AuditLogEvent(source_service="auth-service", actor=actor, action=action, target=target,
                      result=result, ip_address=ip_address),
        key=actor,
    )


# ---------------------------------------------------------------------------
# Registration & email verification
# ---------------------------------------------------------------------------
def register_user(db: Session, full_name: str, company: str, email: str, password: str) -> User:
    existing = db.scalar(select(User).where(User.email == email))
    if existing:
        raise ConflictError("An account with this email already exists.")

    user = User(
        full_name=full_name,
        email=email,
        password_hash=security.hash_password(password),
        role="soc_analyst",
        status="invited",
        email_verified=False,
    )
    db.add(user)
    db.flush()  # populate user.id before creating the verification token

    _issue_email_verification_code(db, user)
    db.commit()
    _audit(actor=email, action="register", target=str(user.id), result="success")
    return user


def _issue_email_verification_code(db: Session, user: User) -> str:
    import random

    code = f"{random.randint(0, 999999):06d}"
    token = EmailVerificationToken(
        user_id=user.id, code=code, expires_at=datetime.now(timezone.utc) + timedelta(minutes=15)
    )
    db.add(token)
    # In production this triggers Notification Service to email the code;
    # here we return it so the caller (route handler) can log/return it in
    # non-production environments for local testing without an email server.
    return code


def verify_email(db: Session, code: str) -> User:
    row = db.scalar(
        select(EmailVerificationToken)
        .where(EmailVerificationToken.code == code, EmailVerificationToken.used.is_(False))
        .order_by(EmailVerificationToken.created_at.desc())
    )
    if not row or row.expires_at < datetime.now(timezone.utc):
        raise ValidationAppError("Verification code is invalid or has expired.")

    user = db.get(User, row.user_id)
    if not user:
        raise ValidationAppError("No account associated with this verification code.")

    user.email_verified = True
    user.status = "active"
    row.used = True
    db.commit()
    _audit(actor=user.email, action="verify_email", target=str(user.id), result="success")
    return user


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------
def authenticate(db: Session, email: str, password: str) -> User:
    user = db.scalar(select(User).where(User.email == email))
    if not user or not security.verify_password(password, user.password_hash):
        _audit(actor=email, action="login", target=email, result="failed")
        raise UnauthorizedError("Incorrect email or password.")
    if user.status == "suspended":
        raise UnauthorizedError("This account has been suspended. Contact your administrator.")
    return user


def issue_token_pair(db: Session, user: User) -> tuple[str, str, datetime]:
    access_token, expires_at = security.create_access_token(
        user_id=str(user.id), email=user.email, role=user.role, org_id=user.org_id
    )
    refresh_token, jti, refresh_expires_at = security.create_refresh_token(user_id=str(user.id))

    db.add(RefreshToken(user_id=user.id, jti=jti, expires_at=refresh_expires_at))
    user.last_active_at = datetime.now(timezone.utc)
    db.commit()

    _audit(actor=user.email, action="login", target=str(user.id), result="success")
    return access_token, refresh_token, expires_at


# ---------------------------------------------------------------------------
# Refresh & logout
# ---------------------------------------------------------------------------
def refresh_access_token(db: Session, refresh_token: str) -> tuple[str, str, datetime]:
    try:
        payload = security.decode_token(refresh_token)
    except Exception as exc:  # jose.JWTError subclasses
        raise UnauthorizedError("Invalid or expired refresh token.") from exc

    if payload.get("type") != "refresh":
        raise UnauthorizedError("Token is not a refresh token.")

    jti = payload["jti"]
    if _redis.sismember("revoked_jti", jti):
        raise UnauthorizedError("This refresh token has been revoked.")

    row = db.scalar(select(RefreshToken).where(RefreshToken.jti == jti, RefreshToken.revoked.is_(False)))
    if not row:
        raise UnauthorizedError("Refresh token not recognized.")

    user = db.get(User, row.user_id)
    if not user:
        raise UnauthorizedError("User account no longer exists.")

    # Rotation: revoke the used refresh token, issue a brand new pair.
    row.revoked = True
    _redis.sadd("revoked_jti", jti)
    db.commit()

    access_token, expires_at = security.create_access_token(
        user_id=str(user.id), email=user.email, role=user.role, org_id=user.org_id
    )
    new_refresh_token, new_jti, new_refresh_expires_at = security.create_refresh_token(user_id=str(user.id))
    db.add(RefreshToken(user_id=user.id, jti=new_jti, expires_at=new_refresh_expires_at))
    db.commit()

    return access_token, new_refresh_token, expires_at


def logout(db: Session, refresh_token: str) -> None:
    try:
        payload = security.decode_token(refresh_token)
    except Exception:
        return  # already invalid; logout is idempotent
    jti = payload.get("jti")
    if not jti:
        return
    _redis.sadd("revoked_jti", jti)
    row = db.scalar(select(RefreshToken).where(RefreshToken.jti == jti))
    if row:
        row.revoked = True
        db.commit()


# ---------------------------------------------------------------------------
# MFA
# ---------------------------------------------------------------------------
def begin_mfa_challenge(user: User) -> str:
    return security.create_mfa_challenge_token(user_id=str(user.id))


def complete_mfa_challenge(db: Session, mfa_challenge_token: str, code: str) -> User:
    try:
        payload = security.decode_token(mfa_challenge_token)
    except Exception as exc:
        raise UnauthorizedError("MFA challenge has expired. Please log in again.") from exc

    if payload.get("type") != "mfa_challenge":
        raise UnauthorizedError("Invalid MFA challenge token.")

    user = db.get(User, uuid.UUID(payload["sub"]))
    if not user or not user.mfa_enabled or not user.mfa_secret:
        raise UnauthorizedError("MFA is not enabled for this account.")

    if not security.verify_totp_code(user.mfa_secret, code):
        _audit(actor=user.email, action="mfa_verify", target=str(user.id), result="failed")
        raise UnauthorizedError("Incorrect verification code.")

    _audit(actor=user.email, action="mfa_verify", target=str(user.id), result="success")
    return user


def enroll_mfa(user: User) -> tuple[str, str]:
    """Returns (secret, provisioning_uri) for the frontend to render as a QR code.
    mfa_enabled is only flipped to True once the user confirms with a valid code
    via a subsequent /auth/mfa/confirm-enrollment call (Settings > Security tab)."""
    secret = security.generate_mfa_secret()
    uri = security.get_mfa_provisioning_uri(secret, user.email)
    return secret, uri


# ---------------------------------------------------------------------------
# Password reset
# ---------------------------------------------------------------------------
def request_password_reset(db: Session, email: str) -> None:
    user = db.scalar(select(User).where(User.email == email))
    if not user:
        # Deliberately do not reveal whether the email exists.
        return
    token = PasswordResetToken(
        user_id=user.id,
        token=security.generate_secure_token(),
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
    )
    db.add(token)
    db.commit()
    # In production, Notification Service emails a link containing token.token.
    _audit(actor=email, action="request_password_reset", target=str(user.id), result="success")


def reset_password(db: Session, token: str, new_password: str) -> None:
    row = db.scalar(
        select(PasswordResetToken).where(PasswordResetToken.token == token, PasswordResetToken.used.is_(False))
    )
    if not row or row.expires_at < datetime.now(timezone.utc):
        raise ValidationAppError("This password reset link is invalid or has expired.")

    user = db.get(User, row.user_id)
    if not user:
        raise ValidationAppError("No account associated with this reset link.")

    user.password_hash = security.hash_password(new_password)
    row.used = True

    # Revoke all existing refresh tokens on password change — a leaked
    # session should not survive a password reset.
    for rt in db.scalars(select(RefreshToken).where(RefreshToken.user_id == user.id, RefreshToken.revoked.is_(False))):
        rt.revoked = True
        _redis.sadd("revoked_jti", rt.jti)

    db.commit()
    _audit(actor=user.email, action="reset_password", target=str(user.id), result="success")
