import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.session import Base, get_db
from app.main import app
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


def test_create_and_list_asset(client):
    resp = client.post(
        "/api/v1/assets",
        json={"name": "Test-Server-01", "type": "server", "ipAddress": "10.0.0.5", "owner": "Ops Team", "location": "AWS"},
    )
    assert resp.status_code == 200
    body = resp.json()["data"]
    assert body["name"] == "Test-Server-01"
    assert body["riskScore"] == 0
    assert body["status"] == "healthy"

    listed = client.get("/api/v1/assets")
    assert listed.status_code == 200
    assert listed.json()["meta"]["total_count"] == 1


def test_get_nonexistent_asset_returns_404(client):
    resp = client.get("/api/v1/assets/00000000-0000-0000-0000-000000000000")
    assert resp.status_code == 404
    assert resp.json()["error"]["code"] == "NOT_FOUND"


def test_isolate_asset_sets_compromised_status(client):
    created = client.post(
        "/api/v1/assets",
        json={"name": "Laptop-99", "type": "laptop", "ipAddress": "10.0.0.99", "owner": "IT", "location": "HQ"},
    ).json()["data"]

    isolated = client.post(f"/api/v1/assets/{created['id']}/actions/isolate")
    assert isolated.status_code == 200
    assert isolated.json()["data"]["status"] == "compromised"
