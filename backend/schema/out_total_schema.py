from pydantic import BaseModel


class OutTotalSchema(BaseModel):
    total: int
