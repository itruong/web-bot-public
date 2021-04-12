from datetime import datetime, timedelta
import requests
from flask import Response, make_response
from .constants import PROGRAMS_BASE_URL
from .database import db
from bson import ObjectId


INIT_TIME = datetime.now()

def register_ip_address(ip_address, user_id):
    updated_time = datetime.now()
    result = db.registered_ip_addresses.update_one(
        {
            'ip_address': ip_address
        },
        {
            '$set': {
                'user_id': user_id,
                'last_updated': updated_time,
                'last_status_update': updated_time, 
                'is_running': False,
                'is_updating': False
            }
        },
        upsert=True
    )

    return 'Successfully registered.', 200

def update_ip_address(ip_address, user_id):
    updated_time = datetime.now()
    result = db.registered_ip_addresses.update_one(
        {
            'ip_address': ip_address
        },
        {
            '$set': {
                'last_updated': updated_time
            }
        },
        upsert=True
    )

    return 'Successfully updated up-time.', 200

# def get_node_connection_key(user_id, node_id):
#     if not ObjectId.is_valid(node_id):
#         return 'Invalid node id', 400

#     node = db.registered_ip_addresses.find_one({
#         '_id': ObjectId(node_id),
#         'user_id': user_id
#     })
#     if not node:
#         return 'Node not found', 400

#     url = 'http://proxy/tunnel?connect'
#     res = requests.post(url, data={'hostname': node['ip_address']})
#     if res.status_code == 200:
#         return make_response(res.content.decode('utf8'), 200)
#     else:
#         return 'Error getting the connection key', 400

def get_node_connection_key(user_id, node_id):
    if not ObjectId.is_valid(node_id):
        return 'Invalid node id', 400

    node = db.registered_ip_addresses.find_one({
        '_id': ObjectId(node_id),
        'user_id': user_id
    })
    if not node:
        return 'Node not found', 400

    return node['ip_address']

    # url = 'http://proxy/tunnel?connect'
    # res = requests.post(url, data={'hostname': node['ip_address']})
    # if res.status_code == 200:
    #     return make_response(res.content.decode('utf8'), 200)
    # else:
    #     return 'Error getting the connection key', 400

def get_active_user_nodes(user_id):
    last_10_sec = datetime.now() - timedelta(seconds=10)
    active_user_nodes = db.registered_ip_addresses.find(
        {
            'user_id': user_id,
            'last_updated': {'$gte': INIT_TIME}
        }
    ).sort(
        '_id', 1
    )
    
    return [
        {
            'id': str(node['_id'])
        } for node in active_user_nodes
    ]

def get_node_details(node_id):
    node = db.registered_ip_addresses.find_one(
        {
            '_id': node_id
        }
    )

    return [
        {
            'id': node_id,
            'is_running': node['is_running'],
            'task': node['active_task']
        }
    ]

def update_node(node_id, action, task_id=None):
    node = db.registered_ip_addresses.find_one(
        {
            '_id': node_id
        }
    )

    if not node:
        return 'invalid node', 400

    if node.is_updating:
        return 'node is currently updating', 400

    if action == 'load':
        if not task_id:
            return 'task required', 400
        if node.is_running:
            return 'node is currently running', 400

        task = db.tasks.find_one(
            {
                '_id': task_id
            }
        )

        if not task:
            return 'invalid task', 400
        
        updated_time = datetime.now()
        result = db.registered_ip_addresses.update_one(
            {
                '_id': node_id,
                'last_updated': node.last_updated
            },
            {
                '$set': {
                    'last_updated': updated_time,
                    'task_id': task_id,
                    'is_updating': True
                }
            }
        )

        # check result status
        load_node_with_task(node, task)

    elif action == 'start':
        if node.is_running:
            return 'node is already running', 400
        
        updated_time = datetime.now()
        result = db.registered_ip_addresses.update_one(
            {
                '_id': node_id,
                'last_updated': node.last_updated
            },
            {
                '$set': {
                    'last_updated': updated_time,
                    'is_running': True,
                    'is_updating': True
                }
            }
        )

        # check result status
        start_node(node)

        
    elif action == 'stop':
        if not node.is_running:
            return 'node is already stopped', 400

        updated_time = datetime.now()
        result = db.registered_ip_addresses.update_one(
            {
                '_id': node_id,
                'last_updated': node.last_updated
            },
            {
                '$set': {
                    'last_updated': updated_time,
                    'is_running': False,
                    'is_updating': True
                }
            }
        )

        # check result status
        stop_node(node)

    else:
        return 'invalid action', 400


def load_node_with_task(node, task):
    task_steps = [
        step for step in task.commands
    ]

    port = '6002'
    url = f'http://{node.ip_address}:{port}/test'
    res = requests.post(
        url,
        data={
            'action': 'load',
            'tasks': task_steps
        }
    )

    result = resolve_node_update_status(node)

    if res.status_code != 200:
        return 'Error loading node', 400

    return 'Successfully loaded node', 200

def stop_node(node):
    port = '6002'
    url = f'http://{node.ip_address}:{port}/test'
    res = requests.post(
        url,
        data={
            'action': 'stop'
        }
    )

    result = resolve_node_update_status(node)

    if res.status_code != 200:
        return 'Error stopping node', 400

    return 'Successfully stopped node', 200

def start_node(node):
    port = '6002'
    url = f'http://{node.ip_address}:{port}/test'
    res = requests.post(
        url,
        data={
            'action': 'start'
        }
    )

    result = resolve_node_update_status(node)

    if res.status_code != 200:
        return 'Error starting node', 400

    return 'Successfully started node', 200

def clear_node(node):
    port = '6002'
    url = f'http://{node.ip_address}:{port}/test'
    res = requests.post(
        url,
        data={
            'action': 'clear'
        }
    )

    result = resolve_node_update_status(node)

    if res.status_code != 200:
        return 'Error clearing node', 400

    return 'Successfully cleared node', 200

def resolve_node_update_status(node):
    updated_time = datetime.now()

    result = db.registered_ip_addresses.update_one(
        {
            '_id': node.id,
            'last_updated': node.last_updated
        },
        {
            '$set': {
                'last_updated': updated_time,
                'is_updating': False
            }
        }
    )

    # result check

    return True
