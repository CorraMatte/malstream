from kombu import Queue

from backend.common.const import CELERY_ENRICHMENT_TASK_QUEUE, CELERY_RETROHUNT_TASK_QUEUE, CELERY_SANDBOX_TASK_QUEUE

result_expires = 3600
task_ignore_result = True

task_acks_late = True
worker_prefetch_multiplier = 1
task_queue_max_priority = 10
task_default_priority = 1

task_queues = [
    Queue(CELERY_SANDBOX_TASK_QUEUE, queue_arguments={'x-max-priority': 1}),
    Queue(CELERY_ENRICHMENT_TASK_QUEUE, queue_arguments={'x-max-priority': 10}),
    Queue(CELERY_RETROHUNT_TASK_QUEUE, queue_arguments={'x-max-priority': 10}),
]

# To debug on pycharm
# task_always_eager=True,
# task_eager_propagates=True
