"""
Refresh tokens are delivered as an http-only, secure, same-site cookie —
never in a JSON body — so client-side JavaScript can never read or exfiltrate
them (see roadmap Chapter 6.1). Access tokens ARE returned in the JSON body;
the frontend keeps them in memory only (never localStorage).
"""
from fastapi import Response, Request

from common import UnauthorizedError
from app.core.config import get_settings

settings = get_settings()

REFRESH_COOKIE_NAME = "sentinel_refresh_token"


def set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=settings.ENVIRONMENT != "local",  # allow http on localhost only
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/api/v1/auth",
    )


def clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(key=REFRESH_COOKIE_NAME, path="/api/v1/auth")


def read_refresh_cookie(request: Request) -> str:
    token = request.cookies.get(REFRESH_COOKIE_NAME)
    if not token:
        raise UnauthorizedError("No refresh session found. Please log in again.")
    return token
