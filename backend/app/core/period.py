import re
from calendar import monthrange
from datetime import datetime


PERIOD_PATTERN = re.compile(r"^(\d{4})-(0[1-9]|1[0-2])$")


def parse_period(period: str) -> tuple[int, int]:
    match = PERIOD_PATTERN.fullmatch(period)
    if not match:
        raise ValueError("账期格式必须为 YYYY-MM")
    return int(match.group(1)), int(match.group(2))


def period_bounds(year: int, month: int) -> tuple[datetime, datetime]:
    start = datetime(year, month, 1)
    if month == 12:
        end = datetime(year + 1, 1, 1)
    else:
        end = datetime(year, month + 1, 1)
    return start, end


def days_in_period(year: int, month: int) -> int:
    return monthrange(year, month)[1]
