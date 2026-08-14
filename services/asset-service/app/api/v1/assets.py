from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from common import ok, paginated, PageParams, get_page_params
from auth_client import get_current_user, require_role, CurrentUser, ROLE_ADMIN, ROLE_MANAGER, ROLE_ANALYST

from app.db.session import get_db
from app.schemas.asset import AssetCreate, AssetUpdate, AssetOut, AssetListOut
from app.services import asset_service

router = APIRouter(prefix="/api/v1/assets", tags=["assets"])


@router.get("")
def list_assets(
    search: Optional[str] = None,
    type: Optional[str] = None,
    page: PageParams = Depends(get_page_params),
    db: Session = Depends(get_db),
    _user: CurrentUser = Depends(get_current_user),
):
    assets, total = asset_service.list_assets(db, page, search=search, asset_type=type)
    items = [AssetListOut.model_validate(a).model_dump(by_alias=True) for a in assets]
    return paginated(items, total, page.page, page.page_size)


@router.post("", dependencies=[Depends(require_role(ROLE_ADMIN, ROLE_MANAGER, ROLE_ANALYST))])
def create_asset(payload: AssetCreate, db: Session = Depends(get_db)):
    asset = asset_service.create_asset(db, payload)
    return ok(AssetOut.model_validate(asset).model_dump(by_alias=True))


@router.get("/{asset_id}")
def get_asset(asset_id: str, db: Session = Depends(get_db), _user: CurrentUser = Depends(get_current_user)):
    asset = asset_service.get_asset(db, asset_id)
    return ok(AssetOut.model_validate(asset).model_dump(by_alias=True))


@router.patch("/{asset_id}", dependencies=[Depends(require_role(ROLE_ADMIN, ROLE_MANAGER))])
def update_asset(asset_id: str, payload: AssetUpdate, db: Session = Depends(get_db)):
    asset = asset_service.update_asset(db, asset_id, payload)
    return ok(AssetOut.model_validate(asset).model_dump(by_alias=True))


@router.post("/{asset_id}/actions/isolate", dependencies=[Depends(require_role(ROLE_ADMIN, ROLE_MANAGER))])
def isolate_asset(asset_id: str, db: Session = Depends(get_db)):
    asset = asset_service.isolate_asset(db, asset_id)
    return ok(AssetOut.model_validate(asset).model_dump(by_alias=True))
