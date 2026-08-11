// ==========================================
// ANALYTICS DATA
// ==========================================

let analyticsData = {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

    income: [
        3500,
        4200,
        5000,
        4500,
        5300,
        6100
    ],

    expense: [
        2100,
        2500,
        3100,
        2800,
        3300,
        3900
    ],

    savings: [
        1400,
        1700,
        1900,
        1700,
        2000,
        2200
    ],

    categories: [
        "Food",
        "Travel",
        "Shopping",
        "Bills",
        "Entertainment"
    ],

    categoryExpenses: [
        1200,
        800,
        950,
        1400,
        600
    ]
};


// ==========================================
// ANALYTICS DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // LOAD PROFILE DATA
    // ==========================================

    const profileImage = localStorage.getItem("profileImage");
    const userName = localStorage.getItem("userName");

    const imageElement = document.getElementById("profileImage");
    const nameElement = document.getElementById("userName");

    if (profileImage && imageElement) {
        imageElement.src = profileImage;
    }

    if (userName && nameElement) {
        nameElement.textContent = userName;
    }


    // ==========================================
    // COMMON CHART OPTIONS
    // ==========================================

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: "top",

                labels: {
                    usePointStyle: true,
                    padding: 18
                }
            }
        }
    };


    // ==========================================
    // BAR CHART
    // INCOME VS EXPENSE
    // ==========================================

    const barCanvas = document.getElementById("barChart");

    if (barCanvas) {

        new Chart(barCanvas, {

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

                datasets: [

                    {
                        label: "Income",

                        data: [
                            3500,
                            4200,
                            5000,
                            4500,
                            5300,
                            6100
                        ],

                        backgroundColor: "#22c55e",

                        borderRadius: 8,

                        borderSkipped: false
                    },

                    {
                        label: "Expense",

                        data: [
                            2100,
                            2500,
                            3100,
                            2800,
                            3300,
                            3900
                        ],

                        backgroundColor: "#ef4444",

                        borderRadius: 8,

                        borderSkipped: false
                    }

                ]
            },

            options: {

                ...commonOptions,

                scales: {

                    y: {
                        beginAtZero: true,

                        grid: {
                            color: "rgba(148,163,184,.15)"
                        }
                    },

                    x: {
                        grid: {
                            display: false
                        }
                    }

                }
            }

        });

    }


    // ==========================================
    // PIE CHART
    // EXPENSE BY CATEGORY
    // ==========================================

    const pieCanvas = document.getElementById("pieChart");

    if (pieCanvas) {

        new Chart(pieCanvas, {

            type: "doughnut",

            data: {

                labels: [
                    "Food",
                    "Travel",
                    "Shopping",
                    "Bills",
                    "Entertainment"
                ],

                datasets: [

                    {
                        data: [
                            1200,
                            800,
                            950,
                            1400,
                            600
                        ],

                        backgroundColor: [
                            "#3b82f6",
                            "#22c55e",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6"
                        ],

                        borderWidth: 0,

                        hoverOffset: 8
                    }

                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "62%",

                plugins: {

                    legend: {
                        position: "bottom",

                        labels: {
                            usePointStyle: true,

                            padding: 15
                        }
                    }

                }
            }

        });

    }


    // ==========================================
    // LINE CHART
    // MONTHLY SAVINGS
    // ==========================================

    const lineCanvas = document.getElementById("lineChart");

    if (lineCanvas) {

        new Chart(lineCanvas, {

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
                        label: "Savings",

                        data: [
                            1400,
                            1700,
                            1900,
                            1700,
                            2000,
                            2200
                        ],

                        borderColor: "#3b82f6",

                        backgroundColor: "rgba(59,130,246,.12)",

                        fill: true,

                        tension: 0.4,

                        pointRadius: 4,

                        pointHoverRadius: 7,

                        borderWidth: 3
                    }

                ]
            },

            options: {

                ...commonOptions,

                interaction: {
                    mode: "index",
                    intersect: false
                },

                scales: {

                    y: {
                        beginAtZero: true,

                        grid: {
                            color: "rgba(148,163,184,.15)"
                        }
                    },

                    x: {
                        grid: {
                            display: false
                        }
                    }

                }
            }

        });

    }


    const userName = localStorage.getItem("userName");

if (userName) {

    const nameElement = document.getElementById("userName");
    const navbarNameElement = document.getElementById("navbarUserName");

    if (nameElement) {
        nameElement.textContent = userName;
    }

    if (navbarNameElement) {
        navbarNameElement.textContent = userName;
    }
}

    // ==========================================
    // PAGE LOADED
    // ==========================================

    console.log("Analytics Dashboard Loaded Successfully!");

});