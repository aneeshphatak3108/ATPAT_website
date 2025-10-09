from flask import current_app, Blueprint, request, jsonify
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
#from api.utils.db import mongo
from api.models.admins import Admins
from api.config import db

auth_routes = Blueprint("auth_routes", __name__)
admins_collection = db["admins"]

@auth_routes.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        mis_id = data.get("mis_id")
        password = data.get("password")
        role = data.get("role")
        tests_registered = data.get("tests_registered", [])

        if not name or not email or not mis_id or not password or not role:
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        # Check if user already exists (by email or MIS ID)
        existing_user = admins_collection.find_one({"$or": [{"email": email}, {"mis_id": mis_id}]})

        if existing_user:
            # If user already has the same role → conflict
            existing_roles = existing_user.get("roles", [existing_user.get("role")])
            if role in existing_roles:
                return jsonify({
                    "status": "error",
                    "message": f"User already registered as {role}"
                }), 409

            # Else, add this role to the user
            admins_collection.update_one(
                {"_id": existing_user["_id"]},
                {"$addToSet": {"roles": role}}
            )
            return jsonify({
                "status": "success",
                "message": f"Existing user updated with new role '{role}'"
            }), 200

        hashed_password = generate_password_hash(password)
        new_user = {
            "name": name,
            "email": email,
            "mis_id": mis_id,
            "roles": [role],
            "tests_registered": tests_registered,
            "hashed_password": hashed_password,
        }

        admins_collection.insert_one(new_user)
        return jsonify({
            "status": "success",
            "message": f"{role.capitalize()} registered successfully"
        }), 201

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
