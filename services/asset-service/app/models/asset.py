import uuid
from datetime import datetime

from sqlalchemy import String, Integer, DateTime, ARRAY, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base

# Matches src/types/index.ts AssetType / AssetStatus exactly.
VALID_TYPES = ("server", "laptop", "mobile", "cloud", "firewall", "switch", "database", "container", "kubernetes")
VALID_STATUSES = ("healthy", "at-risk", "compromised", "offline")


class Asset(Base):
    __tablename__ = "assets"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id: Mapped[str] = mapped_column(String, default="default", index=True)

    name: Mapped[str] = mapped_column(String(255), index=True)
    type: Mapped[str] = mapped_column(String(32))
    status: Mapped[str] = mapped_column(String(32), default="healthy")

    ip_address: Mapped[str] = mapped_column(String(64))
    owner: Mapped[str] = mapped_column(String(255))
    location: Mapped[str] = mapped_column(String(255))
    risk_score: Mapped[int] = mapped_column(Integer, default=0)
    os: Mapped[str | None] = mapped_column(String(128), nullable=True)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)

    last_seen: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
