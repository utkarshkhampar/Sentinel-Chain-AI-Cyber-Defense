"""initial asset schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-08-05 00:00:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "assets",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("org_id", sa.String(), nullable=False, server_default="default"),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("type", sa.String(length=32), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="healthy"),
        sa.Column("ip_address", sa.String(length=64), nullable=False),
        sa.Column("owner", sa.String(length=255), nullable=False),
        sa.Column("location", sa.String(length=255), nullable=False),
        sa.Column("risk_score", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("os", sa.String(length=128), nullable=True),
        sa.Column("tags", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("last_seen", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_assets_name", "assets", ["name"])
    op.create_index("ix_assets_org_id", "assets", ["org_id"])


def downgrade() -> None:
    op.drop_index("ix_assets_org_id", table_name="assets")
    op.drop_index("ix_assets_name", table_name="assets")
    op.drop_table("assets")
