from typing import Literal

from fastapi import APIRouter, HTTPException

from backend.app.api.dependencies import DatabaseSession
from backend.app.schemas.analytics import CategoryRead, SummaryRead, TrendRead
from backend.app.services.analytics_service import AnalyticsService


router = APIRouter(prefix="/analytics", tags=["analytics"])


def run_for_period(action):
    try:
        return action()
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error


@router.get("/summary", response_model=SummaryRead)
def get_summary(period: str, session: DatabaseSession):
    return run_for_period(lambda: AnalyticsService(session).summary(period))


@router.get("/categories", response_model=list[CategoryRead])
def get_categories(period: str, session: DatabaseSession):
    return run_for_period(lambda: AnalyticsService(session).categories(period))


@router.get("/trend", response_model=TrendRead)
def get_trend(
    period: str,
    session: DatabaseSession,
    range_name: Literal["day", "month"] = "day",
):
    return run_for_period(
        lambda: AnalyticsService(session).trend(period, range_name)
    )
