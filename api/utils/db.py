from flask_pymongo import PyMongo

mongo = PyMongo()  # global PyMongo object

def init_db(app):
    mongo.init_app(app)
    return mongo.db
