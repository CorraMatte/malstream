from fastapi import APIRouter

from backend.blueprint.indicator_view import router as indicator_router
from backend.blueprint.indicators_count_view import router as indicators_count_router
from backend.blueprint.indicators_pending_view import router as indicators_pending_router
from backend.blueprint.indicators_view import router as indicators_router
from backend.blueprint.retrohunt_download_view import router as retrohunt_download_router
from backend.blueprint.retrohunt_task_view import router as retrohunt_task_router
from backend.blueprint.retrohunt_tasks_rule_view import router as retrohunt_tasks_rule_router
from backend.blueprint.retrohunt_tasks_view import router as retrohunt_tasks_router
from backend.blueprint.rule_view import router as rule_router
from backend.blueprint.rules_count_view import router as rules_count_router
from backend.blueprint.rules_type_view import router as rules_type_router
from backend.blueprint.rules_types_sync_view import router as rules_types_rule_sync_router
from backend.blueprint.rules_types_view import router as rules_types_router
from backend.blueprint.rules_view import router as rules_router
from backend.blueprint.stats_avg_view import router as stats_avg_router
from backend.blueprint.stats_top_view import router as stats_top_router
from backend.blueprint.stats_total_interval_view import router as stats_total_interval_router
from backend.blueprint.stats_total_view import router as stats_total_router
from backend.blueprint.stats_trend_view import router as stats_trend_router
from backend.blueprint.upload_view import router as upload_router
from backend.blueprint.retrosigma_tasks_rule_view import router as retrosigma_tasks_rule_router

router = APIRouter()

router.include_router(retrohunt_download_router, prefix='/retrohunt/download')
router.include_router(retrohunt_tasks_router, prefix='/retrohunt/tasks')
router.include_router(retrohunt_tasks_rule_router, prefix='/retrohunt/tasks/rule/{rule_uid}')
router.include_router(retrohunt_task_router, prefix='/retrohunt/tasks/{uid}')

router.include_router(retrosigma_tasks_rule_router, prefix='/retrosigma/tasks')

router.include_router(rules_types_rule_sync_router, prefix='/rules/types/{rule_type}/sync')
router.include_router(rules_type_router, prefix='/rules/types/{rule_type}')
router.include_router(rules_types_router, prefix='/rules/types')

router.include_router(rules_count_router, prefix='/rules/count')
router.include_router(rules_router, prefix='/rules')
router.include_router(rule_router, prefix='/rules/{rule_id}')

router.include_router(upload_router, prefix='/upload')

router.include_router(indicators_count_router, prefix='/indicators/count')
router.include_router(indicators_pending_router, prefix='/indicators/pending')
router.include_router(indicator_router, prefix='/indicators/{sha256}')
router.include_router(indicators_router, prefix='/indicators')

router.include_router(stats_top_router, prefix='/stats/top')
router.include_router(stats_total_router, prefix='/stats/total')
router.include_router(stats_total_interval_router, prefix='/stats/total/interval')
router.include_router(stats_trend_router, prefix='/stats/trend')
router.include_router(stats_avg_router, prefix='/stats/avg')
