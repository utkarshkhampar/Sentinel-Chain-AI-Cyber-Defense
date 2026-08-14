# Auth Service

Registration, login, MFA (TOTP), JWT access/refresh tokens, and password reset.
See Sentinel Chain Backend Roadmap, Chapter 3.2.1, Chapter 6, and Chapter 13 (Member 1).

## Endpoints

| Method & Path | Description |
|---|---|
| POST /api/v1/auth/register | Create account (status=invited until email verified) |
| POST /api/v1/auth/verify-email | Confirm 6-digit code, activates account |
| POST /api/v1/auth/login | Authenticate; returns tokens or an MFA challenge |
| POST /api/v1/auth/mfa/verify | Complete MFA challenge, issues tokens |
| POST /api/v1/auth/mfa/enroll | Start MFA enrollment (Settings > Security) |
| POST /api/v1/auth/mfa/confirm-enrollment | Confirm enrollment with a valid code |
| POST /api/v1/auth/refresh | Exchange refresh cookie for a new access token |
| POST /api/v1/auth/logout | Revoke the current refresh session |
| POST /api/v1/auth/forgot-password | Send password reset link |
| POST /api/v1/auth/reset-password | Complete password reset |

## Token Model

- **Access token**: returned in the JSON response body, 15-minute expiry. The frontend keeps this in memory only.
- **Refresh token**: set as an `httpOnly`, `Secure` (in non-local environments), `SameSite=Lax` cookie scoped to `/api/v1/auth`. Never exposed to JavaScript. Rotated on every use.

## Running Locally

From the repo root (`backend/`):
```bash
docker compose up auth-service auth-db redis
```

Or standalone, from this directory:
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

## Testing
```bash
pytest -v --cov=app
```

## What Other Services Need From This One

Every other service validates tokens issued here via `libs/auth_client` —
they do **not** call this service over the network to check a token; JWT
validation is local/stateless (roadmap Chapter 6.1). This service is only
called directly for the operations above (login, refresh, etc.), typically
just by the API Gateway and the frontend.
