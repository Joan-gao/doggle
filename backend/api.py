
from flask import Flask, request, jsonify
from flask_cors import CORS
from db import *
from gemini_fune_tune_util.util import analyzer_func, categorizer_func, transaction_procossor, transaction_procossor_update, transaction_procossor_update
import requests
import json
import re

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
def get_current_date():
    # Get the current date and time
    now = datetime.now()
    
    # Format the date as "YYYY-MM-DD"
    formatted_date = now.strftime("%Y-%m-%d")
    
    return formatted_date

def is_valid_date(date_string):
    # Define the pattern for YYYY-MM-DD
    pattern = r'^\d{4}-\d{2}-\d{2}$'
    
    # Use re.match to check if the string matches the pattern
    match = re.match(pattern, date_string)
    
    # Check if match is not None
    if match is not None:
        return True
    else:
        return False
    
@app.route('/add_transaction/<int:user_id>', methods=['POST'])
def add_transaction_route(user_id):

    try:
        print("add transaction!!")
        Transaction_string = request.json.get("input")
        json_string = transaction_procossor(Transaction_string).replace("json", "").replace("\n", " ").replace("```", "")
        transaction = json.loads(json_string)
        print(json_string)
        prompt = "Please categorize this transaction into following one of "
        name_string = ""
        for name in categories.values():
            name_string += name + ", "
        
        categories_mapping = {}

        for key, value in categories.items():
            categories_mapping[value] = key
        
        prompt += f"[{name_string}]"

        transaction_string = f'transaction_date: {transaction["transaction_date"]} description: {transaction["description"]} amount: {transaction["amount"]}'
        print(transaction_string)
        category = categorizer_func(prompt + " Transaction: " + transaction_string + "just return the category name itself")
        category = category.strip("\n").strip(" ")
        category_id = categories_mapping[category]
        if not is_valid_date(transaction["transaction_date"]):
            transaction["transaction_date"] = get_current_date()

        print(user_id, category_id, transaction["transaction_date"], transaction["description"], transaction["amount"])
        response = add_transaction(user_id, category_id, transaction["transaction_date"], transaction["description"], transaction["amount"])
        print(response)

        return_string = f'Transaction: date: {transaction["transaction_date"]} description: {transaction["description"]} amount: ${transaction["amount"]} has been added'
        return jsonify({"data": return_string})
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"data": "Invalid transaction data to add!"}), 400

@app.route('/update_transaction/<int:user_id>', methods=['POST'])
def update_transaction_route(user_id):

    try:
        Transaction_string = request.json.get("input")
        json_string = transaction_procossor_update(Transaction_string).replace("json", "").replace("\n", " ").replace("```", "")
        transaction_info = json.loads(json_string)
        new_transaction_info = {}
        new_transaction_info["transaction_date"] = transaction_info["new_transaction_date"] if hasattr(transaction_info, "new_transaction_date") else "None"
        new_transaction_info["description"] = transaction_info["new_description"] if hasattr(transaction_info, "new_description") else "None"
        new_transaction_info["amount"] = transaction_info["new_amount"] if hasattr(transaction_info, "new_amount") else "None"
        print(new_transaction_info)
        print(transaction_info)
        update_transaction(user_id, transaction_info["transaction_date"], transaction_info["amount"], new_transaction_info)
        return_string = f'Transaction: date: {transaction_info["transaction_date"]} description: {transaction_info["description"]} amount: ${transaction_info["amount"]} has been updated'
        return jsonify({"data": f"Transaction {return_string} has been added"})
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"data": "Invalid transaction data to add!"})

@app.route('/search_transaction/<int:user_id>', methods=['POST'])
def search_transaction_route(user_id):
    try:
        print(request.json.get("input"))
        Transaction_string = request.json.get("input").split(" ")[1:]
        Transaction_string = " ".join(Transaction_string)
        print(Transaction_string)
        json_string = transaction_procossor(Transaction_string).replace("json", "").replace("\n", " ").replace("```", "")
        print(json_string)
        transaction = json.loads(json_string)

        transaction["transaction_date"] = transaction["transaction_date"] if transaction["transaction_date"] != "None" else "*"
        transaction["amount"] = transaction["amount"] if transaction["amount"] != "None" else "*"
        result = search_transaction(user_id, transaction["transaction_date"], transaction["amount"])
        
        if result == None:
            return jsonify({"data": "No transactions found"})
        else:
            return jsonify({"data": result})
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"data": "No transactions found"})

@app.route('/delete_transaction/<int:user_id>', methods=['POST'])
def delete_transaction_route(user_id):
    try:
        Transaction_string = request.json.get("input")
        json_string = transaction_procossor(Transaction_string).replace("json", "").replace("\n", " ").replace("```", "")
        transaction = json.loads(json_string)

        result = remove_transaction(user_id, transaction["transaction_date"], transaction["amount"])
        
        if result == None:
            return jsonify({"data": "No transactions found"})
        else:
            return jsonify({"data": result + "has been deleted"})
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"data": "No transactions found"})
    
