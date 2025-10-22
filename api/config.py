import os
from pymongo import MongoClient

class Config:
    # Flask secret key
    SECRET_KEY = os.environ.get("SECRET_KEY", "bageshree")
    MONGO_URI = f"mongodb+srv://aneeshmphatak:malayamarutham@cluster0.lzwebsp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(Config.MONGO_URI)
db = client["atpat_project"]
