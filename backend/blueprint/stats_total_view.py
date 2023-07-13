from fastapi import APIRouter, Response

from backend.business_model.indicator_status import IndicatorStatus
from backend.helpers.stats_helper import StatsHelper
from backend.schema.out_rule_schema import RuleType
from backend.schema.out_top_result_stats_schema import OutTotalResultStatsSchema

router = APIRouter()


@router.get('/results', response_model=OutTotalResultStatsSchema, tags=['stats'])
async def get_total_results(status: IndicatorStatus = None):
    return await StatsHelper.get_total_results(status)


@router.get('/rules', response_model=OutTotalResultStatsSchema, tags=['stats'])
async def get_total_rule():
    return await StatsHelper.get_total_rules()


@router.get('/{rule_type}', response_model=OutTotalResultStatsSchema, tags=['stats'])
async def get_total_rule(rule_type: RuleType):
    if rule_type == RuleType.YARA:
        return await StatsHelper.get_total_yara()
    elif rule_type == RuleType.SIGMA:
        return await StatsHelper.get_total_sigma()
    elif rule_type == RuleType.SURICATA:
        return await StatsHelper.get_total_suricata()
