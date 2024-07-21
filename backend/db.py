from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import extract
from model.model import *
from datetime import datetime, date
import hashlib
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
from collections import defaultdict
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
            Transaction.is_shown != 1,
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


def get_income_expense_summary(uid, month=None, year=None):
    """
    1.根据uid 查看 User并拿到 user_id

    2. 首先判断用户的注册时间，以及用户传递的查询时间，如果用用户传递的年份大于或者小于注册年份，则直接返回null

    3. 如果用户传递的年份与注册年份一致，则继续判断用户是否传递了月份，如果传递的月份小于注册月份，或者大于当前月份，也没有数据 直接返回 null

    4 然后开始查看用户的数据，如果月份不为空，则先以月为单位，查询选定年份那年的月份内的 income transaction总金额，expense transaction 总金额，income总共有几笔消费
    expense总共有几笔消费
    5. 然后再以年为但查询选定年份的内，income transaction总金额，expense transaction 总金额，income总共有几笔消费
    expense总共有几笔消费

    6. 需要判断筛选出来的数据对应的category分别有多少金额，给我两个字典list,一个list是income,一个list 是expense list中放着多个字典对象
    字典中的键为type值为金额 类似于这样data = {
  year:[{
    type: "Food",
    value: 25,
  },
  {
    type: "Sports",
    value: 25,
  },
  {
    type: "Shopping",
    value: 30,
  },
  {
    type: "Study",
    value: 15,
  }]
   Month:[{
    type: "Food",
    value: 25,
  },
  {
    type: "Sports",
    value: 25,
  },
  {
    type: "Shopping",
    value: 30,
  },
  {
    type: "Study",
    value: 15,
  },
}];

7 我需要一个排序数据，请将排序最高的前三个category 提供给我，category 名称， transaction数量，transaction金额，income以及out come各需要一个：类似于下面这样
  expense={"year":[ { category: "hotel & travel", transactions: 2, amount: -5000 },
  { category: "rent", transactions: 1, amount:-2000 },
  { category: "shopping", transactions: 2, amount: -1500 }],Month:[ { category: "hotel & travel", transactions: 2, amount: -5000 },
  { category: "rent", transactions: 1, amount:-2000 },
  { category: "shopping", transactions: 2, amount: -1500 }]}


"""


def assembaleData(monthDataDict, yearDataDict):
    # monthDataDict={"total_month_income:":8,"total_month_income":5300,"total_month_expense:":8,"total_month_expense_amount":5300}
    # yearDataDict = {"total_year_income:": 8, "total_year_income_amount": 5300, "total_year_expense:": 8,
    #                  "total_year_expense_amount": 5300}
    expense_data = {
        "monthly": {
            "countData": {
                "today": "Total 8 expenses",
                "title": "$53,00",
                "persent": "+30%",
                "color": "#ed4242",
            },
            "average": "$5000",
            "sortedData": [],
        },
        "yearly": {
            "countData": {
                "today": "Total 8 expenses",
                "title": "$600,000",
                "persent": "+20%",
                "color": "#ed4242",
            },

            "average": "$5000",
            "sortedData": [],
        }
    }
    income_data = {
        "monthly": {
            "countData": {
                "today": "Total 8 expenses",
                "title": "$53,00",
                "persent": "+30%",
                "color": "#ed4242",
            },
            "average": "$5000",

        },
        "yearly": {
            "countData": {
                "today": "Total 8 expenses",
                "title": "$600,000",
                "persent": "+20%",
                "color": "#ed4242",
            },
            "average": "$5000",



        }
    }


def get_user_id_by_uid(uid):
    try:
        user = session.query(User).filter_by(auth_uid=uid).first()
        return user if user else None
    except Exception as e:
        print(e)
        return None
    finally:
        session.close()


def validate_date(user, year, month=None):
    registration_year = user.created_at.year
    current_year = datetime.now().year
    current_month = datetime.now().month

    print(registration_year, current_year, year)
    if year < registration_year or year > current_year:
        return None

    if year == registration_year and month:
        registration_month = user.created_at.month
        if month < registration_month or month > current_month:
            return None

    return True


