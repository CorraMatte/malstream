from fastapi import APIRouter, Response

from backend.helpers.stats_helper import StatsHelper
from backend.schema.out_total_stats_schema import OutTotalStatsSchema

router = APIRouter()


@router.get('/results/by_day', response_model=OutTotalStatsSchema, tags=['stats'])
async def get_total_results_by_day():
    return await StatsHelper.get_total_results_last_day()


@router.get('/results/by_hour', response_model=OutTotalStatsSchema, tags=['stats'])
async def get_total_results_by_hour():
    return await StatsHelper.get_total_results_last_hour()
