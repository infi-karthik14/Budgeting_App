/* =========================================================
   BACHAT BUDDY - LOGGED IN USER
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const loggedIn = sessionStorage.getItem("loggedIn");

    /* =====================================================
       PROTECT DASHBOARD
    ===================================================== */

    if (loggedIn !== "true") {

        window.location.href = "login.html";

        return;
    }


    /* =====================================================
       GET USER DATA
    ===================================================== */

    const fullName =
        sessionStorage.getItem("fullName") || "User";

    const email =
        sessionStorage.getItem("userEmail") || "";


    /* =====================================================
       UPDATE USER NAME
    ===================================================== */

    const userName =
        document.getElementById("userName");

    if (userName) {

        userName.textContent = fullName;

    }


    /* =====================================================
       UPDATE NAVBAR USER NAME
    ===================================================== */

    const navbarUserName =
        document.getElementById("navbarUserName");

    if (navbarUserName) {

        navbarUserName.textContent = fullName;

    }


    /* =====================================================
       UPDATE EMAIL IF PRESENT
    ===================================================== */

    const navbarUserEmail =
        document.getElementById("navbarUserEmail");

    if (navbarUserEmail) {

        navbarUserEmail.textContent = email;

    }

});

// ==========================================
// DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  loadUserData();

  initializeLineChart();

  initializePieChart();

  initializeBarChart();

  // Later:
  // loadDashboardData();
});

// ==========================================
// USER DATA
// ==========================================

function loadUserData() {
  const profileImage = localStorage.getItem("profileImage");
  const userName = localStorage.getItem("userName");

  const profileImageElement = document.getElementById("profileImage");

  const userNameElement = document.getElementById("userName");

  if (profileImage && profileImageElement) {
    profileImageElement.src = profileImage;
  }

  if (userName && userNameElement) {
    userNameElement.textContent = userName;
  }
}

// ==========================================
// LINE CHART
// ==========================================

function initializeLineChart() {
  const canvas = document.getElementById("lineChart");

  if (!canvas) return;

  new Chart(canvas, {
    type: "line",

    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

      datasets: [
        {
          label: "Income",

          data: [40000, 45000, 50000, 48000, 52000, 55000],

          borderColor: "#16a34a",

          backgroundColor: "rgba(22,163,74,.15)",

          fill: true,

          tension: 0.4,
        },

        {
          label: "Expense",

          data: [25000, 28000, 30000, 27000, 32000, 35000],

          borderColor: "#ef4444",

          backgroundColor: "rgba(239,68,68,.15)",

          fill: true,

          tension: 0.4,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          position: "top",
        },
      },

      interaction: {
        mode: "index",

        intersect: false,
      },

      animation: {
        duration: 1800,
      },
    },
  });
}

// ==========================================
// PIE CHART
// ==========================================

function initializePieChart() {
  const canvas = document.getElementById("pieChart");

  if (!canvas) return;

  new Chart(canvas, {
    type: "pie",

    data: {
      labels: ["Food", "Shopping", "Bills", "Travel"],

      datasets: [
        {
          data: [30, 25, 20, 25],
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          position: "top",
        },
      },

      animation: {
        duration: 1800,
      },
    },
  });
}

// ==========================================
// BAR CHART
// ==========================================

function initializeBarChart() {
  const canvas = document.getElementById("barChart");

  if (!canvas) return;

  new Chart(canvas, {
    type: "bar",

    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

      datasets: [
        {
          label: "Savings",

          data: [12000, 15000, 18000, 16000, 20000, 22000],
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          position: "top",
        },
      },

      animation: {
        duration: 1800,
      },
    },
  });
}
