import os

import aiofiles
from fastapi import APIRouter, status, Response

from backend.common.const import TEMPORARY_PATH
from backend.common.exceptions.common import ElasticSearchGenericException, MalstreamApplicationError, \
    IndicatorNotFoundException, ParameterException
from backend.common.utils import async_write
from backend.helpers.indicator_helper import IndicatorHelper
from backend.helpers.mquery_helper import MqueryHelper
from backend.helpers.upload_file_helper import UploadFileHelper
from backend.schema.out_indicator_report_schema import OutIndicatorReportSchema

router = APIRouter()


@router.get('/download', response_model=OutIndicatorReportSchema, tags=['indicators'])
async def download_indicator(sha256: str):
    file = await MqueryHelper.download_file_by_sha256(sha256)

    return Response(content=file, media_type="application/octet-stream")


@router.get('', response_model=OutIndicatorReportSchema, tags=['indicators'])
async def get_indicator(sha256: str):
    return await IndicatorHelper.get_out_indicator_schema_by_sha256_with_rules(sha256)


@router.delete('', status_code=status.HTTP_204_NO_CONTENT, tags=['indicators'])
async def delete_indicator(sha256: str):

    if not await IndicatorHelper.delete_indicator_by_sha256(sha256):
        raise ElasticSearchGenericException(f"Unable to delete result {sha256}")

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put('', response_model=OutIndicatorReportSchema, tags=['indicators'])
async def resubmit_indicator(sha256: str):
    file = await MqueryHelper.download_file_by_sha256(sha256)

    dest_file = os.path.join(TEMPORARY_PATH, sha256)

    async with aiofiles.open(dest_file, 'wb') as fout:
        await fout.write(file)

    await IndicatorHelper.delete_indicator_by_sha256(sha256)

    if not await UploadFileHelper.dispatch(sha256):
        raise MalstreamApplicationError(
            status_code=400,
            message='Something went wrong when insert the indicator'
        )

    return UploadFileHelper.get_basic_indicator_report(
        sha256, UploadFileHelper.is_supported_by_sandbox(sha256)
    )
