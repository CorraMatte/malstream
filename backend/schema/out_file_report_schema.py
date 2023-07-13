from pydantic import BaseModel

from backend.schema.out_hashes_file_schema import OutHashesFileSchema


class OutFileReportSchema(BaseModel):
    name: str
    hash: OutHashesFileSchema
