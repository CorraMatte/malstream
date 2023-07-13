from fastapi import APIRouter, status

from backend.common.exceptions.common import RuleValidationException, ElasticSearchGenericException, \
    MalstreamApplicationError, RuleAlreadyExistsException
from backend.common.utils import rule_title_from_body
from backend.facades.rule_facade import RuleFacade
from backend.helpers.async_elastic_helper import AsyncElasticHelper
from backend.schema.add_rule_schema import AddRuleSchema
from backend.schema.out_rule_schema import RuleType

router = APIRouter()


@router.post('', status_code=status.HTTP_201_CREATED, tags=['rules'])
async def create_rule(rule_type: RuleType, rule: AddRuleSchema):
    if not await RuleFacade.is_rule_valid_fn(rule_type)(rule.body):
        raise RuleValidationException(f"Syntax error for new {rule_type.value} rule")

    rule_title = rule_title_from_body(rule_type, rule.body)
    if await AsyncElasticHelper.rule_title_exists(rule_title):
        raise RuleAlreadyExistsException(f'Rule with title {rule_title} already exists')

    _id = await AsyncElasticHelper.create_rule(rule, rule_type)
    if not _id:
        return ElasticSearchGenericException("Error while creating the rule in ElasticSearch")

    if not await RuleFacade.create_rule_fn(rule_type)(rule.body, _id):
        await AsyncElasticHelper.delete_rule_by_id(_id)
        raise MalstreamApplicationError(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"Error while creating a new {rule_type.value} rule"
        )
