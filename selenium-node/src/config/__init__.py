import os
from . import localhost

def create_config(app):
    config_vars = get_flask_config()
    for k, v in config_vars.items():
        app.config[k] = v

def get_flask_config():
    settings = get_settings()
    config_vars = {
        **settings.FLASK_VARS
    }
    return config_vars

def get_settings():
    return config_options[os.getenv('APP_ENV')]

config_options = {
    'localhost': localhost
}