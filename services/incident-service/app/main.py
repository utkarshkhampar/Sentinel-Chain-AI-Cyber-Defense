from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from common import AppError, app_error_handler
from app.core.config import get_settings
from app.api.v1 import incidents

settings = get_settings()

app = FastAPI(
    title="Sentinel Chain \u2014 Incident Service",
    version="0.1.0",
    description="Incident lifecycle, notes, timeline. See Backend Roadmap Chapter 3.2.9 and Chapter 13 (Member 2).",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AppError, app_error_handler)
app.include_router(incidents.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": settings.SERVICE_NAME}
