"""
Shared JWT validation for every service EXCEPT auth-service itself (which
issues the tokens this module validates). Import `get_current_user` as a
FastAPI dependency to protect any route; import `require_role` to add
RBAC scope checks on top of authentication.

Install into each service as an editable local package:
    pip install -e ../../libs/auth_client
"""
from __future__ import annotations

import os
from typing import Optional

from fastapi import Depends, Header
from jose import jwt, JWTError
from pydantic import BaseModel

# Must match the signing key configured on auth-service. In production this
# is a shared secret injected via Kubernetes Secret (see roadmap Chapter 11).
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "CHANGE-ME-IN-ENV-NEVER-COMMIT-REAL-SECRET")
JWT_ALGORITHM = "HS256"

# Roles, matching the RBAC matrix in the roadmap (Chapter 6.3)
ROLE_ADMIN = "administrator"
ROLE_MANAGER = "manager"
ROLE_ANALYST = "soc_analyst"
ROLE_AUDITOR = "auditor"


class CurrentUser(BaseModel):
    user_id: str
    email: str
    role: str
    org_id: str


class TokenError(Exception):
    """Raised on any invalid/expired/malformed token; caught by callers to
    raise the appropriate HTTP error via libs.common.UnauthorizedError."""


def decode_access_token(token: str) -> CurrentUser:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except JWTError as exc:
        raise TokenError(str(exc)) from exc

    if payload.get("type") != "access":
        raise TokenError("Token is not an access token")

    try:
        return CurrentUser(
            user_id=payload["sub"],
            email=payload["email"],
            role=payload["role"],
            org_id=payload.get("org_id", "default"),
        )
    except KeyError as exc:
        raise TokenError(f"Access token is missing required claim: {exc}") from exc


def _extract_bearer_token(authorization: Optional[str]) -> str:
    from common import UnauthorizedError  # local import avoids a hard dependency cycle

    if not authorization or not authorization.lower().startswith("bearer "):
        raise UnauthorizedError("Missing or malformed Authorization header.")
    return authorization.split(" ", 1)[1].strip()


def get_current_user(authorization: Optional[str] = Header(default=None)) -> CurrentUser:
    """FastAPI dependency: `user: CurrentUser = Depends(get_current_user)`"""
    from common import UnauthorizedError

    token = _extract_bearer_token(authorization)
    try:
        return decode_access_token(token)
    except TokenError as exc:
        raise UnauthorizedError(f"Invalid access token: {exc}") from exc


def require_role(*allowed_roles: str):
    """
    FastAPI dependency factory for RBAC enforcement.
    Usage: @router.post(..., dependencies=[Depends(require_role(ROLE_ADMIN))])
    """

    def _check(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        from common import ForbiddenError

        if user.role not in allowed_roles:
            raise ForbiddenError(
                f"This action requires one of roles {allowed_roles}, but user has role '{user.role}'."
            )
        return user

    return _check
