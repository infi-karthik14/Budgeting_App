# =========================================================
# BACHAT BUDDY - ML MODEL TRAINING
# Random Forest Expense Prediction
# =========================================================

import os
import joblib

from sklearn.model_selection import train_test_split

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

from sklearn.ensemble import RandomForestRegressor

from preprocess import load_and_preprocess


# =========================================================
# DIRECTORIES
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)


# =========================================================
# CREATE MODEL DIRECTORY
# =========================================================

os.makedirs(
    MODEL_DIR,
    exist_ok=True
)


# =========================================================
# LOAD DATA
# =========================================================

print(
    "\n=========================================="
)

print(
    "Loading and preprocessing dataset..."
)

print(
    "=========================================="
)


df, encoders = load_and_preprocess()


# =========================================================
# CHECK DATASET
# =========================================================

if df.empty:

    raise ValueError(
        "No expense data available "
        "for training."
    )


print(
    f"Total expense records: {len(df)}"
)


# =========================================================
# FEATURES
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
# CHECK FEATURES
# =========================================================

missing_features = [

    column

    for column in FEATURES

    if column not in df.columns

]


if missing_features:

    raise ValueError(
        "Missing required features: "
        + ", ".join(missing_features)
    )


# =========================================================
# CREATE X AND Y
# =========================================================

X = df[FEATURES]

y = df["amount"]


# =========================================================
# TRAIN / TEST SPLIT
# =========================================================

X_train, X_test, y_train, y_test = train_test_split(

    X,

    y,

    test_size=0.20,

    random_state=42

)


print(
    f"Training records: {len(X_train)}"
)

print(
    f"Testing records: {len(X_test)}"
)


# =========================================================
# CREATE RANDOM FOREST MODEL
# =========================================================

print(
    "\nTraining Random Forest model..."
)


model = RandomForestRegressor(

    n_estimators=200,

    max_depth=None,

    min_samples_split=2,

    min_samples_leaf=1,

    random_state=42,

    n_jobs=-1

)


# =========================================================
# TRAIN MODEL
# =========================================================

model.fit(

    X_train,

    y_train

)


print(
    "✅ Model training completed."
)


# =========================================================
# PREDICTION
# =========================================================

predictions = model.predict(
    X_test
)


# =========================================================
# MODEL EVALUATION
# =========================================================

mae = mean_absolute_error(

    y_test,

    predictions

)


mse = mean_squared_error(

    y_test,

    predictions

)


rmse = mse ** 0.5


r2 = r2_score(

    y_test,

    predictions

)


# =========================================================
# DISPLAY RESULTS
# =========================================================

print(
    "\n=========================================="
)

print(
    "MODEL PERFORMANCE"
)

print(
    "=========================================="
)

print(
    f"MAE  : {mae:.2f}"
)

print(
    f"RMSE : {rmse:.2f}"
)

print(
    f"R²   : {r2:.4f}"
)


# =========================================================
# SAVE MODEL
# =========================================================

MODEL_PATH = os.path.join(

    MODEL_DIR,

    "expense_model.pkl"

)


ENCODER_PATH = os.path.join(

    MODEL_DIR,

    "encoders.pkl"

)


joblib.dump(

    model,

    MODEL_PATH

)


joblib.dump(

    encoders,

    ENCODER_PATH

)


# =========================================================
# SUCCESS
# =========================================================

print(
    "\n=========================================="
)

print(
    "MODEL SAVED SUCCESSFULLY"
)

print(
    "=========================================="
)

print(
    f"Model   : {MODEL_PATH}"
)

print(
    f"Encoder : {ENCODER_PATH}"
)

print(
    "\n✅ Advanced Random Forest expense model "
    "trained and saved successfully!"
)