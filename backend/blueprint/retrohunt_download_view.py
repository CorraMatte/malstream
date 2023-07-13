from fastapi import APIRouter, Response

from backend.helpers.retrohunt_helper import RetrohuntHelper

router = APIRouter()


@router.get('', tags=["retrohunt"])
async def download_file(uid: str, file_path: str, ordinal: int):
    file_bytes = await RetrohuntHelper.download_retrohunt_file(uid, file_path, ordinal)
    return Response(content=file_bytes, media_type="application/octet-stream")
