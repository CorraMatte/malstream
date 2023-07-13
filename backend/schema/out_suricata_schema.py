from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from backend.schema.out_rule_schema import OutRuleSchema


class OutSuricataSchema(BaseModel):
    gid: int
    rev: int
    severity: int
    sid: int
    srcport: int
    srcip: str
    dstport: int
    dstip: str
    protocol: str
    timestamp: datetime
    category: str
    signature: str
    rule: Optional[OutRuleSchema] = None
    exists_in_platform: bool = False
