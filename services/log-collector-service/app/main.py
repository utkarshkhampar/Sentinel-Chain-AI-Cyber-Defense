from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from common import AppError, app_error_handler
from app.core.config import get_settings
from app.api import ingest

settings = get_settings()

app = FastAPI(
    title="Sentinel Chain \u2014 Log Collector Service",
    version="0.1.0",
    description="Normalizes and publishes log events from all sources into Kafka. "
                 "See Backend Roadmap Chapter 3.2.4, Chapter 7, and Chapter 13 (Member 3).",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AppError, app_error_handler)
app.include_router(ingest.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": settings.SERVICE_NAME}
