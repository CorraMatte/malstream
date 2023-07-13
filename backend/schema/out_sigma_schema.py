from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from backend.schema.out_rule_schema import OutRuleSchema


class OutSigmaSchema(BaseModel):
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
    rule: Optional[OutRuleSchema] = None
    exists_in_platform: bool = True
