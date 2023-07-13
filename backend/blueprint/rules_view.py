from typing import List

from fastapi import APIRouter

from backend.facades.rule_facade import RuleFacade
from backend.helpers.async_elastic_helper import AsyncElasticHelper
from backend.schema.out_rule_schema import RuleType, OutRuleSchema

router = APIRouter()


@router.get('', response_model=List[OutRuleSchema], tags=['rules'])
async def get_all_rules(q: str = None, rule_type: RuleType = None):
    if q is None and rule_type is None:
        rules = await AsyncElasticHelper.get_all_rules()
    elif q is None:
        rules = await AsyncElasticHelper.get_rules_by_type(rule_type)
    else:
        rules = await AsyncElasticHelper.get_rules_by_keyword(q, rule_type)

    for r in rules:
        r.number_results = await RuleFacade.get_results_count_by_rule_fn(r.type)(r.title)

    return sorted(rules, key=lambda r: str(r.number_results), reverse=True)
