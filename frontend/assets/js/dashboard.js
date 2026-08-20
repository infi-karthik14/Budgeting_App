/* =========================================================
   BACHAT BUDDY - DASHBOARD
   Backend + Budget + ML Connected Version
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  console.log("====================================");
  console.log("BACHAT BUDDY DASHBOARD INITIALIZED");
  console.log("====================================");

  /* =====================================================
       LOGIN CHECK
    ===================================================== */

  const loggedIn = sessionStorage.getItem("loggedIn");
  const userId = sessionStorage.getItem("userId");

  if (loggedIn !== "true" || !userId) {
    console.error("User not logged in.");

    window.location.href = "login.html";

    return;
  }

  console.log("Logged in user ID:", userId);

  /* =====================================================
       API URLS
    ===================================================== */

  const TRANSACTION_API = "http://localhost:8080/api/transactions";

  const BUDGET_API = "http://localhost:8080/api/budgets";

  const ML_API = "http://localhost:8080/api/ml";

  /* =====================================================
       GLOBAL DATA
    ===================================================== */

  let transactions = [];

  let budgets = [];

  let lineChart = null;

  let pieChart = null;

  let barChart = null;

  /* =====================================================
       INITIAL LOAD
    ===================================================== */

  loadUserData();

  updateCurrentDate();

  loadDashboardData();

  /* =====================================================
       LOAD USER DATA
    ===================================================== */

  function loadUserData() {
    const fullName = sessionStorage.getItem("fullName") || "User";

    const email = sessionStorage.getItem("userEmail") || "";

    const profileImage = localStorage.getItem("profileImage");

    /* Sidebar */

    const userName = document.getElementById("userName");

    if (userName) {
      userName.textContent = fullName;
    }

    /* Navbar */

    const navbarUserName = document.getElementById("navbarUserName");

    if (navbarUserName) {
      navbarUserName.textContent = fullName;
    }

    /* Email */

    const navbarUserEmail = document.getElementById("navbarUserEmail");

    if (navbarUserEmail) {
      navbarUserEmail.textContent = email;
    }

    /* Profile image */

    const profileImageElement = document.getElementById("profileImage");

    if (profileImage && profileImageElement) {
      profileImageElement.src = profileImage;
    }
  }

  /* =====================================================
       CURRENT DATE
    ===================================================== */

  function updateCurrentDate() {
    const currentDate = document.getElementById("currentDate");

    if (!currentDate) {
      return;
    }

    const today = new Date();

    currentDate.textContent = today.toLocaleDateString("en-IN", {
      weekday: "long",

      day: "2-digit",

      month: "long",

      year: "numeric",
    });
  }

  /* =====================================================
       LOAD DASHBOARD DATA
    ===================================================== */

  async function loadDashboardData() {
    try {
      console.log("Loading dashboard transactions...");

      /* =================================================
               TRANSACTIONS
            ================================================= */

      const transactionResponse = await fetch(
        `${TRANSACTION_API}/user/${userId}`,
      );

      console.log("Transaction API status:", transactionResponse.status);

      if (!transactionResponse.ok) {
        const errorText = await transactionResponse.text();

        throw new Error(
          errorText ||
            `Transaction server returned ${transactionResponse.status}`,
        );
      }

      const transactionData = await transactionResponse.json();

      if (!Array.isArray(transactionData)) {
        throw new Error("Invalid transaction data received.");
      }

      transactions = transactionData;

      console.log("Dashboard transactions:", transactions);

      /* =================================================
               BUDGETS
            ================================================= */

      try {
        const budgetResponse = await fetch(`${BUDGET_API}/user/${userId}`);

        console.log("Budget API status:", budgetResponse.status);

        if (budgetResponse.ok) {
          const budgetData = await budgetResponse.json();

          budgets = Array.isArray(budgetData) ? budgetData : [];

          console.log("Dashboard budgets:", budgets);
        } else {
          console.warn("Budget API returned:", budgetResponse.status);

          budgets = [];
        }
      } catch (budgetError) {
        console.error("Budget loading error:", budgetError);

        budgets = [];
      }

      /* =================================================
               UPDATE DASHBOARD
            ================================================= */

      updateSummaryCards();

      updateTodaySummary();

      updateBudgetUsage();

      updateLineChart();

      updatePieChart();

      updateBarChart();

      updateRecentTransactions();

      /* =================================================
               AI
            ================================================= */

      await updateAIPrediction();

      console.log("Dashboard update completed.");
    } catch (error) {
      console.error("DASHBOARD ERROR:", error);
    }
  }

  /* =====================================================
       TRANSACTION TYPE
    ===================================================== */

  function getTransactionType(transaction) {
    if (!transaction) {
      return "";
    }

    const type = String(transaction.type || "")
      .trim()
      .toLowerCase();

    const category = String(transaction.category || "")
      .trim()
      .toLowerCase();

    /* Salary / income */

    if (
      category === "salary" ||
      category === "income" ||
      category === "salary income"
    ) {
      return "income";
    }

    if (type === "income" || type === "expense") {
      return type;
    }

    return "expense";
  }

  /* =====================================================
       TRANSACTION DATE
    ===================================================== */

  function getTransactionDate(transaction) {
    if (!transaction) {
      return "";
    }

    return (
      transaction.transactionDate ||
      transaction.date ||
      transaction.createdAt ||
      ""
    );
  }

  /* =====================================================
       NORMALIZE DATE
    ===================================================== */

  function normalizeDate(dateValue) {
    if (!dateValue) {
      return "";
    }

    const value = String(dateValue).trim();

    if (value.includes("T")) {
      return value.split("T")[0];
    }

    if (value.includes(" ")) {
      return value.split(" ")[0];
    }

    return value.substring(0, 10);
  }

  /* =====================================================
       PARSE DATE SAFELY
    ===================================================== */

  function parseDate(dateValue) {
    const normalized = normalizeDate(dateValue);

    if (!normalized) {
      return null;
    }

    const date = new Date(normalized + "T00:00:00");

    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  }

  /* =====================================================
       CHECK TODAY
    ===================================================== */

  function isToday(dateValue) {
    const date = parseDate(dateValue);

    if (!date) {
      return false;
    }

    const today = new Date();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  /* =====================================================
       FORMAT MONEY
    ===================================================== */

  function formatMoney(amount) {
    const value = Number(amount) || 0;

    return (
      "₹" +
      value.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })
    );
  }

  /* =====================================================
       SUMMARY CARDS
    ===================================================== */

  function updateSummaryCards() {
    let income = 0;
    let expense = 0;

    let incomeCount = 0;
    let expenseCount = 0;

    transactions.forEach(function (transaction) {
      const amount = Number(transaction.amount) || 0;

      const type = getTransactionType(transaction);

      console.log(
        "Transaction:",
        transaction,
        "Type:",
        type,
        "Amount:",
        amount,
      );

      if (type === "income") {
        income += amount;
        incomeCount++;
      } else if (type === "expense") {
        expense += amount;
        expenseCount++;
      }
    });

    const balance = income - expense;

    console.log("========== DASHBOARD TOTAL ==========");
    console.log("Income:", income);
    console.log("Expense:", expense);
    console.log("Balance:", balance);
    console.log("Income Count:", incomeCount);
    console.log("Expense Count:", expenseCount);
    console.log("=====================================");

    /* ==============================
       UPDATE INCOME
    ============================== */

    const totalIncome = document.getElementById("totalIncome");

    if (totalIncome) {
      totalIncome.textContent = formatMoney(income);
    }

    /* ==============================
       UPDATE EXPENSE
    ============================== */

    const totalExpense = document.getElementById("totalExpense");

    if (totalExpense) {
      totalExpense.textContent = formatMoney(expense);
    }

    /* ==============================
       UPDATE BALANCE
    ============================== */

    const currentBalance = document.getElementById("currentBalance");

    if (currentBalance) {
      currentBalance.textContent = formatMoney(balance);
    }

    /* ==============================
       UPDATE COUNTS
    ============================== */

    const incomeTransactionCount = document.getElementById(
      "incomeTransactionCount",
    );

    if (incomeTransactionCount) {
      incomeTransactionCount.textContent = incomeCount;
    }

    const expenseTransactionCount = document.getElementById(
      "expenseTransactionCount",
    );

    if (expenseTransactionCount) {
      expenseTransactionCount.textContent = expenseCount;
    }
  }

  /* =====================================================
       TODAY'S SUMMARY
    ===================================================== */

  function updateTodaySummary() {
    let todayIncome = 0;

    let todayExpense = 0;

    let todayTransactions = 0;

    transactions.forEach(function (transaction) {
      const date = getTransactionDate(transaction);

      if (!isToday(date)) {
        return;
      }

      const amount = Number(transaction.amount) || 0;

      const type = getTransactionType(transaction);

      todayTransactions++;

      if (type === "income") {
        todayIncome += amount;
      } else {
        todayExpense += amount;
      }
    });

    const todaySavings = todayIncome - todayExpense;

    const todayIncomeElement = document.getElementById("todayIncome");

    const todayExpenseElement = document.getElementById("todayExpense");

    const todayTransactionsElement =
      document.getElementById("todayTransactions");

    const todaySavingsElement = document.getElementById("todaySavings");

    if (todayIncomeElement) {
      todayIncomeElement.textContent = formatMoney(todayIncome);
    }

    if (todayExpenseElement) {
      todayExpenseElement.textContent = formatMoney(todayExpense);
    }

    if (todayTransactionsElement) {
      todayTransactionsElement.textContent = todayTransactions;
    }

    if (todaySavingsElement) {
      todaySavingsElement.textContent = formatMoney(todaySavings);
    }
  }

  /* =====================================================
       CURRENT MONTH BUDGET
    ===================================================== */

  function getCurrentMonthBudget() {
    const today = new Date();

    const currentYear = today.getFullYear();

    const currentMonth = today.getMonth();

    const monthStart = new Date(currentYear, currentMonth, 1);

    const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    const activeBudgets = [];

    budgets.forEach(function (budget) {
      const startDate = normalizeDate(budget.startDate);

      const endDate = normalizeDate(budget.endDate);

      if (!startDate) {
        return;
      }

      const start = parseDate(startDate);

      const end = endDate ? new Date(endDate + "T23:59:59") : null;

      if (!start) {
        return;
      }

      const matches = start <= monthEnd && (!end || end >= monthStart);

      if (matches) {
        activeBudgets.push(budget);
      }
    });

    if (activeBudgets.length === 0) {
      return 0;
    }

    activeBudgets.sort(function (a, b) {
      return parseDate(b.startDate) - parseDate(a.startDate);
    });

    const latestBudget = activeBudgets[0];

    return Number(
      latestBudget.budgetAmount ??
        latestBudget.monthlyBudget ??
        latestBudget.amount ??
        0,
    );
  }

  /* =====================================================
       CURRENT MONTH EXPENSE
    ===================================================== */

  function getCurrentMonthExpense() {
    const today = new Date();

    const currentMonth = today.getMonth();

    const currentYear = today.getFullYear();

    let monthlyExpense = 0;

    transactions.forEach(function (transaction) {
      const date = parseDate(getTransactionDate(transaction));

      if (!date) {
        return;
      }

      if (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear &&
        getTransactionType(transaction) === "expense"
      ) {
        monthlyExpense += Number(transaction.amount) || 0;
      }
    });

    return monthlyExpense;
  }

  /* =====================================================
       MONTHLY BUDGET USAGE
    ===================================================== */

  function updateBudgetUsage() {
    const monthlyBudget = getCurrentMonthBudget();

    const monthlyExpense = getCurrentMonthExpense();

    let percentage = 0;

    if (monthlyBudget > 0) {
      percentage = (monthlyExpense / monthlyBudget) * 100;
    }

    const displayPercentage = Math.round(percentage);

    const progressWidth = Math.min(Math.max(percentage, 0), 100);

    const remaining = monthlyBudget - monthlyExpense;

    const percentageElement = document.getElementById(
      "dashboardBudgetPercentage",
    );

    const progressElement = document.getElementById("dashboardBudgetProgress");

    const budgetElement = document.getElementById("dashboardMonthlyBudget");

    const spentElement = document.getElementById("dashboardMonthlySpent");

    const remainingElement = document.getElementById(
      "dashboardMonthlyRemaining",
    );

    if (percentageElement) {
      percentageElement.textContent =
        monthlyBudget > 0 ? displayPercentage + "%" : "No Budget";
    }

    if (progressElement) {
      progressElement.style.width = progressWidth + "%";

      progressElement.setAttribute("aria-valuenow", displayPercentage);

      progressElement.textContent =
        monthlyBudget > 0 ? displayPercentage + "%" : "No Budget";

      progressElement.classList.remove("bg-success", "bg-warning", "bg-danger");

      if (percentage >= 100) {
        progressElement.classList.add("bg-danger");
      } else if (percentage >= 80) {
        progressElement.classList.add("bg-warning");
      } else {
        progressElement.classList.add("bg-success");
      }
    }

    if (budgetElement) {
      budgetElement.textContent = formatMoney(monthlyBudget);
    }

    if (spentElement) {
      spentElement.textContent = formatMoney(monthlyExpense);
    }

    if (remainingElement) {
      remainingElement.textContent = formatMoney(remaining);

      remainingElement.classList.remove("text-success", "text-danger");

      remainingElement.classList.add(
        remaining < 0 ? "text-danger" : "text-success",
      );
    }
  }

  /* =====================================================
       AI EXPENSE PREDICTION
    ===================================================== */

  async function updateAIPrediction() {
    try {
      console.log("REQUESTING AI EXPENSE PREDICTION");

      const today = new Date();

      const currentMonth = today.getMonth();

      const currentYear = today.getFullYear();

      let monthlyIncome = 0;

      let monthlyExpense = 0;

      transactions.forEach(function (transaction) {
        const date = parseDate(getTransactionDate(transaction));

        if (!date) {
          return;
        }

        if (
          date.getMonth() !== currentMonth ||
          date.getFullYear() !== currentYear
        ) {
          return;
        }

        const amount = Number(transaction.amount) || 0;

        if (getTransactionType(transaction) === "income") {
          monthlyIncome += amount;
        } else {
          monthlyExpense += amount;
        }
      });

      const monthlyBudget = getCurrentMonthBudget();

      /* =================================================
               REFERENCE TRANSACTION
            ================================================= */

      const expenseTransactions = transactions
        .filter(function (transaction) {
          return getTransactionType(transaction) === "expense";
        })
        .sort(function (a, b) {
          return (
            parseDate(getTransactionDate(b)) - parseDate(getTransactionDate(a))
          );
        });

      let referenceTransaction = expenseTransactions[0];

      if (!referenceTransaction && transactions.length > 0) {
        referenceTransaction = transactions[0];
      }

      if (!referenceTransaction) {
        showAIPredictionUnavailable(
          "Add a transaction to generate AI prediction",
        );

        return;
      }

      /* =================================================
               CATEGORY
            ================================================= */

      const category = String(referenceTransaction.category || "Other").trim();

      /* =================================================
               PAYMENT METHOD
            ================================================= */

      const paymentMethod = String(
        referenceTransaction.paymentMethod ||
          referenceTransaction.payment_method ||
          "Cash",
      ).trim();

      /* =================================================
               CITY
            ================================================= */

      const city = String(referenceTransaction.city || "Delhi").trim();

      /* =================================================
               DAY OF WEEK
            ================================================= */

      let dayOfWeek =
        referenceTransaction.dayOfWeek || referenceTransaction.day_of_week;

      if (!dayOfWeek) {
        const transactionDate = getTransactionDate(referenceTransaction);

        const date = parseDate(transactionDate);

        if (date) {
          dayOfWeek = date.toLocaleDateString("en-US", {
            weekday: "long",
          });
        }
      }

      if (!dayOfWeek) {
        dayOfWeek = today.toLocaleDateString("en-US", {
          weekday: "long",
        });
      }

      /* =================================================
               ML REQUEST
            ================================================= */

      const predictionData = {
        monthly_income: monthlyIncome,

        monthly_budget: monthlyBudget,

        category: category,

        payment_method: paymentMethod,

        city: city,

        day_of_week: dayOfWeek,
      };

      console.log("ML request:", predictionData);

      /* =================================================
               CALL SPRING BOOT
            ================================================= */

      const response = await fetch(`${ML_API}/predict-expense`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(predictionData),
      });

      const result = await response.json().catch(function () {
        return {};
      });

      console.log("ML response:", result);

      if (!response.ok) {
        throw new Error(result.error || `ML API returned ${response.status}`);
      }

      const prediction = Number(result.predicted_expense);

      if (!Number.isFinite(prediction)) {
        throw new Error("Invalid prediction received from ML API.");
      }

      updateAICard(prediction);
    } catch (error) {
      console.error("AI Prediction Error:", error);

      showAIPredictionUnavailable("AI service unavailable");
    }
  }

  /* =====================================================
       UPDATE AI CARD
    ===================================================== */

  function updateAICard(prediction) {
    const aiPredictionElement = document.getElementById("aiPrediction");

    if (aiPredictionElement) {
      aiPredictionElement.textContent = formatMoney(prediction);
    }

    const cards = document.querySelectorAll(".dashboard-card");

    if (cards.length >= 4) {
      const description = cards[3].querySelector(".card-footer-info small");

      if (description) {
        description.textContent = "Predicted expense by AI";
      }
    }
  }

  /* =====================================================
       AI UNAVAILABLE
    ===================================================== */

  function showAIPredictionUnavailable(message) {
    const aiPredictionElement = document.getElementById("aiPrediction");

    if (aiPredictionElement) {
      aiPredictionElement.textContent = "Unavailable";
    }

    const cards = document.querySelectorAll(".dashboard-card");

    if (cards.length >= 4) {
      const description = cards[3].querySelector(".card-footer-info small");

      if (description) {
        description.textContent = message;
      }
    }
  }

  /* =====================================================
       GET MONTHLY DATA
       CURRENT YEAR ONLY
    ===================================================== */

  function getMonthlyData() {
    const monthlyIncome = new Array(12).fill(0);

    const monthlyExpense = new Array(12).fill(0);

    const currentYear = new Date().getFullYear();

    transactions.forEach(function (transaction) {
      const date = parseDate(getTransactionDate(transaction));

      if (!date) {
        return;
      }

      /*
       * IMPORTANT:
       * Only current year
       */

      if (date.getFullYear() !== currentYear) {
        return;
      }

      const month = date.getMonth();

      const amount = Number(transaction.amount) || 0;

      if (getTransactionType(transaction) === "income") {
        monthlyIncome[month] += amount;
      } else {
        monthlyExpense[month] += amount;
      }
    });

    return {
      income: monthlyIncome,

      expense: monthlyExpense,
    };
  }

  /* =====================================================
       LINE CHART
    ===================================================== */

  function updateLineChart() {
    const canvas = document.getElementById("lineChart");

    if (!canvas || typeof Chart === "undefined") {
      return;
    }

    const data = getMonthlyData();

    if (lineChart) {
      lineChart.destroy();
    }

    lineChart = new Chart(canvas, {
      type: "line",

      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],

        datasets: [
          {
            label: "Income",

            data: data.income,

            borderColor: "#16a34a",

            backgroundColor: "rgba(22,163,74,.15)",

            fill: true,

            tension: 0.4,
          },

          {
            label: "Expense",

            data: data.expense,

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

          tooltip: {
            callbacks: {
              label: function (context) {
                return context.dataset.label + ": " + formatMoney(context.raw);
              },
            },
          },
        },

        interaction: {
          mode: "index",

          intersect: false,
        },

        scales: {
          y: {
            beginAtZero: true,

            ticks: {
              callback: function (value) {
                return "₹" + Number(value).toLocaleString("en-IN");
              },
            },
          },
        },
      },
    });
  }

  /* =====================================================
       PIE CHART
    ===================================================== */

  function updatePieChart() {
    const canvas = document.getElementById("pieChart");

    if (!canvas || typeof Chart === "undefined") {
      return;
    }

    const categoryTotals = {};

    transactions.forEach(function (transaction) {
      if (getTransactionType(transaction) !== "expense") {
        return;
      }

      const category = String(transaction.category || "Other").trim();

      const amount = Number(transaction.amount) || 0;

      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });

    const labels = Object.keys(categoryTotals);

    const values = Object.values(categoryTotals);

    if (pieChart) {
      pieChart.destroy();
    }

    pieChart = new Chart(canvas, {
      type: "pie",

      data: {
        labels: labels.length ? labels : ["No Expenses"],

        datasets: [
          {
            data: values.length ? values : [1],
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

          tooltip: {
            callbacks: {
              label: function (context) {
                return context.label + ": " + formatMoney(context.raw);
              },
            },
          },
        },
      },
    });
  }

  /* =====================================================
       BAR CHART
    ===================================================== */

  function updateBarChart() {
    const canvas = document.getElementById("barChart");

    if (!canvas || typeof Chart === "undefined") {
      return;
    }

    const data = getMonthlyData();

    const monthlySavings = data.income.map(function (income, index) {
      return income - data.expense[index];
    });

    if (barChart) {
      barChart.destroy();
    }

    barChart = new Chart(canvas, {
      type: "bar",

      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],

        datasets: [
          {
            label: "Savings",

            data: monthlySavings,
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

          tooltip: {
            callbacks: {
              label: function (context) {
                return "Savings: " + formatMoney(context.raw);
              },
            },
          },
        },

        scales: {
          y: {
            beginAtZero: true,

            ticks: {
              callback: function (value) {
                return "₹" + Number(value).toLocaleString("en-IN");
              },
            },
          },
        },
      },
    });
  }

  /* =====================================================
       RECENT TRANSACTIONS
    ===================================================== */

  function updateRecentTransactions() {
    /*
     * Directly use the ID from HTML.
     * This is safer than selecting the last table.
     */

    const tbody = document.getElementById("recentTransactionsBody");

    if (!tbody) {
      return;
    }

    tbody.innerHTML = "";

    const recent = [...transactions]
      .sort(function (a, b) {
        const dateA = parseDate(getTransactionDate(a));

        const dateB = parseDate(getTransactionDate(b));

        return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
      })
      .slice(0, 5);

    if (!recent.length) {
      tbody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="text-center text-muted py-4"
                    >

                        No transactions found.

                    </td>

                </tr>

            `;

      return;
    }

    recent.forEach(function (transaction) {
      const type = getTransactionType(transaction);

      const category = transaction.category || "-";

      const amount = Number(transaction.amount) || 0;

      const date = formatDate(getTransactionDate(transaction));

      const status = transaction.status || "Completed";

      const row = document.createElement("tr");

      const amountClass = type === "income" ? "text-success" : "text-danger";

      const sign = type === "income" ? "+" : "-";

      let statusClass = "bg-success";

      const statusText = String(status).toLowerCase();

      if (statusText === "pending") {
        statusClass = "bg-warning text-dark";
      } else if (statusText === "failed") {
        statusClass = "bg-danger";
      }

      row.innerHTML = `

                    <td>
                        ${escapeHTML(date)}
                    </td>

                    <td>
                        ${escapeHTML(category)}
                    </td>

                    <td>
                        ${type === "income" ? "Income" : "Expense"}
                    </td>

                    <td
                        class="${amountClass} fw-bold"
                    >

                        ${sign}
                        ${formatMoney(amount)}

                    </td>

                    <td>

                        <span
                            class="badge ${statusClass}"
                        >

                            ${escapeHTML(status)}

                        </span>

                    </td>

                `;

      tbody.appendChild(row);
    });
  }

  /* =====================================================
       FORMAT DATE
    ===================================================== */

  function formatDate(dateValue) {
    if (!dateValue) {
      return "-";
    }

    const date = parseDate(dateValue);

    if (!date) {
      return String(dateValue);
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",

      month: "short",

      year: "numeric",
    });
  }

  /* =====================================================
       ESCAPE HTML
    ===================================================== */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")

      .replace(/</g, "&lt;")

      .replace(/>/g, "&gt;")

      .replace(/"/g, "&quot;")

      .replace(/'/g, "&#039;");
  }

  /* =====================================================
       DASHBOARD SEARCH
    ===================================================== */

  const searchInput = document.getElementById("dashboardSearch");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const search = this.value.trim().toLowerCase();

      const tbody = document.getElementById("recentTransactionsBody");

      if (!tbody) {
        return;
      }

      const rows = tbody.querySelectorAll("tr");

      rows.forEach(function (row) {
        const text = row.textContent.toLowerCase();

        row.style.display = !search || text.includes(search) ? "" : "none";
      });
    });
  }

  /* =====================================================
       LOG DASHBOARD DATA
    ===================================================== */

  console.log("Dashboard JavaScript loaded successfully.");
});
