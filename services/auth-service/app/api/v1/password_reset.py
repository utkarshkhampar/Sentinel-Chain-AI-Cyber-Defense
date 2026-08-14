from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from common import ok
from app.db.session import get_db
from app.schemas.auth import ForgotPasswordRequest, ResetPasswordRequest, MessageResponse
from app.services import auth_service

router = APIRouter(prefix="/api/v1/auth", tags=["auth", "password-reset"])


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    auth_service.request_password_reset(db, payload.email)
    # Always return the same message whether or not the email exists,
    # so this endpoint can't be used to enumerate registered accounts.
    return ok(MessageResponse(
        message="If an account exists for that email, a reset link has been sent."
    ).model_dump())


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    auth_service.reset_password(db, payload.token, payload.password)
    return ok(MessageResponse(message="Password updated successfully. Please sign in.").model_dump())
