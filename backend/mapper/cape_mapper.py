from backend.business_model.rule_source_match import RuleSourceMatch
from backend.schema.out_suricata_schema import OutSuricataSchema
from backend.schema.out_yara_schema import OutYaraSchema


class CapeMapper:

    @classmethod
    def map_cape_suricata_to_out_suricata_schema(cls, suricata_rule: dict) -> OutSuricataSchema:
        return OutSuricataSchema(
            gid=suricata_rule['gid'],
            rev=suricata_rule['rev'],
            severity=suricata_rule['severity'],
            sid=suricata_rule['sid'],
            srcport=suricata_rule['srcport'],
            srcip=suricata_rule['srcip'],
            dstport=suricata_rule['dstport'],
            dstip=suricata_rule['dstip'],
            protocol=suricata_rule['protocol'],
            timestamp=suricata_rule['timestamp'],
            category=suricata_rule['category'],
            signature=suricata_rule['signature'],
        )

    @classmethod
    def map_cape_yara_to_out_yara_schema(cls, yara_rule: dict) -> OutYaraSchema:
        return OutYaraSchema(
            name=yara_rule['name'],
            meta=yara_rule['meta'],
            strings=yara_rule['strings'],
            addresses=yara_rule['addresses'],
            rule_source_match=RuleSourceMatch.sandbox.value
        )
