from fastapi import FastAPI
from libs.events.log_event import LogEvent

app = FastAPI(title="Sentinel Chain Log Ingestion")

@app.post("/logs", response_model=LogEvent)
def ingest_log(event: LogEvent) -> LogEvent:
    return event
