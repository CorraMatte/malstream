import ast
import itertools
from typing import List

from backend.business_model.rule_source_match import RuleSourceMatch
from backend.schema.out_osint_result_schema import OutOsintResultSchema
from backend.schema.out_yara_schema import OutYaraSchema


class IntelOwlMapper:

    @classmethod
    def map_yara_report(cls, report: dict, source: str) -> OutYaraSchema:
        meta = {}
        for key, val in report['meta'].items():
            k = key
            if isinstance(key, str):
                k = k.lower()

            meta[k] = val
        return OutYaraSchema(
            source=source,
            name=report['match'],
            path=report['path'],
            meta=meta,
            strings=[r[2].decode('latin-1') for r in ast.literal_eval(report['strings'])],
            rule_source_match=RuleSourceMatch.enrichment.value
        )

    @classmethod
    def map_malpedia_report(cls, report: dict, source: str) -> OutOsintResultSchema:
        matches = []
        for rule, val in report.items():
            if val['match']:
                matches.append(rule)

        return OutOsintResultSchema(source=source, matches=matches)

    @classmethod
    def map_malwarebazaar_report(cls, report: dict) -> List[OutOsintResultSchema]:
        reports = []

        if 'data' not in report or len(report['data']) == 0:
            return reports

        results = report['data']
        vendors = results[0]['vendor_intel']
        for source, report in vendors.items():
            source = source.lower()
            if 'cape' in source and report['detection'] is not None:
                reports.append(OutOsintResultSchema(source=source, matches=[report['detection']]))
            elif 'triage' in source and report['malware_family'] is not None:
                reports.append(OutOsintResultSchema(source=source, matches=[report['malware_family']]))
            elif 'intezer' in source and report['family_name'] is not None:
                reports.append(OutOsintResultSchema(source=source, matches=[report['family_name']]))
            elif 'unpacme' in source:
                matches = list(itertools.chain(*[detection['detections'] for detection in report]))
                if len(matches) > 0:
                    reports.append(OutOsintResultSchema(source=source, matches=matches))
            elif 'pl_mwdb' in source and report['detection']:
                reports.append(OutOsintResultSchema(source=source, matches=[report['detection']]))
            elif 'reversinglabs' in source and report['threat_name'] is not None:
                reports.append(OutOsintResultSchema(source=source, matches=[report['threat_name']]))
            elif 'vmray' in source and report['malware_family']:
                reports.append(OutOsintResultSchema(source=source, matches=[report['malware_family']]))

        return reports

    @classmethod
    def map_intezer_report(cls, report: dict, source: str) -> OutOsintResultSchema:
        return OutOsintResultSchema(source=source, matches=[report['family_name']])

    @classmethod
    def map_xforce_report(cls, report: dict, source: str) -> OutOsintResultSchema:
        return OutOsintResultSchema(
            source=source, matches=report['malware']['malware']['origins']['external']['family']
        )

    @classmethod
    def map_yaraify_report(cls, report: dict, source: str) -> OutOsintResultSchema:
        matches_set = set()

        for t in report['data']['tasks']:
            matches_set.update(t['clamav_results'])
            if 'unpacker_results' in t:
                for unpacker_result in t['unpacker_results']:
                    for u in unpacker_result['unpacked_yara_matches']:
                        matches_set.add(u['rule_name'])

        return OutOsintResultSchema(source=source, matches=[match for match in list(matches_set) if match != 'xxx'])
