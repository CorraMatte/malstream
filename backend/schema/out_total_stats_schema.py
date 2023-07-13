from pydantic import BaseModel


class OutTotalStatsSchema(BaseModel):
    total: int
