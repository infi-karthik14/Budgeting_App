from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from sklearn.ensemble import RandomForestRegressor
import joblib

from preprocess import load_and_preprocess

# Load the dataset
df, encoders = load_and_preprocess()

# Features Variables
X = df[[
    "monthly_income",
    "monthly_budget",
    "category",
    "payment_method",
    "city",
    "day_of_week"
]]

# Target variable
y = df["amount"]

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict 
predictions = model.predict(X_test)

# Accuracy
mae = mean_absolute_error(y_test, predictions)

print(f"Mean Absolute Error: {mae:2f}")

# Save the model
joblib.dump(model, 'models/expense_model.pkl')
joblib.dump(encoders, 'models/encoders.pkl')

print("Advanced model trained and saved successfully!")