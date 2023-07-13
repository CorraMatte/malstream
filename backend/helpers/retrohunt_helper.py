from typing import List

from backend.common.exceptions.mquery import MqueryException
from backend.helpers.async_elastic_helper import AsyncElasticHelper
from backend.helpers.mquery_helper import MqueryHelper
from backend.schema.out_matches_schema import OutMatchSchema
from backend.schema.out_retrohunt_task_schema import OutRetrohuntTaskSchema, StatusTypes


class RetrohuntHelper:
    async_elastic_helper = AsyncElasticHelper
    mquery_helper = MqueryHelper

    @classmethod
    def get_retrohunt_schema_from_job(cls, retrohunt_task) -> OutRetrohuntTaskSchema:
        return OutRetrohuntTaskSchema(
            id=retrohunt_task['id'],
            status=StatusTypes[retrohunt_task['status'].lower()],
            rule_name=retrohunt_task['rule_name'],
            yara=retrohunt_task['raw_yara'],
            submitted=retrohunt_task['submitted'],
            finished=retrohunt_task['finished'],
            priority=retrohunt_task['priority'],
            files_matched=retrohunt_task['files_matched'],
        )

    @classmethod
    async def download_retrohunt_file(cls, task_id: str, file_path: str, ordinal: int):
        data, resp_status = await cls.mquery_helper.download_file(task_id, file_path, ordinal)

        if resp_status == 200:
            return data
        else:
            raise MqueryException(f'Error downloading file, status code: {resp_status}', status_code=resp_status)

    @classmethod
    async def get_retrohunt_task(cls, task_id: str) -> OutRetrohuntTaskSchema:
        resp_json, resp_status = await cls.mquery_helper.view_task_status(task_id)

        if resp_status != 200:
            raise MqueryException(
                f'Error retrieving retrohunt task {task_id}, status code: {resp_status}', status_code=resp_status
            )

        return cls.get_retrohunt_schema_from_job(resp_json)

    @classmethod
    async def get_retrohunt_tasks(cls) -> List[OutRetrohuntTaskSchema]:
        resp_json, resp_status = await cls.mquery_helper.get_tasks()

        if resp_status != 200:
            raise MqueryException(f'Error downloading file, status code: {resp_status}', status_code=resp_status)

        return [
            cls.get_retrohunt_schema_from_job(r)
            for r in resp_json['jobs'] if r['status'] != StatusTypes.cancelled.value
        ]

    @classmethod
    async def get_retrohunt_matches(cls, task_id: str, offset: int, limit: int) -> List[OutMatchSchema]:
        resp_json, resp_status = await cls.mquery_helper.get_matches(task_id, offset, limit)

        if resp_status != 200:
            raise MqueryException(
                f'Error retrieving retrohunt task {task_id}, status code: {resp_status}', status_code=resp_status
            )

        mquery_status = resp_json['job']['status'].lower()
        list_matches = []
        if mquery_status in [StatusTypes.done.value, StatusTypes.processing.value]:
            ordinal = offset
            for m in resp_json['matches']:
                list_matches.append(
                    OutMatchSchema(sha256=m['meta']['sha256']['display_text'], path=m['file'], ordinal=ordinal))
                ordinal += 1
        else:
            for m in resp_json['matches']:
                list_matches.append(OutMatchSchema(sha256=m['meta']['sha256']['display_text']))

        return list_matches
