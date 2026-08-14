from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from common import ok, paginated, PageParams, get_page_params
from auth_client import get_current_user, require_role, CurrentUser, ROLE_ADMIN, ROLE_MANAGER, ROLE_ANALYST

from app.db.session import get_db
from app.schemas.incident import (
    IncidentCreate, IncidentUpdate, NoteCreate, ResponseActionRequest,
    IncidentOut, IncidentListOut, NoteOut, TimelineEventOut,
)
from app.services import incident_service

router = APIRouter(prefix="/api/v1/incidents", tags=["incidents"])


@router.get("")
def list_incidents(
    status: Optional[str] = None,
    search: Optional[str] = None,
    page: PageParams = Depends(get_page_params),
    db: Session = Depends(get_db),
    _user: CurrentUser = Depends(get_current_user),
):
    incidents, total = incident_service.list_incidents(db, page, status=status, search=search)
    items = [IncidentListOut.model_validate(i).model_dump(by_alias=True) for i in incidents]
    return paginated(items, total, page.page, page.page_size)


@router.post("")
def create_incident(
    payload: IncidentCreate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    incident = incident_service.create_incident(db, payload, creator=user)
    return ok(IncidentOut.model_validate(incident).model_dump(by_alias=True))


@router.get("/{incident_id}")
def get_incident(incident_id: str, db: Session = Depends(get_db), _user: CurrentUser = Depends(get_current_user)):
    incident = incident_service.get_incident(db, incident_id)
    return ok(IncidentOut.model_validate(incident).model_dump(by_alias=True))


@router.patch("/{incident_id}")
def update_incident(
    incident_id: str,
    payload: IncidentUpdate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    incident = incident_service.update_incident(db, incident_id, payload, actor=user)
    return ok(IncidentOut.model_validate(incident).model_dump(by_alias=True))


@router.get("/{incident_id}/timeline")
def get_timeline(incident_id: str, db: Session = Depends(get_db), _user: CurrentUser = Depends(get_current_user)):
    events = incident_service.get_timeline(db, incident_id)
    return ok([TimelineEventOut.model_validate(e).model_dump(by_alias=True) for e in events])


@router.get("/{incident_id}/notes")
def get_notes(incident_id: str, db: Session = Depends(get_db), _user: CurrentUser = Depends(get_current_user)):
    notes = incident_service.get_notes(db, incident_id)
    return ok([NoteOut.model_validate(n).model_dump(by_alias=True) for n in notes])


@router.post("/{incident_id}/notes")
def add_note(
    incident_id: str,
    payload: NoteCreate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    note = incident_service.add_note(db, incident_id, payload, author=user)
    return ok(NoteOut.model_validate(note).model_dump(by_alias=True))


@router.post("/{incident_id}/response", dependencies=[Depends(require_role(ROLE_ADMIN, ROLE_MANAGER))])
def submit_response(
    incident_id: str,
    payload: ResponseActionRequest,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(get_current_user),
):
    incident = incident_service.submit_response_action(db, incident_id, payload.approved, payload.action, actor=user)
    return ok(IncidentOut.model_validate(incident).model_dump(by_alias=True))


@router.get("/{incident_id}/ai-recommendation")
def get_ai_recommendation(incident_id: str, db: Session = Depends(get_db), _user: CurrentUser = Depends(get_current_user)):
    """Proxies the AI Engine Service in later sprints (roadmap Chapter 3.2.9);
    for this slice, returns the recommendation already stored on the incident
    record so the frontend's AI Recommendation panel has something real to
    render end-to-end."""
    incident = incident_service.get_incident(db, incident_id)
    return ok({"recommendation": incident.ai_recommendation or "No AI recommendation available yet for this incident."})
