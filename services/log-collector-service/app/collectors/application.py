"""
Application log normalizer — for Sentinel Chain's own services' structured
JSON logs, and any instrumented customer application sending JSON directly
to the ingestion API (roadmap Chapter 7.2, "Application Logs").

Expected raw_payload: a single JSON object as a string, e.g.
    '{"level":"error","service":"incident-service","message":"DB connection timeout","user_id":"abc-123"}'
"""
from __future__ import annotations

import json
import logging

from events import LogRawEvent
from app.collectors.base import BaseNormalizer

logger = logging.getLogger(__name__)


class ApplicationLogNormalizer(BaseNormalizer):
    source_type = "application"

    def normalize(self, raw_payload: str, source_asset_id: str | None) -> LogRawEvent:
        try:
            parsed = json.loads(raw_payload)
        except (json.JSONDecodeError, TypeError):
            logger.warning("Application normalizer: payload was not valid JSON, forwarding as raw event")
            return self._base_event(raw_payload, source_asset_id, "application.unparsed", {})

        if not isinstance(parsed, dict):
            return self._base_event(raw_payload, source_asset_id, "application.unparsed", {})

        level = str(parsed.get("level", "info")).lower()
        event_type = f"application.{level}"

        # Whitelist the fields we lift into parsed_fields for downstream
        # indexing/scoring; everything else stays available in raw_payload.
        parsed_fields = {
            k: parsed[k]
            for k in ("service", "message", "user_id", "request_id", "status_code", "duration_ms")
            if k in parsed
        }
        return self._base_event(raw_payload, source_asset_id, event_type, parsed_fields)
