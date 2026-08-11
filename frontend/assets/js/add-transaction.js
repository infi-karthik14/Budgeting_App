document.addEventListener("DOMContentLoaded", function () {


    // =========================================
    // ELEMENTS
    // =========================================

    const form =
        document.getElementById("transactionForm");

    const type =
        document.getElementById("transactionType");

    const category =
        document.getElementById("category");

    const amount =
        document.getElementById("amount");

    const date =
        document.getElementById("transactionDate");

    const paymentMethod =
        document.getElementById("paymentMethod");

    const description =
        document.getElementById("description");

    const message =
        document.getElementById("transactionMessage");



    // =========================================
    // TODAY'S DATE
    // =========================================

    const today =
        new Date();

    const formattedDate =
        today.toISOString().split("T")[0];

    date.value =
        formattedDate;



    // =========================================
    // CHECK EDIT MODE
    // =========================================

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const editId =
        urlParams.get("edit");


    const editTransaction =
        JSON.parse(
            localStorage.getItem(
                "editTransaction"
            )
        );



    // =========================================
    // LOAD EDIT TRANSACTION
    // =========================================

    if (editTransaction && editId) {

        type.value =
            editTransaction.type;

        category.value =
            editTransaction.category;

        amount.value =
            editTransaction.amount;

        date.value =
            editTransaction.date;

        paymentMethod.value =
            editTransaction.paymentMethod;

        description.value =
            editTransaction.description || "";


        // Apply type color

        type.classList.remove(
            "income-selected",
            "expense-selected"
        );


        if (type.value === "income") {

            type.classList.add(
                "income-selected"
            );

        }


        if (type.value === "expense") {

            type.classList.add(
                "expense-selected"
            );

        }


        // Change title

        const title =
            document.getElementById(
                "transactionPageTitle"
            );

        if (title) {

            title.textContent =
                "Edit Transaction";

        }


        // Change button

        const button =
            form.querySelector(
                ".save-transaction-btn span"
            );

        if (button) {

            button.textContent =
                "Update Transaction";

        }

    }



    // =========================================
    // TYPE CHANGE
    // =========================================

    type.addEventListener(
        "change",
        function () {

            type.classList.remove(
                "income-selected",
                "expense-selected"
            );


            if (this.value === "income") {

                type.classList.add(
                    "income-selected"
                );

            }


            if (this.value === "expense") {

                type.classList.add(
                    "expense-selected"
                );

            }

        }
    );



    // =========================================
    // FORM SUBMIT
    // =========================================

    form.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            message.textContent = "";

            message.className =
                "transaction-message";



            // =================================
            // VALUES
            // =================================

            const transactionType =
                type.value;

            const transactionCategory =
                category.value;

            const transactionAmount =
                Number(amount.value);

            const transactionDate =
                date.value;

            const transactionPaymentMethod =
                paymentMethod.value;

            const transactionDescription =
                description.value.trim();



            // =================================
            // VALIDATION
            // =================================

            if (!transactionType) {

                showError(
                    "Please select transaction type."
                );

                return;

            }


            if (!transactionCategory) {

                showError(
                    "Please select a category."
                );

                return;

            }


            if (
                !transactionAmount ||
                transactionAmount <= 0
            ) {

                showError(
                    "Please enter a valid amount."
                );

                return;

            }


            if (!transactionDate) {

                showError(
                    "Please select a date."
                );

                return;

            }


            if (!transactionPaymentMethod) {

                showError(
                    "Please select a payment method."
                );

                return;

            }



            // =================================
            // GET EXISTING TRANSACTIONS
            // =================================

            let transactions =
                JSON.parse(
                    localStorage.getItem(
                        "transactions"
                    )
                ) || [];



            // =================================
            // EDIT EXISTING
            // =================================

            if (
                editTransaction &&
                editId
            ) {

                const index =
                    transactions.findIndex(
                        transaction =>
                            transaction.id ===
                            Number(editId)
                    );


                if (index !== -1) {

                    transactions[index] = {

                        ...transactions[index],

                        type:
                            transactionType,

                        category:
                            transactionCategory,

                        amount:
                            transactionAmount,

                        date:
                            transactionDate,

                        paymentMethod:
                            transactionPaymentMethod,

                        description:
                            transactionDescription

                    };

                }

            }


            // =================================
            // ADD NEW
            // =================================

            else {

                const transaction = {

                    id:
                        Date.now(),

                    type:
                        transactionType,

                    category:
                        transactionCategory,

                    amount:
                        transactionAmount,

                    date:
                        transactionDate,

                    paymentMethod:
                        transactionPaymentMethod,

                    description:
                        transactionDescription,

                    status:
                        "Completed",

                    createdAt:
                        new Date().toISOString()

                };


                transactions.push(
                    transaction
                );

            }



            // =================================
            // SAVE
            // =================================

            localStorage.setItem(
                "transactions",
                JSON.stringify(
                    transactions
                )
            );


            // Remove temporary edit data

            localStorage.removeItem(
                "editTransaction"
            );



            // =================================
            // SUCCESS
            // =================================

            message.textContent =
                editTransaction && editId
                    ? "Transaction updated successfully!"
                    : "Transaction added successfully!";


            message.classList.add(
                "success"
            );



            // =================================
            // REDIRECT
            // =================================

            setTimeout(
                function () {

                    window.location.href =
                        "transactions.html";

                },
                1000
            );

        }
    );



    // =========================================
    // ERROR FUNCTION
    // =========================================

    function showError(text) {

        message.textContent =
            text;

        message.classList.add(
            "error"
        );

    }



    // =========================================
    // LOAD USER NAME
    // =========================================

    const userName =
        localStorage.getItem(
            "userName"
        );


    if (userName) {

        const name =
            document.getElementById(
                "userName"
            );

        if (name) {

            name.textContent =
                userName;

        }

    }

});