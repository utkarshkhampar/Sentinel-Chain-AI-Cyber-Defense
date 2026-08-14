"""
Central registry of Kafka topic names and their event payload shapes.
Every producer and consumer across all services imports from here so the
event contract lives in exactly one place (see roadmap Chapter 13, Member 3
Sprint 1 task: "Kafka topic provisioning + libs/events/ schema definitions").

Install into each service as an editable local package:
    pip install -e ../../libs/events
"""
from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Optional
from pydantic import BaseModel, Field


class Topics(str, Enum):
    LOG_RAW = "log.raw"
    THREAT_SCORED = "threat.scored"
    INCIDENT_UPDATED = "incident.updated"
    EVIDENCE_ANCHORED = "evidence.anchored"
    NOTIFY_DISPATCH = "notify.dispatch"
    ASSET_CREATED = "asset.created"
    DEVICE_DISCOVERED = "device.discovered"
    AUDIT_LOG = "audit.log"


def utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class BaseEvent(BaseModel):
    """Every event carries these fields regardless of topic, so consumers
    can do generic logging/tracing before dispatching on event_type."""
    event_type: str
    occurred_at: str = Field(default_factory=utcnow_iso)
    source_service: str


class LogRawEvent(BaseEvent):
    event_type: str = "log.raw"
    source_type: str  # windows | linux | docker | kubernetes | cloud | application | firewall | database
    source_asset_id: Optional[str] = None
    log_event_type: str
    raw_payload: str
    parsed_fields: dict[str, Any] = Field(default_factory=dict)


class ThreatScoredEvent(BaseEvent):
    event_type: str = "threat.scored"
    threat_id: str
    severity: str  # critical | high | medium | low
    target_asset_id: Optional[str] = None
    ai_confidence: float
    model_version: str
    top_features: list[dict[str, Any]] = Field(default_factory=list)


class IncidentUpdatedEvent(BaseEvent):
    event_type: str = "incident.updated"
    incident_id: str
    status: str
    severity: str
    updated_by: Optional[str] = None


class EvidenceAnchoredEvent(BaseEvent):
    event_type: str = "evidence.anchored"
    evidence_id: str
    incident_id: str
    blockchain_tx_id: str
    block_number: int


class NotifyDispatchEvent(BaseEvent):
    event_type: str = "notify.dispatch"
    user_id: Optional[str] = None  # None => broadcast to all subscribed analysts
    title: str
    description: str
    severity: str = "info"
    link: Optional[str] = None


class AssetCreatedEvent(BaseEvent):
    event_type: str = "asset.created"
    asset_id: str
    asset_type: str
    name: str


class DeviceDiscoveredEvent(BaseEvent):
    event_type: str = "device.discovered"
    ip_address: str
    mac_address: Optional[str] = None
    hostname: Optional[str] = None
    discovery_method: str  # passive | active_scan


class AuditLogEvent(BaseEvent):
    event_type: str = "audit.log"
    actor: str
    action: str
    target: str
    ip_address: Optional[str] = None
    result: str  # success | failed
