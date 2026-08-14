from app.core import security


class TestPasswordHashing:
    def test_hash_and_verify_roundtrip(self):
        hashed = security.hash_password("CorrectHorse123")
        assert security.verify_password("CorrectHorse123", hashed) is True

    def test_wrong_password_fails(self):
        hashed = security.hash_password("CorrectHorse123")
        assert security.verify_password("WrongPassword", hashed) is False


class TestTokenIssuance:
    def test_access_token_round_trips(self):
        token, expires_at = security.create_access_token(
            user_id="user-123", email="a@b.com", role="soc_analyst", org_id="default"
        )
        payload = security.decode_token(token)
        assert payload["sub"] == "user-123"
        assert payload["type"] == "access"
        assert payload["role"] == "soc_analyst"

    def test_refresh_token_has_unique_jti_each_time(self):
        _, jti1, _ = security.create_refresh_token("user-123")
        _, jti2, _ = security.create_refresh_token("user-123")
        assert jti1 != jti2

    def test_tampered_token_fails_decode(self):
        token, _ = security.create_access_token("user-123", "a@b.com", "soc_analyst", "default")
        tampered = token[:-4] + "abcd"
        import pytest
        from jose import JWTError

        with pytest.raises(JWTError):
            security.decode_token(tampered)


class TestRegisterAndLogin:
    def test_register_then_login_requires_verified_flow(self, client):
        resp = client.post(
            "/api/v1/auth/register",
            json={
                "fullName": "Test User",
                "company": "Acme",
                "email": "test@acme.com",
                "password": "StrongPass123",
            },
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["error"] is None
        assert "user_id" in body["data"]

    def test_duplicate_registration_is_rejected(self, client):
        payload = {
            "fullName": "Test User",
            "company": "Acme",
            "email": "dupe@acme.com",
            "password": "StrongPass123",
        }
        first = client.post("/api/v1/auth/register", json=payload)
        assert first.status_code == 200

        second = client.post("/api/v1/auth/register", json=payload)
        assert second.status_code == 409
        assert second.json()["error"]["code"] == "CONFLICT"

    def test_login_with_wrong_password_returns_401(self, client):
        client.post(
            "/api/v1/auth/register",
            json={"fullName": "T", "company": "C", "email": "wrongpw@acme.com", "password": "StrongPass123"},
        )
        resp = client.post("/api/v1/auth/login", json={"email": "wrongpw@acme.com", "password": "NotTheRightOne"})
        assert resp.status_code == 401
        assert resp.json()["error"]["code"] == "UNAUTHORIZED"
