import os

from backend.business_model.rule_results_schema import RuleResultsSchema
from backend.celery import app
from backend.common.utils import get_sha256_from_complete_filename, get_file_path_from_filename
from backend.helpers.cape_helper import CapeHelper
from backend.helpers.elastic_helper import ElasticHelper
from backend.helpers.sigma_helper import SigmaHelper


@app.task
def sandbox_analyze(complete_filename: str):
    sha256 = get_sha256_from_complete_filename(complete_filename)
    file_path = get_file_path_from_filename(complete_filename)
    yara_suricata_results = CapeHelper.get_capev2_yara_suricata_results(file_path)
    sigma_results = SigmaHelper.get_sigma_result_by_uid(sha256)

    results = RuleResultsSchema(
        yara=yara_suricata_results.yara,
        suricata=yara_suricata_results.suricata,
        sigma=sigma_results.sigma
    )

    res = ElasticHelper.get_result_by_sha256(sha256)

    if res['enrichment'] and res['retrohunt']:
        os.remove(file_path)

    return ElasticHelper.update_rule_results(results, sha256, sandbox=True)
