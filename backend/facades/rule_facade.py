from typing import Callable

from backend.facades.yara_facade import YaraFacade
from backend.helpers.sigma_helper import SigmaHelper
from backend.helpers.suricata_helper import SuricataHelper
from backend.helpers.yara_helper import YaraHelper
from backend.schema.out_rule_schema import RuleType


class RuleFacade:
    yara_facade = YaraFacade
    yara_helper = YaraHelper
    suricata_helper = SuricataHelper
    sigma_helper = SigmaHelper

    @classmethod
    def create_rule_fn(cls, rule_type: RuleType) -> Callable:
        if rule_type == RuleType.YARA:
            return cls.yara_facade.create_yara
        elif rule_type == RuleType.SIGMA:
            return cls.sigma_helper.create_sigma
        elif rule_type == RuleType.SURICATA:
            return cls.suricata_helper.create_suricata

    @classmethod
    def is_rule_valid_fn(cls, rule_type: RuleType) -> Callable:
        if rule_type == RuleType.YARA:
            return cls.yara_helper.is_yara_valid
        elif rule_type == RuleType.SIGMA:
            return cls.sigma_helper.is_sigma_valid
        elif rule_type == RuleType.SURICATA:
            return cls.suricata_helper.is_suricata_valid

    @classmethod
    def clean_up_rules_fn(cls, rule_type: RuleType) -> Callable:
        if rule_type == RuleType.YARA:
            return cls.yara_facade.clean_up_yara
        elif rule_type == RuleType.SIGMA:
            return cls.sigma_helper.clean_up_sigma
        elif rule_type == RuleType.SURICATA:
            return cls.suricata_helper.clean_up_suricata

    @classmethod
    def delete_rule_fn(cls, rule_type: RuleType) -> Callable:
        if rule_type == RuleType.YARA:
            return cls.yara_facade.delete_yara
        elif rule_type == RuleType.SIGMA:
            return cls.sigma_helper.delete_sigma
        elif rule_type == RuleType.SURICATA:
            return cls.suricata_helper.delete_suricata

    @classmethod
    def get_results_by_rule_fn(cls, rule_type: RuleType) -> Callable:
        if rule_type == RuleType.YARA:
            return cls.yara_facade.get_results_by_rule_yara
        elif rule_type == RuleType.SIGMA:
            return cls.sigma_helper.get_results_by_rule_sigma
        elif rule_type == RuleType.SURICATA:
            return cls.suricata_helper.get_results_by_rule_suricata

    @classmethod
    def get_results_count_by_rule_fn(cls, rule_type: RuleType) -> Callable:
        if rule_type == RuleType.YARA:
            return cls.yara_facade.get_results_count_by_rule_yara
        elif rule_type == RuleType.SIGMA:
            return cls.sigma_helper.get_results_count_by_rule_sigma
        elif rule_type == RuleType.SURICATA:
            return cls.suricata_helper.get_results_count_by_rule_suricata
