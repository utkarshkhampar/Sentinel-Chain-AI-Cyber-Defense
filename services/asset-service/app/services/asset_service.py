from __future__ import annotations

import uuid

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from common import NotFoundError, PageParams
from events import Topics, AssetCreatedEvent
from events.kafka_client import EventPublisher

from app.models.asset import Asset
from app.schemas.asset import AssetCreate, AssetUpdate

_publisher = EventPublisher()


def list_assets(
    db: Session, page: PageParams, search: str | None = None, asset_type: str | None = None
) -> tuple[list[Asset], int]:
    query = select(Asset)
    if search:
        query = query.where(Asset.name.ilike(f"%{search}%") | Asset.ip_address.ilike(f"%{search}%"))
    if asset_type and asset_type != "all":
        query = query.where(Asset.type == asset_type)

    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    rows = db.scalars(query.order_by(Asset.name).offset(page.offset).limit(page.page_size)).all()
    return list(rows), total


def get_asset(db: Session, asset_id: str) -> Asset:
    asset = db.get(Asset, uuid.UUID(asset_id))
    if not asset:
        raise NotFoundError("Asset", asset_id)
    return asset


def create_asset(db: Session, payload: AssetCreate) -> Asset:
    asset = Asset(
        name=payload.name,
        type=payload.type,
        ip_address=payload.ip_address,
        owner=payload.owner,
        location=payload.location,
        os=payload.os,
        tags=payload.tags,
        status="healthy",
        risk_score=0,
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)

    _publisher.publish(
        Topics.ASSET_CREATED,
        AssetCreatedEvent(source_service="asset-service", asset_id=str(asset.id), asset_type=asset.type, name=asset.name),
        key=str(asset.id),
    )
    return asset


def update_asset(db: Session, asset_id: str, payload: AssetUpdate) -> Asset:
    asset = get_asset(db, asset_id)
    updates = payload.model_dump(exclude_unset=True, by_alias=False)
    for field, value in updates.items():
        setattr(asset, field, value)
    db.commit()
    db.refresh(asset)
    return asset


def isolate_asset(db: Session, asset_id: str) -> Asset:
    """Backs POST /assets/{id}/actions/isolate (Chapter 1, §1.7). In this
    slice this only updates status; Sprint 3+ wires an actual containment
    action dispatch through the Notification Service."""
    asset = get_asset(db, asset_id)
    asset.status = "compromised"
    db.commit()
    db.refresh(asset)
    return asset
