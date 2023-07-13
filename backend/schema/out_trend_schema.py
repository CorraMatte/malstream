from datetime import datetime

from pydantic import BaseModel


class OutTrendSchema(BaseModel):
    date: datetime
    count: int
