from typing import List

from pydantic import BaseModel

from backend.schema.out_osint_result_schema import OutOsintResultSchema
from backend.schema.out_sigma_schema import OutSigmaSchema
from backend.schema.out_suricata_schema import OutSuricataSchema
from backend.schema.out_yara_schema import OutYaraSchema


class RuleResultsSchema(BaseModel):
    yara: List[OutYaraSchema] = []
    sigma: List[OutSigmaSchema] = []
    suricata: List[OutSuricataSchema] = []
    osint: List[OutOsintResultSchema] = []
