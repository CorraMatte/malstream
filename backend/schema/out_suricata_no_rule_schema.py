from datetime import datetime

from pydantic import BaseModel


class OutSuricataNoRuleSchema(BaseModel):
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
