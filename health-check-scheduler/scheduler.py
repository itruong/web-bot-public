import requests
from apscheduler.schedulers.background import BlockingScheduler
from apscheduler.executors.pool import ThreadPoolExecutor


def perform_health_check():
    res = requests.get('http://selenium-node:6000/health')

executors = {
    'default': ThreadPoolExecutor(1)
}
job_defaults = {
    'max_instances': 1
}
scheduler = BlockingScheduler(executors=executors, job_defaults=job_defaults)
job = scheduler.add_job(perform_health_check, 'interval', seconds=3)

scheduler.start()
