from fastapi import APIRouter

from backend.business_model.result_status import ResultStatus
from backend.helpers.indicator_helper import IndicatorHelper
from backend.schema.out_total_schema import OutTotalSchema

router = APIRouter()


@router.get('', response_model=OutTotalSchema, tags=['indicators'])
async def get_indicators_count(result_status: ResultStatus = ResultStatus.all):
    return OutTotalSchema(total=await IndicatorHelper.get_indicators_count(result_status))
