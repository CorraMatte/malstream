from fastapi import APIRouter

from backend.helpers.async_elastic_helper import AsyncElasticHelper
from backend.schema.out_rule_schema import RuleType
from backend.schema.out_total_schema import OutTotalSchema

router = APIRouter()


@router.get('', response_model=OutTotalSchema, tags=['rules'])
async def get_rules_count(rule_type: RuleType = None):
    if rule_type:
        return OutTotalSchema(total=await AsyncElasticHelper.get_index_docs_count(rule_type.value))
    else:
        return OutTotalSchema(total=await AsyncElasticHelper.get_indexes_docs_count([r.value for r in RuleType]))
