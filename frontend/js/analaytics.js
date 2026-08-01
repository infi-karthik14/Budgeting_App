// ===============================
// Analytics Dashboard JavaScript
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================
    // BAR CHART
    // ==========================

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

                        backgroundColor: "#22c55e"

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

                        backgroundColor: "#ef4444"

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

                }

            }

        });

    }

    // ==========================
    // PIE CHART
    // ==========================

    const pieCanvas = document.getElementById("pieChart");

    if (pieCanvas) {

        new Chart(pieCanvas, {

            type: "pie",

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

                        ]

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        });

    }

    // ==========================
    // Card Hover Animation
    // ==========================

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.transform = "translateY(-8px)";
            card.style.transition = ".3s";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "translateY(0px)";

        });

    });

    // ==========================
    // Table Hover Effect
    // ==========================

    const rows = document.querySelectorAll("tbody tr");

    rows.forEach(row => {

        row.addEventListener("mouseenter", () => {

            row.style.background = "#eef4ff";

        });

        row.addEventListener("mouseleave", () => {

            row.style.background = "";

        });

    });

    // ==========================
    // Console Message
    // ==========================

    console.log("Analytics Dashboard Loaded Successfully!");

});