from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

from app.models.incident import VALID_SEVERITIES, VALID_STATUSES


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class IncidentCreate(CamelModel):
    title: str
    severity: str = Field(pattern="^(" + "|".join(VALID_SEVERITIES) + ")$")
    description: str = ""
    affected_assets: list[str] = Field(default_factory=list)
    mitre_techniques: list[str] = Field(default_factory=list)
    assigned_to: Optional[str] = None
    source_threat_id: Optional[str] = None


class IncidentUpdate(CamelModel):
    status: Optional[str] = Field(default=None, pattern="^(" + "|".join(VALID_STATUSES) + ")$")
    assigned_to: Optional[str] = None
    severity: Optional[str] = Field(default=None, pattern="^(" + "|".join(VALID_SEVERITIES) + ")$")


class NoteCreate(CamelModel):
    text: str = Field(min_length=1)


class ResponseActionRequest(CamelModel):
    approved: bool
    action: str  # e.g. "isolate_host", "block_ip"


class IncidentOut(CamelModel):
    id: str
    title: str
    severity: str
    status: str
    assigned_to: Optional[str] = None
    description: str
    affected_assets: list[str]
    mitre_techniques: list[str]
    ai_recommendation: Optional[str] = None
    blockchain_verified: bool
    evidence_record_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class IncidentListOut(CamelModel):
    id: str
    title: str
    severity: str
    status: str
    assigned_to: Optional[str] = None
    affected_assets: list[str]
    blockchain_verified: bool
    created_at: datetime


class NoteOut(CamelModel):
    id: str
    author_id: str
    author_name: str
    text: str
    created_at: datetime


class TimelineEventOut(CamelModel):
    id: str
    event_type: str
    payload: dict
    created_at: datetime
