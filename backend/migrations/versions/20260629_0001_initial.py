"""创建流水与预算表。

Revision ID: 20260629_0001
Revises:
"""
from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "20260629_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    existing_tables = set(sa.inspect(op.get_bind()).get_table_names())
    if "budgets" not in existing_tables:
        op.create_table(
            "budgets",
            sa.Column("period", sa.String(length=7), nullable=False),
            sa.Column("amount", sa.Numeric(precision=12, scale=2), nullable=False),
            sa.Column("updated_at", sa.DateTime(), nullable=False),
            sa.PrimaryKeyConstraint("period"),
        )
    if "transactions" not in existing_tables:
        op.create_table(
            "transactions",
            sa.Column("id", sa.String(length=36), nullable=False),
            sa.Column("name", sa.String(length=100), nullable=False),
            sa.Column("transaction_type", sa.String(length=16), nullable=False),
            sa.Column("category", sa.String(length=50), nullable=False),
            sa.Column("account", sa.String(length=50), nullable=False),
            sa.Column("amount", sa.Numeric(precision=12, scale=2), nullable=False),
            sa.Column("occurred_at", sa.DateTime(), nullable=False),
            sa.Column("icon", sa.String(length=16), nullable=False),
            sa.Column("color", sa.String(length=16), nullable=False),
            sa.Column("created_at", sa.DateTime(), nullable=False),
            sa.Column("updated_at", sa.DateTime(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_transactions_account", "transactions", ["account"])
        op.create_index("ix_transactions_category", "transactions", ["category"])
        op.create_index(
            "ix_transactions_occurred_at", "transactions", ["occurred_at"]
        )
        op.create_index(
            "ix_transactions_transaction_type", "transactions", ["transaction_type"]
        )


def downgrade() -> None:
    op.drop_index("ix_transactions_transaction_type", table_name="transactions")
    op.drop_index("ix_transactions_occurred_at", table_name="transactions")
    op.drop_index("ix_transactions_category", table_name="transactions")
    op.drop_index("ix_transactions_account", table_name="transactions")
    op.drop_table("transactions")
    op.drop_table("budgets")