@app.route('/upload_file/<int:user_id>', methods=['POST'])
def upload_file(user_id):
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        print(file)
        # files_ = {'file': request.files['file']}
        # Form the file tuple
        files_ = {
            'file': (file.filename, file.stream, file.content_type)
        }
        return_val = requests.post("http://127.0.0.1:5001/file_analyze", files=files_)
        return_val_dict = return_val.json()
        summary, response = return_val_dict["summary"], return_val_dict["response"]
        response = response.replace("json", "").replace("\n", " ").replace("```", "")
        print(response)
        transaction_dict = json.loads(response)
        
        prompt = "Please categorize this transaction into following one of "
        name_string = ""
        for name in categories.values():
            name_string += name + ", "
        
        categories_mapping = {}

        for key, value in categories.items():
            categories_mapping[value] = key
        
        prompt += f"[{name_string}]"
        added_transaction_count = 0
        for transaction in transaction_dict:
            transaction_string = f'transaction_date: {transaction["transaction_date"]} description: {transaction["description"]} amount: {transaction["amount"]}'
            category = categorizer_func(prompt + " Transaction: " + transaction_string + "just return the category name itself")
            print(transaction)
            print(category)
            category = category.strip("\n").strip(" ")
            if category in categories_mapping:
                category_id = categories_mapping[category]
            else:
                continue
            
            
            add_transaction(user_id, category_id, transaction["transaction_date"], transaction["description"], transaction["amount"]) 
            added_transaction_count += 1
        return jsonify({"reply": summary, "count": str(added_transaction_count)})
    except Exception as e:
        print(e)
        return jsonify({"reply": "I am unable to analyze this file", "count": "0"})

@app.route("/info/<int:user_id>", methods=['POST', 'OPTIONS'])
def get_all_financial_info_and_analyze(user_id):
    if request.method == 'OPTIONS':
        return '', 200
    user_input = request.json.get('input')
    print(user_id)
    transaction_info = getOverAllTransactionAnalyze(user_id)
    goal, budget = getBudget_and_goal(user_id)
    user_info = get_user_info(user_id)
    user_info_ = "None"
    if user_info != None:
        user_info_ = {key: user_info[key] for key in ["birth_date", "occupation", "income_source", "gender"]}
    user_info_string =  str({
        "transaction_info": transaction_info,
        "goal": goal,
        "budget": budget,
        "General_info": user_info_
    })


    prompt = """" You need to act as an financial expert to give customer professional and custormized advice (Incorporate informal and friendly language and Include emojis, playful phrases, and a touch of humor) based on following user information in json format: """
    
    post_prompt = "based on above information (take user general information into account), answer the question: " + str(user_input)
    print(prompt + user_info_string + post_prompt)
    reply = analyzer_func(prompt + user_info_string + post_prompt).replace('\"', "")
    print(reply)
    return jsonify({"data": reply})





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
            return jsonify({'status': 'success', "user_id": user_data.user_id}), 200
        else:
            return jsonify({'status': 'error', 'message': 'User creation failed'}), 401
    else:
        return jsonify({'status': 'error', 'message': 'Missing email, password, or uid'}), 400


@app.route('/user/get', methods=['POST'])
def get_user():
    uid = request.json.get("uid")

    user = get_user_id_by_uid(uid)
    if user is not None:

        return jsonify({'status': 'success', "user": user}), 200

    else:
        return jsonify({'status': 'error', 'message': 'Missing email, password, or uid'}), 400


@app.route('/user/update', methods=['POST'])
def update_user():
    userData = request.json.get("userData")

    print(userData)

    if userData is not None:
        result = updateUserInDB(userData)

        if result is not None:
            return jsonify({'status': 'success'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'User update failed'}), 401
    else:
        return jsonify({'status': 'error'}), 400


@app.route('/income_expense_summary', methods=['Post'])
def getIncomeExpenseSummaryData():

    month = request.json.get("month")
    year = request.json.get("year")
    uid = request.json.get("uid")

    summary = get_user_data(uid, year, month)

    return jsonify(summary)


@app.route('/api/getDataByMonth', methods=['POST'])
def get_data_by_month():
    user = request.json.get("user")
    month = request.json.get('month')
    result = getCalanderDatabyMonth(user, month)

    return jsonify(result)


@app.route('/api/getDataByDate', methods=['POST'])
def get_data_by_date():
    user = request.json.get("user")
    date = request.json.get('date')

    result = getCalanderDatabyDate(user, date)
    return jsonify(result)


@app.route('/api/delete/transaction', methods=['POST'])
def deleteTransaction():
    transaction_id = request.json.get("transaction_id")
    result = delete_transaction(transaction_id)
    return jsonify(result)


@app.route('/api/edit/transaction', methods=['POST'])
def editTransaction():
    transaction_id = request.json.get("transaction_id")
    category_id = request.json.get("category_id")
    amount = request.json.get("amount")
    result = edit_transaction(transaction_id, category_id, amount)
    return jsonify(result)


@app.route('/fetch/all-transactions', methods=['POST'])
def getAllTransactionsByUser():
    user = request.json.get("user")
    result = getTransactionsByUser(user)
    return jsonify(result)


@app.route('/transaction/analysis', methods=['POST'])
def transactionAnalysis():
    user = request.json.get("user")

    result = get_expense_income_data(user)
    return jsonify(result)


@app.route('/api/set-budget', methods=['POST'])
def budgetSetting():
    user = request.json.get("user")
    budgetAmout = request.json.get("amount")

    result = setBudget(user, budgetAmout)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
