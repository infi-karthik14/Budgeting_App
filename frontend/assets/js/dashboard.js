// ==========================================================
// BACHAT BUDDY - DASHBOARD.JS
// Backend Connected + Currency + User + AI/ML Prediction
// ==========================================================

"use strict";

// ==========================================================
// API
// ==========================================================

const TRANSACTION_API_URL =
  "https://budgetingapp-production-a92b.up.railway.app/api/transactions";

const BUDGET_API_URL =
  "https://budgetingapp-production-a92b.up.railway.app/api/budgets";

const ML_API_URL = "http://localhost:5000";

// ==========================================================
// GLOBAL VARIABLES
// ==========================================================

let allTransactions = [];
let allBudgets = [];

let lineChartInstance = null;
let pieChartInstance = null;
let barChartInstance = null;

// ==========================================================
// PAGE LOAD
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("Bachat Buddy Dashboard JS loaded.");

  const loggedIn = sessionStorage.getItem("loggedIn");

  const userId = sessionStorage.getItem("userId");

  if (loggedIn !== "true" || !userId) {
    console.error("User is not logged in.");

    window.location.href = "login.html";

    return;
  }

  loadUserData();

  displayCurrentDate();

  setupSearch();

  loadDashboard();
});

// ==========================================================
// LOAD DASHBOARD
// ==========================================================

async function loadDashboard() {
  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    window.location.href = "login.html";

    return;
  }

  try {
    await Promise.all([loadTransactions(userId), loadBudgets(userId)]);

    calculateDashboard();
  } catch (error) {
    console.error("Dashboard loading error:", error);
  }
}

// ==========================================================
// LOAD USER DATA
// ==========================================================

function loadUserData() {
  const profileImage = localStorage.getItem("profileImage");

  const userName =
    sessionStorage.getItem("fullName") ||
    sessionStorage.getItem("userName") ||
    localStorage.getItem("userName") ||
    "User";

  const profileImageElement = document.getElementById("profileImage");

  const userNameElement = document.getElementById("userName");

  const navbarUserNameElement = document.getElementById("navbarUserName");

  if (profileImage && profileImageElement) {
    profileImageElement.src = profileImage;
  }

  if (userNameElement) {
    userNameElement.textContent = userName;
  }

  if (navbarUserNameElement) {
    navbarUserNameElement.textContent = userName;
  }
}

// ==========================================================
// CURRENT DATE
// ==========================================================

