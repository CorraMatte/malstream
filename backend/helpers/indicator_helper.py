import re
from typing import List, Optional

import elasticsearch

from backend.business_model.result_status import ResultStatus
from backend.business_model.rule_source_match import RuleSourceMatch
from backend.common.config import get_cfg
from backend.common.const import RESULTS_INDEX
from backend.common.exceptions.common import IndicatorSha256Exception, MalstreamApplicationError, \
    IndicatorNotFoundException
from backend.helpers.async_elastic_helper import AsyncElasticHelper
from backend.mapper.elastic_mapper import ElasticMapper
from backend.schema.out_indicator_report_schema import OutIndicatorReportSchema
from backend.schema.out_rule_schema import RuleType, OutRuleSchema


class IndicatorHelper:
    async_elastic_helper = AsyncElasticHelper
    elastic_mapper = ElasticMapper
    cfg = get_cfg()

    @classmethod
    def __can_yara_be_in_platform(cls, yara_source: str, yara_source_name: str) -> bool:
        return (yara_source == RuleSourceMatch.enrichment.value and yara_source_name == cls.cfg.intelowl_custom_analyzer) \
               or (yara_source == RuleSourceMatch.sandbox.value)

    @classmethod
    async def is_valid_sha256(cls, sha256: str) -> bool:
        return bool(re.match('^[A-Fa-f0-9]{64}$', sha256))

    @classmethod
    async def __get_indicator_by_sha256(cls, sha256: str) -> dict:
        if not await cls.is_valid_sha256(sha256):
            raise IndicatorSha256Exception("Requested value is not a sha256")

        indicator = await cls.async_elastic_helper.get_indicators_by_sha256(sha256)

        return indicator['_source']

    @classmethod
    def __get_rule_or_none(cls, rules: List[OutRuleSchema], title: str) -> Optional[OutRuleSchema]:
        rules_matched = [r for r in rules if title.lower() == r.title.lower()]
        if len(rules_matched) == 0:
            return None
        elif len(rules_matched) == 1:
            return rules_matched[0]
        else:
            raise MalstreamApplicationError("Multiple rules found with the same title")

    @classmethod
    async def __add_raw_rule_to_indicator(cls, indicator: dict) -> dict:
        yara_rules = [
            {'q': yara['name'], 'type': RuleType.YARA} for yara in indicator['yara']
            if cls.__can_yara_be_in_platform(yara['rule_source_match'], yara['source'])
        ]
        sigma_rules = [{'q': sigma['name'], 'type': RuleType.SIGMA} for sigma in indicator['sigma']]
        suricata_rules = [{'q': suricata['signature'], 'type': RuleType.SURICATA} for suricata in indicator['suricata']]
        rules = yara_rules + sigma_rules + suricata_rules

        if len(rules) > 0:
            search_rules_results = await cls.async_elastic_helper.search_rules_in_platform(rules)
            search_rules_results_index = 0

            for yara in indicator['yara']:
                if cls.__can_yara_be_in_platform(yara['rule_source_match'], yara['source']):
                    yara['rule'] = cls.__get_rule_or_none(
                        search_rules_results[search_rules_results_index],
                        yara['name']
                    )
                    yara['exists_in_platform'] = yara['rule'] is not None
                    search_rules_results_index += 1

            for sigma in indicator['sigma']:
                sigma['rule'] = cls.__get_rule_or_none(
                    search_rules_results[search_rules_results_index],
                    sigma['name']
                )
                sigma['exists_in_platform'] = sigma['rule'] is not None
                search_rules_results_index += 1

            for suricata in indicator['suricata']:
                suricata['rule'] = cls.__get_rule_or_none(
                    search_rules_results[search_rules_results_index],
                    suricata['signature']
                )
                suricata['exists_in_platform'] = suricata['rule'] is not None
                search_rules_results_index += 1

        return indicator

    @classmethod
    async def get_out_indicator_schema_by_sha256_with_rules(cls, sha256) -> OutIndicatorReportSchema:
        indicator = await cls.__get_indicator_by_sha256(sha256)

        return cls.elastic_mapper.map_elastic_indicator_to_out_indicator_schema(
            await cls.__add_raw_rule_to_indicator(indicator)
        )

    @classmethod
    async def delete_indicator_by_sha256(cls, sha256: str) -> bool:
        try:
            r = await cls.async_elastic_helper.async_delete_indicator_by_sha256(sha256)
        except elasticsearch.NotFoundError:
            raise IndicatorNotFoundException

        return r['result'] == 'deleted'

    @classmethod
    async def check_rule_are_in_platform(cls, indicator: dict) -> dict:
        yara_rules = [
            {'q': yara['name'], 'type': RuleType.YARA} for yara in indicator['yara']
            if cls.__can_yara_be_in_platform(yara['rule_source_match'], yara['source'])
        ]
        suricata_rules = [{'q': suricata['signature'], 'type': RuleType.SURICATA} for suricata in indicator['suricata']]
        rules = yara_rules + suricata_rules

        if len(rules) > 0:
            search_rules_results = await cls.async_elastic_helper.search_rules_in_platform(rules)
            search_rules_results_index = 0
            for yara in indicator['yara']:
                if cls.__can_yara_be_in_platform(yara['rule_source_match'], yara['source']):
                    if yara['source'] == 'yara_scan_custom_rules':
                        yara['exists_in_platform'] = True
                    else:
                        yara['exists_in_platform'] = cls.__get_rule_or_none(
                            search_rules_results[search_rules_results_index], yara['name']
                        ) is not None
                        search_rules_results_index += 1

            for suricata in indicator['suricata']:
                suricata['exists_in_platform'] = cls.__get_rule_or_none(
                    search_rules_results[search_rules_results_index],
                    suricata['signature']
                ) is not None
                search_rules_results_index += 1

        for sigma in indicator['sigma']:
            sigma['exists_in_platform'] = True

        return indicator

    @classmethod
    async def get_indicators_with_offset_limit(
            cls, offset: int, limit: int, result_status: ResultStatus = ResultStatus.all
    ) -> List[OutIndicatorReportSchema]:
        indicators = await cls.async_elastic_helper.get_indicators_with_offset_limit(
            cls.async_elastic_helper.elastic_queries.get_results_query_by_result_status(result_status), offset, limit
        )

        return [
            cls.elastic_mapper.map_elastic_indicator_to_out_indicator_schema(
                await cls.check_rule_are_in_platform(indicator['_source'])
            )
            for indicator in indicators
        ]

    @classmethod
    async def get_indicators_count(cls, result_status: ResultStatus = ResultStatus.all) -> int:
        return await cls.async_elastic_helper.get_index_docs_count_by_query(
            RESULTS_INDEX,
            cls.async_elastic_helper.elastic_queries.get_results_query_by_result_status(result_status)
        )
