from flask import Flask, jsonify
from flask_cors import CORS
from flask_session import Session
from api.config import Config
from api.utils.db import init_db, mongo  # import the PyMongo object
from api.routes.auth_routes import auth_routes

def create_app():
    app = Flask(__name__)

    # CORS setup
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    # Load config
    app.config.from_object(Config) #loads the mongo_uri and secret_key
    #app.secret_key = Config.SECRET_KEY

    # Server-side sessions
    app.config['SESSION_TYPE'] = 'filesystem'
    app.config['SESSION_PERMANENT'] = False
    app.config['SESSION_USE_SIGNER'] = True
    app.config['SESSION_FILE_DIR'] = '/tmp/flask_sessions'
    Session(app)

    # Initialize database
    db = init_db(app)  # single connection via Flask-PyMongo
    # Register blueprints
    app.register_blueprint(auth_routes, url_prefix='/api/auth_routes')

    return app
