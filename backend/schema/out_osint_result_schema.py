from typing import List

from pydantic import BaseModel


class OutOsintResultSchema(BaseModel):
    source: str
    matches: List[str]
