from flask import Flask
from flask_restful import Resource, Api
from .config import create_config

def resource_not_found(e):
    return {'error': 'Resource not found.'}, 404

def create_app():

    app = Flask(__name__)
    create_config(app)

    from .resources import app as gateway
    app.register_blueprint(gateway)
    app.register_error_handler(404, resource_not_found)

    return app