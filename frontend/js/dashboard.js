// ===============================
// Income vs Expense Line Chart
// ===============================

const lineChart = document.getElementById("lineChart");

new Chart(lineChart, {
    type: "line",
    data: {
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun"
        ],

        datasets: [

            {
                label: "Income",

                data: [
                    30000,
                    40000,
                    35000,
                    45000,
                    50000,
                    55000
                ],

                borderColor: "#198754",

                backgroundColor: "rgba(25,135,84,.2)",

                borderWidth: 3,

                tension: .4,

                fill: true

            },

            {

                label: "Expense",

                data: [
                    15000,
                    18000,
                    17000,
                    20000,
                    22000,
                    25000
                ],

                borderColor: "#dc3545",

                backgroundColor: "rgba(220,53,69,.2)",

                borderWidth: 3,

                tension: .4,

                fill: true

            }

        ]
    },

    options: {

        responsive: true,

        plugins: {

            legend: {

                position: "top"

            }

        }

    }

});


// ===============================
// Expense Category Pie Chart
// ===============================

const pieChart = document.getElementById("pieChart");

new Chart(pieChart, {

    type: "pie",

    data: {

        labels: [

            "Food",
            "Shopping",
            "Transport",
            "Bills",
            "Others"

        ],

        datasets: [{

            data: [

                12000,
                8000,
                5000,
                10000,
                3000

            ],

            backgroundColor: [

                "#0d6efd",
                "#198754",
                "#ffc107",
                "#dc3545",
                "#6f42c1"

            ]

        }]

    },

    options: {

        responsive: true,

        plugins: {

            legend: {

                position: "bottom"

            }

        }

    }

});


// ===============================
// Monthly Savings Bar Chart
// ===============================

const barChart = document.getElementById("barChart");

new Chart(barChart, {

    type: "bar",

    data: {

        labels: [

            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun"

        ],

        datasets: [{

            label: "Savings",

            data: [

                15000,
                22000,
                18000,
                25000,
                28000,
                30000

            ],

            backgroundColor: [

                "#0d6efd",
                "#198754",
                "#ffc107",
                "#17a2b8",
                "#6f42c1",
                "#fd7e14"

            ],

            borderRadius: 8

        }]

    },

    options: {

        responsive: true,

        scales: {

            y: {

                beginAtZero: true

            }

        },

        plugins: {

            legend: {

                display: false

            }

        }

    }

});
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
        themeToggle.innerHTML = "☀️";
    } else {
        themeToggle.innerHTML = "🌙";
    }
});