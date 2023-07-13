from typing import Tuple

import aiohttp
import requests

from backend.common.config import get_cfg
from backend.common.exceptions.common import IndicatorNotFoundException, ParameterException


class MqueryHelper:
    MQUERY_API_URL = get_cfg().mquery_url

    @classmethod
    async def submit_task(cls, raw_yara, priority) -> Tuple[dict, int]:
        body = {
            "raw_yara": raw_yara,
            "taints": [],
            "priority": priority,
            "method": "query"
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(f'{cls.MQUERY_API_URL}/api/query', json=body) as response:
                return await response.json(), response.status

    @classmethod
    async def get_tasks(cls) -> Tuple[dict, int]:
        async with aiohttp.ClientSession() as session:
            async with session.get(f'{cls.MQUERY_API_URL}/api/job') as response:
                return await response.json(), response.status

    @classmethod
    async def view_task_status(cls, task_id: str) -> Tuple[dict, int]:
        async with aiohttp.ClientSession() as session:
            async with session.get(f'{cls.MQUERY_API_URL}/api/job/{task_id}') as response:
                return await response.json(), response.status

    @classmethod
    async def get_matches(cls, task_id: str, offset: int = 0, limit: int = 20) -> Tuple[dict, int]:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                    f'{cls.MQUERY_API_URL}/api/matches/{task_id}?offset={offset}&limit={limit}') as response:
                return await response.json(), response.status

    @classmethod
    async def remove_task(cls, task_id: str) -> Tuple[dict, int]:
        async with aiohttp.ClientSession() as session:
            async with session.delete(f'{cls.MQUERY_API_URL}/api/job/{task_id}') as response:
                return await response.json(), response.status

    @classmethod
    async def download_file(cls, task_id: str, file_path: str, ordinal: int) -> Tuple[bytes, int]:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                    f'{cls.MQUERY_API_URL}/api/download?job_id={task_id}&file_path={file_path}&ordinal={ordinal}'
            ) as response:
                return await response.read(), response.status

    @classmethod
    def upload_file(cls, filename: str) -> bool:
        r = requests.post(
            f"{cls.MQUERY_API_URL}/api/upload",
            files={'file': open(filename, 'rb')}
        )

        return r.status_code != 200 or r.json()['status'] != 'ok'

    @classmethod
    async def download_file_by_sha256(cls, sha256: str) -> bytes:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                    f"{cls.MQUERY_API_URL}/api/download/{sha256}"
            ) as response:
                status_code = response.status

                if status_code == 404:
                    raise IndicatorNotFoundException('Indicator not exists anymore on the server')
                elif status_code == 400:
                    raise ParameterException('Insert a valida SHA256')

                return await response.read()
