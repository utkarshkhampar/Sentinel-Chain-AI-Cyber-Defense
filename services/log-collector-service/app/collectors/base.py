"""
Every log source implements this same interface. Adding a ninth source
means adding one file here and one line in registry.py — the ingestion
endpoint and Kafka publishing logic never change (roadmap Chapter 7.3).
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any

from events import LogRawEvent


class BaseNormalizer(ABC):
    source_type: str

    @abstractmethod
    def normalize(self, raw_payload: str, source_asset_id: str | None) -> LogRawEvent:
        """Parse a raw log line/blob from this source into the common
        LogRawEvent envelope. Must never raise on malformed input — log a
        parse warning and return a best-effort event with an empty
        parsed_fields dict instead, so one bad line can't stall the pipeline."""
        raise NotImplementedError

    def _base_event(self, raw_payload: str, source_asset_id: str | None, log_event_type: str, parsed_fields: dict[str, Any]) -> LogRawEvent:
        return LogRawEvent(
            source_service="log-collector-service",
            source_type=self.source_type,
            source_asset_id=source_asset_id,
            log_event_type=log_event_type,
            raw_payload=raw_payload,
            parsed_fields=parsed_fields,
        )
