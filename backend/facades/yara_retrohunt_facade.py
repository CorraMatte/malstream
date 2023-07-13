from backend.common.exceptions.common import RuleValidationException, ParameterException
from backend.common.exceptions.mquery import MqueryException
from backend.helpers.async_elastic_helper import AsyncElasticHelper
from backend.helpers.mquery_helper import MqueryHelper
from backend.helpers.yara_helper import YaraHelper
from backend.schema.add_retrohunt_schema import AddRetrohuntTaskSchema, PriorityTypes


class YaraRetrohuntFacade:
    yara_helper = YaraHelper
    mquery_helper = MqueryHelper
    async_elastic_helper = AsyncElasticHelper

    @classmethod
    async def add_retrohunt_task(cls, rule_id: str, task: AddRetrohuntTaskSchema):
        if not await cls.yara_helper.is_yara_valid(task.yara):
            raise RuleValidationException(f"Syntax error for new Yara rule")

        resp_json, resp_status = await cls.mquery_helper.submit_task(task.yara, task.priority.value)
        if resp_status == 200:
            task_id = resp_json["query_hash"]
            resp_json, resp_status = await cls.mquery_helper.view_task_status(task_id)
            if resp_status != 200:
                raise MqueryException(f"Problem submitting yara rule. Internal status code: {resp_status}")

            # Update rule in Elastic with a reference of the task_uid
            await cls.async_elastic_helper.add_retrohunt_task_id_to_rule(rule_id, task_id)

        elif resp_status == 400:
            raise ParameterException("Yara rule is not correctly formatted")
        else:
            raise MqueryException("Problem submitting yara rule")

    @classmethod
    async def remove_retrohunt_task(cls, task_id: str):
        resp_json, resp_status = await cls.mquery_helper.remove_task(task_id)

        if resp_status != 200 or resp_json["status"] != "ok":
            raise MqueryException(
                f'Error removing retrohunt task {task_id}, status code: {resp_status}', status_code=resp_status
            )

        rule = (await cls.async_elastic_helper.get_rules_by_retrohunt_task(task_id))[0]

        await cls.async_elastic_helper.add_retrohunt_task_id_to_rule(rule['_id'], '')

    @classmethod
    async def resubmit_task(cls, rule_id: str):
        rule = await cls.async_elastic_helper.get_rule_by_id(rule_id)
        await cls.add_retrohunt_task(
            str(rule.id), AddRetrohuntTaskSchema(yara=rule.body, priority=PriorityTypes.medium)
        )

        resp_json, resp_status = await cls.mquery_helper.remove_task(rule.retrohunt_task_id)

        if resp_status != 200 or resp_json["status"] != "ok":
            raise MqueryException(
                f'Error removing retrohunt task {rule.retrohunt_task_id}, status code: {resp_status}', status_code=resp_status
            )
