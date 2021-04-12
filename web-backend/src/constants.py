import os

APP_ENV = os.getenv('APP_ENV')
if APP_ENV == 'localhost':
    PROGRAMS_BASE_URL = 'http://programs:6001/'