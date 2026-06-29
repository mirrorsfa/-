from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.db.database import Base


class Budget(Base):
    __tablename__ = "budgets"

    period: Mapped[str] = mapped_column(String(7), primary_key=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now, onupdate=datetime.now
    )
