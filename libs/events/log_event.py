from datetime import datetime
from pydantic import BaseModel


class LogEvent(BaseModel):
    timestamp: datetime
    source_asset_id: str
    event_type: str
    raw_payload: dict

#A valid sentinel chain must have these 4 things