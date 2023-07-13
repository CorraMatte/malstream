import os

from backend.business_model.rule_results_schema import RuleResultsSchema
from backend.celery import app
from backend.common.utils import get_sha256_from_complete_filename, get_file_path_from_filename
from backend.helpers.elastic_helper import ElasticHelper

from backend.helpers.mquery_helper import MqueryHelper


@app.task
def retrohunt_upload(complete_filename: str):
    file_path = get_file_path_from_filename(complete_filename)
    sha256 = get_sha256_from_complete_filename(complete_filename)

    MqueryHelper.upload_file(file_path)

    res = ElasticHelper.get_result_by_sha256(sha256)

    if res['enrichment'] and (res['sandbox'] or not res["is_supported_by_sandbox"]):
        os.remove(file_path)

    return ElasticHelper.update_rule_results(RuleResultsSchema(), sha256, retrohunt=True)
