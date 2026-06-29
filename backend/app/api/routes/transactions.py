from fastapi import APIRouter, HTTPException, Query, Response, status

from backend.app.api.dependencies import DatabaseSession
from backend.app.repositories.transaction_repository import TransactionRepository
from backend.app.schemas.transaction import (
    TransactionCreate,
    TransactionRead,
    TransactionType,
    TransactionUpdate,
)
from backend.app.services.transaction_service import (
    TransactionNotFoundError,
    TransactionService,
)


router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=list[TransactionRead])
def list_transactions(
    session: DatabaseSession,
    year: int = Query(ge=2000, le=2100),
    month: int | None = Query(default=None, ge=1, le=12),
    search: str | None = Query(default=None, max_length=100),
    transaction_type: TransactionType | None = None,
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
):
    return TransactionRepository(session).list(
        year=year,
        month=month,
        search=search,
        transaction_type=transaction_type,
        limit=limit,
        offset=offset,
    )


@router.post("", response_model=TransactionRead, status_code=status.HTTP_201_CREATED)
def create_transaction(payload: TransactionCreate, session: DatabaseSession):
    return TransactionService(session).create(payload)


@router.get("/{transaction_id}", response_model=TransactionRead)
def get_transaction(transaction_id: str, session: DatabaseSession):
    try:
        return TransactionService(session).get(transaction_id)
    except TransactionNotFoundError as error:
        raise HTTPException(status_code=404, detail="流水不存在") from error


@router.patch("/{transaction_id}", response_model=TransactionRead)
def update_transaction(
    transaction_id: str, payload: TransactionUpdate, session: DatabaseSession
):
    try:
        return TransactionService(session).update(transaction_id, payload)
    except TransactionNotFoundError as error:
        raise HTTPException(status_code=404, detail="流水不存在") from error


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: str, session: DatabaseSession) -> Response:
    try:
        TransactionService(session).delete(transaction_id)
    except TransactionNotFoundError as error:
        raise HTTPException(status_code=404, detail="流水不存在") from error
    return Response(status_code=status.HTTP_204_NO_CONTENT)
