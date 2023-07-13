from typing import List

from fastapi import APIRouter, Response

from backend.helpers.stats_helper import StatsHelper
from backend.schema.out_top_trend_stats_schema import OutTopTrendStatsSchema
from backend.schema.out_trend_schema import OutTrendSchema

router = APIRouter()


@router.get('/results/by_hour', response_model=List[OutTrendSchema], tags=['stats'])
async def get_total_results(days: int = 30):
    return await StatsHelper.get_trend_results_by_hours(days)


@router.get('/osint/by_hour', response_model=List[OutTopTrendStatsSchema], tags=['stats'])
async def get_total_results(days: int = 7):
    return await StatsHelper.get_trend_osint_by_hours(days)
