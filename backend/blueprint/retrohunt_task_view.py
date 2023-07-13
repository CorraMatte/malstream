from typing import List

from fastapi import Response, status, APIRouter

from backend.facades.yara_retrohunt_facade import YaraRetrohuntFacade
from backend.helpers.retrohunt_helper import RetrohuntHelper
from backend.schema.out_matches_schema import OutMatchSchema
from backend.schema.out_retrohunt_task_schema import OutRetrohuntTaskSchema

router = APIRouter()


@router.get('', response_model=OutRetrohuntTaskSchema, tags=["retrohunt"])
async def get_task(uid: str):
    return await RetrohuntHelper.get_retrohunt_task(uid)


@router.delete('', status_code=status.HTTP_204_NO_CONTENT, tags=["retrohunt"])
async def delete_task(uid: str):
    await YaraRetrohuntFacade.remove_retrohunt_task(uid)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get('/matches', response_model=List[OutMatchSchema], tags=["retrohunt"])
async def get(uid: str, offset: int = 0, limit: int = 20):
    return await RetrohuntHelper.get_retrohunt_matches(uid, offset, limit)
