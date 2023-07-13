import asyncio
from collections import deque

import requests

from backend.business_model.rule_results_schema import RuleResultsSchema
from backend.common.config import get_cfg
from backend.providers.capev2_provider import CapeProvider

cfg = get_cfg()


class CapeHelper:
    capev2_queue = deque(
        [CapeProvider(cape_conf) for cape_conf in cfg.capev2s], maxlen=len(cfg.capev2s)
    )

    @classmethod
    def get_capev2_instance_and_rotate(cls) -> CapeProvider:
        c = cls.capev2_queue[0]
        cls.capev2_queue.rotate()

        return c

    @classmethod
    def get_capev2_yara_suricata_results(cls, filename: str) -> RuleResultsSchema:
        capev2_provider = cls.get_capev2_instance_and_rotate()
        return capev2_provider.get_capev2_yara_suricata_results(filename)

    @classmethod
    async def upload_yara_capev2(cls, body: str, _id: str) -> bool:
        results = await asyncio.gather(*(
            cape.upload_yara_capev2(body, _id) for cape in cls.capev2_queue
        ))

        return all(results)

    @classmethod
    async def delete_yara_capev2(cls, _id: str) -> bool:
        results = await asyncio.gather(*(
            cape.delete_yara_capev2(_id) for cape in cls.capev2_queue
        ))

        return all(results)

    @classmethod
    async def clean_up_yara_capev2(cls) -> bool:
        results = await asyncio.gather(*(
            cape.clean_up_yara_capev2() for cape in cls.capev2_queue
        ))

        return all(results)
    
    @classmethod
    async def upload_suricata_capev2(cls, body: str, _id: str) -> bool:
        results = await asyncio.gather(*(
            cape.upload_suricata_capev2(body, _id) for cape in cls.capev2_queue
        ))

        return all(results)

    @classmethod
    async def delete_suricata_capev2(cls, _id: str) -> bool:
        results = await asyncio.gather(*(
            cape.delete_suricata_capev2(_id) for cape in cls.capev2_queue
        ))

        return all(results)

    @classmethod
    async def clean_up_suricata_capev2(cls) -> bool:
        results = await asyncio.gather(*(
            cape.clean_up_suricata_capev2() for cape in cls.capev2_queue
        ))

        return all(results)
