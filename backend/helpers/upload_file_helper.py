import os
from datetime import datetime

import magic

from backend.celery_tasks.enrichment_task import enrichment
from backend.celery_tasks.retrohunt_task import retrohunt_upload
from backend.celery_tasks.sandbox_task import sandbox_analyze
from backend.common.const import CELERY_ENRICHMENT_TASK_QUEUE, CELERY_RETROHUNT_TASK_QUEUE, CELERY_SANDBOX_TASK_QUEUE
from backend.common.utils import get_sha256_from_complete_filename, get_file_path_from_filename
from backend.helpers.async_elastic_helper import AsyncElasticHelper
from backend.schema.out_file_report_schema import OutFileReportSchema
from backend.schema.out_hashes_file_schema import OutHashesFileSchema
from backend.schema.out_indicator_report_schema import OutIndicatorReportSchema


class UploadFileHelper:
    async_elastic_helper = AsyncElasticHelper

    @classmethod
    def is_file_too_big(cls, file: str) -> bool:
        # File less than 100MB
        return (os.path.getsize(file) / (1024 * 1024)) > 100

    @classmethod
    def is_filetype_allowed(cls, file: str) -> bool:
        # Skip Linux executable files
        file = magic.from_file(file).lower()

        return 'elf' != file[:3].lower() and 'Bourne-Again shell script'.lower() not in file and \
               "POSIX shell script, ".lower() not in file

    @classmethod
    def get_basic_indicator_report(
        cls, complete_filename: str, is_supported_by_sandbox: bool
    ) -> OutIndicatorReportSchema:
        return OutIndicatorReportSchema(
            file=OutFileReportSchema(
                name=complete_filename,
                hash=OutHashesFileSchema(sha256=get_sha256_from_complete_filename(complete_filename))
            ),
            created_dt=datetime.utcnow(),
            sandbox=False,
            enrichment=False,
            retrohunt=False,
            is_supported_by_sandbox=is_supported_by_sandbox
        )

    @classmethod
    def is_supported_by_sandbox(cls, complete_filename: str) -> bool:
        file_path = get_file_path_from_filename(complete_filename)

        return not cls.is_file_too_big(file_path) and cls.is_filetype_allowed(file_path)

    @classmethod
    async def dispatch(cls, complete_filename: str):
        basic_indicator_report = cls.get_basic_indicator_report(
            complete_filename, cls.is_supported_by_sandbox(complete_filename)
        ).dict()

        is_indexed = await cls.async_elastic_helper.index_result(
            basic_indicator_report,
            _id=get_sha256_from_complete_filename(complete_filename)
        )

        retrohunt_upload.apply_async((complete_filename, ), queue=CELERY_RETROHUNT_TASK_QUEUE)

        enrichment.apply_async((complete_filename, ), queue=CELERY_ENRICHMENT_TASK_QUEUE)

        if cls.is_supported_by_sandbox(complete_filename):
            sandbox_analyze.apply_async((complete_filename, ), queue=CELERY_SANDBOX_TASK_QUEUE)

        return is_indexed
