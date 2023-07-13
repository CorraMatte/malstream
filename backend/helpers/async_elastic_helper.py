from datetime import datetime
from typing import List, Optional, Tuple, Dict
from uuid import uuid4

from elasticsearch import AsyncElasticsearch
from elasticsearch import exceptions

from backend.common.config import get_cfg
from backend.common.const import RESULTS_INDEX, RULES_INDEXES, YARA_INDEX
from backend.common.elastic_queries import ElasticQueries
from backend.common.exceptions.common import IndicatorNotFoundException, RuleNotFoundException, RuleValidationException
from backend.common.utils import rule_title_from_body
from backend.helpers.yara_helper import YaraHelper
from backend.mapper.elastic_mapper import ElasticMapper
from backend.schema.add_rule_schema import AddRuleSchema
from backend.schema.out_indicator_report_no_rule_schema import OutIndicatorNoRuleReportSchema
from backend.schema.out_rule_schema import RuleType, OutRuleSchema
from backend.schema.out_top_result_stats_schema import OutTotalResultStatsSchema
from backend.schema.out_trend_schema import OutTrendSchema

cfg = get_cfg()


class AsyncElasticHelper:
    SCROLL_TIME = "5m"
    SCROLL_SIZE = 1000
    yara_helper = YaraHelper
    elastic_mapper = ElasticMapper
    elastic_queries = ElasticQueries

    handler = AsyncElasticsearch(
        cfg.elasticsearch_url, api_key=(cfg.elasticsearch_id, cfg.elasticsearch_key),
        verify_certs=cfg.elasticsearch_verify_cert
    )

    @classmethod
    def __escape_string(cls, string: str):
        specials = ["\\", "!", "(", ")", "{", "}", "[", "]", "^", "\"", "~", "*", "?", ":", "/"]
        for s in specials:
            string = string.replace(s, '\\' + f'{s}')
        return string

    @classmethod
    async def scroll(cls, scroll_id: str) -> dict:
        return await cls.handler.scroll(scroll_id=scroll_id, scroll=cls.SCROLL_TIME)

    @classmethod
    async def scroll_docs(
            cls, index: str, query: dict, timeout=600, _source_excludes: Optional[Tuple[str, ...]] = (),
            _source_includes: Optional[Tuple[str, ...]] = ('*',)
    ) -> dict:
        return await cls.handler.search(
            index=index, body=query, scroll=cls.SCROLL_TIME, size=cls.SCROLL_SIZE, request_timeout=timeout,
            source_excludes=_source_excludes, source_includes=_source_includes
        )

    @classmethod
    async def all_docs(
            cls, index: str, query: dict, _source_excludes: Optional[Tuple[str, ...]] = (),
            _source_includes: Optional[Tuple[str, ...]] = ('*',)
    ) -> dict:
        # Scroll documents
        result_scroll = await cls.scroll_docs(
            index=index, query=query, _source_includes=_source_includes, _source_excludes=_source_excludes
        )
        hits = {
            'hits': {
                'total': {'value': 0}, 'hits': []
            }
        }
        hits["hits"]["hits"] = result_scroll["hits"]["hits"]
        hits["hits"]["total"]["value"] = result_scroll["hits"]["total"]["value"]

        while result_scroll["hits"]["hits"]:
            result_scroll = await cls.scroll(result_scroll["_scroll_id"])
            # Process current batch of hits
            hits["hits"]["hits"].extend(result_scroll["hits"]["hits"])
            hits["hits"]["total"]["value"] += result_scroll["hits"]["total"]["value"]

        await cls.handler.clear_scroll(scroll_id=result_scroll["_scroll_id"])

        return hits

    @classmethod
    async def is_file_analyzed(cls, sha256: str) -> bool:
        try:
            await cls.handler.get(index=RESULTS_INDEX, id=sha256)
            return True
        except exceptions.NotFoundError:
            return False

    @classmethod
    async def get_indicators_by_sha256(cls, sha256: str, _source: Tuple[str, ...] = ('*',)) -> dict:
        try:
            return await cls.handler.get(index=RESULTS_INDEX, id=sha256, _source=_source)
        except exceptions.NotFoundError:
            raise IndicatorNotFoundException("Indicator not found")

    @classmethod
    async def get_rules_by_keyword(cls, q: str, rule_type: RuleType = None) -> List[OutRuleSchema]:
        res = await cls.all_docs(index=RULES_INDEXES if not rule_type else rule_type.value, query={
            "query": {
                "query_string": {
                    "query": f"*{cls.__escape_string(q)}*",
                    "fields": ["body"]
                }
            }
        })
        return [cls.elastic_mapper.get_rule_schema_from_doc(r) for r in res['hits']['hits']]

    @classmethod
    async def search_rule_in_platform(cls, q: str, rule_type: RuleType = None) -> List[OutRuleSchema]:
        index = RULES_INDEXES if rule_type is None else rule_type.value

        res = await cls.handler.search(index=index, body={
            "query": {
                "match_phrase": {
                    "body": f"*{cls.__escape_string(q)}*"
                }
            }
        })

        return [
            cls.elastic_mapper.get_rule_schema_from_doc(r) for r in res['hits']['hits']
            if q.lower() == rule_title_from_body(RuleType[r['_source']['type'].upper()], r['_source']['body']).lower()
        ]

    @classmethod
    async def search_rules_in_platform(cls, rules: List[Dict[str, str]]) -> List[List[OutRuleSchema]]:
        search_arr = []
        for rule in rules:
            search_arr.append({'index': rule['type']})
            search_arr.append({
                "query": {
                    "match_phrase": {
                        "body": f"*{cls.__escape_string(rule['q'])}*"
                    }
                }
            })

        res = await cls.handler.msearch(searches=search_arr)

        results = []
        for index, rule in enumerate(rules):
            rule_result = res['responses'][index]
            results.append([
                cls.elastic_mapper.get_rule_schema_from_doc(r) for r in rule_result['hits']['hits']
                if rule['q'].lower() == rule_title_from_body(
                    RuleType[r['_source']['type'].upper()], r['_source']['body']
                ).lower()
            ])

        return results

    @classmethod
    async def get_rules_by_type(cls, rule_type: RuleType, _source_excludes: Optional[Tuple[str, ...]] = ()) -> \
            List[OutRuleSchema]:
        if not RuleType.has_value(rule_type.value):
            return []

        res = await cls.all_docs(
            index=rule_type.value, query={'query': {'match_all': {}}}, _source_excludes=_source_excludes
        )
        return [cls.elastic_mapper.get_rule_schema_from_doc(r) for r in res['hits']['hits']]

    @classmethod
    async def create_rule(cls, rule: AddRuleSchema, rule_type: RuleType) -> Optional[str]:
        if not RuleType.has_value(rule_type.value):
            return None

        r = rule.dict()
        _id = uuid4()
        r['@timestamp'] = datetime.utcnow()
        r['type'] = rule_type.value
        r['id'] = _id

        res = await cls.handler.index(index=rule_type.value, document=r, id=r['id'])
        return _id if res['result'] == 'created' else None

    @classmethod
    async def get_rule_by_id(cls, rule_id: str) -> Optional[OutRuleSchema]:
        doc = await cls.handler.search(
            index=RULES_INDEXES,
            body={"query": {"match": {"_id": rule_id}}}
        )

        if doc['hits']['total']['value'] == 0:
            raise RuleNotFoundException(f"Rule {rule_id} not found")

        return cls.elastic_mapper.get_rule_schema_from_doc(doc['hits']['hits'][0])

    @classmethod
    async def delete_rule_by_id(cls, rule_id: str) -> bool:
        res = await cls.handler.delete_by_query(
            index=RULES_INDEXES, body={"query": {"match": {"_id": rule_id}}}, refresh=True
        )
        return res['deleted'] == 1

    @classmethod
    async def delete_pending_indicators(cls):
        await cls.handler.delete_by_query(
            index=RESULTS_INDEX, body=cls.elastic_queries.get_pending_task_query(), refresh=True
        )

    @classmethod
    async def update_rule(cls, rule: OutRuleSchema) -> bool:
        res = await cls.handler.update(index=rule.type, id=str(rule.id), body={'doc': rule.dict()}, refresh=True)
        return res['result'] == 'updated' or res['result'] == 'noop'

    @classmethod
    async def index_result(cls, doc: dict, _id: str) -> bool:
        res = await cls.handler.index(index=RESULTS_INDEX, document=doc, id=_id, refresh=True)
        return res['result'] == 'created'

    @classmethod
    async def get_all_rules(cls) -> List[OutRuleSchema]:
        res = await cls.all_docs(index=RULES_INDEXES, query={"query": {"match_all": {}}})
        return [cls.elastic_mapper.get_rule_schema_from_doc(r) for r in res['hits']['hits']]

    @classmethod
    async def add_retrohunt_task_id_to_rule(cls, _id: str, task_id: str) -> bool:
        rule = await cls.get_rule_by_id(_id)
        if rule.type != RuleType.YARA or not cls.yara_helper.is_yara_valid(rule.body):
            raise RuleValidationException(f"The rule is not a Yara or it has a wrong syntax")

        rule.retrohunt_task_id = task_id
        res = await cls.handler.update(index=rule.type, id=str(_id), body={'doc': rule.dict()}, refresh=True)
        return res['result'] == 'updated' or res['result'] == 'noop'

    @classmethod
    async def get_first_result(cls) -> Optional[dict]:
        res = await cls.handler.search(
            index=RESULTS_INDEX, body={"query": {"match_all": {}}}, size=1, sort=[{'created_dt': 'asc'}]
        )

        if len(res['hits']['hits']) > 0:
            return res['hits']['hits'][0]

        return None

    @classmethod
    async def get_indicators_with_offset_limit(cls, query: dict, offset: int, limit: int) -> List[dict]:
        res = await cls.handler.search(
            index=RESULTS_INDEX,
            body=query,
            from_=offset,
            size=limit,
            sort=[{'created_dt': 'desc'}]
        )

        return res['hits']['hits']

    @classmethod
    async def get_index_docs_count(cls, index: str) -> int:
        c = await cls.handler.count(index=index)
        return c['count']

    @classmethod
    async def get_index_docs_count_by_query(cls, index: str, query: dict) -> int:
        c = await cls.handler.count(index=index, body=query)
        return c['count']

    @classmethod
    async def get_indexes_docs_count(cls, indexes: List[str]) -> int:
        c = await cls.handler.count(index=indexes)
        return c['count']

    @classmethod
    async def get_rule_by_title(cls, rule_type: RuleType, title: str) -> List[OutRuleSchema]:
        return await cls.search_rule_in_platform(title, rule_type)

    @classmethod
    async def rule_title_exists(cls, title: str) -> bool:
        return len(await cls.search_rule_in_platform(title)) >= 1

    @classmethod
    async def get_rules_by_retrohunt_task(cls, task_uid: str):
        res = await cls.handler.search(
            index=YARA_INDEX,
            body={
                'query': {
                    'match': {
                        'retrohunt_task_id': task_uid
                    }
                }
            }
        )

        return res['hits']['hits']

    @classmethod
    async def async_delete_indicator_by_sha256(cls, sha256: str) -> dict:
        return await cls.handler.delete(index=RESULTS_INDEX, id=sha256, refresh=True)

    @classmethod
    async def search_result_by_query(
            cls, q: dict, offset: int = None, limit: int = None
    ) -> List[OutIndicatorNoRuleReportSchema]:
        if offset is None:
            if limit is None:
                res = await cls.all_docs(index=RESULTS_INDEX, query=q)
            else:
                res = await cls.handler.search(index=RESULTS_INDEX, body=q, size=limit)
        else:
            if limit is None:
                res = await cls.handler.search(index=RESULTS_INDEX, body=q, from_=offset)
            else:
                res = await cls.handler.search(index=RESULTS_INDEX, body=q, size=limit, from_=offset)

        return [
            cls.elastic_mapper.map_elastic_indicator_to_out_indicator_no_rule_schema(indicator['_source'])
            for indicator in res['hits']['hits']
        ]

    @classmethod
    async def count_results_by_query(cls, query: dict) -> int:
        res = await cls.handler.count(index=RESULTS_INDEX, body=query)

        return res['count']

    @classmethod
    async def get_aggs_result(
            cls, group_by_field: str, size: int = 10, query: dict = None
    ) -> List[OutTotalResultStatsSchema]:
        q = query if query is not None else {}

        q['aggs'] = {
            "results": {
                "terms": {
                    "field": group_by_field,
                    "size": size
                }
            }
        }

        res = await cls.handler.search(index=RESULTS_INDEX, size=0, body=q)

        return [
            cls.elastic_mapper.map_result_to_out_top_result_schema(r) for r in res['aggregations']['results']['buckets']
        ]

    @classmethod
    async def get_date_aggs_result(
            cls, group_by_field: str, interval: str, query: dict = None, days: int = 30,
            _min: str = None, _max: str = None
    ) -> List[OutTrendSchema]:
        if query is None:
            query = {"query": {"range": {group_by_field: {"lte": "now-1h/h", "gte": f"now-{days}d/d"}}}}
            _min = query['query']['range'][group_by_field]['gte']
            _max = query['query']['range'][group_by_field]['lte']

        res = await cls.handler.search(index=RESULTS_INDEX, size=0, body={
            "query": query['query'],
            "aggs": {
                "results": {
                    "date_histogram": {
                        "field": group_by_field,
                        "calendar_interval": interval,
                        "min_doc_count": 0,
                        "extended_bounds": {
                            "min": _min,
                            "max": _max
                        }
                    }
                }
            }
        })

        return [
            cls.elastic_mapper.map_result_to_out_trend_schema(r) for r in res['aggregations']['results']['buckets']
        ]
