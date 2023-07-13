from typing import List

from pydantic import BaseModel

from backend.schema.out_trend_schema import OutTrendSchema


class OutTopTrendStatsSchema(BaseModel):
    name: str
    trend: List[OutTrendSchema]
