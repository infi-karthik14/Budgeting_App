from flask import Flask, request, jsonify
from predict import predict_expense

app = Flask(__name__)

# STEP 1: Add the validation function here
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


@app.route("/predict-expense", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        error = validate_input(data)

        if error:
            return jsonify({"error": error}), 400

        prediction = predict_expense(data)

        return jsonify({
            "predicted_expense": round(prediction, 2)
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "running",
        "message": "Expense Prediction API is working"
    })

if __name__ == '__main__':
    app.run(debug=True)