function displayCurrentDate() {
  const dateElement = document.getElementById("currentDate");

  if (!dateElement) {
    return;
  }

  const today = new Date();

  dateElement.textContent = today.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ==========================================================
// LOAD TRANSACTIONS
// ==========================================================

async function loadTransactions(userId) {
  try {
    const response = await fetch(`${TRANSACTION_API_URL}/user/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to load transactions: " + response.status);
    }

    const transactions = await response.json();

    allTransactions = Array.isArray(transactions) ? transactions : [];

    console.log("Dashboard Transactions:", allTransactions);
  } catch (error) {
    console.error("Transaction loading error:", error);

    allTransactions = [];
  }
}

// ==========================================================
// LOAD BUDGETS
// ==========================================================

async function loadBudgets(userId) {
  try {
    const response = await fetch(`${BUDGET_API_URL}/user/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to load budgets: " + response.status);
    }

    const budgets = await response.json();

    allBudgets = Array.isArray(budgets) ? budgets : [];

    console.log("Dashboard Budgets:", allBudgets);
  } catch (error) {
    console.error("Budget loading error:", error);

    allBudgets = [];
  }
}

// ==========================================================
// CALCULATE DASHBOARD
// ==========================================================

function calculateDashboard() {
  calculateIncomeExpense();

  calculateTodaySummary();

  calculateBudgetUsage();

  calculateAI();

  displayRecentTransactions();

  createIncomeExpenseChart();

  createExpenseCategoryChart();

  createMonthlySavingsChart();

  displaySavingsGoal();
}


// ==========================================================
// INCOME / EXPENSE
// ==========================================================

function calculateIncomeExpense() {
  let totalIncome = 0;
  let totalExpense = 0;

  let incomeCount = 0;
  let expenseCount = 0;

  allTransactions.forEach(function (transaction) {
    const amount = Number(transaction.amount || 0);

    const type = String(transaction.type || "")
      .trim()
      .toLowerCase();

    if (type === "income") {
      totalIncome += amount;

      incomeCount++;
    }

    if (type === "expense") {
      totalExpense += amount;

      expenseCount++;
    }
  });

  const balance = totalIncome - totalExpense;

  setText("totalIncome", formatCurrency(totalIncome));

  setText("totalExpense", formatCurrency(totalExpense));

  setText("currentBalance", formatCurrency(balance));

  setText("incomeTransactionCount", incomeCount);

  setText("expenseTransactionCount", expenseCount);
}

// ==========================================================
// TODAY SUMMARY
// ==========================================================

function calculateTodaySummary() {
  const today = getTodayDate();

  let todayIncome = 0;
  let todayExpense = 0;
  let todayTransactions = 0;

  allTransactions.forEach(function (transaction) {
    const transactionDate = normalizeDate(
      transaction.transactionDate || transaction.date || transaction.createdAt,
    );

    if (transactionDate !== today) {
      return;
    }

    todayTransactions++;

    const amount = Number(transaction.amount || 0);

    const type = String(transaction.type || "")
      .trim()
      .toLowerCase();

    if (type === "income") {
      todayIncome += amount;
    }

    if (type === "expense") {
      todayExpense += amount;
    }
  });

  const savings = todayIncome - todayExpense;

  setText("todayIncome", formatCurrency(todayIncome));

  setText("todayExpense", formatCurrency(todayExpense));

  setText("todayTransactions", todayTransactions);

  setText("todaySavings", formatCurrency(savings));
}

// ==========================================================
// BUDGET USAGE
// ==========================================================

function calculateBudgetUsage() {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();

  const currentMonth = currentDate.getMonth() + 1;

  let totalBudget = 0;
  let totalSpent = 0;

  allBudgets.forEach(function (budget) {
    const startDate = normalizeDate(budget.startDate);

    if (startDate) {
      const parts = startDate.split("-");

      const budgetYear = Number(parts[0]);

      const budgetMonth = Number(parts[1]);

      if (budgetYear !== currentYear || budgetMonth !== currentMonth) {
        return;
      }
    }

    const budgetAmount = Number(budget.budgetAmount || 0);

    const spent = calculateBudgetSpent(budget);

    budget.spent = spent;

    totalBudget += budgetAmount;

    totalSpent += spent;
  });

  const remaining = totalBudget - totalSpent;

  let percentage = 0;

  if (totalBudget > 0) {
    percentage = Math.round((totalSpent / totalBudget) * 100);
  }

  const progressWidth = Math.min(Math.max(percentage, 0), 100);

  setText("dashboardMonthlyBudget", formatCurrency(totalBudget));

  setText("dashboardMonthlySpent", formatCurrency(totalSpent));

  setText("dashboardMonthlyRemaining", formatCurrency(remaining));

  setText("dashboardBudgetPercentage", percentage + "%");

  const progress = document.getElementById("dashboardBudgetProgress");

  if (progress) {
    progress.style.width = progressWidth + "%";

    const percentageElement = document.getElementById(
      "dashboardBudgetPercentage",
    );

    const progressElement = document.getElementById("dashboardBudgetProgress");

    if (percentageElement) {
      percentageElement.textContent = percentage + "%";
    }

    if (progressElement) {
      const progress = Math.min(Math.max(percentage, 0), 100);

      progressElement.style.width = progress + "%";

      progressElement.setAttribute("aria-valuenow", percentage);

      progressElement.classList.remove("bg-success", "bg-warning", "bg-danger");

      if (percentage >= 100) {
        progressElement.classList.add("bg-danger");
      } else if (percentage >= 80) {
        progressElement.classList.add("bg-warning");
      } else {
        progressElement.classList.add("bg-success");
      }
    }

    progress.setAttribute("aria-valuenow", percentage);

    progress.classList.remove("bg-success", "bg-warning", "bg-danger");

    if (percentage >= 100) {
      progress.classList.add("bg-danger");
    } else if (percentage >= 80) {
      progress.classList.add("bg-warning");
    } else {
      progress.classList.add("bg-success");
    }
  }
}

// ==========================================================
// CALCULATE BUDGET SPENT
// ==========================================================

function calculateBudgetSpent(budget) {
  const category = String(budget.category || "")
    .trim()
    .toLowerCase();

  const startDate = normalizeDate(budget.startDate);

  const endDate = normalizeDate(budget.endDate);

  let spent = 0;

  allTransactions.forEach(function (transaction) {
    const transactionType = String(transaction.type || "")
      .trim()
      .toLowerCase();

    if (transactionType !== "expense") {
      return;
    }

    const transactionCategory = String(transaction.category || "")
      .trim()
      .toLowerCase();

    if (transactionCategory !== category) {
      return;
    }

    const transactionDate = normalizeDate(
      transaction.transactionDate || transaction.date || transaction.createdAt,
    );

    if (startDate && transactionDate && transactionDate < startDate) {
      return;
    }

    if (endDate && transactionDate && transactionDate > endDate) {
      return;
    }

    spent += Number(transaction.amount || 0);
  });

  return spent;
}

// ==========================================================
// AI / ML EXPENSE PREDICTION
// ==========================================================

async function calculateAI() {
  const predictionElement = document.getElementById("aiPrediction");

  const messageElement = document.getElementById("aiPredictionMessage");

  const recommendationElement = document.getElementById("aiRecommendation");

  if (predictionElement) {
    predictionElement.textContent = "Calculating...";
  }

  if (messageElement) {
    messageElement.textContent = "AI is analyzing your spending patterns...";
  }

  if (recommendationElement) {
    recommendationElement.innerHTML = `
      <i class="bi bi-lightbulb-fill me-1"></i>
      AI recommendation will appear here.
    `;
  }

  try {
    // ======================================================
    // CURRENT DATE
    // ======================================================

    const today = new Date();

    const currentMonth = today.getMonth();

    const currentYear = today.getFullYear();

    // ======================================================
    // MONTHLY INCOME
    // ======================================================

    let monthlyIncome = 0;

    allTransactions.forEach(function (transaction) {
      const type = String(transaction.type || "")
        .trim()
        .toLowerCase();

      if (type !== "income") {
        return;
      }

      const date = parseDate(
        transaction.transactionDate ||
          transaction.date ||
          transaction.createdAt,
      );

      if (!date) {
        return;
      }

      if (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      ) {
        monthlyIncome += Number(transaction.amount || 0);
      }
    });

    // ======================================================
    // MONTHLY BUDGET
    // ======================================================

    let monthlyBudget = 0;

    allBudgets.forEach(function (budget) {
      const startDate = parseDate(budget.startDate);

      if (!startDate) {
        return;
      }

      if (
        startDate.getMonth() === currentMonth &&
        startDate.getFullYear() === currentYear
      ) {
        monthlyBudget += Number(budget.budgetAmount || 0);
      }
    });

    // ======================================================
    // DEFAULT BUDGET
    // ======================================================

    if (monthlyBudget <= 0 && monthlyIncome > 0) {
      monthlyBudget = Math.round(monthlyIncome * 0.7);
    }

    // ======================================================
    // MOST SPENT CATEGORY
    // ======================================================

    let category = "Other";

    const expenseCategories = {};

    allTransactions.forEach(function (transaction) {
      const type = String(transaction.type || "")
        .trim()
        .toLowerCase();

      if (type !== "expense") {
        return;
      }

      const transactionCategory = String(
        transaction.category || "Other",
      ).trim();

      const amount = Number(transaction.amount || 0);

      expenseCategories[transactionCategory] =
        (expenseCategories[transactionCategory] || 0) + amount;
    });

    const categories = Object.keys(expenseCategories);

    if (categories.length > 0) {
      category = categories.reduce(function (highest, current) {
        return expenseCategories[current] > expenseCategories[highest]
          ? current
          : highest;
      });
    }

    // ======================================================
    // MOST USED PAYMENT METHOD
    // ======================================================

    let paymentMethod = "UPI";

    const paymentMethods = {};

    allTransactions.forEach(function (transaction) {
      const type = String(transaction.type || "")
        .trim()
        .toLowerCase();

      if (type !== "expense") {
        return;
      }

      const method = String(transaction.paymentMethod || "").trim();

      if (!method) {
        return;
      }

      paymentMethods[method] = (paymentMethods[method] || 0) + 1;
    });

    const methods = Object.keys(paymentMethods);

    if (methods.length > 0) {
      paymentMethod = methods.reduce(function (mostUsed, current) {
        return paymentMethods[current] > paymentMethods[mostUsed]
          ? current
          : mostUsed;
      });
    }

    // ======================================================
    // CITY
    // ======================================================

    const city =
      sessionStorage.getItem("city") ||
      localStorage.getItem("city") ||
      "Lucknow";

    // ======================================================
    // DAY
    // ======================================================

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const dayOfWeek = days[today.getDay()];

    // ======================================================
    // CHECK INCOME
    // ======================================================

    if (monthlyIncome <= 0) {
      if (predictionElement) {
        predictionElement.textContent = formatCurrency(0);
      }

      if (messageElement) {
        messageElement.textContent =
          "Add an income transaction to generate an AI prediction.";
      }

      if (recommendationElement) {
        recommendationElement.innerHTML = `
          <i class="bi bi-lightbulb-fill me-1"></i>
          Add your monthly income to enable AI prediction.
        `;
      }

      return;
    }

    // ======================================================
    // ML REQUEST
    // ======================================================

    const requestData = {
      monthly_income: monthlyIncome,

      monthly_budget: monthlyBudget,

      category: category,

      payment_method: paymentMethod,

      city: city,

      day_of_week: dayOfWeek,
    };

    console.log("Sending ML prediction request:", requestData);

    // ======================================================
    // CALL FLASK
    // ======================================================

    const response = await fetch(`${ML_API_URL}/predict-expense`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(requestData),
    });

    // ======================================================
    // API ERROR
    // ======================================================

    if (!response.ok) {
      let errorMessage = `ML API returned ${response.status}`;

      try {
        const errorData = await response.json();

        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (error) {
        console.warn("Could not parse ML error.", error);
      }

      throw new Error(errorMessage);
    }

    // ======================================================
    // RESPONSE
    // ======================================================

    const result = await response.json();

    const prediction = Number(result.predicted_expense) || 0;

    console.log("ML prediction:", prediction);

    // ======================================================
    // DISPLAY PREDICTION
    // ======================================================

    if (predictionElement) {
      predictionElement.textContent = formatCurrency(prediction);
    }

    // ======================================================
    // AI FINANCIAL INSIGHT
    // ======================================================

    const aiMessage = document.getElementById("aiPredictionMessage");

    if (aiMessage) {
      if (monthlyBudget <= 0) {
        aiMessage.textContent =
          "Set a monthly budget to receive AI spending insights.";
      } else if (prediction > monthlyBudget) {
        const difference = prediction - monthlyBudget;

        const percentage = Math.round((difference / monthlyBudget) * 100);

        aiMessage.textContent =
          "⚠️ Your predicted expense is " +
          formatCurrency(difference) +
          " (" +
          percentage +
          "%) above your monthly budget.";
      } else {
        const remaining = monthlyBudget - prediction;

        const percentage = Math.round((remaining / monthlyBudget) * 100);

        aiMessage.textContent =
          "✅ Your predicted expense is within budget. " +
          "You may have approximately " +
          formatCurrency(remaining) +
          " remaining.";
      }
    }

    // ======================================================
    // CURRENT MONTH ACTUAL EXPENSE
    // ======================================================

    let currentMonthExpense = 0;

    allTransactions.forEach(function (transaction) {
      const type = String(transaction.type || "")
        .trim()
        .toLowerCase();

      if (type !== "expense") {
        return;
      }

      const date = parseDate(
        transaction.transactionDate ||
          transaction.date ||
          transaction.createdAt,
      );

      if (!date) {
        return;
      }

      if (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      ) {
        currentMonthExpense += Number(transaction.amount || 0);
      }
    });

    // ======================================================
    // AI BUDGET STATUS
    // ======================================================

    const difference = monthlyBudget - prediction;

    if (messageElement) {
      if (prediction > monthlyBudget) {
        const overAmount = prediction - monthlyBudget;

        messageElement.innerHTML = `
          <span class="ai-status-danger">
            <i class="bi bi-exclamation-triangle-fill me-1"></i>
            Over Budget
          </span>
          <br>
          Predicted spending is
          <strong>
            ${formatCurrency(overAmount)}
          </strong>
          above your monthly budget.
        `;
      } else if (monthlyBudget > 0 && prediction >= monthlyBudget * 0.8) {
        const remaining = monthlyBudget - prediction;

        messageElement.innerHTML = `
          <span class="ai-status-warning">
            <i class="bi bi-exclamation-circle-fill me-1"></i>
            Near Budget Limit
          </span>
          <br>
          Approximately
          <strong>
            ${formatCurrency(remaining)}
          </strong>
          may remain.
        `;
      } else {
        messageElement.innerHTML = `
          <span class="ai-status-success">
            <i class="bi bi-check-circle-fill me-1"></i>
            Within Budget
          </span>
          <br>
          Predicted spending is
          <strong>
            ${formatCurrency(difference)}
          </strong>
          below your monthly budget.
        `;
      }
    }

    // ======================================================
    // AI RECOMMENDATION
    // ======================================================

    if (recommendationElement) {
      if (prediction > monthlyBudget) {
        recommendationElement.innerHTML = `
          <i class="bi bi-lightbulb-fill me-1"></i>
          Consider reducing spending in
          <strong>
            ${escapeHtml(category)}
          </strong>
          to stay within your budget.
        `;
      } else if (monthlyBudget > 0 && prediction >= monthlyBudget * 0.8) {
        recommendationElement.innerHTML = `
          <i class="bi bi-lightbulb-fill me-1"></i>
          Keep an eye on your
          <strong>
            ${escapeHtml(category)}
          </strong>
          expenses this month.
        `;
      } else {
        recommendationElement.innerHTML = `
          <i class="bi bi-lightbulb-fill me-1"></i>
          Your spending pattern looks healthy.
          Keep maintaining your current budget.
        `;
      }
    }

    // ======================================================
    // AI DETAILS
    // ======================================================

    console.log("AI Prediction Details:", {
      income: monthlyIncome,

      budget: monthlyBudget,

      actualExpense: currentMonthExpense,

      category: category,

      paymentMethod: paymentMethod,

      city: city,

      day: dayOfWeek,

      prediction: prediction,
    });
  } catch (error) {
    console.error("AI/ML prediction error:", error);

    if (predictionElement) {
      predictionElement.textContent = "Unavailable";
    }

    if (messageElement) {
      messageElement.innerHTML = `
        <span class="ai-status-danger">
          <i class="bi bi-exclamation-triangle-fill me-1"></i>
          AI prediction service is unavailable.
        </span>
      `;
    }

    if (recommendationElement) {
      recommendationElement.innerHTML = `
        <i class="bi bi-info-circle-fill me-1"></i>
        Start the Flask ML server to enable AI predictions.
      `;
    }
  }
}

// ==========================================================
// RECENT TRANSACTIONS
// ==========================================================

function displayRecentTransactions() {
  const tableBody = document.getElementById("recentTransactionsBody");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = "";

  if (!allTransactions || allTransactions.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td
          colspan="5"
          class="text-center text-muted"
        >
          No transactions found.
        </td>
      </tr>
    `;

    return;
  }

  const sortedTransactions = [...allTransactions].sort(function (a, b) {
    const dateA = parseDate(a.transactionDate || a.date || a.createdAt);

    const dateB = parseDate(b.transactionDate || b.date || b.createdAt);

    return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
  });

  const recent = sortedTransactions.slice(0, 10);

  recent.forEach(function (transaction) {
    appendTransactionRow(tableBody, transaction);
  });
}

// ==========================================================
// TRANSACTION ROW
// ==========================================================

function appendTransactionRow(tableBody, transaction) {
  const amount = Number(transaction.amount || 0);

  const type = String(transaction.type || "")
    .trim()
    .toLowerCase();

  const date = normalizeDate(
    transaction.transactionDate || transaction.date || transaction.createdAt,
  );

  // ========================================================
  // TYPE CLASS + ICON
  // ========================================================

  const isIncome = type === "income";

  const typeClass = isIncome ? "text-success" : "text-danger";

  const amountClass = isIncome ? "amount-income" : "amount-expense";

  const typeIcon = isIncome
    ? "bi-arrow-down-circle-fill"
    : "bi-arrow-up-circle-fill";

  const status = transaction.status || "Completed";

  // ========================================================
  // AMOUNT SIGN
  // ========================================================

  const displayAmount =
    (isIncome ? "+" : "-") + formatCurrency(Math.abs(amount));

  // ========================================================
  // CREATE ROW
  // ========================================================

  const row = document.createElement("tr");

  row.innerHTML = `

    <!-- DATE -->
    <td>
      ${escapeHtml(formatDate(date))}
    </td>

    <!-- CATEGORY -->
    <td>
      ${escapeHtml(transaction.category || "Other")}
    </td>

    <!-- TYPE -->
    <td class="${typeClass} transaction-type">

      <i class="bi ${typeIcon} transaction-type-icon"></i>

      ${escapeHtml(capitalize(type))}

    </td>

    <!-- AMOUNT -->
<!-- AMOUNT -->
<td class="transaction-amount">

  <span
    class="amount-value"
    style="
      color: ${isIncome ? "#00e676" : "#ff304f"} !important;
      font-weight: 800;
    "
  >
    ${displayAmount}
  </span>

</td>

    <!-- STATUS -->
    <td>
      <span class="badge bg-success">
        ${escapeHtml(status)}
      </span>
    </td>

  `;

  tableBody.appendChild(row);
}

// ==========================================================
// INCOME VS EXPENSE CHART
// ==========================================================

function createIncomeExpenseChart() {
  const canvas = document.getElementById("lineChart");

  if (!canvas || typeof Chart === "undefined") {
    return;
  }

  if (lineChartInstance) {
    lineChartInstance.destroy();

    lineChartInstance = null;
  }

  const monthlyData = getMonthlyIncomeExpense();

  lineChartInstance = new Chart(canvas, {
    type: "bar",

    data: {
      labels: monthlyData.labels,

      datasets: [
        {
          label: "Income",

          data: monthlyData.income,

          borderColor: "#00c835",

          backgroundColor: "#00e676",
        },

        {
          label: "Expense",

          data: monthlyData.expense,

          borderColor: "#d50000",

          backgroundColor: "#ff1744",
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      scales: {
        y: {
          beginAtZero: true,

          ticks: {
            callback: function (value) {
              return formatCurrency(value);
            },
          },
        },
      },

      plugins: {
        legend: {
          position: "top",
        },

        tooltip: {
          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + formatCurrency(context.raw);
            },
          },
        },
      },
    },
  });
}

// ==========================================================
// MONTHLY DATA
// ==========================================================

function getMonthlyIncomeExpense() {
  const data = {};

  allTransactions.forEach(function (transaction) {
    const date = normalizeDate(
      transaction.transactionDate || transaction.date || transaction.createdAt,
    );

    if (!date) {
      return;
    }

    const month = date.substring(0, 7);

    if (!data[month]) {
      data[month] = {
        income: 0,

        expense: 0,
      };
    }

    const amount = Number(transaction.amount || 0);

    const type = String(transaction.type || "")
      .trim()
      .toLowerCase();

    if (type === "income") {
      data[month].income += amount;
    }

    if (type === "expense") {
      data[month].expense += amount;
    }
  });

  const months = Object.keys(data).sort();

  const labels = months.map(function (month) {
    const parts = month.split("-");

    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);

    return date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  });

  return {
    labels: labels,

    income: months.map(function (month) {
      return data[month].income;
    }),

    expense: months.map(function (month) {
      return data[month].expense;
    }),
  };
}

// ==========================================================
// EXPENSE CATEGORY CHART
// ==========================================================

function createExpenseCategoryChart() {
  const canvas = document.getElementById("pieChart");

  if (!canvas || typeof Chart === "undefined") {
    return;
  }

  if (pieChartInstance) {
    pieChartInstance.destroy();

    pieChartInstance = null;
  }

  const categories = {};

  allTransactions.forEach(function (transaction) {
    const type = String(transaction.type || "")
      .trim()
      .toLowerCase();

    if (type !== "expense") {
      return;
    }

    const category = String(transaction.category || "Other").trim();

    const amount = Number(transaction.amount || 0);

    categories[category] = (categories[category] || 0) + amount;
  });

  const labels = Object.keys(categories);

  const values = labels.map(function (category) {
    return categories[category];
  });

  if (labels.length === 0) {
    return;
  }

  pieChartInstance = new Chart(canvas, {
    type: "doughnut",

    data: {
      labels: labels,

      datasets: [
        {
          data: values,

          backgroundColor: [
            "#22c55e", // Green
            "#2563eb", // Blue
            "#f59e0b", // Orange
            "#ef4444", // Red
            "#8b5cf6", // Purple
            "#06b6d4", // Cyan
            "#ec4899", // Pink
            "#84cc16", // Lime
            "#f97316", // Orange-red
            "#14b8a6", // Teal
          ],

          borderWidth: 0,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      cutout: "65%",

      plugins: {
        legend: {
          position: "bottom",
        },

        tooltip: {
          callbacks: {
            label: function (context) {
              return context.label + ": " + formatCurrency(context.raw);
            },
          },
        },
      },
    },
  });
}

// ==========================================================
// MONTHLY SAVINGS CHART
// ==========================================================

function createMonthlySavingsChart() {
  const canvas = document.getElementById("barChart");

  if (!canvas || typeof Chart === "undefined") {
    return;
  }

  if (barChartInstance) {
    barChartInstance.destroy();

    barChartInstance = null;
  }

  const data = getMonthlyIncomeExpense();

  const savings = data.labels.map(function (_, index) {
    return data.income[index] - data.expense[index];
  });

  barChartInstance = new Chart(canvas, {
    type: "bar",

    data: {
      labels: data.labels,

      datasets: [
        {
          label: "Savings",
          data: savings,

          backgroundColor: savings.map((value) =>
            value >= 0 ? "#00c853" : "#ff1744",
          ),

          borderColor: savings.map((value) =>
            value >= 0 ? "#00a844" : "#d50000",
          ),

          borderWidth: 2,
          borderRadius: 8,

          barThickness: 45,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      scales: {
        y: {
          beginAtZero: true,

          ticks: {
            callback: function (value) {
              return formatCurrency(value);
            },
          },
        },
      },

      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return "Savings: " + formatCurrency(context.raw);
            },
          },
        },
      },
    },
  });
}

// ==========================================================
// SAVINGS GOAL
// ==========================================================

function displaySavingsGoal() {
  const goalName = localStorage.getItem("savingsGoalName") || "No Goal Set";

  const saved = Number(localStorage.getItem("savingsGoalSaved") || 0);

  const target = Number(localStorage.getItem("savingsGoalTarget") || 0);

  let percentage = 0;

  if (target > 0) {
    percentage = Math.round((saved / target) * 100);
  }

  const progress = Math.min(Math.max(percentage, 0), 100);

  setText("savingsGoalName", goalName);

  setText("savingsGoalSaved", formatCurrency(saved));

  setText("savingsGoalTarget", formatCurrency(target));

  setText("savingsGoalPercentage", percentage + "%");

  const progressElement = document.getElementById("savingsGoalProgress");

  if (progressElement) {
    progressElement.style.width = progress + "%";

    progressElement.textContent = percentage + "%";

    progressElement.setAttribute("aria-valuenow", percentage);
  }
}

// ==========================================================
// SEARCH
// ==========================================================

function setupSearch() {
  const searchInput = document.getElementById("dashboardSearch");

  if (!searchInput) {
    return;
  }

  searchInput.addEventListener("input", function () {
    const searchText = this.value.trim().toLowerCase();

    if (!searchText) {
      displayRecentTransactions();

      return;
    }

    const filtered = allTransactions.filter(function (transaction) {
      const searchableText = [
        transaction.category,
        transaction.type,
        transaction.description,
        transaction.merchant,
        transaction.paymentMethod,
        transaction.status,
        transaction.amount,
      ]

        .filter(Boolean)

        .join(" ")

        .toLowerCase();

      return searchableText.includes(searchText);
    });

    displayFilteredTransactions(filtered);
  });
}

// ==========================================================
// DISPLAY SEARCH RESULTS
// ==========================================================

function displayFilteredTransactions(transactions) {
  const tableBody = document.getElementById("recentTransactionsBody");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = "";

  const recent = transactions.slice(0, 10);

  if (recent.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td
          colspan="5"
          class="text-center text-muted"
        >
          No matching transactions.
        </td>
      </tr>
    `;

    return;
  }

  recent.forEach(function (transaction) {
    appendTransactionRow(tableBody, transaction);
  });
}

// ==========================================================
// NORMALIZE DATE
// ==========================================================

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  const stringValue = String(value);

  if (stringValue.includes("T")) {
    return stringValue.split("T")[0];
  }

  if (stringValue.includes(" ")) {
    return stringValue.split(" ")[0];
  }

  return stringValue.substring(0, 10);
}

