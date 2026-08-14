from __future__ import annotations

import uuid

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from common import NotFoundError, ConflictError, PageParams
from events import Topics, IncidentUpdatedEvent
from events.kafka_client import EventPublisher
from auth_client import CurrentUser

from app.models.incident import Incident, IncidentNote, IncidentEvent, ALLOWED_TRANSITIONS
from app.schemas.incident import IncidentCreate, IncidentUpdate, NoteCreate

_publisher = EventPublisher()


def _log_event(db: Session, incident: Incident, event_type: str, payload: dict) -> None:
    db.add(IncidentEvent(incident_id=incident.id, event_type=event_type, payload=payload))


def list_incidents(
    db: Session, page: PageParams, status: str | None = None, search: str | None = None
) -> tuple[list[Incident], int]:
    query = select(Incident)
    if status and status != "all":
        query = query.where(Incident.status == status)
    if search:
        query = query.where(Incident.title.ilike(f"%{search}%"))

    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    rows = db.scalars(query.order_by(Incident.created_at.desc()).offset(page.offset).limit(page.page_size)).all()
    return list(rows), total


def get_incident(db: Session, incident_id: str) -> Incident:
    incident = db.get(Incident, uuid.UUID(incident_id))
    if not incident:
        raise NotFoundError("Incident", incident_id)
    return incident


def create_incident(db: Session, payload: IncidentCreate, creator: CurrentUser) -> Incident:
    incident = Incident(
        title=payload.title,
        severity=payload.severity,
        description=payload.description,
        affected_assets=payload.affected_assets,
        mitre_techniques=payload.mitre_techniques,
        assigned_to=payload.assigned_to or creator.email,
        source_threat_id=payload.source_threat_id,
        status="open",
    )
    db.add(incident)
    db.flush()
    _log_event(db, incident, "created", {"created_by": creator.email, "source_threat_id": payload.source_threat_id})
    db.commit()
    db.refresh(incident)

    _publish_update(incident, updated_by=creator.email)
    return incident


def update_incident(db: Session, incident_id: str, payload: IncidentUpdate, actor: CurrentUser) -> Incident:
    incident = get_incident(db, incident_id)

    if payload.status and payload.status != incident.status:
        _validate_transition(incident.status, payload.status)
        _log_event(db, incident, "status_changed", {
            "from": incident.status, "to": payload.status, "changed_by": actor.email,
        })
        incident.status = payload.status

    if payload.assigned_to is not None:
        incident.assigned_to = payload.assigned_to
    if payload.severity is not None:
        incident.severity = payload.severity

    db.commit()
    db.refresh(incident)
    _publish_update(incident, updated_by=actor.email)
    return incident


def _validate_transition(current: str, target: str) -> None:
    allowed = ALLOWED_TRANSITIONS.get(current, set())
    if target not in allowed:
        raise ConflictError(
            f"Cannot transition incident from '{current}' to '{target}'. "
            f"Allowed next states: {sorted(allowed) or 'none'}."
        )


def _publish_update(incident: Incident, updated_by: str) -> None:
    _publisher.publish(
        Topics.INCIDENT_UPDATED,
        IncidentUpdatedEvent(
            source_service="incident-service",
            incident_id=str(incident.id),
            status=incident.status,
            severity=incident.severity,
            updated_by=updated_by,
        ),
        key=str(incident.id),
    )


def get_timeline(db: Session, incident_id: str) -> list[IncidentEvent]:
    get_incident(db, incident_id)  # 404 if missing
    return list(
        db.scalars(
            select(IncidentEvent).where(IncidentEvent.incident_id == uuid.UUID(incident_id))
            .order_by(IncidentEvent.created_at.asc())
        )
    )


def add_note(db: Session, incident_id: str, payload: NoteCreate, author: CurrentUser) -> IncidentNote:
    incident = get_incident(db, incident_id)
    note = IncidentNote(incident_id=incident.id, author_id=author.user_id, author_name=author.email, text=payload.text)
    db.add(note)
    _log_event(db, incident, "note_added", {"author": author.email})
    db.commit()
    db.refresh(note)
    return note


def get_notes(db: Session, incident_id: str) -> list[IncidentNote]:
    get_incident(db, incident_id)
    return list(
        db.scalars(
            select(IncidentNote).where(IncidentNote.incident_id == uuid.UUID(incident_id))
            .order_by(IncidentNote.created_at.desc())
        )
    )


def submit_response_action(db: Session, incident_id: str, approved: bool, action: str, actor: CurrentUser) -> Incident:
    """Backs POST /incidents/{id}/response — Approve/Reject buttons on the
    Incident Detail page. In this slice this only logs the decision; wiring
    the actual containment dispatch to the Notification Service is a later
    module (roadmap Chapter 13, Member 6)."""
    incident = get_incident(db, incident_id)
    _log_event(db, incident, "response_action", {"action": action, "approved": approved, "decided_by": actor.email})
    if approved and incident.status == "open":
        incident.status = "contained"
    db.commit()
    db.refresh(incident)
    _publish_update(incident, updated_by=actor.email)
    return incident
