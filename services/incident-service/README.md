# Incident Service

Incident lifecycle management: creation, status transitions, notes, and an
append-only timeline. See Backend Roadmap Chapter 3.2.9 and Chapter 13 (Member 2).

## Endpoints
| Method & Path | Description |
|---|---|
| GET /api/v1/incidents | List (status filter, search, pagination) |
| POST /api/v1/incidents | Create (manually or from an escalated threat) |
| GET /api/v1/incidents/{id} | Detail |
| PATCH /api/v1/incidents/{id} | Update status/assignment/severity |
| GET /api/v1/incidents/{id}/timeline | Append-only event log |
| GET/POST /api/v1/incidents/{id}/notes | Analyst notes |
| POST /api/v1/incidents/{id}/response | Approve/reject a response action |
| GET /api/v1/incidents/{id}/ai-recommendation | AI recommendation text |

## State Machine

Status transitions are enforced server-side, not left to the client:

```
open ──────► investigating ──────► monitoring
  │                │  ▲                │
  │                │  └────────────────┘
  ▼                ▼
closed ◄────── contained ◄─────────────┘
  │                ▲
  └────────────────┘  (closed → investigating only; no direct re-open to "open")
```

An illegal transition returns `409 CONFLICT` with the allowed next states in
the error message. See `app/models/incident.py`'s `ALLOWED_TRANSITIONS` for
the authoritative table and `tests/test_incidents.py` for the enforcement tests.

## Events Published

`incident.updated` on every create/status-change — consumed by the
WebSocket Gateway (live Incident Detail updates) and the Recent Incidents
dashboard widget.

## Running Locally
```bash
docker compose up incident-service incident-db
```

## Testing
```bash
pytest -v --cov=app
```
