# Expense Prediction ML API

## Overview

This project is a Python Flask API that predicts the expense amount based on user details using a Machine Learning model.

The model is trained using transaction data and can be integrated with a Java Spring Boot backend for the Budgeting App.

---

## Features

- Predict expense amount
- Machine Learning using Random Forest Regressor
- REST API using Flask
- Input validation
- Error handling
- Health check endpoint

---

## Technologies Used

- Python 3.x
- Flask
- Pandas
- Scikit-learn
- Joblib

---

## Folder Structure

```
python_ml/
│── app.py
│── predict.py
│── preprocess.py
│── train_model.py
│── generate_dataset.py
│── requirements.txt
│── README.md
│
├── datasets/
│   ├── expenses.csv
│   └── transactions.csv
│
└── models/
    ├── expense_model.pkl
    └── encoders.pkl
```

---

## Installation

Install the required packages:

```bash
pip install -r requirements.txt
```

---

## Train the Model

```bash
python train_model.py
```

This creates:

- expense_model.pkl
- encoders.pkl

inside the **models** folder.

---

## Run the API

```bash
python app.py
```

The server starts at:

```
http://127.0.0.1:5000
```

---

## API Endpoints

### Predict Expense

**POST**

```
/predict-expense
```

Example Request:

```json
{
    "monthly_income": 50000,
    "monthly_budget": 40000,
    "category": "Food",
    "payment_method": "UPI",
    "city": "Lucknow",
    "day_of_week": "Monday"
}
```

Example Response:

```json
{
    "predicted_expense": 790.26
}
```

---

### Health Check

**GET**

```
/health
```

Example Response:

```json
{
    "status": "running",
    "message": "Expense Prediction API is working"
}
```

---

## Future Improvements

- Integrate with Spring Boot backend
- Store predictions in MySQL
- User authentication
- Expense analytics dashboard
- Budget recommendation system

---