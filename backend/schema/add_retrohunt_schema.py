from enum import Enum

from pydantic import BaseModel


class PriorityTypes(Enum):
    low = 'low'
    medium = 'medium'
    high = 'high'


class AddRetrohuntTaskSchema(BaseModel):
    yara: str
    priority: PriorityTypes
