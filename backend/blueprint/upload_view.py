import os
import re

from fastapi import APIRouter, UploadFile, File

from backend.common.const import TEMPORARY_PATH
from backend.common.exceptions.common import FileAlreadyExistsException, MalstreamApplicationError
from backend.common.utils import async_write, async_sha256, get_sha256_from_complete_filename
from backend.helpers.async_elastic_helper import AsyncElasticHelper
from backend.helpers.upload_file_helper import UploadFileHelper
from backend.schema.out_indicator_report_schema import OutIndicatorReportSchema

router = APIRouter()


@router.post("", response_model=OutIndicatorReportSchema, description='Upload a malware file', tags=['upload'])
async def upload_file(file: UploadFile = File(..., description='Malware file')):
    if re.match('^[A-Fa-f0-9]{64}', file.filename):
        complete_filename = file.filename
        sha256 = get_sha256_from_complete_filename(file.filename)
    else:
        sha256 = await async_sha256(file)
        complete_filename = f"{sha256}{file.filename}"

    if await AsyncElasticHelper.is_file_analyzed(sha256):
        raise FileAlreadyExistsException('File already analyzed')

    dest_file = os.path.join(TEMPORARY_PATH, complete_filename)

    await file.seek(0)
    await async_write(dest_file, file)

    if not await UploadFileHelper.dispatch(complete_filename):
        raise MalstreamApplicationError(
            status_code=400,
            message='Something went wrong when insert the indicator'
        )

    return UploadFileHelper.get_basic_indicator_report(
        complete_filename, UploadFileHelper.is_supported_by_sandbox(complete_filename)
    )
