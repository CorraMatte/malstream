from fastapi import APIRouter, Response, status

from backend.helpers.async_elastic_helper import AsyncElasticHelper

router = APIRouter()


@router.delete('', status_code=status.HTTP_204_NO_CONTENT, tags=['indicators'])
async def delete_pending_indicators():
    await AsyncElasticHelper.delete_pending_indicators()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
