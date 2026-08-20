from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Sentinel Chain - Incident Service")


class Incident(BaseModel):
    status: str
    mitre_techniques: list[str] = []


incidents = []
<<<<<<< HEAD
=======
incident_timelines = {}
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> parent of 3309db9 (Add incident evidence APIs)
=======
>>>>>>> parent of 3309db9 (Add incident evidence APIs)
=======
>>>>>>> parent of 3309db9 (Add incident evidence APIs)


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

<<<<<<< HEAD
=======
@app.get("/api/v1/incidents/{id}/timeline")
def get_incident_timeline(id: int):
    if id not in [incident["id"] for incident in incidents]:
        return {"message": "Incident not found"}

    return incident_timelines.get(id, [])

@app.post("/api/v1/incidents/{id}/timeline")
def add_incident_timeline(id: int, event: dict = Body(...)):
    if id not in [incident["id"] for incident in incidents]:
        return {"message": "Incident not found"}

    if id not in incident_timelines:
        incident_timelines[id] = []

    incident_timelines[id].append(event)

    return event

<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> parent of 3309db9 (Add incident evidence APIs)
=======
>>>>>>> parent of 3309db9 (Add incident evidence APIs)
=======
>>>>>>> parent of 3309db9 (Add incident evidence APIs)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)