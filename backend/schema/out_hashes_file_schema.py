from typing import Optional

from pydantic import BaseModel


class OutHashesFileSchema(BaseModel):
    md5: Optional[str]
    sha1: Optional[str]
    sha256: str
