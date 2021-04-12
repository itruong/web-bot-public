import requests
import time
import os
from flask import Flask, g
from flask_restful import Resource, Api
from .config import create_config
from .database import init_app


def resource_not_found(e):
    return {'error': 'Resource not found.'}, 404

def create_app():
    print('*** creating')
    register_app()
    
    app = Flask(__name__)

    @app.teardown_appcontext
    def close_connection(exception):
        db = getattr(g, '_database', None)
        if db is not None:
            db.close()

    init_app(app)
    print('asdfasdf')
    create_config(app)

    from .resources import app as gateway
    app.register_blueprint(gateway)
    app.register_error_handler(404, resource_not_found)

    return app

def register_app():
    is_registered = False
    attempt = 0
    total_attempts = 3
    url = f'{os.getenv("WEB_BASE_URL")}/register'
    while True:
        res = requests.post(url)
        if res.status_code == 200:
            is_registered = True
            break
        elif attempt == 3:
            break
        else:
            attempt += 1
            print(f'Failed to register. Retrying... ({attempt}/{total_attempts})')
            time.sleep(1)

    if is_registered:
        print('********** Successfully registered to the monitor. **********')
    else:
        print('********** Failed to register to the monitor. **********')
        raise Exception()

def set_up_database():
    cursor = connection.cursor()

