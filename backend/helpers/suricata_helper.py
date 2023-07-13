from typing import List

from idstools import rule

from backend.helpers.async_elastic_helper import AsyncElasticHelper
from backend.helpers.cape_helper import CapeHelper
from backend.schema.out_indicator_report_no_rule_schema import OutIndicatorNoRuleReportSchema


class SuricataHelper:
    cape_helper = CapeHelper
    elastic_helper = AsyncElasticHelper

    @classmethod
    def __get_query_results_match(cls, title: str) -> dict:
        return {
            "query": {
                "match_phrase": {
                    "suricata.signature": title
                }
            }
        }

    @classmethod
    async def is_suricata_valid(cls, body: str) -> bool:
        try:
            r = rule.parse(body)
            if r is None:
                raise Exception

            return True
        except Exception:
            return False

    @classmethod
    async def create_suricata(cls, body, _id: str) -> bool:
        return await cls.cape_helper.upload_suricata_capev2(body, _id)

    @classmethod
    async def delete_suricata(cls, _id: str) -> bool:
        return await cls.cape_helper.delete_suricata_capev2(_id)

    @classmethod
    async def clean_up_suricata(cls) -> bool:
        return await cls.cape_helper.clean_up_suricata_capev2()

    @classmethod
    async def get_results_by_rule_suricata(
            cls, title: str, offset: int = 0, limit: int = 20
    ) -> List[OutIndicatorNoRuleReportSchema]:
        return await cls.elastic_helper.search_result_by_query(
            cls.__get_query_results_match(title), offset, limit
        )

    @classmethod
    async def get_results_count_by_rule_suricata(cls, title: str) -> int:
        return await cls.elastic_helper.count_results_by_query(cls.__get_query_results_match(title))
