from decimal import Decimal

from pydantic import BaseModel


class SummaryRead(BaseModel):
    period: str
    income: Decimal
    expense: Decimal
    balance: Decimal
    transaction_count: int
    income_count: int
    expense_count: int
    active_days: int
    budget: Decimal
    budget_remaining: Decimal
    budget_percentage: float


class CategoryRead(BaseModel):
    category: str
    amount: Decimal
    percentage: float
    color: str


class TrendPointRead(BaseModel):
    label: str
    income: Decimal
    expense: Decimal


class TrendRead(BaseModel):
    period: str
    range: str
    points: list[TrendPointRead]
