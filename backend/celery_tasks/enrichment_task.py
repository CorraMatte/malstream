import os

from backend.celery import app
from backend.common.utils import get_sha256_from_complete_filename, get_file_path_from_filename
from backend.helpers.elastic_helper import ElasticHelper

from backend.helpers.intelowl_helper import IntelOwlHelper


@app.task
def enrichment(complete_filename: str):
    sha256 = get_sha256_from_complete_filename(complete_filename)
    file_path = get_file_path_from_filename(complete_filename)
    results = IntelOwlHelper.enrich_file_intelowl(complete_filename)

    res = ElasticHelper.get_result_by_sha256(sha256)

    if res['retrohunt'] and (res['sandbox'] or not res["is_supported_by_sandbox"]):
        os.remove(file_path)

    return ElasticHelper.update_rule_results(
        results, get_sha256_from_complete_filename(complete_filename), enrichment=True
    )
