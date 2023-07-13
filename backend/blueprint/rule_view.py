from typing import List

from fastapi import APIRouter, status
from fastapi.responses import Response

from backend.common.exceptions.common import RuleValidationException, \
    ElasticSearchGenericException, MalstreamApplicationError, RuleAlreadyExistsException, ParameterException
from backend.common.utils import rule_title_from_body
from backend.facades.rule_facade import RuleFacade
from backend.helpers.async_elastic_helper import AsyncElasticHelper
from backend.schema.add_rule_schema import AddRuleSchema
from backend.schema.out_indicator_report_no_rule_schema import OutIndicatorNoRuleReportSchema
from backend.schema.out_rule_schema import OutRuleSchema
from backend.schema.out_total_schema import OutTotalSchema

router = APIRouter()


@router.get('', response_model=OutRuleSchema, tags=['rules'])
async def get_rule_by_id(rule_id: str) -> OutRuleSchema:
    r = await AsyncElasticHelper.get_rule_by_id(rule_id)

    return r


@router.get('/indicators/count', response_model=OutTotalSchema, tags=['rules'])
async def get_rule_by_uid_results(rule_id: str):
    r = await AsyncElasticHelper.get_rule_by_id(rule_id)
    return OutTotalSchema(total=await RuleFacade.get_results_count_by_rule_fn(r.type)(r.title))


@router.get('/indicators', response_model=List[OutIndicatorNoRuleReportSchema], tags=['rules'])
async def get_rule_by_uid_results(rule_id: str, offset: int = None, limit: int = None):
    if limit is None and offset is not None:
        offset = 0
    if offset is None and limit is not None:
        limit = 20

    r = await AsyncElasticHelper.get_rule_by_id(rule_id)
    return await RuleFacade.get_results_by_rule_fn(r.type)(r.title, offset, limit)


@router.post('/sync', status_code=status.HTTP_204_NO_CONTENT, tags=['rules'])
async def sync_rule(rule_id: str):
    rule = await AsyncElasticHelper.get_rule_by_id(rule_id)

    if not await RuleFacade.delete_rule_fn(rule.type)(rule.id) or not await RuleFacade.create_rule_fn(rule.type)(rule.body, rule.id):
        raise MalstreamApplicationError(status_code=400, message="Error while sync the rule")

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put('', status_code=status.HTTP_204_NO_CONTENT, tags=['rules'])
async def edit_rule(rule_id: str, rule: AddRuleSchema):
    old_rule = await AsyncElasticHelper.get_rule_by_id(rule_id)

    old_rule.body = rule.body

    if not await RuleFacade.is_rule_valid_fn(old_rule.type)(rule.body):
        raise RuleValidationException(f"Syntax error for new {old_rule.type} rule")

    old_rule_title = rule_title_from_body(old_rule.type, old_rule.body)
    new_rule_title = rule_title_from_body(old_rule.type, rule.body)
    existing_rule = await AsyncElasticHelper.get_rule_by_title(old_rule.type, old_rule_title)

    if await AsyncElasticHelper.rule_title_exists(new_rule_title) and str(existing_rule[0].id) != rule_id:
        raise RuleAlreadyExistsException(f'Rule with title {new_rule_title} already exists')

    if not await AsyncElasticHelper.update_rule(old_rule):
        raise ElasticSearchGenericException("Error while updating the rule in the DB")

    if not await RuleFacade.delete_rule_fn(old_rule.type)(rule_id) or not await RuleFacade.create_rule_fn(old_rule.type)(rule.body, rule_id):
        raise MalstreamApplicationError(status_code=400, message="Error while sync the rule")

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete('', status_code=status.HTTP_204_NO_CONTENT, tags=['rules'])
async def delete_rule(rule_id: str):
    rule = await AsyncElasticHelper.get_rule_by_id(rule_id)

    if not await RuleFacade.delete_rule_fn(rule.type)(rule_id):
        raise MalstreamApplicationError(status_code=400, message="Error while deleting the rule")

    res = await AsyncElasticHelper.delete_rule_by_id(rule_id)
    if not res:
        raise ElasticSearchGenericException("Error while deleting the rule in ElasticSearch")

    return Response(status_code=status.HTTP_204_NO_CONTENT)
