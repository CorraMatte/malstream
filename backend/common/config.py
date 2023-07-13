import os
from typing import Callable, Optional, List, Dict

import yaml

from backend.common.exceptions.common import ConfigException

_cfg = None

_TRUE_VALS = {'true', '1'}


def get_cfg():
    global _cfg
    if _cfg is None:
        _cfg = ApiConfig(YamlConfigProvider())
    return _cfg


class YamlConfigProvider:
    def __init__(self):
        try:
            self.config = yaml.load(open('conf.yaml', 'r'), Loader=yaml.Loader)
        except FileNotFoundError:
            raise ConfigException('Unable to find conf.yaml')
        except yaml.scanner.ScannerError:
            raise ConfigException('Syntax error in conf.yaml file')

    def get(self, section: str, name: str, defval: Optional[str] = None) -> Optional[str]:
        sec = self.config.get(section)
        if sec is None:
            return None or defval

        return self.config[section].get(name, defval)

    def getint(self, section: str, name: str, defval: Optional[int] = None) -> Optional[int]:
        try:
            num = self.get(section, name)
            if num is None:
                return None or defval

            ret = int(num)
            return ret or defval
        except (ValueError, TypeError):
            raise ConfigException(f'Unable to cast {self.get(section, name)} in {section}.{name} to int')

    def getboolean(self, section: str, name: str, defval: Optional[bool] = None) -> Optional[bool]:
        return self.get(section, name, defval)

    def get_capev2_objects(self) -> Optional[List[Dict[str, str]]]:
        if not self.config.get('capev2', None).get('instances', None):
            return None

        capev2s = []
        for capev2 in self.config['capev2']['instances']:
            if capev2.get('apikey') is None or capev2.get('url') is None:
                return None

            capev2s.append(capev2)

        return capev2s

    def get_intelowl_objects(self) -> Optional[List[Dict[str, str]]]:
        if not self.config.get('intelowl', {}).get('instances', None):
            return None

        intelowls = []
        for intelowl in self.config['intelowl']['instances']:
            if intelowl.get('apikey') is None or intelowl.get('url') is None:
                return None

            intelowls.append(intelowl)

        return intelowls


class ConfigParamUtils:
    _REQUIRED = []

    @classmethod
    def required_param(cls, check_func: Callable = lambda x: x is None, name: str = None):
        def decorator(prop_func: Callable):
            cls._REQUIRED.append((name or prop_func.__name__, check_func))
            return prop_func
        return decorator


class ApiConfig:
    def __init__(self, provider, check_required_params: bool = True):
        self._provider = provider
        if check_required_params:
            self.check_required_config_params()

    def _get(self, section, name, defval=None):
        return self._provider.get(section, name, defval)

    def _getint(self, section, name, defval=None):
        return self._provider.getint(section, name, defval)

    def _getboolean(self, section, name, defval=None):
        return self._provider.getboolean(section, name, defval)

    def _get_intelowl_objects(self):
        return self._provider.get_intelowl_objects()

    def _get_capev2_objects(self):
        return self._provider.get_capev2_objects()

    def check_required_config_params(self):
        missing = [name for (name, check_func) in ConfigParamUtils._REQUIRED if check_func(getattr(self, name))]  # noqa
        if len(missing) > 0:
            raise ConfigException(f'The following required parameters are missing from the configuration: {missing}')

    @property
    @ConfigParamUtils.required_param()
    def rabbitmq_user(self):
        return self._get('rabbitmq', 'user')

    @property
    @ConfigParamUtils.required_param()
    def rabbitmq_password(self):
        return self._get('rabbitmq', 'password')

    @property
    @ConfigParamUtils.required_param()
    def rabbitmq_vhost(self):
        return self._get('rabbitmq', 'vhost')

    @property
    @ConfigParamUtils.required_param()
    def rabbitmq_host(self):
        return self._get('rabbitmq', 'host')

    @property
    @ConfigParamUtils.required_param()
    def elasticsearch_id(self):
        return self._get('elasticsearch', 'id')

    @property
    @ConfigParamUtils.required_param()
    def elasticsearch_key(self):
        return self._get('elasticsearch', 'key')

    @property
    @ConfigParamUtils.required_param()
    def elasticsearch_url(self):
        return self._get('elasticsearch', 'url')

    @property
    def elasticsearch_verify_cert(self):
        return self._getboolean('elasticsearch', 'verify_cert', True)

    @property
    @ConfigParamUtils.required_param()
    def kibana_token(self):
        return self._get('kibana', 'token')

    @property
    @ConfigParamUtils.required_param()
    def kibana_url(self):
        return self._get('kibana', 'url')

    @property
    def kibana_verify_cert(self):
        return self._getboolean('kibana', 'verify_cert', True)

    @property
    def intelowls(self):
        return self._get_intelowl_objects()

    @property
    def capev2s(self):
        return self._get_capev2_objects()

    @property
    def log_filepath(self):
        return self._get('log', 'filepath', os.path.join('backend', 'log'))

    @property
    def log_filename(self):
        return self._get('log', 'filename', 'malstream.log')

    @property
    def log_retention_days(self):
        return self._getint('log', 'retention_days', 30)

    @property
    @ConfigParamUtils.required_param()
    def temporary_path(self):
        return self._get('temporary', 'path')

    @property
    @ConfigParamUtils.required_param()
    def mquery_url(self):
        return self._get('mquery', 'url')

    @property
    def sentry_dsn(self):
        return self._get('sentry', 'dsn')

    @property
    def sentry_environment(self):
        return self._get('sentry', 'environment')

    @property
    def intelowl_custom_analyzer(self):
        return self._get('intelowl', 'custom_analyzer', 'yara_scan_custom_rules')
