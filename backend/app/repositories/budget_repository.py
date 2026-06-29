from decimal import Decimal

from sqlalchemy.orm import Session

from backend.app.models.budget import Budget


class BudgetRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get(self, period: str) -> Budget | None:
        return self.session.get(Budget, period)

    def upsert(self, period: str, amount: Decimal) -> Budget:
        budget = self.get(period)
        if budget is None:
            budget = Budget(period=period, amount=amount)
            self.session.add(budget)
        else:
            budget.amount = amount
        self.session.commit()
        self.session.refresh(budget)
        return budget