// ==========================================================
// PARSE DATE
// ==========================================================

function parseDate(value) {
  const normalized = normalizeDate(value);

  if (!normalized) {
    return null;
  }

  const date = new Date(normalized + "T00:00:00");

  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
}

// ==========================================================
// TODAY DATE
// ==========================================================

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

// ==========================================================
// FORMAT DATE
// ==========================================================

function formatDate(dateValue) {
  const date = parseDate(dateValue);

  if (!date) {
    return "N/A";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ==========================================================
// CAPITALIZE
// ==========================================================

function capitalize(value) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

// ==========================================================
// SET TEXT
// ==========================================================

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

// ==========================================================
// ESCAPE HTML
// ==========================================================

function escapeHtml(value) {
  const div = document.createElement("div");

  div.textContent = value == null ? "" : String(value);

  return div.innerHTML;
}

// ==========================================================
// CURRENCY CHANGE
// ==========================================================

window.addEventListener("currencyChanged", function (event) {
  console.log(
    "Dashboard currency changed:",
    event.detail ? event.detail.currency : getSelectedCurrency(),
  );

  calculateDashboard();
});

// ==========================================================
// STORAGE CHANGE
// ==========================================================

window.addEventListener("storage", function (event) {
  if (event.key === "currency") {
    calculateDashboard();
  }

  if (
    event.key === "savingsGoalName" ||
    event.key === "savingsGoalSaved" ||
    event.key === "savingsGoalTarget"
  ) {
    displaySavingsGoal();
  }

  if (event.key === "profileImage") {
    const image = document.getElementById("profileImage");

    if (image && event.newValue) {
      image.src = event.newValue;
    }
  }

  if (event.key === "fullName") {
    const userName = event.newValue || "User";

    setText("userName", userName);

    setText("navbarUserName", userName);
  }
});

// ==========================================================
// SAVINGS GOAL LIVE UPDATE
// ==========================================================

window.addEventListener("savingsGoalChanged", function () {
  displaySavingsGoal();
});

// ==========================================================
// PROFILE UPDATE
// ==========================================================

window.addEventListener("profileUpdated", function (event) {
  if (!event.detail || !event.detail.user) {
    return;
  }

  const user = event.detail.user;

  const fullName = user.fullName || user.name || "User";

  setText("userName", fullName);

  setText("navbarUserName", fullName);

  if (user.profileImage) {
    const image = document.getElementById("profileImage");

    if (image) {
      image.src = user.profileImage;
    }
  }
});
