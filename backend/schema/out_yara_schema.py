from typing import List, Optional

from pydantic import BaseModel

from backend.schema.out_rule_schema import OutRuleSchema


class OutYaraSchema(BaseModel):
    strings: List[str]
    source: Optional[str] = None
    path: Optional[str] = None
    meta: dict
    addresses: Optional[dict]
    name: str
    rule_source_match: Optional[str]
    rule: Optional[OutRuleSchema] = None
    exists_in_platform: bool = False
