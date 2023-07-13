from fastapi import APIRouter, status
from pydantic import BaseModel
from sigma.exceptions import SigmaError

from backend.common.exceptions.common import RuleValidationException
from backend.helpers.async_elastic_helper import AsyncElasticHelper
from backend.helpers.sigma_helper import SigmaHelper

router = APIRouter()


class RetroSigma(BaseModel):
    body: str


@router.post('', status_code=status.HTTP_200_OK, tags=["retrosigma"])
async def add_task(sigma: RetroSigma):
    if not await SigmaHelper.is_sigma_valid(sigma.body):
        raise RuleValidationException('Rule not valid')

    es_sigma = await SigmaHelper.translate_rule(sigma.body)
    if es_sigma is None:
        raise SigmaError

    res = await AsyncElasticHelper.all_docs(
        index="logs-*", _source_includes=('file.hash.sha256',), query={
            "query": {
                "query_string": {
                    "default_field": "*",
                    "query": es_sigma
                }
            }
        }
    )

    return sorted(list(set([r['_source']['file']['hash']['sha256'] for r in res['hits']['hits']])))
