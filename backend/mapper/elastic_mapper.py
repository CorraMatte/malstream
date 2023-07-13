import datetime

import dateutil.parser

from backend.common.utils import rule_title_from_body
from backend.schema.out_file_report_schema import OutFileReportSchema
from backend.schema.out_hashes_file_schema import OutHashesFileSchema
from backend.schema.out_indicator_report_no_rule_schema import OutIndicatorNoRuleReportSchema
from backend.schema.out_indicator_report_schema import OutIndicatorReportSchema
from backend.schema.out_osint_result_schema import OutOsintResultSchema
from backend.schema.out_rule_schema import OutRuleSchema, RuleType
from backend.schema.out_sigma_no_rule_schema import OutSigmaNoRuleSchema
from backend.schema.out_sigma_schema import OutSigmaSchema
from backend.schema.out_suricata_no_rule_schema import OutSuricataNoRuleSchema
from backend.schema.out_suricata_schema import OutSuricataSchema
from backend.schema.out_top_result_stats_schema import OutTotalResultStatsSchema
from backend.schema.out_trend_schema import OutTrendSchema
from backend.schema.out_yara_no_rule_schema import OutYaraNoRuleSchema
from backend.schema.out_yara_schema import OutYaraSchema


class ElasticMapper:

    @classmethod
    def get_rule_schema_from_doc(cls, doc: dict) -> OutRuleSchema:
        doc['_source']['title'] = rule_title_from_body(RuleType[doc['_source']['type'].upper()], doc['_source']['body'])
        return OutRuleSchema(**doc['_source'])

    @classmethod
    def map_elastic_alert_sigma_result_to_out_sigma_schema(cls, sigma_result) -> OutSigmaSchema:
        return OutSigmaSchema(
            name=sigma_result['signal']['rule']['name'],
            tags=sigma_result['signal']['rule']['tags'],
            description=sigma_result['signal']['rule']['description'],
            id=sigma_result['signal']['rule']['rule_id'],
            severity=sigma_result['signal']['rule']['severity'],
            created_dt=dateutil.parser.isoparse(sigma_result['signal']['rule']['created_at']),
            authors=sigma_result['signal']['rule']['author'],
            references=sigma_result['signal']['rule']['references'],
            risk_score=sigma_result['signal']['rule']['risk_score'],
            query=sigma_result['signal']['rule']['query'],
            reason=sigma_result['signal']['reason'],
            raw=sigma_result
        )

    @classmethod
    def map_elastic_file_to_out_file_report_schema(cls, file: dict) -> OutFileReportSchema:
        return OutFileReportSchema(
            name=file['name'],
            hash=OutHashesFileSchema(sha256=file['hash']['sha256'])
        )

    @classmethod
    def map_elastic_yara_rule_to_out_yara_schema(cls, yara: dict) -> OutYaraSchema:
        return OutYaraSchema(**yara)

    @classmethod
    def map_elastic_osint_rule_to_out_osint_schema(cls, osint: dict) -> OutOsintResultSchema:
        return OutOsintResultSchema(**osint)

    @classmethod
    def map_elastic_sigma_rule_to_out_sigma_schema(cls, sigma: dict) -> OutSigmaSchema:
        return OutSigmaSchema(**sigma)

    @classmethod
    def map_elastic_suricata_rule_to_out_suricata_schema(cls, suricata: dict) -> OutSuricataSchema:
        return OutSuricataSchema(**suricata)

    @classmethod
    def map_elastic_yara_rule_to_out_yara_no_rule_schema(cls, yara: dict) -> OutYaraNoRuleSchema:
        return OutYaraNoRuleSchema(**yara)

    @classmethod
    def map_elastic_sigma_rule_to_out_sigma_no_rule_schema(cls, sigma: dict) -> OutSigmaNoRuleSchema:
        return OutSigmaNoRuleSchema(**sigma)

    @classmethod
    def map_elastic_suricata_rule_to_out_suricata_no_rule_schema(cls, suricata: dict) -> OutSuricataNoRuleSchema:
        return OutSuricataNoRuleSchema(**suricata)

    @classmethod
    def map_elastic_indicator_to_out_indicator_schema(cls, indicator: dict) -> OutIndicatorReportSchema:
        return OutIndicatorReportSchema(
            file=cls.map_elastic_file_to_out_file_report_schema(indicator['file']),
            yara=sorted(
                [cls.map_elastic_yara_rule_to_out_yara_schema(y) for y in indicator.get('yara', [])],
                key=lambda r: (r.exists_in_platform, r.name), reverse=True
            ),
            sigma=[cls.map_elastic_sigma_rule_to_out_sigma_schema(s) for s in indicator.get('sigma', [])],
            suricata=sorted(
                [cls.map_elastic_suricata_rule_to_out_suricata_schema(s) for s in indicator.get('suricata', [])],
                key=lambda r: (r.exists_in_platform, r.signature), reverse=True
            ),
            osint=sorted(
                [cls.map_elastic_osint_rule_to_out_osint_schema(o) for o in indicator.get('osint', [])],
                key=lambda o: o.source
            ),
            enrichment=indicator['enrichment'],
            sandbox=indicator['sandbox'],
            created_dt=indicator['created_dt'],
            enrichment_dt=indicator.get('enrichment_dt', None),
            sandbox_dt=indicator.get('sandbox_dt', None),
            is_supported_by_sandbox=indicator.get('is_supported_by_sandbox', False),
            retrohunt=indicator.get('retrohunt', None),
            retrohunt_dt=indicator.get('retrohunt_dt', None),
        )

    @classmethod
    def map_elastic_indicator_to_out_indicator_no_rule_schema(cls, indicator: dict) -> OutIndicatorNoRuleReportSchema:
        return OutIndicatorNoRuleReportSchema(
            file=cls.map_elastic_file_to_out_file_report_schema(indicator['file']),
            yara=sorted(
                [cls.map_elastic_yara_rule_to_out_yara_schema(y) for y in indicator.get('yara', [])],
                key=lambda r: r.name, reverse=True
            ),
            sigma=[cls.map_elastic_sigma_rule_to_out_sigma_no_rule_schema(s) for s in indicator.get('sigma', [])],
            suricata=sorted(
                [cls.map_elastic_suricata_rule_to_out_suricata_no_rule_schema(s) for s in indicator.get('suricata', [])],
                key=lambda r: r.signature, reverse=True
            ),
            osint=sorted(
                [cls.map_elastic_osint_rule_to_out_osint_schema(o) for o in indicator.get('osint', [])],
                key=lambda o: o.source
            ),
            enrichment=indicator['enrichment'],
            sandbox=indicator['sandbox'],
            created_dt=indicator['created_dt'],
            enrichment_dt=indicator.get('enrichment_dt', None),
            sandbox_dt=indicator.get('sandbox_dt', None),
            is_supported_by_sandbox=indicator.get('is_supported_by_sandbox', False)
        )

    @classmethod
    def map_result_to_out_top_result_schema(cls, res: dict) -> OutTotalResultStatsSchema:
        return OutTotalResultStatsSchema(name=res['key'], count=res['doc_count'])

    @classmethod
    def map_result_to_out_trend_schema(cls, res: dict) -> OutTrendSchema:
        return OutTrendSchema(date=datetime.datetime.fromtimestamp(res['key'] / 1000), count=res['doc_count'])
