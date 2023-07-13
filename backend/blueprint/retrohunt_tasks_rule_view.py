from fastapi import APIRouter, status

from backend.facades.yara_retrohunt_facade import YaraRetrohuntFacade
from backend.schema.add_retrohunt_schema import AddRetrohuntTaskSchema

router = APIRouter()


@router.post('', status_code=status.HTTP_201_CREATED, tags=["retrohunt"])
async def add_task(rule_uid: str, task: AddRetrohuntTaskSchema):
    return await YaraRetrohuntFacade.add_retrohunt_task(rule_uid, task)


@router.put('', status_code=status.HTTP_201_CREATED, tags=["retrohunt"])
async def resubmit_task(rule_uid: str):
    return await YaraRetrohuntFacade.resubmit_task(rule_uid)
