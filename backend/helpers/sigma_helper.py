from typing import Optional, List

from sigma.backends.elasticsearch import LuceneBackend
from sigma.collection import SigmaCollection
from sigma.exceptions import SigmaError
from sigma.pipelines.elasticsearch.windows import ecs_windows
from sigma.rule import SigmaRule
from yaml import load, Loader
from yaml.scanner import ScannerError

from backend.business_model.rule_results_schema import RuleResultsSchema
from backend.helpers.async_elastic_helper import AsyncElasticHelper
from backend.helpers.elastic_helper import ElasticHelper
from backend.helpers.kibana_helper import KibanaHelper
from backend.mapper.elastic_mapper import ElasticMapper
from backend.schema.out_indicator_report_no_rule_schema import OutIndicatorNoRuleReportSchema


class SigmaHelper:
    kibana_helper = KibanaHelper
    elastic_helper = ElasticHelper
    async_elastic_helper = AsyncElasticHelper
    elastic_mapper = ElasticMapper

    @classmethod
    def __get_query_results_match(cls, title: str) -> dict:
        return {
            "query": {
                "match_phrase": {
                    "sigma.name": title
                }
            }
        }

    @classmethod
    def get_severity_score_from_level(cls, level: str) -> int:
        if level == 'informational':
            return 0
        elif level == 'low':
            return 25
        elif level == 'medium':
            return 50
        elif level == 'high':
            return 75
        elif level == 'critical':
            return 100
        else:
            return -1

    @classmethod
    async def translate_rule(cls, body: str) -> Optional[str]:
        return LuceneBackend(ecs_windows()).convert(SigmaCollection.from_yaml(body))[0]

    @classmethod
    async def is_sigma_valid(cls, body: str) -> bool:
        try:
            SigmaRule.from_dict(load(body, Loader=Loader))
            if await cls.translate_rule(body) is None:
                raise SigmaError

            return True
        except (SigmaError, ScannerError):
            return False

    @classmethod
    def get_sigma_result_by_uid(cls, sha256: str) -> RuleResultsSchema:
        sigma_results = cls.elastic_helper.get_sigma_result_by_sha56(sha256)

        return RuleResultsSchema(
            sigma=[
                cls.elastic_mapper.map_elastic_alert_sigma_result_to_out_sigma_schema(res['_source'])
                for res in sigma_results
            ]
        )

    @classmethod
    async def create_sigma(cls, body: str, _id: str) -> bool:
        es_rule = await cls.translate_rule(body)
        rule = SigmaRule.from_dict(load(body, Loader=Loader))

        return await cls.kibana_helper.create_sigma(rule, _id, es_rule)

    @classmethod
    async def delete_sigma(cls, _id: str) -> bool:
        return await cls.kibana_helper.delete_sigma(_id)

    @classmethod
    async def clean_up_sigma(cls) -> bool:
        return await cls.kibana_helper.clean_up_sigma()

    @classmethod
    async def get_results_by_rule_sigma(
            cls, title: str, offset: int = 0, limit: int = 20
    ) -> List[OutIndicatorNoRuleReportSchema]:
        return await cls.async_elastic_helper.search_result_by_query(
            cls.__get_query_results_match(title), offset, limit
        )

    @classmethod
    async def get_results_count_by_rule_sigma(cls, title: str) -> int:
        return await cls.async_elastic_helper.count_results_by_query(cls.__get_query_results_match(title))
