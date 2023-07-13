import datetime
import enum
from typing import List, Optional

from backend.business_model.indicator_status import IndicatorStatus
from backend.common.const import RESULTS_INDEX, SIGMA_INDEX, SURICATA_INDEX, YARA_INDEX
from backend.helpers.async_elastic_helper import AsyncElasticHelper
from backend.schema.out_avg_stats_schema import OutAvgStatsSchema
from backend.schema.out_top_result_stats_schema import OutTotalResultStatsSchema
from backend.schema.out_top_trend_stats_schema import OutTopTrendStatsSchema
from backend.schema.out_total_stats_schema import OutTotalStatsSchema
from backend.schema.out_trend_schema import OutTrendSchema


class StatsHelper:
    async_elastic_helper = AsyncElasticHelper

    class Interval(enum.Enum):
        hour = 'hour'
        day = 'day'

    @classmethod
    async def get_top_n_osint(cls, limit: int = 10, query: dict = None) -> List[OutTotalResultStatsSchema]:
        return await cls.async_elastic_helper.get_aggs_result('osint.matches.keyword', limit, query=query)

    @classmethod
    async def get_top_n_yara(cls, limit: int = 10) -> List[OutTotalResultStatsSchema]:
        return await cls.async_elastic_helper.get_aggs_result('yara.name.keyword', limit)

    @classmethod
    async def get_top_n_suricata(cls, limit: int = 10) -> List[OutTotalResultStatsSchema]:
        return await cls.async_elastic_helper.get_aggs_result('suricata.signature.keyword', limit)

    @classmethod
    async def get_top_n_sigma(cls, limit: int = 10) -> List[OutTotalResultStatsSchema]:
        return await cls.async_elastic_helper.get_aggs_result('sigma.name.keyword', limit)

    @classmethod
    async def get_total_yara(cls) -> OutTotalResultStatsSchema:
        return OutTotalResultStatsSchema(
            count=await cls.async_elastic_helper.get_index_docs_count(YARA_INDEX),
            name=YARA_INDEX
        )

    @classmethod
    async def get_total_suricata(cls) -> OutTotalResultStatsSchema:
        return OutTotalResultStatsSchema(
            count=await cls.async_elastic_helper.get_index_docs_count(SURICATA_INDEX),
            name=SURICATA_INDEX
        )

    @classmethod
    async def get_total_sigma(cls) -> OutTotalResultStatsSchema:
        return OutTotalResultStatsSchema(
            count=await cls.async_elastic_helper.get_index_docs_count(SIGMA_INDEX),
            name=SIGMA_INDEX
        )

    @classmethod
    async def get_total_results(cls, status: Optional[IndicatorStatus] = None) -> OutTotalResultStatsSchema:
        if status is None:
            return OutTotalResultStatsSchema(
                count=await cls.async_elastic_helper.get_index_docs_count(RESULTS_INDEX),
                name=RESULTS_INDEX
            )

        if status == IndicatorStatus.finished:
            return OutTotalResultStatsSchema(
                count=await cls.async_elastic_helper.get_index_docs_count_by_query(
                    RESULTS_INDEX, cls.async_elastic_helper.elastic_queries.get_finished_task_query()
                ),
                name=RESULTS_INDEX
            )
        elif status == IndicatorStatus.pending:
            return OutTotalResultStatsSchema(
                count=await cls.async_elastic_helper.get_index_docs_count_by_query(
                    RESULTS_INDEX, cls.async_elastic_helper.elastic_queries.get_pending_task_query()
                ),
                name=RESULTS_INDEX
            )
        elif status == IndicatorStatus.not_supported:
            return OutTotalResultStatsSchema(
                count=await cls.async_elastic_helper.get_index_docs_count_by_query(
                    RESULTS_INDEX, cls.async_elastic_helper.elastic_queries.get_pending_not_supported_task_query()
                ),
                name=RESULTS_INDEX
            )

    @classmethod
    async def get_total_rules(cls) -> OutTotalResultStatsSchema:
        return OutTotalResultStatsSchema(
            count=await cls.async_elastic_helper.get_indexes_docs_count([YARA_INDEX, SURICATA_INDEX, SIGMA_INDEX]),
            name='rules'
        )

    @classmethod
    async def get_trend_results_by_hours(cls, days: int = 90) -> List[OutTrendSchema]:
        return await cls.async_elastic_helper.get_date_aggs_result('sandbox_dt', '1h', days=days)

    @classmethod
    async def get_trend_osint_by_hours(cls, days: int = 7) -> List[OutTopTrendStatsSchema]:
        res = await cls.get_top_n_osint(5, query={
            'query': {
                "range": {
                    "enrichment_dt": {
                        "lte": "now-1h/h",
                        "gte": f"now-{days}d/d"
                    }
                }
            }
        })

        return [
            OutTopTrendStatsSchema(
                name=r.name,
                trend=await cls.async_elastic_helper.get_date_aggs_result(
                    'enrichment_dt', '1h',
                    _max="now-1h/h",
                    _min=f"now-{days}d/d",
                    query={
                        "query": {
                            "bool": {
                                "must": [
                                    {
                                        "match": {
                                            "osint.matches": r.name
                                        }
                                    },
                                    {
                                        "range": {
                                            "enrichment_dt": {
                                                "lte": "now-1h/h",
                                                "gte": f"now-{days}d/d"
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    },
                )
            ) for r in res
        ]

    @classmethod
    async def __get_avg(cls, interval: Interval) -> OutAvgStatsSchema:
        first_result_date = await cls.async_elastic_helper.get_first_result()

        if first_result_date is None:
            return OutAvgStatsSchema(avg=0)

        result_count = await cls.async_elastic_helper.get_index_docs_count(RESULTS_INDEX)
        first_result_date = datetime.datetime.fromisoformat(first_result_date['_source']['created_dt'])
        now = datetime.datetime.now()

        delta = now - first_result_date

        if interval == cls.Interval.hour:
            return OutAvgStatsSchema(avg=result_count / (delta.days * 24 + delta.seconds / 3600))
        elif interval == cls.Interval.day:
            return OutAvgStatsSchema(avg=result_count / (delta.days + delta.seconds / (3600 * 24)))
        else:
            return OutAvgStatsSchema(avg=0)

    @classmethod
    async def get_avg_results_by_hour(cls) -> OutAvgStatsSchema:
        return await cls.__get_avg(cls.Interval.hour)

    @classmethod
    async def get_avg_results_by_day(cls) -> OutAvgStatsSchema:
        return await cls.__get_avg(cls.Interval.day)

    @classmethod
    async def __get_last_results_in_interval(cls, interval: Interval) -> OutTotalStatsSchema:
        if interval == cls.Interval.day:
            total = await cls.async_elastic_helper.get_index_docs_count_by_query(
                index=RESULTS_INDEX,
                query=cls.async_elastic_helper.elastic_queries.get_last_analyzed_files_with_interval('1d/d')
            )
        elif interval == cls.Interval.hour:
            total = await cls.async_elastic_helper.get_index_docs_count_by_query(
                index=RESULTS_INDEX,
                query=cls.async_elastic_helper.elastic_queries.get_last_analyzed_files_with_interval('1h/h')
            )
        else:
            total = 0

        return OutTotalStatsSchema(total=total)

    @classmethod
    async def get_total_results_last_hour(cls) -> OutTotalStatsSchema:
        return await cls.__get_last_results_in_interval(cls.Interval.hour)

    @classmethod
    async def get_total_results_last_day(cls) -> OutTotalStatsSchema:
        return await cls.__get_last_results_in_interval(cls.Interval.day)
