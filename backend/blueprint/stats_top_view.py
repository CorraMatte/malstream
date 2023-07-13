from typing import List

from fastapi import APIRouter, Response

from backend.helpers.stats_helper import StatsHelper
from backend.schema.out_rule_schema import RuleType
from backend.schema.out_top_result_stats_schema import OutTotalResultStatsSchema

router = APIRouter()


@router.get('/osint', response_model=List[OutTotalResultStatsSchema], tags=['stats'])
async def get_top_osint(limit: int = 10):
    return await StatsHelper.get_top_n_osint(limit)


@router.get('/{rule_type}', response_model=List[OutTotalResultStatsSchema], tags=['stats'])
async def get_top_osint(rule_type: RuleType, limit: int = 10):
    if rule_type == RuleType.YARA:
        return await StatsHelper.get_top_n_yara(limit)
    elif rule_type == RuleType.SIGMA:
        return await StatsHelper.get_top_n_sigma(limit)
    elif rule_type == RuleType.SURICATA:
        return await StatsHelper.get_top_n_suricata(limit)


