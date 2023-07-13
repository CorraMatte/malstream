from typing import List

from fastapi import APIRouter

from backend.business_model.result_status import ResultStatus
from backend.helpers.indicator_helper import IndicatorHelper
from backend.schema.out_indicator_report_schema import OutIndicatorReportSchema

router = APIRouter()


@router.get('', response_model=List[OutIndicatorReportSchema], tags=['indicators'])
async def get_indicator_reports(offset: int = 0, limit: int = 20, result_status: ResultStatus = ResultStatus.all):
    return await IndicatorHelper.get_indicators_with_offset_limit(offset, limit, result_status)
