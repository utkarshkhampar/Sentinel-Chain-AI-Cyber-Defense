# Sentinel Chain — Backend

This is the first implemented slice of the backend described in the
**Sentinel Chain Backend Architecture & Implementation Roadmap** — the
services that unblock everyone else, per that document's Chapter 13/14
sequencing: **Auth Service** (Sprint 1, Member 1's hard-blocker deliverable),
**Asset Service** and **Incident Service** (Sprint 1, Member 2), and
**Log Collector Service** with two working normalizers (Sprint 1, Member 3).

## What's implemented vs. what's next

| Status | Service |
|---|---|
| ✅ Implemented | auth-service — register, login, MFA (TOTP), JWT + httpOnly refresh cookie, password reset |
| ✅ Implemented | asset-service — full CRUD, isolate action |
| ✅ Implemented | incident-service — CRUD, enforced state machine, notes, timeline, response actions |
| ✅ Implemented | log-collector-service — ingestion API + Kafka publishing + linux/application normalizers |
| ⬜ Not yet built | ai-engine-service, blockchain-service, graph-service, threat-intelligence-service, report-service, analytics-service, notification-service, configuration-service, audit-service, api-gateway, websocket-gateway |

See the roadmap's Chapter 13 for exactly who owns each remaining service and
Chapter 14 for the sprint sequencing. This repo's structure already matches
Chapter 13.1's monorepo layout, so each remaining service slots into
`services/<name>/` with no restructuring.

## Quick Start

```bash
docker compose up --build
```

This brings up Postgres (one instance per implemented service, per the
database-per-service principle in roadmap Chapter 2.2), Redis, Kafka,
Elasticsearch, and Neo4j (the last two are running but unused until their
owning services are built), plus the four implemented services.

Run migrations before first use (containers don't auto-migrate on start,
by design — see "Why migrations aren't automatic" below):
```bash
docker compose exec auth-service alembic upgrade head
docker compose exec asset-service alembic upgrade head
docker compose exec incident-service alembic upgrade head
```

Service URLs:
- Auth Service: http://localhost:8000 (docs at /docs)
- Asset Service: http://localhost:8001 (docs at /docs)
- Incident Service: http://localhost:8002 (docs at /docs)
- Log Collector Service: http://localhost:8003 (docs at /docs)

## Why Migrations Aren't Automatic

Running `alembic upgrade head` as a container's entrypoint is convenient
but dangerous once more than one replica of a service exists — two
containers starting simultaneously can race on the same migration. Treat
migrations as a deploy-time step (a Kubernetes Job in staging/production,
per roadmap Chapter 11), not application startup logic, even in local dev.

## Running a Single Service Without Docker

Each service is a standalone Python package:
```bash
cd services/auth-service
python -m venv .venv && source .venv/bin/activate
pip install --break-system-packages -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

## Running Tests

Every service's tests run against in-memory SQLite, not the real Postgres
containers — fast, hermetic, no docker-compose required:
```bash
cd services/auth-service && pytest -v --cov=app
cd services/asset-service && pytest -v --cov=app
cd services/incident-service && pytest -v --cov=app
cd services/log-collector-service && pytest -v --cov=app
```

## Shared Libraries (`libs/`)

- `libs/common` — response envelope (`{data, meta, error}`), pagination, error classes
- `libs/auth_client` — JWT validation + RBAC dependency every non-auth service imports
- `libs/events` — Kafka topic names, typed event schemas, and the publisher helper

Every service's `requirements.txt` installs these as editable local
packages (`-e ../../libs/...`), so a change to a shared contract is
immediately visible to every service without a publish step — appropriate
for a monorepo at this team size (roadmap Chapter 13.1).

## Trying It End-to-End

```bash
# 1. Register and verify (in local dev, the verification code is only
#    logged server-side, not emailed — check `docker compose logs auth-service`)
curl -X POST localhost:8000/api/v1/auth/register -H "Content-Type: application/json" \
  -d '{"fullName":"Test Analyst","company":"Acme","email":"analyst@acme.com","password":"StrongPass123"}'

# 2. Log in (no MFA enabled yet, so this returns tokens directly)
curl -X POST localhost:8000/api/v1/auth/login -H "Content-Type: application/json" \
  -d '{"email":"analyst@acme.com","password":"StrongPass123"}' -c cookies.txt

# 3. Use the returned access_token as a Bearer token against Asset/Incident Service
curl localhost:8001/api/v1/assets -H "Authorization: Bearer <access_token_from_step_2>"
```

## What Comes Next

Follow the roadmap's Chapter 14 sprint plan. The next hard dependency to
unblock is the **AI Engine Service**'s internal `/ai/score` contract
(Member 4, Sprint 2) — Threat Detection Service (Member 3, Sprint 3) is
built against it.
