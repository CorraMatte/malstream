from fastapi import APIRouter, Response

from backend.helpers.stats_helper import StatsHelper
from backend.schema.out_avg_stats_schema import OutAvgStatsSchema

router = APIRouter()


@router.get('/results/by_day', response_model=OutAvgStatsSchema, tags=['stats'])
async def get_avg_results_by_day():
    return await StatsHelper.get_avg_results_by_day()


@router.get('/results/by_hour', response_model=OutAvgStatsSchema, tags=['stats'])
async def get_avg_results_by_hour():
    return await StatsHelper.get_avg_results_by_hour()
