from fastapi import APIRouter, status, Response

from backend.common.exceptions.common import MalstreamApplicationError
from backend.facades.rule_facade import RuleFacade
from backend.helpers.async_elastic_helper import AsyncElasticHelper
from backend.schema.out_rule_schema import RuleType

router = APIRouter()


@router.post('', status_code=status.HTTP_204_NO_CONTENT, tags=['rules'])
async def sync_rules_by_type(rule_type: RuleType):
    rules = await AsyncElasticHelper.get_rules_by_type(rule_type, ('title, @timestamp',))

    if not await RuleFacade.clean_up_rules_fn(rule_type)():
        raise MalstreamApplicationError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"Something went wrong when deleting {rule_type} rules"
        )

    if not all([await RuleFacade.create_rule_fn(rule_type)(r.body, str(r.id)) for r in rules]):
        raise MalstreamApplicationError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"Something went wrong when creating {rule_type} rules"
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)
