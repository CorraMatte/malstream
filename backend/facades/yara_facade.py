from typing import List

from backend.helpers.async_elastic_helper import AsyncElasticHelper
from backend.helpers.cape_helper import CapeHelper
from backend.helpers.intelowl_helper import IntelOwlHelper
from backend.schema.out_indicator_report_no_rule_schema import OutIndicatorNoRuleReportSchema


class YaraFacade:
    intelowl_helper = IntelOwlHelper
    cape_helper = CapeHelper
    elastic_helper = AsyncElasticHelper

    @classmethod
    def __get_query_results_match(cls, title: str) -> dict:
        return {
            "query": {
                "match_phrase": {
                    "yara.name": title
                }
            }
        }

    @classmethod
    async def create_yara(cls, body: str, _id: str) -> bool:
        return await cls.intelowl_helper.upload_yara_intelowl(body, _id) and await cls.cape_helper.upload_yara_capev2(
            body, _id
        )

    @classmethod
    async def delete_yara(cls, _id: str) -> bool:
        return await cls.intelowl_helper.delete_yara_intelowl(_id) and await cls.cape_helper.delete_yara_capev2(_id)

    @classmethod
    async def clean_up_yara(cls):
        return await cls.intelowl_helper.clean_up_yara_intelowl() and await cls.cape_helper.clean_up_yara_capev2()

    @classmethod
    async def get_results_by_rule_yara(
            cls, title: str, offset: int = 0, limit: int = 20
    ) -> List[OutIndicatorNoRuleReportSchema]:
        return await cls.elastic_helper.search_result_by_query(
            cls.__get_query_results_match(title), offset, limit
        )

    @classmethod
    async def get_results_count_by_rule_yara(cls, title: str) -> int:
        return await cls.elastic_helper.count_results_by_query(cls.__get_query_results_match(title))
