from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Sentinel Chain - Asset Service")


class Asset(BaseModel):
    name: str
    ip_address: str
    device_type: str
    risk_score: int


assets = []


@app.get("/")
def home():
    return {"message": "Asset Service is running"}


@app.post("/assets")
def create_asset(asset: Asset):
    asset_data = asset.model_dump()
    asset_data["id"] = len(assets) + 1
    assets.append(asset_data)

    return {
        "message": "Asset created successfully",
        "asset": asset_data
    }


@app.get("/assets")
def get_assets():
    return assets


@app.get("/assets/{asset_id}")
def get_asset(asset_id: int):
    for asset in assets:
        if asset["id"] == asset_id:
            return asset

    return {"message": "Asset not found"}