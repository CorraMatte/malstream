from typing import List, Optional

from pydantic import BaseModel


class OutYaraNoRuleSchema(BaseModel):
    strings: List[str]
    source: Optional[str] = None
    path: Optional[str] = None
    meta: dict
    addresses: Optional[dict]
    name: str
    rule_source_match: Optional[str]
