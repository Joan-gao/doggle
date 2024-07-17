
from flask import Flask, request, jsonify
from flask_cors import CORS
from db import *


## import gemini api
import google.generativeai as genai
from oAuth import load_creds

## authenticate to use gemini api
creds = load_creds()
genai.configure(credentials=creds)
analyzer = genai.get_tuned_model(f'tunedModels/analyzer-bys21ugc6n7d')
categorizer = genai.get_tuned_model(f'tunedModels/categorizer-w96cc9hez4u7')

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


# use gemini api 
@app.route('/gemini/categorizer')
def categozie_user_transaction(user_transaction):
    prompt = '''
    You should classify the text into one of the following classes:[Savings Potential, High Consumption, Fixed Expenditure, Non-Essential Payment, Essential Expenditure].
    '''

    prompt += user_transaction
    result = analyzer.generate_content(prompt)
    return jsonify(result.text)

# use gemini api 
@app.route('/gemini/analyzer')
def categozie_user_transaction(user_input):
    prompt = '''
    You should act as financial expert, base on following user input, providing revelent and specific suggestions: 
    '''

    prompt += user_input
    result = analyzer.generate_content(prompt)
    return jsonify(result.text)

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
