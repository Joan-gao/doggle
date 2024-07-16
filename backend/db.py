from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from model.model import *
from datetime import datetime
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root123456@35.226.135.14/Finance'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)

categories = {
    1: "Salary income",
    2: "Bonus income",
    3: "Investment Income income",
    4: "Other Income income",
    5: "Business income",
    6: "Part-time Job income",
    7: "Buying and Selling income",
    8: "Housing expense",
    9: "Food expense",
    10: "Transportation expense",
    11: "Entertainment expense",
    12: "Utilities expense",
    13: "Health expense",
    14: "Insurance expense",
    15: "Education expense",
    16: "Other Expenses expense",
    17: "Investment Expens expense",
    18: "Shopping expense",
    19: "Grocery expense"
}


def categorize_transactions(transactions, categories):
    # Initialize dictionaries to hold counts and category types
    income = {}
    expense = {}

    # Count transactions per category_id, using the category name as the key
    for transaction in transactions:
        category_id = transaction['category_id']
        if category_id in categories:
            # Extract category name and type from the categories dictionary
            category_name, category_type = categories[category_id].split(
            )[:-1], categories[category_id].split()[-1]
            # Join to handle names consisting of multiple words
            category_name = ' '.join(category_name)

            # Count based on category type
            if category_type == 'income':
                income[category_name] = income.get(category_name, 0) + 1
            elif category_type == 'expense':
                expense[category_name] = expense.get(category_name, 0) + 1

    # Calculate percentages
    total_income = sum(income.values())
    total_expense = sum(expense.values())

    income_percent = {name: f"""{count} - {count /
                                           total_income:.2%}""" for name, count in income.items()}
    expense_percent = {name: f"""{count} - {count /
                                            total_expense:.2%}""" for name, count in expense.items()}

    # Prepare the summary dictionary
    summary = {
        'total_income_transactions': total_income,
        'total_expense_transactions': total_expense
    }

    return income_percent, expense_percent, summary


def getOverAllTransactionAnalyze(user_id):

    today = datetime.today()
    # first_day_of_month = datetime(today.year, today.month, 1)
    # next_month = today.month + 1 if today.month < 12 else 1
    # next_year = today.year if today.month < 12 else today.year + 1
    # last_day_of_month = datetime(next_year, next_month, 1)

    first_day_of_year = datetime(today.year, 1, 1)
    print(first_day_of_year)
    last_day_of_year = datetime(today.year + 1, 1, 1)
    print(last_day_of_year)
    transactions = db.session.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.transaction_date >= first_day_of_year.strftime('%Y-%m-%d'),
        Transaction.transaction_date < last_day_of_year.strftime('%Y-%m-%d')
    ).all()

    # Convert the results into a list of serializable dictionaries
    transaction_result = [{
        'transaction_id': t.transaction_id,
        'category_id': t.category_id,

    } for t in transactions]

    # Assume categories is defined somewhere in your app
    income_percent, expense_percent, summary = categorize_transactions(
        transaction_result, categories)

    # Structure the final JSON response
    response_data = {
        'income': income_percent,
        'expense': expense_percent,
        'summary': summary
    }

    return response_data
