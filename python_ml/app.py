import os

from flask import Flask, request, jsonify
from flask_cors import CORS

from predict import predict_expense
from utils.validators import validate_input

app = Flask(__name__)

# Allow frontend to call Flask API
CORS(app)


@app.route("/predict-expense", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Request body is required."
            }), 400

        error = validate_input(data)

        if error:
            return jsonify({
                "error": error
            }), 400

        prediction = predict_expense(data)

        return jsonify({
            "predicted_expense": round(prediction, 2)
        })

    except Exception as e:

        print("Prediction error:", e)

        return jsonify({
            "error": str(e)
        }), 500


@app.route("/health", methods=["GET"])
def health():

    return jsonify({
        "status": "running",
        "message": "Expense Prediction API is working"
    })


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False
    )