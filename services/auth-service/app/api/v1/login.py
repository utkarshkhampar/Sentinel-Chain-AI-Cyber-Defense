from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from common import ok
from app.db.session import get_db
from app.core.cookies import set_refresh_cookie, clear_refresh_cookie, read_refresh_cookie
from app.schemas.auth import LoginRequest, RegisterRequest, MessageResponse, UserPublic
from app.services import auth_service

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    user = auth_service.register_user(
        db, full_name=payload.fullName, company=payload.company, email=payload.email, password=payload.password
    )
    return ok({"message": "Account created. Check your email for a verification code.", "user_id": str(user.id)})


@router.post("/login")
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = auth_service.authenticate(db, payload.email, payload.password)

    if user.mfa_enabled:
        challenge_token = auth_service.begin_mfa_challenge(user)
        return ok({"mfa_required": True, "mfa_challenge_token": challenge_token})

    access_token, refresh_token, expires_at = auth_service.issue_token_pair(db, user)
    set_refresh_cookie(response, refresh_token)
    return ok({
        "access_token": access_token,
        "token_type": "bearer",
        "expires_at": expires_at.isoformat(),
        "user": UserPublic.model_validate(user).model_dump(),
    })


@router.post("/refresh")
def refresh(request: Request, response: Response, db: Session = Depends(get_db)):
    current_refresh_token = read_refresh_cookie(request)
    access_token, new_refresh_token, expires_at = auth_service.refresh_access_token(db, current_refresh_token)
    set_refresh_cookie(response, new_refresh_token)
    return ok({"access_token": access_token, "token_type": "bearer", "expires_at": expires_at.isoformat()})


@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get("sentinel_refresh_token")
    if token:
        auth_service.logout(db, token)
    clear_refresh_cookie(response)
    return ok(MessageResponse(message="Logged out successfully.").model_dump())


@router.post("/verify-email")
def verify_email(code: str, db: Session = Depends(get_db)):
    user = auth_service.verify_email(db, code)
    return ok({"message": "Email verified successfully.", "user_id": str(user.id)})
