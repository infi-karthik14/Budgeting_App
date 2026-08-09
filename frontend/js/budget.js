// ===============================
// Budget vs Spent Bar Chart
// ===============================

const budgetChart = document.getElementById("budgetChart");

if (budgetChart) {

    new Chart(budgetChart, {

        type: "bar",

        data: {

            labels: [
                "Food",
                "Shopping",
                "Travel",
                "Bills",
                "Entertainment"
            ],

            datasets: [

                {
                    label: "Budget",

                    data: [
                        10000,
                        6000,
                        5000,
                        4000,
                        3000
                    ],

                    backgroundColor: "#2563eb",

                    borderRadius: 10
                },

                {
                    label: "Spent",

                    data: [
                        8000,
                        3200,
                        2500,
                        3900,
                        1800
                    ],

                    backgroundColor: "#22c55e",

                    borderRadius: 10
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "top"

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}


// ===============================
// Budget Distribution Doughnut Chart
// ===============================

const pieChart = document.getElementById("pieChart");

if (pieChart) {

    new Chart(pieChart, {

        type: "doughnut",

        data: {

            labels: [

                "Food",
                "Shopping",
                "Travel",
                "Bills",
                "Entertainment"

            ],

            datasets: [

                {

                    data: [

                        8000,
                        3200,
                        2500,
                        3900,
                        1800

                    ],

                    backgroundColor: [

                        "#22c55e",
                        "#2563eb",
                        "#f59e0b",
                        "#ef4444",
                        "#8b5cf6"

                    ],

                    borderWidth: 0

                }

            ]

        },

        options: {

            responsive: true,

            cutout: "65%",

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}

const profileImage = localStorage.getItem("profileImage");
const userName = localStorage.getItem("userName");

if(profileImage){
    document.getElementById("profileImage").src = profileImage;
}

if(userName){
    document.getElementById("userName").textContent = userName;
}

function saveBudget() {
    alert("Budget Saved!");
}