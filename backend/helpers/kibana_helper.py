import aiohttp
from sigma.rule import SigmaRule, SigmaLevel

from backend.common.const import KIBANA_VERIFY_CERT, KIBANA_URL, KIBANA_TOKEN


class KibanaHelper:
    headers = {
        'Content-Type': 'application/json',
        'kbn-xsrf': 'true',
        'Authorization': f'ApiKey {KIBANA_TOKEN}'
    }

    @classmethod
    async def create_sigma(cls, rule: SigmaRule, _id: str, es_rule: str) -> bool:
        kibana_rule = {
            "name": rule.title,
            "tags": [t.name for t in rule.tags],
            "interval": "5m",
            "enabled": True,
            "description": rule.description,
            "risk_score": int(rule.level.value - 1) * 20,
            "severity": rule.level.name.lower() if rule.level == SigmaLevel.INFORMATIONAL else rule.level.LOW.name.lower(),
            "author": [rule.author],
            "from": f"now-{60 * 30}s",
            "rule_id": str(_id),
            "to": "now",
            "references": rule.references,
            "type": "query",
            "language": "lucene",
            "index": ["logs-*"],
            "query": es_rule,
            "throttle": "no_actions",
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{KIBANA_URL}/api/detection_engine/rules",
                headers=cls.headers, json=kibana_rule, verify_ssl=KIBANA_VERIFY_CERT
            ) as response:
                return response.status == 200

    @classmethod
    async def delete_sigma(cls, _id: str) -> bool:
        params = {"rule_id": _id}

        async with aiohttp.ClientSession() as session:
            async with session.delete(
                f"{KIBANA_URL}/api/detection_engine/rules",
                headers=cls.headers, params=params, verify_ssl=KIBANA_VERIFY_CERT
            ) as response:
                return response.status == 200 or response.status == 404

    @classmethod
    async def clean_up_sigma(cls):
        params = {"page": 1}

        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{KIBANA_URL}/api/detection_engine/rules/_find",
                headers=cls.headers, params=params, verify_ssl=KIBANA_VERIFY_CERT
            ) as response:
                ids = [{"rule_id":   r["rule_id"]} for r in (await response.json())["data"]]

                if response.status != 200:
                    return False

            async with session.delete(
                f"{KIBANA_URL}/api/detection_engine/rules/_bulk_delete",
                headers=cls.headers, json=ids, verify_ssl=KIBANA_VERIFY_CERT
            ) as resp:
                if resp.status != 200:
                    return False

        return True
