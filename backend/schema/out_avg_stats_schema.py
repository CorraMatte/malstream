from pydantic import BaseModel


class OutAvgStatsSchema(BaseModel):
    avg: float
