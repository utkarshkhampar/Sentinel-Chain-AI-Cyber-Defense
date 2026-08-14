from fastapi import Header
from common import UnauthorizedError
from app.core.config import get_settings

settings = get_settings()


def verify_ingest_api_key(x_api_key: str | None = Header(default=None)) -> None:
    """Collectors/shippers authenticate with a scoped API key (roadmap
    Chapter 6.5), not a user JWT — there is no human session for a syslog
    forwarder. Production looks this up per-key via Configuration Service;
    this local-dev slice checks against a single configured key."""
    if not x_api_key or x_api_key != settings.INGEST_API_KEY:
        raise UnauthorizedError("Missing or invalid X-API-Key header.")
