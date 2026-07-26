import pandas as pd
import joblib

# Load the trained model and encoders
model = joblib.load('models/expense_model.pkl')
encoders = joblib.load('models/encoders.pkl')

def predict_expense(data):
    print("Received data for prediction:", data)

    category = encoders["category"].transform([data["category"]])[0]
    payment_method = encoders["payment_method"].transform([data["payment_method"]])[0]
    city = encoders["city"].transform([data["city"]])[0]
    day = encoders["day_of_week"].transform([data["day_of_week"]])[0]

    input_data = pd.DataFrame([{
        "monthly_income": data["monthly_income"],
        "monthly_budget": data["monthly_budget"],
        "category": category,
        "payment_method": payment_method,
        "city": city,
        "day_of_week": day
    }])

    prediction = model.predict(input_data)
    return float(prediction[0])