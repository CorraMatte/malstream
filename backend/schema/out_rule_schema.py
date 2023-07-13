from datetime import datetime
from enum import Enum
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, Field

from backend.schema.out_indicator_report_no_rule_schema import OutIndicatorNoRuleReportSchema


class RuleType(str, Enum):
    YARA = "yara"
    SIGMA = "sigma"
    SURICATA = "suricata"

    @classmethod
    def has_value(cls, value):
        return value in [item for item in cls]


class OutRuleSchema(BaseModel):
    id: UUID
    title: Optional[str]
    body: Optional[str]
    timestamp: datetime = Field(alias="@timestamp")
    type: RuleType
    retrohunt_task_id: Optional[str] = None
    number_results: Optional[int]