def get_transactions(user_id, year, month=None):
    query = session.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.is_shown != 1,
        func.date_format(Transaction.transaction_date, '%Y') == str(year)
    )
    if month:
        query = query.filter(func.strftime(
            '%m', Transaction.transaction_date) == str(month).zfill(2))

    return query.all()


def categorize_transactions(transactions):
    income_transactions = [
        t for t in transactions if categories[t.category_id].endswith("income")]
    expense_transactions = [
        t for t in transactions if categories[t.category_id].endswith("expense")]

    def aggregate_by_category(transactions):
        data = {}
        for t in transactions:
            category = categories[t.category_id].split()[0]
            if category not in data:
                data[category] = {"amount": 0, "transactions": 0}
            data[category]["amount"] += t.amount
            data[category]["transactions"] += 1
        return data

    return aggregate_by_category(income_transactions), aggregate_by_category(expense_transactions)


def top_categories(transactions_by_category):
    sorted_transactions = sorted(
        transactions_by_category.items(), key=lambda x: x[1]["amount"], reverse=True)
    return sorted_transactions[:3]


def get_user_data(uid, year=None, month=None):
    user_id = get_user_id_by_uid(uid)
    if not user_id:
        return None

    user = session.query(User).get(user_id)
    if not validate_date(user, year, month):
        return None

    transactions = get_transactions(user_id, year, month)
    if not transactions:
        return None

    income_data_year, expense_data_year = categorize_transactions(
        get_transactions(user_id, year))
    income_data_month, expense_data_month = categorize_transactions(
        get_transactions(user_id, year, month))

    top_income_year = top_categories(income_data_year)
    top_expense_year = top_categories(expense_data_year)
    top_income_month = top_categories(income_data_month)
    top_expense_month = top_categories(expense_data_month)

    data = {
        "year": {
            "income": [{"type": k, "value": v["amount"]} for k, v in income_data_year.items()],
            "expense": [{"type": k, "value": v["amount"]} for k, v in expense_data_year.items()],
            "top_income": [{"category": k, "transactions": v["transactions"], "amount": v["amount"]} for k, v in
                           top_income_year],
            "top_expense": [{"category": k, "transactions": v["transactions"], "amount": v["amount"]} for k, v in
                            top_expense_year]
        },
        "month": {
            "income": [{"type": k, "value": v["amount"]} for k, v in income_data_month.items()],
            "expense": [{"type": k, "value": v["amount"]} for k, v in expense_data_month.items()],
            "top_income": [{"category": k, "transactions": v["transactions"], "amount": v["amount"]} for k, v in
                           top_income_month],
            "top_expense": [{"category": k, "transactions": v["transactions"], "amount": v["amount"]} for k, v in
                            top_expense_month]
        }
    }

    return data


def getCalanderDatabyDate(user, date):
    try:

        registered_at = datetime.strptime(
            user.get("created_at"), '%Y-%m-%d')
        query_date = datetime.strptime(date, '%Y-%m-%d')

        if query_date < registered_at:
            return {}

        transactions = session.query(Transaction).filter(
            Transaction.transaction_date == query_date.strftime(
                '%Y-%m-%d'),
            Transaction.user_id == user.get("user_id"),
            Transaction.is_shown != 1
        ).all()

        expense = 0
        income = 0
        financeData = []
        key = 0

        for transaction in transactions:
            category_name = categories.get(
                transaction.category_id, "Unknown").rsplit(' ', 1)[0]
            amount = transaction.amount
            if "expense" in categories.get(transaction.category_id, "Unknown").lower():
                stramount = "-" + str(amount)
                expense += amount
            else:
                stramount = str(amount)
                income += amount
            key += 1
            financeData.append({
                "key": key,
                "category": category_name,
                "amount": stramount,
                "transaction_id": transaction.transaction_id,
                "category_id": transaction.category_id
            })

        result = {
            "expense": expense,
            "income": income,
            "financeData": financeData
        }

        return result

    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": "An error occurred while fetching data"}

    finally:
        session.close()


