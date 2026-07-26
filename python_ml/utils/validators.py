def validate_input(data):

    required_fields = [
        "monthly_income",
        "monthly_budget",
        "category",
        "payment_method",
        "city",
        "day_of_week"
    ]

    valid_payment_methods = [
    "UPI",
    "Cash",
    "Credit Card",
    "Debit Card",
    "Net Banking"
    ]

    valid_days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
    ]

    for field in required_fields:
        if field not in data:
            return f"{field} is required."

    if data["monthly_income"] <= 0:
        return "monthly_income must be greater than 0."

    if data["monthly_budget"] < 0:
        return "monthly_budget cannot be negative."

    if data["payment_method"] not in valid_payment_methods:
        return "Invalid payment method."


    if data["day_of_week"] not in valid_days:
        return "Invalid day of week."

    return None