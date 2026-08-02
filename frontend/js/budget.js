const ctx = document.getElementById("budgetChart");

if (ctx) {
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Food", "Travel", "Shopping", "Bills", "Entertainment"],
            datasets: [{
                label: "Budget",
                data: [2000, 3000, 2500, 2200, 1200]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}