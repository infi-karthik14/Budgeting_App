import pandas as pd
import random
from datetime import datetime, timedelta

random.seed(42)

categories = {
    "Salary": (25000, 200000),
    "Food": (100, 1500),
    "Groceries": (200, 5000),
    "Travel": (100, 3000),
    "Shopping": (500, 20000),
    "Bills": (500, 10000),
    "Rent": (5000, 30000),
    "Entertainment": (100, 5000),
    "Healthcare": (200, 15000),
    "Education": (500, 50000),
    "Investment": (1000, 50000),
    "Other": (100, 10000)
}

payment_methods = [
    "Cash",
    "UPI",
    "Debit Card",
    "Credit Card",
    "Net Banking"
]

cities = [
    "Delhi","Mumbai","Lucknow","Kanpur","Noida",
    "Bengaluru","Hyderabad","Pune","Chennai",
    "Jaipur","Kolkata","Ahmedabad"
]

merchants = {
    "Food":["Domino's","McDonald's","KFC","Burger King","Zomato","Swiggy"],
    "Groceries":["DMart","Reliance Fresh","Big Bazaar","Blinkit"],
    "Travel":["Uber","Ola","IRCTC","IndiGo"],
    "Shopping":["Amazon","Flipkart","Myntra","Ajio"],
    "Bills":["Electricity Board","Jio","Airtel","BSNL"],
    "Rent":["Landlord"],
    "Entertainment":["PVR","Netflix","BookMyShow"],
    "Healthcare":["Apollo","MedPlus","PharmEasy"],
    "Education":["Udemy","Coursera","College"],
    "Investment":["Groww","Zerodha","Upstox"],
    "Salary":["Company"],
    "Other":["Miscellaneous"]
}

rows = []

start_date = datetime(2025,1,1)

for i in range(1,10001):

    user_id = f"U{random.randint(1,100):03}"

    date = start_date + timedelta(days=random.randint(0,730))

    if random.random() < 0.08:
        transaction_type = "Income"
        category = "Salary"
    else:
        transaction_type = "Expense"
        category = random.choice([
            "Food","Groceries","Travel","Shopping",
            "Bills","Rent","Entertainment",
            "Healthcare","Education","Investment","Other"
        ])

    amount = random.randint(
        categories[category][0],
        categories[category][1]
    )

    income = random.randint(25000,200000)

    budget = int(income * random.uniform(0.5,0.9))

    remaining = max(0,budget-random.randint(0,budget))

    merchant = random.choice(merchants[category])

    rows.append([
        f"T{i:05}",
        user_id,
        date.strftime("%Y-%m-%d"),
        transaction_type,
        category,
        amount,
        random.choice(payment_methods),
        merchant,
        income,
        budget,
        remaining,
        random.choice(cities),
        date.strftime("%A")
    ])

columns = [
    "transaction_id",
    "user_id",
    "date",
    "transaction_type",
    "category",
    "amount",
    "payment_method",
    "merchant",
    "monthly_income",
    "monthly_budget",
    "remaining_budget",
    "city",
    "day_of_week"
]

df = pd.DataFrame(rows, columns=columns)

df.to_csv("datasets/transactions.csv", index=False)

print("✅ Dataset created successfully!")
print("Total Transactions:", len(df))