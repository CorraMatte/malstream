import logging
import os.path
from logging.handlers import TimedRotatingFileHandler

from backend.common.config import get_cfg

logging.basicConfig(filename='malstream.log')

formatter = logging.Formatter('[%(levelname)s][%(asctime)s][%(filename)s][%(funcName)s] %(message)s')
logger = logging.getLogger('malstream')
logger.setLevel(logging.DEBUG)

ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
ch.setFormatter(formatter)
logger.addHandler(ch)

cfg = get_cfg()

handler = TimedRotatingFileHandler(
    os.path.join(cfg.log_filepath, cfg.log_filename),
    when="d",
    interval=1,
    backupCount=get_cfg().log_retention_days
)
handler.setFormatter(formatter)

logger.addHandler(handler)
