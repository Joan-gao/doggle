from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, Date
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
Base = declarative_base()


class User(Base):
    __tablename__ = 'User'

    user_id = Column(Integer, primary_key=True)
    username = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=False)
    email = Column(String(100), nullable=False)
    auth_uid = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.now)
    facebook_id = Column(String(100))
    github_id = Column(String(100))
    google_id = Column(String(100))
    auth_provider = Column(String(10))
    address = Column(String(255))
    gender = Column(String(20))
    income_source = Column(String(255))
    occupation = Column(String(50))
    birth_date = Column(Date)

    # Relationship to transactions and saving goals
    transactions = relationship("Transaction", back_populates="user")
    saving_goals = relationship("SavingGoal", back_populates="user")


class Transaction(Base):
    __tablename__ = 'Transaction'

    transaction_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('User.user_id'))
    category_id = Column(Integer, ForeignKey('Category.category_id'))
    transaction_date = Column(String(25))
    description = Column(String(255))
    amount = Column(Integer)
    created_at = Column(TIMESTAMP, default=datetime.now)
    note = Column(String(255))

    # Relationships
    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")


class Category(Base):
    __tablename__ = 'Category'

    category_id = Column(Integer, primary_key=True)
    category_name = Column(String(100), nullable=False)
    category_type = Column(String(10), nullable=False)

    # Relationship to transactions
    transactions = relationship("Transaction", back_populates="category")


class SavingGoal(Base):
    __tablename__ = 'Saving_Goal'

    goal_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('User.user_id'))
    target_amount = Column(Integer)
    target_date = Column(String(25))
    created_at = Column(TIMESTAMP, default=datetime.now)
    target = Column(String(255))
    # Relationship to user
    user = relationship("User", back_populates="saving_goals")
