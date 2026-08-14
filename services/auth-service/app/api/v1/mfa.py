from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from common import ok, ValidationAppError
from auth_client import get_current_user, CurrentUser
from app.db.session import get_db
from app.core.cookies import set_refresh_cookie
from app.schemas.auth import MfaVerifyRequest, UserPublic
from app.services import auth_service
from app.models.user import User

router = APIRouter(prefix="/api/v1/auth/mfa", tags=["auth", "mfa"])


@router.post("/verify")
def verify_mfa(payload: MfaVerifyRequest, response: Response, db: Session = Depends(get_db)):
    """Second step of login when the account has MFA enabled — the frontend's
    Two-Factor page submits the challenge token plus the 6-digit code here."""
    user = auth_service.complete_mfa_challenge(db, payload.mfa_challenge_token, payload.code)
    access_token, refresh_token, expires_at = auth_service.issue_token_pair(db, user)
    set_refresh_cookie(response, refresh_token)
    return ok({
        "access_token": access_token,
        "token_type": "bearer",
        "expires_at": expires_at.isoformat(),
        "user": UserPublic.model_validate(user).model_dump(),
    })


@router.post("/enroll")
def enroll_mfa(current: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """Settings > Security tab: start MFA enrollment. Returns a secret +
    provisioning URI for the frontend to render as a QR code. MFA is not
    actually enabled until /confirm-enrollment succeeds with a valid code."""
    from uuid import UUID

    user = db.get(User, UUID(current.user_id))
    secret, uri = auth_service.enroll_mfa(user)
    user.mfa_secret = secret  # not yet "enabled" until confirmed below
    db.commit()
    return ok({"secret": secret, "provisioning_uri": uri})


@router.post("/confirm-enrollment")
def confirm_mfa_enrollment(code: str, current: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    from uuid import UUID
    from app.core import security

    user = db.get(User, UUID(current.user_id))
    if not user.mfa_secret:
        raise ValidationAppError("No MFA enrollment in progress. Call /enroll first.")
    if not security.verify_totp_code(user.mfa_secret, code):
        raise ValidationAppError("Incorrect verification code.")

    user.mfa_enabled = True
    db.commit()
    return ok({"message": "MFA has been enabled for your account."})
