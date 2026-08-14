import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.session import Base, get_db
from app.main import app
from app.models.incident import ALLOWED_TRANSITIONS
from auth_client import get_current_user, CurrentUser


@pytest.fixture()
def db_session():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(engine)


@pytest.fixture()
def client(db_session):
    def _override_get_db():
        yield db_session

    def _override_current_user():
        return CurrentUser(user_id="test-user", email="analyst@test.com", role="administrator", org_id="default")

    app.dependency_overrides[get_db] = _override_get_db
    app.dependency_overrides[get_current_user] = _override_current_user
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def _create_incident(client, title="Test Incident", severity="high"):
    resp = client.post("/api/v1/incidents", json={"title": title, "severity": severity})
    assert resp.status_code == 200
    return resp.json()["data"]


class TestIncidentStateMachine:
    def test_open_to_investigating_is_allowed(self, client):
        incident = _create_incident(client)
        resp = client.patch(f"/api/v1/incidents/{incident['id']}", json={"status": "investigating"})
        assert resp.status_code == 200
        assert resp.json()["data"]["status"] == "investigating"

    def test_open_to_contained_is_rejected(self, client):
        """open -> contained is not a legal direct transition per ALLOWED_TRANSITIONS."""
        incident = _create_incident(client)
        resp = client.patch(f"/api/v1/incidents/{incident['id']}", json={"status": "contained"})
        assert resp.status_code == 409
        assert resp.json()["error"]["code"] == "CONFLICT"

    def test_closed_to_open_is_rejected(self, client):
        """Re-opening a closed incident must go through 'investigating', not
        straight back to 'open' — this is the exact rule the roadmap calls
        out under Member 2's testing requirements."""
        incident = _create_incident(client)
        client.patch(f"/api/v1/incidents/{incident['id']}", json={"status": "investigating"})
        client.patch(f"/api/v1/incidents/{incident['id']}", json={"status": "closed"})

        resp = client.patch(f"/api/v1/incidents/{incident['id']}", json={"status": "open"})
        assert resp.status_code == 409

    def test_full_lifecycle_happy_path(self, client):
        incident = _create_incident(client)
        for target in ["investigating", "contained", "closed"]:
            resp = client.patch(f"/api/v1/incidents/{incident['id']}", json={"status": target})
            assert resp.status_code == 200, f"transition to {target} should succeed"
            assert resp.json()["data"]["status"] == target

    def test_every_declared_transition_is_reachable(self):
        """Sanity check on the transition table itself, not the API —
        every 'to' state must also be a valid 'from' state or 'closed'."""
        all_states = set(ALLOWED_TRANSITIONS.keys())
        for targets in ALLOWED_TRANSITIONS.values():
            assert targets.issubset(all_states | {"closed"})


class TestIncidentTimelineAndNotes:
    def test_creating_incident_logs_a_timeline_event(self, client):
        incident = _create_incident(client)
        timeline = client.get(f"/api/v1/incidents/{incident['id']}/timeline").json()["data"]
        assert len(timeline) == 1
        assert timeline[0]["eventType"] == "created"

    def test_status_change_appends_timeline_event(self, client):
        incident = _create_incident(client)
        client.patch(f"/api/v1/incidents/{incident['id']}", json={"status": "investigating"})
        timeline = client.get(f"/api/v1/incidents/{incident['id']}/timeline").json()["data"]
        assert [e["eventType"] for e in timeline] == ["created", "status_changed"]

    def test_add_note_appears_in_notes_list(self, client):
        incident = _create_incident(client)
        client.post(f"/api/v1/incidents/{incident['id']}/notes", json={"text": "Confirmed malicious."})
        notes = client.get(f"/api/v1/incidents/{incident['id']}/notes").json()["data"]
        assert len(notes) == 1
        assert notes[0]["text"] == "Confirmed malicious."
