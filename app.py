from flask import Flask, jsonify, request
from pymongo import MongoClient
from dotenv import load_dotenv  # Add this import
import os

# Load environment variables from .env file
load_dotenv()  # Add this line

app = Flask(__name__)

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "your_mongodb_connection_string_here")
client = MongoClient(MONGO_URI)
db = client["mydatabase"]
collection = db["mycollection"]

@app.route('/api/data', methods=['GET'])
def get_data():
    data = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB's _id field
    return jsonify(data)

@app.route('/api/data', methods=['POST'])
def add_data():
    new_data = request.json
    if not new_data:
        return jsonify({"error": "No data provided"}), 400
    collection.insert_one(new_data)
    return jsonify({"message": "Data added successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)
