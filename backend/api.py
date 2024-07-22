
from flask import Flask, request, jsonify
from flask_cors import CORS
from db import *


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


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


if __name__ == '__main__':
    app.run(debug=True)
