# =========================================================
# BACHAT BUDDY - ML INPUT VALIDATOR
# =========================================================

# =========================================================
# VALID PAYMENT METHODS
# =========================================================

VALID_PAYMENT_METHODS = [

    "UPI",

    "Cash",

    "Credit Card",

    "Debit Card",

    "Net Banking"

]


# =========================================================
# VALID DAYS
# =========================================================

VALID_DAYS = [

    "Monday",

    "Tuesday",

    "Wednesday",

    "Thursday",

    "Friday",

    "Saturday",

    "Sunday"

]


# =========================================================
# VALID CATEGORIES
# =========================================================

VALID_CATEGORIES = [

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

]


# =========================================================
# VALID CITIES
# =========================================================

VALID_CITIES = [

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


# =========================================================
# VALIDATE ML INPUT
# =========================================================

def validate_input(data):

    # =====================================================
    # REQUIRED FIELDS
    # =====================================================

    required_fields = [

        "monthly_income",

        "monthly_budget",

        "category",

        "payment_method",

        "city",

        "day_of_week"

    ]


    # =====================================================
    # CHECK REQUIRED FIELDS
    # =====================================================

    for field in required_fields:

        if field not in data:

            return f"{field} is required."


        if data[field] is None:

            return f"{field} cannot be null."


    # =====================================================
    # NUMERIC VALIDATION
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
    # CHECK FINITE NUMBERS
    # =====================================================

    if not (
        monthly_income ==
        monthly_income
    ):

        return (
            "monthly_income must be a valid number."
        )


    if not (
        monthly_budget ==
        monthly_budget
    ):

        return (
            "monthly_budget must be a valid number."
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
    # BUDGET VS INCOME
    # =====================================================

    if monthly_budget > monthly_income:

        return (
            "monthly_budget cannot be greater "
            "than monthly_income."
        )


    # =====================================================
    # CATEGORY VALIDATION
    # =====================================================

    category = str(
        data["category"]
    ).strip()


    if not category:

        return (
            "Category cannot be empty."
        )


    if category not in VALID_CATEGORIES:

        return (
            "Invalid category. "
            "Supported categories are: "
            + ", ".join(VALID_CATEGORIES)
        )


    # =====================================================
    # PAYMENT METHOD VALIDATION
    # =====================================================

    payment_method = str(
        data["payment_method"]
    ).strip()


    if payment_method not in VALID_PAYMENT_METHODS:

        return (
            "Invalid payment method."
        )


    # =====================================================
    # CITY VALIDATION
    # =====================================================

    city = str(
        data["city"]
    ).strip()


    if not city:

        return (
            "City cannot be empty."
        )


    if city not in VALID_CITIES:

        return (
            "Invalid city. "
            "Supported cities are: "
            + ", ".join(VALID_CITIES)
        )


    # =====================================================
    # DAY VALIDATION
    # =====================================================

    day_of_week = str(
        data["day_of_week"]
    ).strip()


    if day_of_week not in VALID_DAYS:

        return (
            "Invalid day of week."
        )


    # =====================================================
    # EVERYTHING VALID
    # =====================================================

    return None