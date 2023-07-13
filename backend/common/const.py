from backend.common.config import get_cfg

cfg = get_cfg()

RESULTS_INDEX = 'results'
YARA_INDEX = 'yara'
SURICATA_INDEX = 'suricata'
SIGMA_INDEX = 'sigma'
RULES_INDEXES = [YARA_INDEX, SURICATA_INDEX, SIGMA_INDEX]
SIGMA_RESULTS_INDEX = '.siem-signals-default-*'

KIBANA_URL = cfg.kibana_url
KIBANA_TOKEN = cfg.kibana_token
KIBANA_VERIFY_CERT = cfg.kibana_verify_cert

TEMPORARY_PATH = cfg.temporary_path


CELERY_SANDBOX_TASK_QUEUE = 'sandbox'
CELERY_ENRICHMENT_TASK_QUEUE = 'enrichment'
CELERY_RETROHUNT_TASK_QUEUE = 'retrohunt'
