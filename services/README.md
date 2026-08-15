# Sentinel Chain — Backend

Backend services for the Sentinel Chain AI Cyber Defense Platform.

## Tech Stack

- Python
- FastAPI
- Uvicorn
- Pydantic

## Services

### Incident Service

The Incident Service manages security incidents and their related timeline and evidence.

#### Incident APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/incidents` | Create an incident |
| GET | `/api/v1/incidents` | Get all incidents |
| GET | `/api/v1/incidents/{id}` | Get an incident by ID |
| PATCH | `/api/v1/incidents/{id}` | Update an incident |
| DELETE | `/api/v1/incidents/{id}` | Delete an incident |
| GET | `/api/v1/incidents/{id}/timeline` | Get incident timeline |
| POST | `/api/v1/incidents/{id}/timeline` | Add timeline event |
| GET | `/api/v1/incidents/{id}/evidence` | Get incident evidence |
| POST | `/api/v1/incidents/{id}/evidence` | Add incident evidence |

### Asset Service

The Asset Service manages security assets.

#### Asset APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check Asset Service status |
| GET | `/assets` | Get all assets |
| POST | `/assets` | Create an asset |
| GET | `/assets/{asset_id}` | Get an asset by ID |

## Running the Services

### Incident Service

```bash
cd services/incident-service
python -m uvicorn incident_service:app --reload --port 8001