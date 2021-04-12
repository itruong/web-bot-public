
from flask import Blueprint
from flask_restful import Resource, Api, reqparse
import requests
from . import controllers

app = Blueprint('gateway', __name__)
api = Api(app)

@api.resource('/test')
class TestRunnerAPI(Resource):
    def get(self):
        return 'ivan'

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('action')
        parser.add_argument('task')
        args = parser.parse_args()

        action = args['action']
        task = args['task']
        if action == 'start':
            # load and start
            return controllers.run_test(task)
        
        elif action == 'stop':
            # stop
            return controllers.stop_test()

        elif action == 'load':
            # load and stop
            return controllers.reset_test()

        elif action == 'clear':
            # clear and stop
            return controllers.clear_test()

        # elif action == 'add':

@api.resource('/test-chrome')
class TestChrome(Resource):
    def get(self):
        from selenium import webdriver
        driver = webdriver.Chrome()
        driver.maximize_window()

@api.resource('/health')
class HealthCheck(Resource):
    def get(self):
        return controllers.send_health_update()
