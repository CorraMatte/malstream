import asyncio
from collections import deque

from backend.business_model.rule_results_schema import RuleResultsSchema
from backend.common.config import get_cfg
from backend.providers.intelowl_provider import IntelOwlProvider

cfg = get_cfg()


class IntelOwlHelper:
    intelowl_queue = deque(
        [IntelOwlProvider(intel_conf, cfg.intelowl_custom_analyzer) for intel_conf in cfg.intelowls],
        maxlen=len(cfg.intelowls)
    )

    @classmethod
    def get_intelowl_instance_and_rotate(cls) -> IntelOwlProvider:
        i = cls.intelowl_queue[0]
        cls.intelowl_queue.rotate()

        return i

    @classmethod
    def enrich_file_intelowl(cls, filename: str) -> RuleResultsSchema:
        print('Enrich intelowl')
        intelowl = cls.get_intelowl_instance_and_rotate()

        return intelowl.enrich_file_intelowl(filename)

    @classmethod
    async def upload_yara_intelowl(cls, body: str, _id: str) -> bool:
        results = await asyncio.gather(*(
            intelowl.upload_yara_intelowl(body, _id) for intelowl in cls.intelowl_queue
        ))

        return all(results)

    @classmethod
    async def clean_up_yara_intelowl(cls) -> bool:
        results = await asyncio.gather(*(
            intelowl.clean_up_yara_intelowl() for intelowl in cls.intelowl_queue
        ))

        return all(results)

    @classmethod
    async def delete_yara_intelowl(cls, _id) -> bool:
        results = await asyncio.gather(*(
            intelowl.delete_yara_intelowl(_id) for intelowl in cls.intelowl_queue
        ))

        return all(results)
