from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel

from backend.schema.add_retrohunt_schema import PriorityTypes


class StatusTypes(Enum):
    new = 'new'
    processing = 'processing'
    done = 'done'
    removed = 'removed'
    expired = 'expired'
    cancelled = 'cancelled'
    failed = 'failed'
    error = 'error'


class OutRetrohuntTaskSchema(BaseModel):
    id: Optional[str] = None
    status: Optional[StatusTypes] = None
    rule_name: Optional[str] = None
    yara: Optional[str] = None
    submitted: Optional[datetime] = None
    finished: Optional[datetime] = None
    priority: Optional[PriorityTypes] = None
    files_matched: Optional[int] = None
