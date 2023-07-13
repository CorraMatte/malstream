from typing import Optional

from pydantic import BaseModel


class OutMatchSchema(BaseModel):
    sha256: Optional[str]
    path: Optional[str]
    ordinal: Optional[int]
