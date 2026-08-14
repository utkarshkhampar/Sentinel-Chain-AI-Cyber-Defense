# Log Collector Service

Accepts log input from all eight source categories, normalizes each into a
common `LogRawEvent` envelope, and publishes to Kafka topic `log.raw`.
See Backend Roadmap Chapter 3.2.4, Chapter 7, and Chapter 13 (Member 3).

## Endpoints
| Method & Path | Description |
|---|---|
| POST /internal/logs/ingest | Ingest one log event (requires `X-API-Key`) |
| POST /internal/logs/ingest/batch | Ingest a batch (high-throughput sources) |
| GET /internal/logs/sources | List currently supported `source_type` values |

## Implemented Normalizers (this slice)

- **linux** — syslog-format lines (SSH auth success/failure, sudo privilege escalation, generic)
- **application** — structured JSON logs from Sentinel Chain's own services

## Adding the Remaining Six Sources (Sprint 2, Member 3)

1. Create `app/collectors/<source>.py` implementing `BaseNormalizer` (see `linux.py` for the reference shape).
2. Register it in `app/collectors/registry.py`'s `_REGISTRY` dict.
3. Add normalizer tests mirroring `tests/test_normalizers.py`.

No other file needs to change — the ingestion endpoint and Kafka publishing
are already source-agnostic.

## Running Locally
```bash
docker compose up log-collector-service kafka
```

## Testing
```bash
pytest -v --cov=app
```
