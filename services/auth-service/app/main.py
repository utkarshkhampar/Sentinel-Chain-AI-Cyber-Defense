from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from common import AppError, app_error_handler
from app.core.config import get_settings
from app.api.v1 import login, mfa, password_reset

settings = get_settings()

app = FastAPI(
    title="Sentinel Chain \u2014 Auth Service",
    version="0.1.0",
    description="Authentication, MFA, session, and password-reset service. "
                 "See Sentinel Chain Backend Roadmap, Chapter 3.2.1 and Chapter 6.",
)

# CORS: allow_credentials=True is required for the httpOnly refresh-token
# cookie to be sent by the browser; this means the origin list MUST be
# explicit (never "*") when credentials are allowed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AppError, app_error_handler)

app.include_router(login.router)
app.include_router(mfa.router)
app.include_router(password_reset.router)


@app.get("/health")
def health():
    """Liveness/readiness probe target for Kubernetes (roadmap Chapter 11.3)."""
    return {"status": "ok", "service": settings.SERVICE_NAME}
