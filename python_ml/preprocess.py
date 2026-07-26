import pandas as pd
from sklearn.preprocessing import LabelEncoder

def load_and_preprocess():

    # Load dataset
    df = pd.read_csv("datasets/transactions.csv")

    # Keep only expense transactions
    df = df[df["transaction_type"] == "Expense"]

    # Encode categorical columns
    encoders = {}

    categorical_columns = [
        "category",
        "payment_method",
        "city",
        "day_of_week"
    ]

    for column in categorical_columns:
        encoder = LabelEncoder()
        df[column] = encoder.fit_transform(df[column])
        encoders[column] = encoder

    return df, encoders