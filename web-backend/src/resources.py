
from flask import Blueprint, request
from flask_restful import Resource, Api, reqparse
import requests
from . import controllers

app = Blueprint('gateway', __name__)
api = Api(app)
test_id = 'test_id'

@api.resource('/test')
class Programs(Resource):
    def get(self):
        return 'ivan'

@api.resource('/register')
class RegisterAPI(Resource):
    def post(self):
        # ip_address = request.remote_addr
        ip_address = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
        user_id = test_id
        return controllers.register_ip_address(ip_address, user_id)

@api.resource('/nodes')
class UserNodesAPI(Resource):
    def get(self):
        # get all nodes
        user_id = test_id
        return controllers.get_active_user_nodes(user_id)

    # def post(self):
    #     # add not instance

@api.resource('/node')
class NodeAPI(Resource):
    def get(self):
        # get node info
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)
        args = parser.parse_args()
        node_id = args['id']

        return controllers.get_node_details(node_id)

    def post(self):
        # update (start/stop) node
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)
        parser.add_argument('action', required=True)
        parser.add_argument('task_id')
        args = parser.parse_args()

        node_id = args['id']
        action = args['action']
        task_id = args['task_id']

        return controllers.update_node(node_id, action, task_id)

    def delete(self):
        # stop and delete node
        return

@api.resource('/node-health')
class NodeHealthAPI(Resource):
    def post(self):
        ip_address = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
        user_id = test_id
        return controllers.update_ip_address(ip_address, user_id)

@api.resource('/health')
class HealthCheck(Resource):
    def get(self):
        return {'Status': 'Healthy'}, 200

@api.resource('/node-connection')
class NodeConnection(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('node_id', required=True)
        args = parser.parse_args()

        node_id = args['node_id']
        user_id = test_id
        return controllers.get_node_connection_key(user_id, node_id)

# @api.resource('')
# class UserAccountAPI(Resource):
#     def get(self):
#         # get node info

# @api.resource('')
# class NodeStatusAPI(Resource):
