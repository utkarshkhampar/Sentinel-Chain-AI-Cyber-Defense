"""initial incident schema

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
        "incidents",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("org_id", sa.String(), nullable=False, server_default="default"),
        sa.Column("title", sa.String(length=500), nullable=False),
        sa.Column("severity", sa.String(length=16), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="open"),
        sa.Column("assigned_to", sa.String(length=255), nullable=True),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("affected_assets", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("mitre_techniques", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("ai_recommendation", sa.Text(), nullable=True),
        sa.Column("blockchain_verified", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("evidence_record_id", sa.String(length=64), nullable=True),
        sa.Column("source_threat_id", sa.String(length=64), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_incidents_org_id", "incidents", ["org_id"])

    op.create_table(
        "incident_notes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("incident_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("author_id", sa.String(length=255), nullable=False),
        sa.Column("author_name", sa.String(length=255), nullable=False),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "incident_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("incident_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("event_type", sa.String(length=64), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("incident_events")
    op.drop_table("incident_notes")
    op.drop_index("ix_incidents_org_id", table_name="incidents")
    op.drop_table("incidents")