def getCalanderDatabyMonth(user, month):

    transactions = session.query(Transaction).filter(
        extract('year', Transaction.transaction_date) == int(month[:4]),
        extract('month', Transaction.transaction_date) == int(month[5:7]),
        Transaction.user_id == user.get("user_id"),
        Transaction.is_shown != 1
    ).all()

    expense = 0
    income = 0
    financeData = []
    key = 0

    for transaction in transactions:
        category_name = categories.get(
            transaction.category_id, "Unknown").rsplit(' ', 1)[0]
        amount = transaction.amount
        if "expense" in categories.get(transaction.category_id, "Unknown").lower():
            amount = -amount
            expense += amount
        else:
            income += amount
        key += 1
        financeData.append({
            "key": key,
            "category": category_name,
            "amount": amount,
            "transaction_id": transaction.transaction_id,
            "category_id": transaction.category_id
        })

    result = {
        "expense": expense,
        "income": income,
        "financeData": financeData
    }

    return result


def delete_transaction(transaction_id):

    try:
        transaction = session.query(Transaction).filter(
            Transaction.transaction_id == transaction_id).first()
        if transaction:
            transaction.is_shown = 1
            session.commit()
            return {'status': "success"}
        else:
            return {'status': "fail"}
    except Exception as e:
        session.rollback()
        return {'status': "fail", 'error': str(e)}
    finally:
        session.close()


def edit_transaction(transaction_id, category_id, amount):

    try:
        transaction = session.query(Transaction).filter(
            Transaction.transaction_id == transaction_id).first()
        if transaction:
            transaction.category_id = category_id
            transaction.amount = amount
            session.commit()
            return {'status': "success"}
        else:
            return {'status': "fail"}
    except Exception as e:
        session.rollback()
        return {'status': "fail", 'error': str(e)}
    finally:
        session.close()


def getTransactionsByUser(user):
    try:
        registered_at = datetime.strptime(user.get("created_at"), '%Y-%m-%d')
        user_id = user.get("user_id")

        transactions = session.query(Transaction).filter(
            Transaction.transaction_date >= registered_at.strftime('%Y-%m-%d'),
            Transaction.user_id == user_id,
            Transaction.is_shown != 1
        ).all()

        # Initialize result dictionaries
        result_by_date = defaultdict(
            lambda: {"expense": 0, "income": 0, "financeData": []})
        result_by_month = defaultdict(
            lambda: {"expense": 0, "income": 0, "financeData": []})

        key_counter = 0

        for transaction in transactions:
            transaction_date = transaction.transaction_date.strftime(
                '%Y-%m-%d')
            transaction_month = transaction.transaction_date.strftime('%Y-%m')
            category_name = categories.get(
                transaction.category_id, "Unknown").rsplit(' ', 1)[0]
            amount = transaction.amount
            if "expense" in categories.get(transaction.category_id, "Unknown").lower():
                stramount = "-" + str(amount)
                result_by_date[transaction_date]["expense"] += amount
                result_by_month[transaction_month]["expense"] += amount
            else:
                stramount = str(amount)
                result_by_date[transaction_date]["income"] += amount
                result_by_month[transaction_month]["income"] += amount

            key_counter += 1
            transaction_data = {
                "key": key_counter,
                "category": category_name,
                "amount": stramount,
                "transaction_id": transaction.transaction_id,
                "category_id": transaction.category_id
            }
            result_by_date[transaction_date]["financeData"].append(
                transaction_data)
            result_by_month[transaction_month]["financeData"].append(
                transaction_data)

        return {
            "by_date": dict(result_by_date),
            "by_month": dict(result_by_month)
        }

    except Exception as e:
        print(f"An error occurred: {e}")
        return {"error": "An error occurred while fetching data"}

    finally:
        session.close()
