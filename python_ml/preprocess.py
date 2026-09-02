# =========================================================
# BACHAT BUDDY - DATA PREPROCESSING
# =========================================================

import os
import pandas as pd
from sklearn.preprocessing import LabelEncoder


# =========================================================
# DATASET PATH
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "datasets",
    "transactions.csv"
)


# =========================================================
# REQUIRED COLUMNS
# =========================================================

REQUIRED_COLUMNS = [

    "transaction_type",

    "amount",

    "monthly_income",

    "monthly_budget",

    "category",

    "payment_method",

    "city",

    "day_of_week"

]


# =========================================================
# CATEGORICAL COLUMNS
# =========================================================

CATEGORICAL_COLUMNS = [

    "category",

    "payment_method",

    "city",

    "day_of_week"

]


# =========================================================
# LOAD AND PREPROCESS
# =========================================================

def load_and_preprocess():

    print(
        "Loading dataset from:",
        DATASET_PATH
    )


    # =====================================================
    # LOAD DATASET
    # =====================================================

    if not os.path.exists(DATASET_PATH):

        raise FileNotFoundError(
            f"Dataset not found: {DATASET_PATH}"
        )


    df = pd.read_csv(
        DATASET_PATH
    )


    print(
        "Dataset loaded successfully."
    )

    print(
        "Total records:",
        len(df)
    )


    # =====================================================
    # CHECK REQUIRED COLUMNS
    # =====================================================

    missing_columns = [

        column

        for column in REQUIRED_COLUMNS

        if column not in df.columns

    ]


    if missing_columns:

        raise ValueError(
            "Missing required columns: "
            + ", ".join(missing_columns)
        )


    # =====================================================
    # REMOVE MISSING VALUES
    # =====================================================

    df = df.dropna(
        subset=REQUIRED_COLUMNS
    ).copy()


    # =====================================================
    # KEEP ONLY EXPENSE TRANSACTIONS
    # =====================================================

    df["transaction_type"] = (
        df["transaction_type"]
        .astype(str)
        .str.strip()
    )


    df = df[
        df["transaction_type"].str.lower()
        == "expense"
    ].copy()


    if df.empty:

        raise ValueError(
            "No expense transactions found "
            "in the dataset."
        )


    # =====================================================
    # CONVERT NUMERIC COLUMNS
    # =====================================================

    numeric_columns = [

        "amount",

        "monthly_income",

        "monthly_budget"

    ]


    for column in numeric_columns:

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )


    # =====================================================
    # REMOVE INVALID NUMERIC RECORDS
    # =====================================================

    df = df.dropna(
        subset=numeric_columns
    ).copy()


    # =====================================================
    # REMOVE INVALID AMOUNTS
    # =====================================================

    df = df[
        df["amount"] > 0
    ].copy()


    df = df[
        df["monthly_income"] > 0
    ].copy()


    df = df[
        df["monthly_budget"] >= 0
    ].copy()


    # =====================================================
    # CLEAN CATEGORICAL VALUES
    # =====================================================

    for column in CATEGORICAL_COLUMNS:

        df[column] = (
            df[column]
            .astype(str)
            .str.strip()
        )


    # =====================================================
    # ENCODERS
    # =====================================================

    encoders = {}


    for column in CATEGORICAL_COLUMNS:

        encoder = LabelEncoder()


        df[column] = encoder.fit_transform(
            df[column]
        )


        encoders[column] = encoder


        print(
            f"\n{column} categories:"
        )

        print(
            list(encoder.classes_)
        )


    # =====================================================
    # RESET INDEX
    # =====================================================

    df.reset_index(
        drop=True,
        inplace=True
    )


    # =====================================================
    # FINAL INFORMATION
    # =====================================================

    print(
        "\n=========================================="
    )

    print(
        "PREPROCESSING COMPLETED"
    )

    print(
        "=========================================="
    )

    print(
        "Expense records:",
        len(df)
    )

    print(
        "Features:",
        [
            "monthly_income",
            "monthly_budget",
            "category",
            "payment_method",
            "city",
            "day_of_week"
        ]
    )


    return df, encoders