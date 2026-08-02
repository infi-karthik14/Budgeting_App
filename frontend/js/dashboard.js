// Line Chart

new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun"],
        datasets: [
            {
                label: "Income",
                data: [40000,45000,50000,48000,52000,55000],
                borderColor: "green",
                fill: false
            },
            {
                label: "Expense",
                data: [25000,28000,30000,27000,32000,35000],
                borderColor: "red",
                fill: false
            }
        ]
    }
});

// Pie Chart

new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
        labels: ["Food","Shopping","Bills","Travel"],
        datasets: [{
            data: [30,25,20,25]
        }]
    }
});

// Bar Chart

new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun"],
        datasets: [{
            label: "Savings",
            data: [12000,15000,18000,16000,20000,22000]
        }]
    }
});