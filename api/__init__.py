from flask import Flask
from flask_cors import CORS
from flask_session import Session
from datetime import timedelta
from api.config import Config
from api.utils.db import init_db
from api.routes.auth_routes import auth_routes
from api.routes.test_routes import test_routes


def create_app():
    app = Flask(__name__)

    # ✅ CORS setup (must allow credentials)
    CORS(
        app,
        resources={r"/*": {"origins": ["http://localhost:3000"]}},
        supports_credentials=True
    )

    # ✅ Load configuration
    app.config.from_object(Config)
    app.secret_key = app.config.get("SECRET_KEY")

    # ✅ Session configuration
    app.config.update(
        SESSION_TYPE='filesystem',
        SESSION_PERMANENT=False,
        SESSION_USE_SIGNER=True,
        SESSION_FILE_DIR='/tmp/flask_sessions',
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE='None',   # ✅ critical fix
        SESSION_COOKIE_SECURE=False,      # ❌ True only if using HTTPS
        PERMANENT_SESSION_LIFETIME=timedelta(hours=2),
    )

    Session(app)

    # ✅ Initialize database
    db = init_db(app)

    # ✅ Register blueprints
    app.register_blueprint(auth_routes, url_prefix='/api/auth_routes')
    app.register_blueprint(test_routes, url_prefix='/api/test_routes')

    return app
