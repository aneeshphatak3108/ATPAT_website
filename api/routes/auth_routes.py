from flask import current_app, Blueprint, request, jsonify, session
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
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


@auth_routes.route("/login", methods=["POST"])
def login():
    try:
        if "user" in session:
            return jsonify({"status": "error", "message": "Already logged in. Please logout first."}), 403
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")  # 👈 role from request

        # ✅ Check for missing fields
        if not email or not password or not role:
            return jsonify({"status": "error", "message": "Missing email, password, or role"}), 400

        # ✅ Find user by email
        user = admins_collection.find_one({"email": email})
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404

        # ✅ Check password
        if not check_password_hash(user["hashed_password"], password):
            return jsonify({"status": "error", "message": "Invalid password"}), 401

        # ✅ Check if user actually has this role
        if role not in user.get("roles", []):
            return jsonify({"status": "error", "message": f"No account found for role '{role}'"}), 403

        # ✅ Store session with *only the selected role*
        session["user"] = {
            "name": user["name"],
            "email": user["email"],
            "mis_id": user["mis_id"],
            "role": role  # 👈 Only one active role stored
        }

        return jsonify({
            "status": "success",
            "message": f"Login successful as {role}",
            "user": session["user"]
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@auth_routes.route("/me", methods=["GET"])
def me():
    user = session.get("user")
    if not user:
        return jsonify({"message": "Not logged in"}), 401
    return jsonify(user), 200



@auth_routes.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"status": "success", "message": "Logged out successfully"})