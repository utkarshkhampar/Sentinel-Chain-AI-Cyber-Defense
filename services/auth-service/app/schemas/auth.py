from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


# ---------------------------------------------------------------------------
# Requests — field names match the frontend's React Hook Form field names
# exactly (src/pages/Auth/*.tsx) so no translation layer is needed.
# ---------------------------------------------------------------------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    fullName: str = Field(min_length=1, max_length=255)
    company: str = Field(min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(min_length=8)

    @field_validator("password")
    @classmethod
    def password_complexity(cls, v: str) -> str:
        if v.isalpha() or v.isdigit():
            raise ValueError("Password must contain a mix of letters and numbers.")
        return v


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(min_length=8)
    confirmPassword: str

    @field_validator("confirmPassword")
    @classmethod
    def passwords_match(cls, v: str, info) -> str:
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match.")
        return v


class VerifyEmailRequest(BaseModel):
    token: str  # user_id encoded in the mfa/verify link, or session ref
    code: str = Field(min_length=6, max_length=6)


class MfaVerifyRequest(BaseModel):
    mfa_challenge_token: str
    code: str = Field(min_length=6, max_length=6)
    method: Literal["app", "sms"] = "app"


class RefreshRequest(BaseModel):
    refresh_token: str


# ---------------------------------------------------------------------------
# Responses
# ---------------------------------------------------------------------------
class UserPublic(BaseModel):
    id: str
    full_name: str
    email: str
    role: str
    mfa_enabled: bool
    status: str

    model_config = {"from_attributes": True}


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_at: datetime
    user: UserPublic


class MfaChallengeResponse(BaseModel):
    mfa_required: Literal[True] = True
    mfa_challenge_token: str


class MessageResponse(BaseModel):
    message: str


LoginResponse = TokenPair | MfaChallengeResponse
