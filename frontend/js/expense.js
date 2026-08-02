const ctx = document.getElementById("expenseChart");

new Chart(ctx, {
    type: "doughnut",
    data: {
        labels: ["Food", "Shopping", "Travel", "Bills", "Health"],
        datasets: [{
            data: [5000, 8000, 3000, 7000, 2000],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF"
            ]
        }]
    }
});