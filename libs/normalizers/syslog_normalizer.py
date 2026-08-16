from datetime import datetime
from libs.events.log_event import LogEvent

def normalize_syslog(timestamp: datetime, source_asset_id: str, message: str) -> LogEvent:
    return LogEvent(
        timestamp=timestamp,
        source_asset_id=source_asset_id,
        event_type="syslog",
        raw_payload={"message": message},
    )
