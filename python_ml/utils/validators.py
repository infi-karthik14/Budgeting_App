# =========================================================
# VALIDATE ML INPUT
# =========================================================

def validate_input(data):

    required_fields = [

        "monthly_income",

        "monthly_budget",

        "category",

        "payment_method",

        "city",

        "day_of_week"
    ]


    # =====================================================
    # VALID PAYMENT METHODS
    # =====================================================

    valid_payment_methods = [

        "UPI",

        "Cash",

        "Credit Card",

        "Debit Card",

        "Net Banking"
    ]


    # =====================================================
    # VALID DAYS
    # =====================================================

    valid_days = [

        "Monday",

        "Tuesday",

        "Wednesday",

        "Thursday",

        "Friday",

        "Saturday",

        "Sunday"
    ]


    # =====================================================
    # CHECK REQUIRED FIELDS
    # =====================================================

    for field in required_fields:

        if field not in data:

            return f"{field} is required."


    # =====================================================
    # CHECK NUMERIC VALUES
    # =====================================================

    try:

        monthly_income = float(
            data["monthly_income"]
        )

        monthly_budget = float(
            data["monthly_budget"]
        )

    except (ValueError, TypeError):

        return (
            "monthly_income and monthly_budget "
            "must be numbers."
        )


    # =====================================================
    # INCOME VALIDATION
    # =====================================================

    if monthly_income <= 0:

        return (
            "monthly_income must be greater than 0."
        )


    # =====================================================
    # BUDGET VALIDATION
    # =====================================================

    if monthly_budget < 0:

        return (
            "monthly_budget cannot be negative."
        )


    # =====================================================
    # CATEGORY VALIDATION
    # =====================================================

    if not str(data["category"]).strip():

        return "Category cannot be empty."


    # =====================================================
    # PAYMENT METHOD VALIDATION
    # =====================================================

    if data["payment_method"] not in valid_payment_methods:

        return "Invalid payment method."


    # =====================================================
    # CITY VALIDATION
    # =====================================================

    if not str(data["city"]).strip():

        return "City cannot be empty."


    # =====================================================
    # DAY VALIDATION
    # =====================================================

    if data["day_of_week"] not in valid_days:

        return "Invalid day of week."


    # =====================================================
    # EVERYTHING OK
    # =====================================================

    return None