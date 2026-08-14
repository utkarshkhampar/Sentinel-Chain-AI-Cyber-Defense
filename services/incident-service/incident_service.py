from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Sentinel Chain - Incident Service")


class Incident(BaseModel):
    status: str
    mitre_techniques: list[str] = []


incidents = []


@app.post("/api/v1/incidents")
def create_incident(incident: Incident):
    incident_data = incident.model_dump()
    incident_data["id"] = len(incidents) + 1
    incidents.append(incident_data)

    return incident_data

@app.get("/api/v1/incidents")
def get_incidents(status: str = "", search: str = ""):
    result = incidents

    if status:
        result = [i for i in result if i["status"] == status]

    if search:
        result = [
            i for i in result
            if search.lower() in str(i).lower()
        ]

    return result

@app.get("/api/v1/incidents/{id}")
def get_incident(id: int):
    for incident in incidents:
        if incident["id"] == id:
            return incident
    return {"message": "Incident not found"}

@app.patch("/api/v1/incidents/{id}")
def update_incident(id: int, status: str):
    for incident in incidents:
        if incident["id"] == id:
            incident["status"] = status
            return incident

    return {"message": "Incident not found"}

@app.delete("/api/v1/incidents/{id}")
def delete_incident(id: int):
    for incident in incidents:
        if incident["id"] == id:
            incidents.remove(incident)
            return {"message": "Incident deleted successfully"}

    return {"message": "Incident not found"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)