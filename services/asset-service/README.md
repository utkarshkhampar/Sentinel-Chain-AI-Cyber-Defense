# Asset Service

Asset/device inventory: registration, listing, detail, and the isolate-asset
response action. See Backend Roadmap Chapter 3.2.3 and Chapter 13 (Member 2).

## Endpoints
| Method & Path | Description |
|---|---|
| GET /api/v1/assets | List (search, type filter, pagination) |
| POST /api/v1/assets | Register a new asset |
| GET /api/v1/assets/{id} | Asset detail |
| PATCH /api/v1/assets/{id} | Update (status, owner, location, risk_score, tags) |
| POST /api/v1/assets/{id}/actions/isolate | Trigger isolation |

## Response Shape

All response fields are **camelCase** (`ipAddress`, `riskScore`, `lastSeen`)
via a shared `CamelModel` Pydantic base, matching `src/types/index.ts`'s
`Asset` interface in the frontend exactly — no translation layer needed on
either side.

## Events Published

`asset.created` on POST /assets — consumed by the Graph Service to add the
new node to the relationship graph (see Backend Roadmap Chapter 3.2.7).

## Running Locally
```bash
docker compose up asset-service asset-db
```
or standalone:
```bash
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8001
```

## Testing
```bash
pytest -v --cov=app
```
