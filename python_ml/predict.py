import pandas as pd
import joblib


# =========================================================
# LOAD MODEL AND ENCODERS
# =========================================================

model = joblib.load("models/expense_model.pkl")

encoders = joblib.load("models/encoders.pkl")


# =========================================================
# PREDICT EXPENSE
# =========================================================

def predict_expense(data):

    print("Received data for prediction:", data)

    # -----------------------------------------------------
    # Encode category
    # -----------------------------------------------------

    category = encoders["category"].transform(
        [data["category"]]
    )[0]

    # -----------------------------------------------------
    # Encode payment method
    # -----------------------------------------------------

    payment_method = encoders["payment_method"].transform(
        [data["payment_method"]]
    )[0]

    # -----------------------------------------------------
    # Encode city
    # -----------------------------------------------------

    city = encoders["city"].transform(
        [data["city"]]
    )[0]

    # -----------------------------------------------------
    # Encode day of week
    # -----------------------------------------------------

    day = encoders["day_of_week"].transform(
        [data["day_of_week"]]
    )[0]

    # -----------------------------------------------------
    # CREATE MODEL INPUT
    # -----------------------------------------------------

    input_data = pd.DataFrame([{

        "monthly_income": float(
            data["monthly_income"]
        ),

        "monthly_budget": float(
            data["monthly_budget"]
        ),

        "category": category,

        "payment_method": payment_method,

        "city": city,

        "day_of_week": day
    }])

    print("Model input:")
    print(input_data)

    # -----------------------------------------------------
    # PREDICTION
    # -----------------------------------------------------

    prediction = model.predict(input_data)

    return float(prediction[0])