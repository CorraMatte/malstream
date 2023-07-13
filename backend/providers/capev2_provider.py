import time
from typing import List, Set

import aiohttp
import requests

from backend.business_model.rule_results_schema import RuleResultsSchema
from backend.common.exceptions.cape import CapeConnectionError
from backend.common.logging import logger
from backend.mapper.cape_mapper import CapeMapper
from backend.schema.out_suricata_schema import OutSuricataSchema
from backend.schema.out_yara_schema import OutYaraSchema


class CapeProvider:
    cape_mapper = CapeMapper

    def __init__(self, cape_conf: dict):
        self.capev2_api_token = cape_conf['apikey']
        self.capev2_api_url = cape_conf['url']
        self.capev2_headers = {'Authorization': f'Token {self.capev2_api_token}'}
        self.capev2_headers_json = {
            'Authorization': self.capev2_headers['Authorization'],
            'Content-Type': 'application/json'
        }

    def __upload_file_to_capev2(self, filename: str) -> int:
        r = requests.post(
            f"{self.capev2_api_url}/tasks/create/file/",
            files={'file': open(filename, 'rb')},
            data={'route': 'internet'},
            headers=self.capev2_headers
        )

        if r.status_code != 200 or ('error' in r.json() and r.json()['error'] is True):
            raise CapeConnectionError(f"{r.status_code=} {r.text=}")

        return r.json()['data']['task_ids'][0]

    def __is_task_reported(self, task_id: int) -> bool:
        r = requests.get(
            f"{self.capev2_api_url}/tasks/status/{task_id}",
            headers=self.capev2_headers
        )

        if r.status_code != 200 or r.json()['error'] is True:
            raise CapeConnectionError(f"{r.status_code=} {r.text=}")

        return r.json()['data'] == 'reported'

    def __get_raw_report(self, task_id: int) -> dict:
        r = requests.get(
            f"{self.capev2_api_url}/tasks/get/report/{task_id}",
            headers=self.capev2_headers
        )

        if r.status_code != 200 or ('error' in r.json() and r.json()['error'] is True):
            logger.exception(f"CAPE Exception {r.status_code=} {r.text=}")
            raise CapeConnectionError(f"{r.status_code=} {r.text=}")

        return r.json()

    def __get_yara_from_cape_yara(self, cape_yara: List[dict], yara_names: Set[str]) -> List[OutYaraSchema]:
        yara_results = []

        for yara_res in cape_yara:
            if yara_res['name'] not in yara_names:
                yara_names.add(yara_res['name'])
                yara_results.append(self.cape_mapper.map_cape_yara_to_out_yara_schema(yara_res))

        return yara_results

    def __get_yara_from_report(self, report: dict) -> List[OutYaraSchema]:
        yara_results = []
        yara_names = set()

        for payload in report.get('CAPE', {}).get('payloads', []):
            yara_results.extend(self.__get_yara_from_cape_yara(payload['cape_yara'], yara_names))
            yara_results.extend(self.__get_yara_from_cape_yara(payload['yara'], yara_names))

        if 'procdump' in report and report['procdump'] is not None:
            for dump in report['procdump']:
                yara_results.extend(self.__get_yara_from_cape_yara(dump['cape_yara'], yara_names))
                yara_results.extend(self.__get_yara_from_cape_yara(dump['yara'], yara_names))

        yara_results.extend(self.__get_yara_from_cape_yara(report['target']['file']['cape_yara'], yara_names))

        for sig in report['signatures']:
            if sig['name'] == 'cape_extracted_content':
                raw_yara = []
                for data in sig['data']:
                    if isinstance(list(data.values())[0], list):
                        raw_yara.append(list(data.values())[0][0])

                yara_results.extend(self.__get_yara_from_cape_yara(raw_yara, yara_names))
                break

        return yara_results

    def __get_suricata_from_report(self, report: dict) -> List[OutSuricataSchema]:
        return [
            self.cape_mapper.map_cape_suricata_to_out_suricata_schema(suricata_rule)
            for suricata_rule in report['suricata']['alerts']
        ]

    def __get_rule_result_schema_from_report(self, report: dict) -> RuleResultsSchema:
        return RuleResultsSchema(
            yara=self.__get_yara_from_report(report),
            suricata=self.__get_suricata_from_report(report)
        )

    def get_capev2_yara_suricata_results(self, filename: str) -> RuleResultsSchema:
        task_id = self.__upload_file_to_capev2(filename)

        time.sleep(10)
        while not self.__is_task_reported(task_id):
            time.sleep(10)

        try:
            report = self.__get_raw_report(task_id)
            return self.__get_rule_result_schema_from_report(report)
        except CapeConnectionError:
            return RuleResultsSchema()

    async def upload_yara_capev2(self, body: str, _id: str) -> bool:
        data = {
            'body': body,
            'id': str(_id)
        }
        async with aiohttp.ClientSession() as session:
            async with session.post(
                    f"{self.capev2_api_url}/yara/upload/", headers=self.capev2_headers_json, json=data
            ) as response:
                return not (await response.json())['error']

    async def delete_yara_capev2(self, _id: str) -> bool:
        async with aiohttp.ClientSession() as session:
            async with session.delete(
                    f"{self.capev2_api_url}/yara/{_id}/", headers=self.capev2_headers_json
            ) as response:
                return not (await response.json())['error']

    async def clean_up_yara_capev2(self) -> bool:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                    f"{self.capev2_api_url}/yara/clean_up/", headers=self.capev2_headers_json
            ) as response:
                return not (await response.json())['error']

    async def upload_suricata_capev2(self, body: str, _id: str) -> bool:
        data = {
            'body': body,
            'id': str(_id)
        }
        async with aiohttp.ClientSession() as session:
            async with session.post(
                    f"{self.capev2_api_url}/suricata/upload/", headers=self.capev2_headers_json, json=data
            ) as response:
                return not (await response.json())['error']

    async def delete_suricata_capev2(self, _id: str) -> bool:
        async with aiohttp.ClientSession() as session:
            async with session.delete(
                    f"{self.capev2_api_url}/suricata/{_id}/", headers=self.capev2_headers_json
            ) as response:
                return not (await response.json())['error']

    async def clean_up_suricata_capev2(self) -> bool:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                    f"{self.capev2_api_url}/suricata/clean_up/", headers=self.capev2_headers_json
            ) as response:
                return not (await response.json())['error']
