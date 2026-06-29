from sqlalchemy.orm import Session

from backend.app.models.transaction import Transaction
from backend.app.repositories.transaction_repository import TransactionRepository
from backend.app.schemas.transaction import TransactionCreate, TransactionUpdate


class TransactionNotFoundError(LookupError):
    pass


class TransactionService:
    def __init__(self, session: Session) -> None:
        self.repository = TransactionRepository(session)

    def create(self, payload: TransactionCreate) -> Transaction:
        return self.repository.create(payload)

    def update(self, transaction_id: str, payload: TransactionUpdate) -> Transaction:
        transaction = self.get(transaction_id)
        return self.repository.update(transaction, payload)

    def delete(self, transaction_id: str) -> None:
        transaction = self.get(transaction_id)
        self.repository.delete(transaction)

    def get(self, transaction_id: str) -> Transaction:
        transaction = self.repository.get(transaction_id)
        if transaction is None:
            raise TransactionNotFoundError(transaction_id)
        return transaction
