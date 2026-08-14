import uuid
from datetime import datetime

from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey, ARRAY, JSON, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base

# Matches src/types/index.ts Severity / IncidentStatus exactly.
VALID_SEVERITIES = ("critical", "high", "medium", "low")
VALID_STATUSES = ("open", "investigating", "monitoring", "contained", "closed")

# Legal state transitions — enforced in app/services/incident_service.py.
# This is the "state-machine tests for incident status transitions" the
# roadmap calls out under Member 2's testing requirements (Chapter 13.2).
ALLOWED_TRANSITIONS: dict[str, set[str]] = {
    "open": {"investigating", "closed"},
    "investigating": {"monitoring", "contained", "closed"},
    "monitoring": {"investigating", "contained", "closed"},
    "contained": {"closed", "investigating"},
    "closed": {"investigating"},  # re-opening requires explicit re-escalation
}


class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id: Mapped[str] = mapped_column(String, default="default", index=True)

    title: Mapped[str] = mapped_column(String(500))
    severity: Mapped[str] = mapped_column(String(16))
    status: Mapped[str] = mapped_column(String(16), default="open")
    assigned_to: Mapped[str | None] = mapped_column(String(255), nullable=True)

    description: Mapped[str] = mapped_column(Text, default="")
    affected_assets: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    mitre_techniques: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    ai_recommendation: Mapped[str | None] = mapped_column(Text, nullable=True)

    blockchain_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    evidence_record_id: Mapped[str | None] = mapped_column(String(64), nullable=True)

    source_threat_id: Mapped[str | None] = mapped_column(String(64), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    notes: Mapped[list["IncidentNote"]] = relationship(back_populates="incident", cascade="all, delete-orphan")
    events: Mapped[list["IncidentEvent"]] = relationship(back_populates="incident", cascade="all, delete-orphan")


class IncidentNote(Base):
    __tablename__ = "incident_notes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("incidents.id", ondelete="CASCADE"))
    author_id: Mapped[str] = mapped_column(String(255))
    author_name: Mapped[str] = mapped_column(String(255))
    text: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    incident: Mapped["Incident"] = relationship(back_populates="notes")


class IncidentEvent(Base):
    """Append-only timeline log — never updated or deleted, only inserted,
    which is what makes the Incident Detail 'Timeline' tab a trustworthy
    audit trail rather than just the current row's state (roadmap 1.6)."""
    __tablename__ = "incident_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("incidents.id", ondelete="CASCADE"))
    event_type: Mapped[str] = mapped_column(String(64))  # created | status_changed | note_added | evidence_anchored | response_action
    payload: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    incident: Mapped["Incident"] = relationship(back_populates="events")
