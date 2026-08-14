"""
Shared response envelope, pagination helpers, and error classes used by
every Sentinel Chain backend service.

Install into each service as an editable local package:
    pip install -e ../../libs/common
"""
from __future__ import annotations

from typing import Any, Generic, TypeVar, Optional
from pydantic import BaseModel, Field
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

T = TypeVar("T")


# ---------------------------------------------------------------------------
# Standard response envelope: { "data": ..., "meta": {...}, "error": null }
# Every endpoint in every service returns this shape (see roadmap Chapter 5.1)
# ---------------------------------------------------------------------------
class ErrorDetail(BaseModel):
    code: str
    message: str
    fields: Optional[dict[str, str]] = None


class Meta(BaseModel):
    total_count: Optional[int] = None
    page: Optional[int] = None
    page_size: Optional[int] = None
    total_pages: Optional[int] = None


class Envelope(BaseModel, Generic[T]):
    data: Optional[T] = None
    meta: Optional[Meta] = None
    error: Optional[ErrorDetail] = None


def ok(data: Any, meta: Optional[Meta] = None) -> dict:
    """Wrap a successful payload in the standard envelope."""
    return {"data": data, "meta": meta.model_dump() if meta else None, "error": None}


def paginated(items: list[Any], total_count: int, page: int, page_size: int) -> dict:
    """Wrap a paginated list response in the standard envelope."""
    total_pages = max(1, (total_count + page_size - 1) // page_size)
    return ok(
        items,
        Meta(total_count=total_count, page=page, page_size=page_size, total_pages=total_pages),
    )


# ---------------------------------------------------------------------------
# Pagination query params — shared FastAPI dependency
# ---------------------------------------------------------------------------
class PageParams(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size


def get_page_params(page: int = 1, page_size: int = 20) -> PageParams:
    return PageParams(page=page, page_size=page_size)


# ---------------------------------------------------------------------------
# Standard application error — raise this, not raw HTTPException, so every
# service produces the same error envelope shape automatically.
# ---------------------------------------------------------------------------
class AppError(HTTPException):
    def __init__(self, status_code: int, code: str, message: str, fields: Optional[dict] = None):
        super().__init__(status_code=status_code, detail={"code": code, "message": message, "fields": fields})


class NotFoundError(AppError):
    def __init__(self, resource: str, resource_id: str):
        super().__init__(404, "NOT_FOUND", f"{resource} '{resource_id}' was not found.")


class ValidationAppError(AppError):
    def __init__(self, message: str, fields: Optional[dict] = None):
        super().__init__(400, "VALIDATION_ERROR", message, fields)


class ConflictError(AppError):
    def __init__(self, message: str):
        super().__init__(409, "CONFLICT", message)


class ForbiddenError(AppError):
    def __init__(self, message: str = "You do not have permission to perform this action."):
        super().__init__(403, "FORBIDDEN", message)


class UnauthorizedError(AppError):
    def __init__(self, message: str = "Authentication is required or the token is invalid/expired."):
        super().__init__(401, "UNAUTHORIZED", message)


async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    """Register with app.add_exception_handler(AppError, app_error_handler)."""
    detail = exc.detail if isinstance(exc.detail, dict) else {"code": "ERROR", "message": str(exc.detail)}
    return JSONResponse(status_code=exc.status_code, content={"data": None, "meta": None, "error": detail})
