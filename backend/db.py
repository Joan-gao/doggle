from sqlalchemy.exc import SQLAlchemyError

from model.model import *
from datetime import datetime
import hashlib
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# 配置数据库 URI
DATABASE_URI = 'mysql+pymysql://root:root123456@35.226.135.14/Finance'

# 创建 SQLAlchemy 引擎
engine = create_engine(DATABASE_URI, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# 初始化数据库


def init_db():
    Base.metadata.create_all(bind=engine)


init_db()
session = SessionLocal()

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
# Generate Password Hash


def generate_hash(input_string):
    # 创建 SHA-256 哈希对象
    sha256 = hashlib.sha256()

    # 更新哈希对象以包括输入字符串
    sha256.update(input_string.encode('utf-8'))

    # 获取哈希值的十六进制表示
    hash_hex = sha256.hexdigest()

    return hash_hex


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

# Get overall transaction analysis


def getOverAllTransactionAnalyze(user_id):
    try:
        today = datetime.today()
        # first_day_of_month = datetime(today.year, today.month, 1)
        # next_month = today.month + 1 if today.month < 12 else 1
        # next_year = today.year if today.month < 12 else today.year + 1
        # last_day_of_month = datetime(next_year, next_month, 1)

        first_day_of_year = datetime(today.year, 1, 1)
        print(first_day_of_year)
        last_day_of_year = datetime(today.year + 1, 1, 1)
        print(last_day_of_year)

        transactions = session.query(Transaction).filter(
            Transaction.user_id == user_id,
            Transaction.transaction_date >= first_day_of_year.strftime(
                '%Y-%m-%d'),
            Transaction.transaction_date < last_day_of_year.strftime(
                '%Y-%m-%d')
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
    except SQLAlchemyError as e:
        print(f"An error occurred: {e}")
        session.rollback()
        return None

    finally:
        session.close()


# Create User

def createUserInDB(email, password, uid, username):

    try:
        passwordhash = generate_hash(password)
        new_user = User(auth_uid=uid, email=email,
                        password_hash=passwordhash, username=username)
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        print(f'User {email} created successfully!')
        return new_user
    except Exception as e:
        print(e)
        return None
    finally:
        session.close()


def updateUserInDB(userData):

    try:
        # Retrieve the user by user_id
        user = session.query(User).filter(
            User.user_id == userData['userId']).one_or_none()

        if user is None:
            print("User not found")
            return False

        # Update the user fields
        user.gender = userData.get('gender', user.gender)
        user.birth_date = datetime.strptime(
            userData['birth_date'], '%Y-%m-%d').date()
        user.address = userData.get('address', user.address)
        user.occupation = userData.get('occupation', user.occupation)
        user.income_source = ','.join(userData.get(
            'income_source', user.income_source))

        # Update the saving goals if provided in userData
        if 'goal' in userData:
            # Check if a SavingGoal exists, if not, create a new one
            if not user.saving_goals:
                new_goal = SavingGoal(
                    user_id=user.user_id,
                    target=userData['goal']
                )
                session.add(new_goal)
            else:
                for goal in user.saving_goals:
                    goal.target = userData['goal']

        # Commit the transaction
        session.commit()
        return True
    except SQLAlchemyError as e:
        print(f"An error occurred: {e}")
        session.rollback()
        return False
    finally:
        session.close()
