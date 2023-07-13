from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from backend.schema.out_osint_result_schema import OutOsintResultSchema
from backend.schema.out_sigma_schema import OutSigmaSchema
from backend.schema.out_suricata_schema import OutSuricataSchema
from backend.schema.out_yara_schema import OutYaraSchema


class OutIndicatorReportSchema(BaseModel):
    file: dict
    yara: List[OutYaraSchema] = []
    sigma: List[OutSigmaSchema] = []
    suricata: List[OutSuricataSchema] = []
    osint: List[OutOsintResultSchema] = []
    enrichment: bool = False
    sandbox: bool = False
    created_dt: datetime
    sandbox_dt: Optional[datetime] = None
    enrichment_dt: Optional[datetime] = None
    is_supported_by_sandbox: bool = True
    retrohunt: Optional[bool] = True
    retrohunt_dt: Optional[datetime] = None
