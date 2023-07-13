from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.blueprint import router as api_router
from backend.common.config import get_cfg
from backend.common.exceptions.common import fastapi_error_handler, MalstreamApplicationError
from backend.startup import setup_sentry_listener

app = FastAPI()
cfg = get_cfg()

app.include_router(api_router)

setup_sentry_listener(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_exception_handler(MalstreamApplicationError, fastapi_error_handler)
