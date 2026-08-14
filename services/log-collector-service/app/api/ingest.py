from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from common import ok, ValidationAppError
from events import Topics
from events.kafka_client import EventPublisher

from app.core.auth import verify_ingest_api_key
from app.collectors.registry import get_normalizer, SUPPORTED_SOURCE_TYPES

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/internal/logs", tags=["log-ingestion"])

_publisher = EventPublisher()


class IngestRequest(BaseModel):
    source_type: str
    source_asset_id: Optional[str] = None
    raw_payload: str


class BatchIngestRequest(BaseModel):
    events: list[IngestRequest]


@router.post("/ingest", dependencies=[Depends(verify_ingest_api_key)])
def ingest_log(payload: IngestRequest):
    """Single-event ingestion — the common path for low-volume or
    request-per-event shippers. See /ingest/batch for high-throughput
    sources (firewall, cloud) that should not open a connection per line."""
    if payload.source_type not in SUPPORTED_SOURCE_TYPES:
        raise ValidationAppError(
            f"Unsupported source_type '{payload.source_type}'. Supported: {SUPPORTED_SOURCE_TYPES}"
        )

    normalizer = get_normalizer(payload.source_type)
    event = normalizer.normalize(payload.raw_payload, payload.source_asset_id)

    _publisher.publish(Topics.LOG_RAW, event, key=payload.source_asset_id)
    return ok({"status": "accepted", "log_event_type": event.log_event_type})


@router.post("/ingest/batch", dependencies=[Depends(verify_ingest_api_key)])
def ingest_log_batch(payload: BatchIngestRequest):
    accepted, failed = 0, 0
    for item in payload.events:
        try:
            if item.source_type not in SUPPORTED_SOURCE_TYPES:
                failed += 1
                continue
            normalizer = get_normalizer(item.source_type)
            event = normalizer.normalize(item.raw_payload, item.source_asset_id)
            _publisher.publish(Topics.LOG_RAW, event, key=item.source_asset_id)
            accepted += 1
        except Exception:  # noqa: BLE001 — one bad event must never fail the whole batch
            logger.exception("Failed to normalize/publish one event in batch")
            failed += 1

    _publisher.flush(timeout=2.0)
    return ok({"accepted": accepted, "failed": failed, "total": len(payload.events)})


@router.get("/sources")
def list_supported_sources():
    """Lets shippers/admins confirm which source_types are currently
    normalizable before configuring a new collector."""
    return ok({"supported_source_types": list(SUPPORTED_SOURCE_TYPES)})
