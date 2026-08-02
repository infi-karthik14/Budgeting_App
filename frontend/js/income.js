new Chart(document.getElementById("incomeChart"), {
    type: "doughnut",
    data: {
        labels: ["Salary", "Freelancing", "Business", "Investment", "Other"],
        datasets: [{
            data: [50000, 12000, 18000, 5000, 3000]
        }]
    }
});