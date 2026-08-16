from datetime import datetime
from libs.events.log_event import LogEvent

def normalize_json(payload: dict) -> LogEvent:
    return LogEvent(
        timestamp=datetime.fromisoformat(payload["timestamp"]),
        source_asset_id=payload["source_asset_id"],
        event_type=payload.get("event_type", "json"),
        raw_payload=payload,
    )
