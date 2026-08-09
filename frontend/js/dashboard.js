// Line Chart
new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun"],
        datasets: [{
            label: "Income",
            data: [40000,45000,50000,48000,52000,55000],
            borderColor: "#16a34a",
            backgroundColor: "rgba(22,163,74,.15)",
            fill: true,
            tension: 0.4
        },{
            label: "Expense",
            data: [25000,28000,30000,27000,32000,35000],
            borderColor: "#ef4444",
            backgroundColor: "rgba(239,68,68,.15)",
            fill: true,
            tension: 0.4
        }]
    },
    options:{
    responsive:true,
    maintainAspectRatio:false,
    plugins:{
        legend:{
            position:"top"
        }
    },
    interaction:{
        mode:"index",
        intersect:false
    },
    animation:{
        duration:1800
    }
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
    },
    options:{
    responsive:true,
    maintainAspectRatio:false,
    plugins:{
        legend:{
            position:"top"
        }
    },
    interaction:{
        mode:"index",
        intersect:false
    },
    animation:{
        duration:1800
    }
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
    },
    options:{
    responsive:true,
    maintainAspectRatio:false,
    plugins:{
        legend:{
            position:"top"
        }
    },
    interaction:{
        mode:"index",
        intersect:false
    },
    animation:{
        duration:1800
    }
}
});

const profileImage = localStorage.getItem("profileImage");
const userName = localStorage.getItem("userName");

if(profileImage){
    document.getElementById("profileImage").src = profileImage;
}

if(userName){
    document.getElementById("userName").textContent = userName;
}