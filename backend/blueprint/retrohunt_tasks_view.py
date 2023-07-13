from typing import List

from fastapi import APIRouter

from backend.helpers.retrohunt_helper import RetrohuntHelper
from backend.schema.out_retrohunt_task_schema import OutRetrohuntTaskSchema

router = APIRouter()


@router.get('', response_model=List[OutRetrohuntTaskSchema], tags=["retrohunt"])
async def get_tasks():
    return await RetrohuntHelper.get_retrohunt_tasks()
