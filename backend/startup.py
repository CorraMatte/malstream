import sentry_sdk

from backend.common.config import get_cfg

cfg = get_cfg()


def setup_sentry_listener(app):
    @app.on_event("startup")
    def setup_sentry():
        sentry_sdk.init(
            dsn=cfg.sentry_dsn,
            attach_stacktrace=True,
            environment=cfg.sentry_environment,
            traces_sample_rate=1.0
        )
