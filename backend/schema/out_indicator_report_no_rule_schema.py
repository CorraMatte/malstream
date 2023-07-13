from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from backend.schema.out_osint_result_schema import OutOsintResultSchema
from backend.schema.out_sigma_no_rule_schema import OutSigmaNoRuleSchema
from backend.schema.out_suricata_no_rule_schema import OutSuricataNoRuleSchema
from backend.schema.out_yara_no_rule_schema import OutYaraNoRuleSchema


class OutIndicatorNoRuleReportSchema(BaseModel):
    file: dict
    yara: List[OutYaraNoRuleSchema] = []
    sigma: List[OutSigmaNoRuleSchema] = []
    suricata: List[OutSuricataNoRuleSchema] = []
    osint: List[OutOsintResultSchema] = []
    enrichment: bool = False
    sandbox: bool = False
    created_dt: datetime
    sandbox_dt: Optional[datetime] = None
