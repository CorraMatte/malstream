from time import sleep
from typing import Tuple, Dict, Any

import aiohttp
from pyintelowl import IntelOwl, IntelOwlClientException

from backend.business_model.rule_results_schema import RuleResultsSchema
from backend.common.exceptions.intelowl import IntelOwlConnectionError
from backend.common.logging import logger
from backend.common.utils import get_file_path_from_filename, get_sha256_from_complete_filename
from backend.mapper.intelowl_mapper import IntelOwlMapper


class IntelOwlProvider:
    def __init__(self, config: dict, custom_analyzer: str):
        self.url = config['url']
        self.apikey = config['apikey']

        self.intelowl = IntelOwl(self.apikey, self.url)
        self.intelowl_mapper = IntelOwlMapper
        self.custom_analyzer = custom_analyzer
        self.auth_json_header = {
            'Content-Type': 'application/json',
            'Authorization': f'Token {self.apikey}'
        }

    @classmethod
    def __has_intezer_report(cls, report: dict) -> bool:
        return 'family_name' in report and report['family_name']

    @classmethod
    def __has_xforce_report(cls, report: dict) -> bool:
        if not report:
            return False

        if report.get('malware', {}).get('malware', {}).get('origins', {}).get('external', {}).get('family', None) is not None:
            return True

        return False

    @classmethod
    def __has_yaraify_report(cls, report: dict) -> bool:
        if report.get('data', {}).get('tasks') is None:
            return False

        total_results = 0
        for t in report['data']['tasks']:
            total_results += len(
                [clamav for clamav in t['clamav_results'] if clamav != 'xxx']
            ) + len(
                [u['unpacked_yara_matches'] for u in t['unpacker_results'] if u['unpacked_yara_matches'] != 'xxx']
                if 'unpacker_results' in t else []
            )

        return total_results > 0

    @classmethod
    def __has_malpedia_report(cls, report: dict) -> bool:
        return len([val for val in report.values() if val['match']]) > 0

    @classmethod
    def __are_jobs_running(cls, jobs: tuple):
        return any([j['status'] == 'running' or j['status'] == 'pending' for j in jobs])

    @classmethod
    def __are_jobs_accepted(cls, jobs: tuple):
        return all([j['status'] == 'accepted' for j in jobs])

    def __analyze_file_intelowl(self, sha256: str, filename: str, filepath: str) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        try:
            obs_search = self.intelowl.send_observable_analysis_request(sha256)
            file_search = self.intelowl.send_file_analysis_request(
                filepath, open(get_file_path_from_filename(filename), 'rb').read()
            )

            if not self.__are_jobs_accepted((obs_search, file_search)):
                raise Exception('Error during the enrichment')

            while self.__are_jobs_running(
                jobs := (
                        self.intelowl.get_job_by_id(obs_search['job_id']),
                        self.intelowl.get_job_by_id(file_search['job_id'])
                )
            ):
                sleep(3)
        except IntelOwlClientException as e:
            logger.exception(f"IntelOwl Exception {e}")
            raise IntelOwlConnectionError(e)

        return jobs

    def __get_rule_results_schema_from_jobs(self, jobs: Tuple[Dict[str, Any], Dict[str, Any]]) -> RuleResultsSchema:
        osint_result = []
        yara_result = []
        for j in jobs:
            for an in j['analyzer_reports']:
                source = an['name'].lower()
                r = an['report']
                status = an['status'].lower()

                if status == 'failed':
                    continue

                if source == self.custom_analyzer:
                    for report in r:
                        if 'meta' in report:
                            yara_result.append(self.intelowl_mapper.map_yara_report(report, source))

                elif 'yara' in source and 'yaraify' not in source:
                    for report in r:
                        if 'meta' in report:
                            yara_result.append(self.intelowl_mapper.map_yara_report(report, source))
                elif 'malpedia_scan' in source and self.__has_malpedia_report(r):
                    osint_result.append(self.intelowl_mapper.map_malpedia_report(r, source))
                elif 'malwarebazaar' in source:
                    osint_result.extend(self.intelowl_mapper.map_malwarebazaar_report(r))
                elif 'intezer' in source and self.__has_intezer_report(r):
                    osint_result.append(self.intelowl_mapper.map_intezer_report(r, source))
                elif 'xforceexchange' in source and self.__has_xforce_report(r):
                    osint_result.append(self.intelowl_mapper.map_xforce_report(r, source))
                elif 'yaraify_search' in source and self.__has_yaraify_report(r):
                    osint_result.append(self.intelowl_mapper.map_yaraify_report(r, source))

        return RuleResultsSchema(yara=yara_result, osint=osint_result)

    def enrich_file_intelowl(self, filename: str) -> RuleResultsSchema:
        print('Enrich intelowl')
        sha256 = get_sha256_from_complete_filename(filename)
        try:
            jobs = self.__analyze_file_intelowl(sha256, filename, get_file_path_from_filename(sha256))

            return self.__get_rule_results_schema_from_jobs(jobs)
        except IntelOwlConnectionError:
            return RuleResultsSchema()

    async def upload_yara_intelowl(self, body: str, _id: str) -> bool:
        data = {
            'body': body,
            'id': str(_id)
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.url}/api/yara/upload", headers=self.auth_json_header, json=data) as response:
                return response.status == 201

    async def clean_up_yara_intelowl(self) -> bool:
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.url}/api/yara/clean_up", headers=self.auth_json_header) as response:
                return response.status == 200

    async def delete_yara_intelowl(self, _id) -> bool:
        async with aiohttp.ClientSession() as session:
            async with session.delete(f"{self.url}/api/yara/{_id}", headers=self.auth_json_header) as response:
                return response.status == 200
