from pydantic import BaseModel


class OutTotalResultStatsSchema(BaseModel):
    name: str
    count: int
