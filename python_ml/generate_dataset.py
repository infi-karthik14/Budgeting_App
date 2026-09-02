import pandas as pd
import random
from datetime import datetime, timedelta

random.seed(42)

# =========================================================
# CONFIGURATION
# =========================================================

categories = {
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
    "Delhi",
    "Mumbai",
    "Lucknow",
    "Kanpur",
    "Noida",
    "Bengaluru",
    "Hyderabad",
    "Pune",
    "Chennai",
    "Jaipur",
    "Kolkata",
    "Ahmedabad"
]

merchants = {
    "Food": [
        "Domino's",
        "McDonald's",
        "KFC",
        "Burger King",
        "Zomato",
        "Swiggy"
    ],

    "Groceries": [
        "DMart",
        "Reliance Fresh",
        "Big Bazaar",
        "Blinkit"
    ],

    "Travel": [
        "Uber",
        "Ola",
        "IRCTC",
        "IndiGo"
    ],

    "Shopping": [
        "Amazon",
        "Flipkart",
        "Myntra",
        "Ajio"
    ],

    "Bills": [
        "Electricity Board",
        "Jio",
        "Airtel",
        "BSNL"
    ],

    "Rent": [
        "Landlord"
    ],

    "Entertainment": [
        "PVR",
        "Netflix",
        "BookMyShow"
    ],

    "Healthcare": [
        "Apollo",
        "MedPlus",
        "PharmEasy"
    ],

    "Education": [
        "Udemy",
        "Coursera",
        "College"
    ],

    "Investment": [
        "Groww",
        "Zerodha",
        "Upstox"
    ],

    "Other": [
        "Miscellaneous"
    ]
}


# =========================================================
# GENERATE REALISTIC EXPENSE
# =========================================================

def generate_expense(
    category,
    monthly_income,
    monthly_budget,
    day_of_week
):

    minimum, maximum = categories[category]

    # Base amount
    amount = random.uniform(minimum, maximum)

    # -----------------------------------------------------
    # INCOME EFFECT
    # -----------------------------------------------------

    income_factor = monthly_income / 75000

    if income_factor > 1:
        amount *= min(income_factor, 1.5)
    else:
        amount *= max(income_factor, 0.6)

    # -----------------------------------------------------
    # BUDGET EFFECT
    # -----------------------------------------------------

    budget_factor = monthly_budget / max(monthly_income, 1)

    if budget_factor > 0.75:
        amount *= 1.08

    elif budget_factor < 0.55:
        amount *= 0.92

    # -----------------------------------------------------
    # WEEKEND EFFECT
    # -----------------------------------------------------

    if day_of_week in ["Saturday", "Sunday"]:

        if category in [
            "Food",
            "Travel",
            "Shopping",
            "Entertainment"
        ]:
            amount *= 1.15

    # -----------------------------------------------------
    # CATEGORY-SPECIFIC PATTERNS
    # -----------------------------------------------------

    if category == "Rent":

        amount = random.uniform(
            max(minimum, monthly_income * 0.15),
            min(maximum, monthly_income * 0.35)
        )

    elif category == "Investment":

        amount *= 0.8

    elif category == "Bills":

        amount *= random.uniform(0.9, 1.1)

    # -----------------------------------------------------
    # RANDOM NOISE
    # -----------------------------------------------------

    amount *= random.uniform(0.9, 1.1)

    # Keep within category range
    amount = max(minimum, min(amount, maximum))

    return round(amount, 2)


# =========================================================
# GENERATE DATASET
# =========================================================

rows = []

start_date = datetime(2025, 1, 1)

for i in range(1, 10001):

    user_id = f"U{random.randint(1, 100):03}"

    date = start_date + timedelta(
        days=random.randint(0, 730)
    )

    # -----------------------------------------------------
    # INCOME TRANSACTION
    # -----------------------------------------------------

    if random.random() < 0.08:

        transaction_type = "Income"

        category = "Salary"

        monthly_income = random.randint(
            25000,
            200000
        )

        monthly_budget = int(
            monthly_income *
            random.uniform(0.50, 0.90)
        )

        amount = monthly_income

    # -----------------------------------------------------
    # EXPENSE TRANSACTION
    # -----------------------------------------------------

    else:

        transaction_type = "Expense"

        category = random.choice([
            "Food",
            "Groceries",
            "Travel",
            "Shopping",
            "Bills",
            "Rent",
            "Entertainment",
            "Healthcare",
            "Education",
            "Investment",
            "Other"
        ])

        monthly_income = random.randint(
            25000,
            200000
        )

        monthly_budget = int(
            monthly_income *
            random.uniform(0.50, 0.90)
        )

        amount = generate_expense(
            category,
            monthly_income,
            monthly_budget,
            date.strftime("%A")
        )

    # -----------------------------------------------------
    # REMAINING BUDGET
    # -----------------------------------------------------

    spent_so_far = random.randint(
        0,
        max(monthly_budget, 1)
    )

    remaining_budget = max(
        0,
        monthly_budget - spent_so_far
    )

    # -----------------------------------------------------
    # OTHER DATA
    # -----------------------------------------------------

    payment_method = random.choice(
        payment_methods
    )

    city = random.choice(
        cities
    )

    merchant = random.choice(
        merchants.get(
            category,
            ["Miscellaneous"]
        )
    )

    rows.append([
        f"T{i:05}",
        user_id,
        date.strftime("%Y-%m-%d"),
        transaction_type,
        category,
        amount,
        payment_method,
        merchant,
        monthly_income,
        monthly_budget,
        remaining_budget,
        city,
        date.strftime("%A")
    ])


# =========================================================
# CREATE DATAFRAME
# =========================================================

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

df = pd.DataFrame(
    rows,
    columns=columns
)


# =========================================================
# SAVE DATASET
# =========================================================

df.to_csv(
    "datasets/transactions.csv",
    index=False
)


# =========================================================
# INFORMATION
# =========================================================

print("============================================")
print("BACHAT BUDDY ML DATASET CREATED")
print("============================================")

print(
    "Total Transactions:",
    len(df)
)

print(
    "Expense Transactions:",
    len(
        df[
            df["transaction_type"] == "Expense"
        ]
    )
)

print(
    "Income Transactions:",
    len(
        df[
            df["transaction_type"] == "Income"
        ]
    )
)

print()
print("Category Distribution:")
print(
    df["category"].value_counts()
)

print()
print("Dataset saved successfully!")
print("datasets/transactions.csv")