from flask import Flask, request, jsonify
from predict import predict_expense
from utils.validators import validate_input

app = Flask(__name__)

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