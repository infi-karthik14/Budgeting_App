"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // LOGIN
    // =====================================================

    const loggedIn = sessionStorage.getItem("loggedIn");
    const userId = sessionStorage.getItem("userId");

    if (loggedIn !== "true" || !userId) {
        window.location.href = "login.html";
        return;
    }

    console.log("Analytics User ID:", userId);


    // =====================================================
    // API
    // =====================================================

    const API_URL =
        "https://budgetingapp-production-a92b.up.railway.app/api/transactions";


    // =====================================================
    // CHART VARIABLES
    // =====================================================

    let barChart = null;
    let pieChart = null;
    let lineChart = null;


    // =====================================================
    // GET TRANSACTION TYPE
    // =====================================================

    function getTransactionType(transaction) {

        const rawType =
            String(transaction.type || "")
                .trim()
                .toLowerCase();

        const category =
            String(transaction.category || "")
                .trim()
                .toLowerCase();


        // Salary is income

        if (
            category === "salary" ||
            category === "salary income"
        ) {
            return "income";
        }


        if (
            rawType === "income" ||
            rawType === "expense"
        ) {
            return rawType;
        }


        return "expense";
    }


    // =====================================================
    // GET DATE
    // =====================================================

    function getTransactionDate(transaction) {

        return (
            transaction.transactionDate ||
            transaction.date ||
            transaction.createdAt ||
            ""
        );
    }


    // =====================================================
    // NORMALIZE DATE
    // =====================================================

    function normalizeDate(value) {

        if (!value) {
            return "";
        }

        return String(value).split("T")[0];
    }

    // =====================================================
    // LOAD TRANSACTIONS
    // =====================================================

    async function loadAnalytics() {

        try {

            console.log("Loading analytics...");


            const response =
                await fetch(
                    `${API_URL}/user/${userId}`
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to load transactions"
                );
            }


            const transactions =
                await response.json();


            console.log(
                "Analytics transactions:",
                transactions
            );


            if (!Array.isArray(transactions)) {

                throw new Error(
                    "Invalid transaction data"
                );
            }


            calculateAnalytics(transactions);


        } catch (error) {

            console.error(
                "ANALYTICS ERROR:",
                error
            );

        }

    }


    // =====================================================
    // CALCULATE ANALYTICS
    // =====================================================

    function calculateAnalytics(transactions) {

        let totalIncome = 0;
        let totalExpense = 0;


        // =================================================
        // MONTHLY DATA
        // =================================================

        const monthlyIncome =
            new Array(12).fill(0);

        const monthlyExpense =
            new Array(12).fill(0);


        // =================================================
        // CATEGORY DATA
        // =================================================

        const categoryExpenses = {};


        // =================================================
        // PROCESS TRANSACTIONS
        // =================================================

        transactions.forEach(function (transaction) {

            const amount =
                Number(transaction.amount) || 0;


            const type =
                getTransactionType(transaction);


            const dateValue =
                getTransactionDate(transaction);


            if (type === "income") {

                totalIncome += amount;

            } else {

                totalExpense += amount;

            }


            // ---------------------------------------------
            // DATE
            // ---------------------------------------------

            if (!dateValue) {
                return;
            }


            const date =
                new Date(
                    normalizeDate(dateValue)
                    + "T00:00:00"
                );


            if (isNaN(date.getTime())) {
                return;
            }


            const month =
                date.getMonth();


            // ---------------------------------------------
            // MONTHLY INCOME / EXPENSE
            // ---------------------------------------------

            if (type === "income") {

                monthlyIncome[month] += amount;

            } else {

                monthlyExpense[month] += amount;


                // Category

                const category =
                    transaction.category ||
                    "Other";


                categoryExpenses[category] =
                    (categoryExpenses[category] || 0)
                    + amount;
            }

        });


        // =================================================
        // SAVINGS
        // =================================================

        const monthlySavings =
            monthlyIncome.map(
                function (income, index) {

                    return (
                        income -
                        monthlyExpense[index]
                    );

                }
            );


        console.log(
            "Monthly Income:",
            monthlyIncome
        );

        console.log(
            "Monthly Expense:",
            monthlyExpense
        );

        console.log(
            "Monthly Savings:",
            monthlySavings
        );


        console.log(
            "Total Income:",
            totalIncome
        );

        console.log(
            "Total Expense:",
            totalExpense
        );


        // =================================================
        // UPDATE SUMMARY
        // =================================================

        updateSummary(
            totalIncome,
            totalExpense
        );


        // =================================================
        // UPDATE CHARTS
        // =================================================

        createBarChart(
            monthlyIncome,
            monthlyExpense
        );


        createPieChart(
            categoryExpenses
        );


        createSavingsChart(
            monthlySavings
        );

    }


    // =====================================================
    // UPDATE SUMMARY
    // =====================================================

    function updateSummary(
        income,
        expense
    ) {

        const savings =
            income - expense;


        const incomeElement =
            document.querySelector(
                ".income-card .amount"
            );


        const expenseElement =
            document.querySelector(
                ".expense-card .amount"
            );


        const savingsElement =
            document.querySelector(
                ".savings-card .amount"
            );


        if (incomeElement) {

            incomeElement.textContent =
                formatCurrency(income);

        }


        if (expenseElement) {

            expenseElement.textContent =
                formatCurrency(expense);

        }


        if (savingsElement) {

            savingsElement.textContent =
                formatCurrency(savings);

        }

    }


    // =====================================================
    // BAR CHART
    // =====================================================

    function createBarChart(
        income,
        expense
    ) {

        const canvas =
            document.getElementById(
                "barChart"
            );


        if (!canvas) {
            return;
        }


        if (barChart) {

            barChart.destroy();

        }


        const months = [

            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"

        ];


        barChart =
            new Chart(
                canvas,
                {

                    type: "bar",

                    data: {

                        labels: months,

                        datasets: [

                            {
                                label: "Income",

                                data: income,

                                backgroundColor:
                                    "#00d26a",

                                borderRadius: 6
                            },

                            {
                                label: "Expense",

                                data: expense,

                                backgroundColor:
                                    "#ff304f",

                                borderRadius: 6
                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        scales: {

                            y: {

                                beginAtZero: true,

                                ticks: {

                                    callback:
                                        function (value) {

                                            return formatCurrency(
                                                value
                                            );

                                        }

                                }

                            }

                        },

                        plugins: {

                            tooltip: {

                                callbacks: {

                                    label:
                                        function (context) {

                                            return (
                                                context.dataset.label
                                                + ": "
                                                + formatCurrency(
                                                    context.raw
                                                )
                                            );

                                        }

                                }

                            }

                        }

                    }

                }
            );

    }


    // =====================================================
    // PIE CHART
    // =====================================================

    function createPieChart(
        categoryExpenses
    ) {

        const canvas =
            document.getElementById(
                "pieChart"
            );


        if (!canvas) {
            return;
        }


        if (pieChart) {

            pieChart.destroy();

        }


        const labels =
            Object.keys(
                categoryExpenses
            );


        const values =
            Object.values(
                categoryExpenses
            );


        pieChart =
            new Chart(
                canvas,
                {

                    type: "doughnut",

                    data: {

                        labels: labels,

                        datasets: [

                            {

                                data: values,

                                backgroundColor: [

                                    "#22c55e",
                                    "#2196f3",
                                    "#ff304f",
                                    "#f59e0b",
                                    "#a35fdb",
                                    "#06b6d4",
                                    "#ec4899",
                                    "#84cc16"

                                ],

                                borderWidth: 0

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {

                                position: "bottom"

                            },

                            tooltip: {

                                callbacks: {

                                    label:
                                        function (context) {

                                            return (
                                                context.label
                                                + ": "
                                                + formatCurrency(
                                                    context.raw
                                                )
                                            );

                                        }

                                }

                            }

                        }

                    }

                }
            );

    }


    // =====================================================
    // MONTHLY SAVINGS CHART
    // =====================================================

    function createSavingsChart(
        savings
    ) {

        const canvas =
            document.getElementById(
                "lineChart"
            );


        if (!canvas) {

            console.error(
                "lineChart canvas not found"
            );

            return;
        }


        if (lineChart) {

            lineChart.destroy();

        }


        const months = [

            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"

        ];


        console.log(
            "Creating savings chart:",
            savings
        );


        lineChart =
            new Chart(
                canvas,
                {

                    type: "line",

                    data: {

                        labels: months,

                        datasets: [

                            {

                                label: "Savings",

                                data: savings,

                                borderColor:
                                    "#22c55e",

                                backgroundColor:
                                    "rgba(34,197,94,0.15)",

                                borderWidth: 3,

                                pointRadius: 5,

                                pointBackgroundColor:
                                    "#22c55e",

                                pointBorderColor:
                                    "#ffffff",

                                pointBorderWidth: 2,

                                fill: true,

                                tension: 0.4

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        interaction: {

                            mode: "index",

                            intersect: false

                        },

                        scales: {

                            y: {

                                beginAtZero: true,

                                ticks: {

                                    callback:
                                        function (value) {

                                            return formatCurrency(
                                                value
                                            );

                                        }

                                }

                            }

                        },

                        plugins: {

                            legend: {

                                display: true,

                                position: "top"

                            },

                            tooltip: {

                                callbacks: {

                                    label:
                                        function (context) {

                                            return (
                                                "Savings: "
                                                + formatCurrency(
                                                    context.raw
                                                )
                                            );

                                        }

                                }

                            }

                        }

                    }

                }
            );

    }


    // =====================================================
    // USER NAME
    // =====================================================

    function loadUserName() {

        const name =
            sessionStorage.getItem("fullName") ||
            sessionStorage.getItem("userName") ||
            localStorage.getItem("userName") ||
            "User";


        const element =
            document.getElementById(
                "userName"
            );


        if (element) {

            element.textContent = name;

        }

    }


    loadUserName();


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    loadAnalytics();


    // =====================================================
    // CURRENCY CHANGE
    // =====================================================

    window.addEventListener(
        "currencyChanged",
        function () {

            loadAnalytics();

        }
    );


    window.addEventListener(
        "storage",
        function (event) {

            if (event.key === "currency") {

                loadAnalytics();

            }

        }
    );

});