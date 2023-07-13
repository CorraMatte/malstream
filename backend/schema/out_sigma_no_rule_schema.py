from datetime import datetime
from typing import List

from pydantic import BaseModel


class OutSigmaNoRuleSchema(BaseModel):
    name: str
    tags: List[str]
    description: str
    id: str
    severity: str
    query: str
    references: List[str]
    created_dt: datetime
    authors: List[str]
    raw: dict
