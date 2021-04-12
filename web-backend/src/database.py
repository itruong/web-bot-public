import os
from pymongo import MongoClient


print(os.getenv('MONGO_DATABASE_NAME'), os.getenv('MONGO_CONNECTION'))
client = MongoClient(os.getenv('MONGO_CONNECTION'))
db = client[os.getenv('MONGO_DATABASE_NAME')]
