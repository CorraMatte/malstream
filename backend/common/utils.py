import hashlib
import os
import re

import aiofiles
from fastapi import UploadFile
from idstools import rule
from sigma.rule import SigmaRule
from yaml import load, Loader

from backend.common.const import TEMPORARY_PATH
from backend.schema.out_rule_schema import RuleType

CHUNK = 1024


async def async_write(filename: str, file_source: UploadFile) -> None:
    async with aiofiles.open(filename, 'wb') as fout:
        while c := await file_source.read(CHUNK):
            await fout.write(c)


async def async_sha256(file: UploadFile) -> str:
    m = hashlib.sha256()

    while c := await file.read(CHUNK):
        m.update(c)

    return m.hexdigest()


def get_sha256_from_complete_filename(complete_filename: str) -> str:
    return complete_filename[:64]


def get_file_path_from_filename(filename: str) -> str:
    return os.path.join(TEMPORARY_PATH, filename)


def rule_title_from_body(rule_type: RuleType, body: str) -> str:
    if rule_type == RuleType.YARA:
        return re.match(r'^rule (.*)[\s\n]{', body).groups()[0]
    elif rule_type == RuleType.SIGMA:
        return SigmaRule.from_dict(load(body, Loader=Loader)).title
    elif rule_type == RuleType.SURICATA:
        return rule.parse(body).msg
