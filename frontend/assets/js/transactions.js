document.addEventListener("DOMContentLoaded", function () {

    const tableBody =
        document.getElementById("transactionTableBody");

    const searchInput =
        document.getElementById("searchTransaction");

    const typeFilter =
        document.getElementById("typeFilter");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const monthFilter =
        document.getElementById("monthFilter");


    // =========================================
    // LOAD TRANSACTIONS
    // =========================================

    function getTransactions() {

        return JSON.parse(
            localStorage.getItem("transactions")
        ) || [];

    }


    // =========================================
    // DISPLAY TRANSACTIONS
    // =========================================

    function displayTransactions() {

        const transactions =
            getTransactions();

        tableBody.innerHTML = "";


        // =====================================
        // EMPTY STATE
        // =====================================

        if (transactions.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6"
                        class="text-center py-5 text-muted">

                        <i class="bi bi-receipt"
                           style="font-size:35px;">
                        </i>

                        <br>

                        No transactions found.

                        <br>

                        <a href="add-transaction.html"
                           class="btn btn-primary btn-sm mt-3">

                            <i class="bi bi-plus-circle me-1"></i>

                            Add Transaction

                        </a>

                    </td>
                </tr>
            `;

            updateSummary([]);

            return;
        }


        transactions.forEach(transaction => {

            const row =
                document.createElement("tr");


            // =================================
            // DATE
            // =================================

            const formattedDate =
                formatDate(transaction.date);


            // =================================
            // TYPE
            // =================================

            const typeClass =
                transaction.type === "income"
                    ? "income-tag"
                    : "expense-tag";


            const typeText =
                transaction.type === "income"
                    ? "Income"
                    : "Expense";


            // =================================
            // AMOUNT
            // =================================

            const amount =
                Number(transaction.amount)
                    .toLocaleString("en-IN");


            // =================================
            // ROW
            // =================================

            row.innerHTML = `

                <td>
                    ${formattedDate}
                </td>

                <td>
                    ${escapeHTML(transaction.category)}
                </td>

                <td>

                    <span class="${typeClass}">
                        ${typeText}
                    </span>

                </td>

                <td>
                    ₹${amount}
                </td>

                <td>

                    <span class="badge bg-success">
                        ${transaction.status || "Completed"}
                    </span>

                </td>

                <td>

                    <button
                        type="button"
                        class="btn btn-warning btn-sm edit-btn"
                        data-id="${transaction.id}"
                        title="Edit Transaction">

                        <i class="bi bi-pencil-fill"></i>

                    </button>

                    <button
                        type="button"
                        class="btn btn-danger btn-sm ms-1 delete-btn"
                        data-id="${transaction.id}"
                        title="Delete Transaction">

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        });


        updateSummary(transactions);

        attachActionButtons();

    }


    // =========================================
    // FORMAT DATE
    // =========================================

    function formatDate(dateString) {

        if (!dateString) {
            return "-";
        }

        const date =
            new Date(dateString + "T00:00:00");


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    // =========================================
    // UPDATE SUMMARY
    // =========================================

    function updateSummary(transactions) {

        let income = 0;

        let expense = 0;


        transactions.forEach(transaction => {

            const amount =
                Number(transaction.amount) || 0;


            if (transaction.type === "income") {

                income += amount;

            } else {

                expense += amount;

            }

        });


        const balance =
            income - expense;


        // Find summary cards

        const cards =
            document.querySelectorAll(
                ".dashboard-card"
            );


        if (cards.length >= 4) {

            // Income

            cards[0]
                .querySelector("h2")
                .textContent =
                "₹" +
                income.toLocaleString("en-IN");


            // Expense

            cards[1]
                .querySelector("h2")
                .textContent =
                "₹" +
                expense.toLocaleString("en-IN");


            // Balance

            cards[2]
                .querySelector("h2")
                .textContent =
                "₹" +
                balance.toLocaleString("en-IN");


            // Total transactions

            cards[3]
                .querySelector("h2")
                .textContent =
                transactions.length;

        }

    }


    // =========================================
    // SEARCH + FILTER
    // =========================================

    function filterTransactions() {

        const transactions =
            getTransactions();


        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        const selectedType =
            typeFilter.value;


        const selectedCategory =
            categoryFilter.value;


        const selectedMonth =
            monthFilter.value;


        const filtered =
            transactions.filter(transaction => {

                // Search

                const searchableText = (

                    transaction.category +
                    " " +
                    transaction.type +
                    " " +
                    transaction.description +
                    " " +
                    transaction.paymentMethod

                ).toLowerCase();


                if (
                    search &&
                    !searchableText.includes(search)
                ) {

                    return false;

                }


                // Type

                if (
                    selectedType !== "all" &&
                    transaction.type !== selectedType
                ) {

                    return false;

                }


                // Category

                if (
                    selectedCategory !== "all" &&
                    transaction.category !== selectedCategory
                ) {

                    return false;

                }


                // Month

                if (selectedMonth !== "all") {

                    const date =
                        new Date(
                            transaction.date +
                            "T00:00:00"
                        );


                    const month =
                        date.toLocaleString(
                            "en-US",
                            {
                                month: "long"
                            }
                        );


                    if (month !== selectedMonth) {

                        return false;

                    }

                }


                return true;

            });


        displayFilteredTransactions(filtered);

    }


    // =========================================
    // DISPLAY FILTERED DATA
    // =========================================

    function displayFilteredTransactions(
        transactions
    ) {

        tableBody.innerHTML = "";


        if (transactions.length === 0) {

            tableBody.innerHTML = `

                <tr>

                    <td colspan="6"
                        class="text-center py-5 text-muted">

                        No matching transactions found.

                    </td>

                </tr>

            `;

            updateSummary([]);

            return;

        }


        transactions.forEach(transaction => {

            const row =
                document.createElement("tr");


            const formattedDate =
                formatDate(transaction.date);


            const typeClass =
                transaction.type === "income"
                    ? "income-tag"
                    : "expense-tag";


            const typeText =
                transaction.type === "income"
                    ? "Income"
                    : "Expense";


            const amount =
                Number(transaction.amount)
                    .toLocaleString("en-IN");


            row.innerHTML = `

                <td>
                    ${formattedDate}
                </td>

                <td>
                    ${escapeHTML(transaction.category)}
                </td>

                <td>
                    <span class="${typeClass}">
                        ${typeText}
                    </span>
                </td>

                <td>
                    ₹${amount}
                </td>

                <td>
                    <span class="badge bg-success">
                        ${transaction.status || "Completed"}
                    </span>
                </td>

                <td>

                    <button
                        class="btn btn-warning btn-sm edit-btn"
                        data-id="${transaction.id}">

                        <i class="bi bi-pencil-fill"></i>

                    </button>

                    <button
                        class="btn btn-danger btn-sm ms-1 delete-btn"
                        data-id="${transaction.id}">

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        });


        updateSummary(transactions);

        attachActionButtons();

    }


    // =========================================
    // EDIT + DELETE
    // =========================================

    function attachActionButtons() {

        const deleteButtons =
            document.querySelectorAll(
                ".delete-btn"
            );


        deleteButtons.forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(this.dataset.id);


                    if (
                        !confirm(
                            "Delete this transaction?"
                        )
                    ) {

                        return;

                    }


                    let transactions =
                        getTransactions();


                    transactions =
                        transactions.filter(
                            transaction =>
                                transaction.id !== id
                        );


                    localStorage.setItem(
                        "transactions",
                        JSON.stringify(transactions)
                    );


                    filterTransactions();

                }
            );

        });


        const editButtons =
            document.querySelectorAll(
                ".edit-btn"
            );


        editButtons.forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(this.dataset.id);


                    const transactions =
                        getTransactions();


                    const transaction =
                        transactions.find(
                            item =>
                                item.id === id
                        );


                    if (!transaction) {
                        return;
                    }


                    localStorage.setItem(
                        "editTransaction",
                        JSON.stringify(transaction)
                    );


                    window.location.href =
                        "add-transaction.html?edit=" + id;

                }
            );

        });

    }


    // =========================================
    // SEARCH EVENTS
    // =========================================

    searchInput.addEventListener(
        "input",
        filterTransactions
    );


    typeFilter.addEventListener(
        "change",
        filterTransactions
    );


    categoryFilter.addEventListener(
        "change",
        filterTransactions
    );


    monthFilter.addEventListener(
        "change",
        filterTransactions
    );


    // =========================================
    // PROFILE
    // =========================================

    const profileImage =
        localStorage.getItem("profileImage");

    const userName =
        localStorage.getItem("userName");


    if (profileImage) {

        const image =
            document.getElementById(
                "profileImage"
            );

        if (image) {

            image.src = profileImage;

        }

    }


    if (userName) {

        const name =
            document.getElementById(
                "userName"
            );

        if (name) {

            name.textContent = userName;

        }

    }


    // =========================================
    // HTML SAFETY
    // =========================================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value || "";

        return div.innerHTML;

    }


    // =========================================
    // INITIAL LOAD
    // =========================================

    displayTransactions();

});