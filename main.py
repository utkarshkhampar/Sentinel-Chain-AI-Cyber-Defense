from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "Sentinel Chain Backend is running"
    }