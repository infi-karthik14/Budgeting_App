# =========================================================
# BACHAT BUDDY - EXPENSE PREDICTION
# Random Forest ML Prediction
# =========================================================

import os
import pandas as pd
import joblib


# =========================================================
# MODEL PATHS
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "expense_model.pkl"
)

ENCODER_PATH = os.path.join(
    BASE_DIR,
    "models",
    "encoders.pkl"
)


# =========================================================
# LOAD MODEL
# =========================================================

try:

    model = joblib.load(MODEL_PATH)

    print("✅ Expense model loaded successfully.")

except Exception as e:

    print("❌ Unable to load expense model.")

    raise RuntimeError(
        f"Model loading failed: {e}"
    )


# =========================================================
# LOAD ENCODERS
# =========================================================

try:

    encoders = joblib.load(ENCODER_PATH)

    print("✅ Encoders loaded successfully.")

except Exception as e:

    print("❌ Unable to load encoders.")

    raise RuntimeError(
        f"Encoder loading failed: {e}"
    )


# =========================================================
# MODEL FEATURES
# =========================================================

FEATURES = [

    "monthly_income",

    "monthly_budget",

    "category",

    "payment_method",

    "city",

    "day_of_week"

]


# =========================================================
# ENCODE VALUE SAFELY
# =========================================================

def encode_value(encoder, value, field_name):

    value = str(value).strip()

    # -----------------------------------------------------
    # Check whether value exists in trained encoder
    # -----------------------------------------------------

    if value not in encoder.classes_:

        raise ValueError(
            f"Unknown {field_name}: '{value}'. "
            f"Supported values are: "
            f"{', '.join(map(str, encoder.classes_))}"
        )

    return encoder.transform([value])[0]


# =========================================================
# PREDICT EXPENSE
# =========================================================

def predict_expense(data):

    print(
        "Received data for prediction:",
        data
    )


    # =====================================================
    # CONVERT NUMERIC VALUES
    # =====================================================

    try:

        monthly_income = float(
            data["monthly_income"]
        )

        monthly_budget = float(
            data["monthly_budget"]
        )

    except (ValueError, TypeError) as e:

        raise ValueError(
            "monthly_income and monthly_budget "
            "must be valid numbers."
        ) from e


    # =====================================================
    # ENCODE CATEGORY
    # =====================================================

    category = encode_value(

        encoders["category"],

        data["category"],

        "category"

    )


    # =====================================================
    # ENCODE PAYMENT METHOD
    # =====================================================

    payment_method = encode_value(

        encoders["payment_method"],

        data["payment_method"],

        "payment method"

    )


    # =====================================================
    # ENCODE CITY
    # =====================================================

    city = encode_value(

        encoders["city"],

        data["city"],

        "city"

    )


    # =====================================================
    # ENCODE DAY
    # =====================================================

    day = encode_value(

        encoders["day_of_week"],

        data["day_of_week"],

        "day of week"

    )


    # =====================================================
    # CREATE MODEL INPUT
    # =====================================================

    input_data = pd.DataFrame([{

        "monthly_income":
            monthly_income,

        "monthly_budget":
            monthly_budget,

        "category":
            category,

        "payment_method":
            payment_method,

        "city":
            city,

        "day_of_week":
            day

    }])


    # =====================================================
    # ENSURE FEATURE ORDER
    # =====================================================

    input_data = input_data[FEATURES]


    # =====================================================
    # DEBUG
    # =====================================================

    print(
        "Model input:"
    )

    print(input_data)


    # =====================================================
    # MAKE PREDICTION
    # =====================================================

    prediction = model.predict(
        input_data
    )


    predicted_expense = float(
        prediction[0]
    )


    # =====================================================
    # PREVENT NEGATIVE PREDICTION
    # =====================================================

    predicted_expense = max(
        0,
        predicted_expense
    )


    # =====================================================
    # RETURN RESULT
    # =====================================================

    print(
        "Predicted expense:",
        predicted_expense
    )


    return predicted_expense