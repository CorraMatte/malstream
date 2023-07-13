from celery import Celery
import sentry_sdk
from backend.common.config import get_cfg


cfg = get_cfg()

app = Celery(
    'malstream',
    broker=f'pyamqp://{cfg.rabbitmq_user}:{cfg.rabbitmq_password}@{cfg.rabbitmq_host}/{cfg.rabbitmq_vhost}',
    backend=f'rpc://{cfg.rabbitmq_user}:{cfg.rabbitmq_password}@{cfg.rabbitmq_host}/{cfg.rabbitmq_vhost}',
    include=[
        'backend.celery_tasks.sandbox_task',
        'backend.celery_tasks.enrichment_task',
        'backend.celery_tasks.retrohunt_task'
    ]
)

sentry_sdk.init(
    dsn=cfg.sentry_dsn,
    attach_stacktrace=True,
    environment=cfg.sentry_environment,
    traces_sample_rate=1.0
)


# Optional configuration, see the application user guide.
app.config_from_object('backend.celeryconfig')


if __name__ == '__main__':
    app.start()
