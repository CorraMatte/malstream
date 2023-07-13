from typing import Dict, List

from fastapi import APIRouter

from backend.schema.out_rule_schema import RuleType

router = APIRouter()


@router.get('', tags=['rules'])
async def get_rules_by_type() -> Dict[str, List[str]]:
    return {'types': [t.value for t in RuleType]}
