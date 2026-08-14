from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

from app.models.asset import VALID_TYPES, VALID_STATUSES


class CamelModel(BaseModel):
    """Base for any schema that must match the frontend's camelCase
    TypeScript types exactly (e.g. ipAddress, riskScore, lastSeen) while the
    database and Python code stay idiomatic snake_case. This is what lets
    the roadmap's principle 'no frontend changes required' actually hold."""
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class AssetCreate(CamelModel):
    name: str
    type: str = Field(pattern="^(" + "|".join(VALID_TYPES) + ")$")
    ip_address: str
    owner: str
    location: str
    os: Optional[str] = None
    tags: list[str] = Field(default_factory=list)


class AssetUpdate(CamelModel):
    name: Optional[str] = None
    status: Optional[str] = Field(default=None, pattern="^(" + "|".join(VALID_STATUSES) + ")$")
    owner: Optional[str] = None
    location: Optional[str] = None
    risk_score: Optional[int] = Field(default=None, ge=0, le=100)
    tags: Optional[list[str]] = None


class AssetOut(CamelModel):
    id: str
    name: str
    type: str
    status: str
    ip_address: str
    owner: str
    location: str
    risk_score: int
    os: Optional[str] = None
    tags: list[str]
    last_seen: datetime


class AssetListOut(CamelModel):
    """Slimmer shape for the Assets grid; AssetOut is used for the detail page.
    Kept as a separate schema deliberately so the list endpoint payload stays
    small at scale, per roadmap Chapter 1's consolidated requirement theme #2."""
    id: str
    name: str
    type: str
    status: str
    ip_address: str
    owner: str
    location: str
    risk_score: int
