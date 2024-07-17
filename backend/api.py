
from flask import Flask, request, jsonify
from flask_cors import CORS
from db import *


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


# Get overall transactions by usesr_id
@app.route('/transactions/<int:user_id>')
def get_transactions_for_current_year(user_id):
    response = getOverAllTransactionAnalyze(user_id)
    return jsonify(response)


@app.route('/user/create', methods=['POST'])
def create_user():
    email = request.json.get("email")
    password = request.json.get("password")
    uid = request.json.get("uid")
    username = request.json.get("username")

    if email is not None and password is not None and uid is not None:
         user_data = createUserInDB(email, password, uid, username)
         if user_data is not None:
             return jsonify({'status': 'success'}), 200
         else:
             return jsonify({'status': 'error', 'message': 'User creation failed'}), 401
    else:
         return jsonify({'status': 'error', 'message': 'Missing email, password, or uid'}), 400
