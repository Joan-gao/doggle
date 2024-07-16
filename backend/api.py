
from flask import Flask, request, jsonify
from flask_cors import CORS
from fileAnalyze import *
from db import *


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route('/upload', methods=['Get', 'POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:

        filename = file.filename
        fileAnalyze(file)
        return jsonify({"message": f"File {filename} uploaded successfully"}), 200


@app.route('/transactions/<int:user_id>')
def get_transactions_for_current_month(user_id):
    response = getOverAllTransactionAnalyze(user_id)
    return jsonify(response)
