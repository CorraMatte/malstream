import time
from datetime import datetime
from typing import List

from elasticsearch import Elasticsearch, exceptions

from backend.business_model.rule_results_schema import RuleResultsSchema
from backend.common.config import get_cfg
from backend.common.const import RESULTS_INDEX, SIGMA_RESULTS_INDEX
from backend.common.exceptions.common import IndicatorNotFoundException

cfg = get_cfg()


class ElasticHelper:
    handler = Elasticsearch(
        cfg.elasticsearch_url, api_key=(cfg.elasticsearch_id, cfg.elasticsearch_key), verify_certs=cfg.elasticsearch_verify_cert
    )

    @classmethod
    def get_result_by_sha256(cls, sha256: str) -> dict:
        try:
            return cls.handler.get(index=RESULTS_INDEX, id=sha256)['_source']
        except exceptions.NotFoundError:
            raise IndicatorNotFoundException(f"Indicator {sha256} not found")

    @classmethod
    def update_rule_results(
            cls, results: RuleResultsSchema, sha256: str,
            sandbox: bool = False, enrichment: bool = False, retrohunt: bool = False
    ) -> bool:
        body = cls.get_result_by_sha256(sha256)

        for rule_type in ['yara', 'sigma', 'suricata', 'osint']:
            if rule_type in body:
                body[rule_type].extend([r.dict() for r in getattr(results, rule_type)])
            else:
                body[rule_type] = [r.dict() for r in getattr(results, rule_type)]

        if sandbox:
            body['sandbox'] = True
            body['sandbox_dt'] = datetime.utcnow()

        if enrichment:
            body['enrichment'] = True
            body['enrichment_dt'] = datetime.utcnow()

        if retrohunt:
            body['retrohunt'] = True
            body['retrohunt_dt'] = datetime.utcnow()

        res = cls.handler.index(index=RESULTS_INDEX, id=sha256, body=body, refresh=True)
        return res['result'] == 'updated'

    @classmethod
    def get_sigma_result_by_sha56(cls, sha256: str) -> List[dict]:
        # Sleep 5 minutes in order to be sure that the alerts are triggered
        time.sleep(600)

        res = cls.handler.search(
            index=SIGMA_RESULTS_INDEX,
            body={
                "query": {
                    "bool": {
                        "must": [
                            {
                                "match": {
                                    "file.hash.sha256": sha256
                                }
                            },
                            {
                                "range": {
                                    "@timestamp": {
                                        "gte": f"now-30m/m"
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        )

        return res['hits']['hits']
