from pydantic import BaseModel


class AddRuleSchema(BaseModel):
    body: str
