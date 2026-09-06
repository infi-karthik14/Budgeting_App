// ==========================================================
// BACHAT BUDDY - BUDGET
// Backend Connected + Transactions + Charts + Currency
// ==========================================================

"use strict";

// ==========================================================
// API
// ==========================================================

const BUDGET_API_URL = "https://budgetingapp-production-a92b.up.railway.app/api/budgets";

const TRANSACTION_API_URL = "https://budgetingapp-production-a92b.up.railway.app/api/transactions";

// ==========================================================
// GLOBAL DATA
// ==========================================================

let budgets = [];

let transactions = [];

let budgetChart = null;

let pieChart = null;

// ==========================================================
// PAGE LOAD
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("Budget JS loaded.");

  if (!checkLogin()) {
    return;
  }

  loadUserData();

  setDefaultMonth();

  setupSearch();

  setupCurrencyChange();

  loadBudgetData();
});

// ==========================================================
// LOGIN CHECK
// ==========================================================

function checkLogin() {
  const loggedIn = sessionStorage.getItem("loggedIn");

  const userId = sessionStorage.getItem("userId");

  if (loggedIn !== "true" || !userId) {
    console.error("User is not logged in or userId is missing.");

    window.location.href = "login.html";

    return false;
  }

  return true;
}

// ==========================================================
// USER ID
// ==========================================================

function getUserId() {
  return sessionStorage.getItem("userId");
}

// ==========================================================
// USER DATA
// ==========================================================

function loadUserData() {
  const userName =
    sessionStorage.getItem("fullName") ||
    sessionStorage.getItem("userName") ||
    "User";

  const userNameElement = document.getElementById("userName");

  if (userNameElement) {
    userNameElement.textContent = userName;
  }

  const profileImage = localStorage.getItem("profileImage");

  const profileImageElement = document.getElementById("profileImage");

  if (profileImage && profileImageElement) {
    profileImageElement.src = profileImage;
  }
}

// ==========================================================
// DEFAULT MONTH
// ==========================================================

function setDefaultMonth() {
  const monthInput = document.getElementById("budgetMonth");

  if (!monthInput) {
    return;
  }

  if (!monthInput.value) {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    monthInput.value = `${year}-${month}`;
  }
}

// ==========================================================
// LOAD BUDGET DATA
// ==========================================================

async function loadBudgetData() {
  try {
    showTableMessage("Loading budgets...");

    const userId = getUserId();

    // --------------------------------------------------
    // LOAD BUDGETS
    // --------------------------------------------------

    const budgetResponse = await fetch(`${BUDGET_API_URL}/user/${userId}`);

    if (!budgetResponse.ok) {
      const errorText = await budgetResponse.text();

      throw new Error(
        errorText || `Budget API returned ${budgetResponse.status}`,
      );
    }

    const budgetData = await budgetResponse.json();

    budgets = Array.isArray(budgetData) ? budgetData : [];

    console.log("Budgets:", budgets);

    // --------------------------------------------------
    // LOAD TRANSACTIONS
    // --------------------------------------------------

    try {
      const transactionResponse = await fetch(
        `${TRANSACTION_API_URL}/user/${userId}`,
      );

      if (transactionResponse.ok) {
        const transactionData = await transactionResponse.json();

        transactions = Array.isArray(transactionData) ? transactionData : [];
      } else {
        console.warn("Unable to load transactions.");

        transactions = [];
      }
    } catch (transactionError) {
      console.error("Transaction loading error:", transactionError);

      transactions = [];
    }

    // --------------------------------------------------
    // DISPLAY
    // --------------------------------------------------

    displayBudgets();

    updateSummary();

    updateMonthlyUsage();

    updateCharts();
  } catch (error) {
    console.error("BUDGET LOAD ERROR:", error);

    budgets = [];

    transactions = [];

    showTableMessage("Unable to load budgets: " + error.message);

    updateSummary();

    updateMonthlyUsage();

    updateCharts();
  }
}

// ==========================================================
// SAVE BUDGET
// ==========================================================

async function saveBudget() {
  const userId = getUserId();

  if (!userId) {
    alert("Please login again.");

    window.location.href = "login.html";

    return;
  }

  // ------------------------------------------------------
  // GET VALUES
  // ------------------------------------------------------

  const budgetName = getValue("budgetName").trim();

  const category = getValue("category").trim();

  const amount = Number(getValue("budgetAmount"));

  const month = getValue("budgetMonth");

  // ------------------------------------------------------
  // VALIDATION
  // ------------------------------------------------------

  if (!budgetName) {
    alert("Please enter a budget name.");

    focusElement("budgetName");

    return;
  }

  if (!category) {
    alert("Please select a category.");

    focusElement("category");

    return;
  }

  if (!amount || amount <= 0) {
    alert("Please enter a valid budget amount.");

    focusElement("budgetAmount");

    return;
  }

  if (!month) {
    alert("Please select a month.");

    focusElement("budgetMonth");

    return;
  }

  // ------------------------------------------------------
  // DATE RANGE
  // ------------------------------------------------------

  const dates = getMonthDateRange(month);

  // ------------------------------------------------------
  // MONTHLY INCOME
  // ------------------------------------------------------

  const monthlyIncome = calculateMonthlyIncome(month);

  // ------------------------------------------------------
  // REQUEST
  // ------------------------------------------------------

  const requestData = {
    userId: Number(userId),

    monthlyIncome: monthlyIncome,

    category: category,

    startDate: dates.startDate,

    endDate: dates.endDate,

    budgetAmount: amount,

    budgetName: budgetName,
  };

  console.log("Creating budget:", requestData);

  const saveButton = document.querySelector('button[onclick="saveBudget()"]');

  const originalHTML = saveButton ? saveButton.innerHTML : "";

  try {
    if (saveButton) {
      saveButton.disabled = true;

      saveButton.innerHTML = `
                <i class="bi bi-hourglass-split"></i>
                Saving...
            `;
    }

    const response = await fetch(BUDGET_API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(errorText || `Server returned ${response.status}`);
    }

    const savedBudget = await response.json();

    console.log("Budget saved:", savedBudget);

    alert("Budget saved successfully!");

    // --------------------------------------------------
    // CLEAR FORM
    // --------------------------------------------------

    clearBudgetForm();

    // --------------------------------------------------
    // RELOAD
    // --------------------------------------------------

    await loadBudgetData();
  } catch (error) {
    console.error("SAVE BUDGET ERROR:", error);

    alert("Unable to save budget.\n\n" + error.message);
  } finally {
    if (saveButton) {
      saveButton.disabled = false;

      saveButton.innerHTML =
        originalHTML ||
        `
                <i class="bi bi-plus-circle me-1"></i>
                Save
                `;
    }
  }
}

// ==========================================================
// GET MONTH DATE RANGE
// ==========================================================

function getMonthDateRange(month) {
  const parts = month.split("-");

  const year = Number(parts[0]);

  const monthNumber = Number(parts[1]);

  const lastDay = new Date(year, monthNumber, 0).getDate();

  return {
    startDate: `${year}-${String(monthNumber).padStart(2, "0")}-01`,

    endDate: `${year}-${String(monthNumber).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
  };
}

// ==========================================================
// CALCULATE MONTHLY INCOME
// ==========================================================

function calculateMonthlyIncome(month) {
  let income = 0;

  transactions.forEach(function (transaction) {
    const type = String(transaction.type || "")
      .trim()
      .toLowerCase();

    if (type !== "income") {
      return;
    }

    const date = normalizeDate(
      transaction.transactionDate || transaction.date || transaction.createdAt,
    );

    if (date && date.substring(0, 7) === month) {
      income += Number(transaction.amount || 0);
    }
  });

  return income;
}

// ==========================================================
// DISPLAY BUDGETS
// ==========================================================

function displayBudgets() {
  const tableBody = document.getElementById("budgetTableBody");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = "";

  if (!budgets.length) {
    showTableMessage("No budgets found.");

    return;
  }

  budgets.forEach(function (budget) {
    const spent = calculateBudgetSpent(budget);

    const budgetAmount = Number(budget.budgetAmount || 0);

    const remaining = budgetAmount - spent;

    const percentage =
      budgetAmount > 0 ? Math.round((spent / budgetAmount) * 100) : 0;

    const row = document.createElement("tr");

    row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(budget.category || "Other")}
                    </strong>

                    <br>

                    <small class="text-muted">
                        ${escapeHTML(budget.budgetName || "")}
                    </small>
                </td>

                <td>
                    ${formatCurrency(budgetAmount)}
                </td>

                <td class="text-danger fw-bold">
                    ${formatCurrency(spent)}
                </td>

                <td class="${
                  remaining >= 0 ? "text-success" : "text-danger"
                } fw-bold">

                    ${formatCurrency(remaining)}

                </td>

                <td>
                    ${getBudgetStatus(percentage, remaining)}
                </td>

                <td class="budget-actions">

                    <button
                        type="button"
                        class="btn btn-sm btn-warning"
                        onclick="editBudget(${budget.id})"
                        title="Edit Budget"
                    >
                        <i class="bi bi-pencil"></i>
                    </button>

                    <button
                        type="button"
                        class="btn btn-sm btn-danger ms-1"
                        onclick="deleteBudget(${budget.id})"
                        title="Delete Budget"
                    >
                        <i class="bi bi-trash"></i>
                    </button>

                </td>
            `;

    tableBody.appendChild(row);
  });
}

// ==========================================================
// BUDGET STATUS
// ==========================================================

function getBudgetStatus(percentage, remaining) {
  if (remaining < 0) {
    return `
            <span class="badge bg-danger">
                Over Budget
            </span>
        `;
  }

  if (percentage >= 100) {
    return `
            <span class="badge bg-danger">
                Limit Reached
            </span>
        `;
  }

  if (percentage >= 80) {
    return `
            <span class="badge bg-warning text-dark">
                Near Limit
            </span>
        `;
  }

  return `
        <span class="badge bg-success">
            Within Budget
        </span>
    `;
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

  transactions.forEach(function (transaction) {
    const type = String(transaction.type || "")
      .trim()
      .toLowerCase();

    if (type !== "expense") {
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
// SUMMARY
// ==========================================================

function updateSummary() {
  let totalBudget = 0;

  let totalSpent = 0;

  const categorySet = new Set();

  budgets.forEach(function (budget) {
    const amount = Number(budget.budgetAmount || 0);

    const spent = calculateBudgetSpent(budget);

    totalBudget += amount;

    totalSpent += spent;

    if (budget.category) {
      categorySet.add(String(budget.category).trim().toLowerCase());
    }
  });

  const remaining = totalBudget - totalSpent;

  setText("totalBudget", formatCurrency(totalBudget));

  setText("totalSpent", formatCurrency(totalSpent));

  setText("remainingBudget", formatCurrency(remaining));

  setText("budgetCategoryCount", categorySet.size);
}

// ==========================================================
// MONTHLY USAGE
// ==========================================================

function updateMonthlyUsage() {
  const selectedMonth = getValue("budgetMonth");

  let monthlyBudget = 0;

  let monthlySpent = 0;

  budgets.forEach(function (budget) {
    const budgetMonth = normalizeDate(budget.startDate).substring(0, 7);

    if (selectedMonth && budgetMonth !== selectedMonth) {
      return;
    }

    const amount = Number(budget.budgetAmount || 0);

    const spent = calculateBudgetSpent(budget);

    monthlyBudget += amount;

    monthlySpent += spent;
  });

  const remaining = monthlyBudget - monthlySpent;

  let percentage = 0;

  if (monthlyBudget > 0) {
    percentage = Math.round((monthlySpent / monthlyBudget) * 100);
  }

  const progress = Math.min(Math.max(percentage, 0), 100);

  setText("monthlyBudgetPercentage", percentage + "%");

  setText("monthlySpent", formatCurrency(monthlySpent));

  setText("monthlyBudgetLimit", formatCurrency(monthlyBudget));

  const progressElement = document.getElementById("monthlyBudgetProgress");

  if (progressElement) {
    progressElement.style.width = progress + "%";

    progressElement.textContent = percentage + "%";

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
}

// ==========================================================
// EDIT BUDGET
// ==========================================================

function editBudget(id) {
  const budget = budgets.find(function (item) {
    return String(item.id) === String(id);
  });

  if (!budget) {
    alert("Budget not found.");

    return;
  }

  const newName = prompt("Enter budget name:", budget.budgetName || "");

  if (newName === null || !newName.trim()) {
    return;
  }

  const newAmount = prompt("Enter budget amount:", budget.budgetAmount || "");

  if (newAmount === null) {
    return;
  }

  const amount = Number(newAmount);

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount.");

    return;
  }

  updateBudget(budget, newName.trim(), amount);
}

// ==========================================================
// UPDATE BUDGET
// ==========================================================

async function updateBudget(budget, budgetName, budgetAmount) {
  const userId = getUserId();

  const requestData = {
    userId: Number(userId),

    monthlyIncome: budget.monthlyIncome
      ? Number(budget.monthlyIncome)
      : calculateMonthlyIncome(normalizeDate(budget.startDate).substring(0, 7)),

    category: budget.category,

    startDate: budget.startDate,

    endDate: budget.endDate,

    budgetAmount: budgetAmount,

    budgetName: budgetName,
  };

  try {
    const response = await fetch(`${BUDGET_API_URL}/${budget.id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(errorText || "Failed to update budget.");
    }

    await response.json();

    alert("Budget updated successfully!");

    await loadBudgetData();
  } catch (error) {
    console.error("UPDATE BUDGET ERROR:", error);

    alert("Unable to update budget.\n\n" + error.message);
  }
}

// ==========================================================
// DELETE BUDGET
// ==========================================================

async function deleteBudget(id) {
  const budget = budgets.find(function (item) {
    return String(item.id) === String(id);
  });

  if (!budget) {
    alert("Budget not found.");

    return;
  }

  const confirmed = confirm(`Delete "${budget.budgetName}" budget?`);

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${BUDGET_API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(errorText || "Failed to delete budget.");
    }

    alert("Budget deleted successfully!");

    await loadBudgetData();
  } catch (error) {
    console.error("DELETE BUDGET ERROR:", error);

    alert("Unable to delete budget.\n\n" + error.message);
  }
}

// ==========================================================
// SEARCH
// ==========================================================

function setupSearch() {
  const searchInput = document.getElementById("budgetSearch");

  if (!searchInput) {
    return;
  }

  searchInput.addEventListener("input", function () {
    const searchText = this.value.trim().toLowerCase();

    const filtered = budgets.filter(function (budget) {
      const text = [
        budget.budgetName,

        budget.category,

        budget.budgetAmount,

        budget.startDate,

        budget.endDate,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(searchText);
    });

    displayFilteredBudgets(filtered);
  });
}

// ==========================================================
// DISPLAY FILTERED BUDGETS
// ==========================================================

function displayFilteredBudgets(filteredBudgets) {
  const tableBody = document.getElementById("budgetTableBody");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = "";

  if (!filteredBudgets || !filteredBudgets.length) {
    showTableMessage("No matching budgets found.");

    return;
  }

  filteredBudgets.forEach(function (budget) {
    const spent = calculateBudgetSpent(budget);

    const amount = Number(budget.budgetAmount || 0);

    const remaining = amount - spent;

    const percentage = amount > 0 ? Math.round((spent / amount) * 100) : 0;

    const row = document.createElement("tr");

    row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(budget.category || "Other")}
                    </strong>

                    <br>

                    <small class="text-muted">
                        ${escapeHTML(budget.budgetName || "")}
                    </small>
                </td>

                <td>
                    ${formatCurrency(amount)}
                </td>

                <td class="text-danger fw-bold">
                    ${formatCurrency(spent)}
                </td>

                <td class="${
                  remaining >= 0 ? "text-success" : "text-danger"
                } fw-bold">
                    ${formatCurrency(remaining)}
                </td>

                <td>
                    ${getBudgetStatus(percentage, remaining)}
                </td>

                <td class="budget-actions">

                    <button
                        type="button"
                        class="btn btn-sm btn-warning"
                        onclick="editBudget(${budget.id})"
                    >
                        <i class="bi bi-pencil"></i>
                    </button>

                    <button
                        type="button"
                        class="btn btn-sm btn-danger ms-1"
                        onclick="deleteBudget(${budget.id})"
                    >
                        <i class="bi bi-trash"></i>
                    </button>

                </td>
            `;

    tableBody.appendChild(row);
  });
}

// ==========================================================
// CHARTS
// ==========================================================

function updateCharts() {
  if (typeof Chart === "undefined") {
    console.error("Chart.js is not loaded.");

    return;
  }

  createBudgetChart();

  createPieChart();
}

// ==========================================================
// BUDGET VS SPENT CHART
// ==========================================================

function createBudgetChart() {
  const canvas = document.getElementById("budgetChart");

  if (!canvas) {
    return;
  }

  if (budgetChart) {
    budgetChart.destroy();

    budgetChart = null;
  }

  const labels = budgets.map(function (budget) {
    return budget.category || "Other";
  });

  const budgetValues = budgets.map(function (budget) {
    return Number(budget.budgetAmount || 0);
  });

  const spentValues = budgets.map(function (budget) {
    return calculateBudgetSpent(budget);
  });

  budgetChart = new Chart(canvas, {
    type: "bar",

    data: {
      labels: labels,

      datasets: [
        {
          label: "Budget",

          data: budgetValues,

          backgroundColor: "#2563eb",

          borderRadius: 6,
        },

        {
          label: "Spent",

          data: spentValues,

          backgroundColor: "#ef4444",

          borderRadius: 6,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + formatCurrency(context.raw);
            },
          },
        },
      },

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
    },
  });
}

// ==========================================================
// PIE CHART
// ==========================================================

function createPieChart() {
  const canvas = document.getElementById("pieChart");

  if (!canvas) {
    return;
  }

  if (pieChart) {
    pieChart.destroy();

    pieChart = null;
  }

  const categoryData = {};

  budgets.forEach(function (budget) {
    const category = budget.category || "Other";

    const amount = Number(budget.budgetAmount || 0);

    categoryData[category] = (categoryData[category] || 0) + amount;
  });

  const labels = Object.keys(categoryData);

  const values = labels.map(function (category) {
    return categoryData[category];
  });

  pieChart = new Chart(canvas, {
    type: "doughnut",

    data: {
      labels: labels,

      datasets: [
        {
          data: values,

          backgroundColor: [
            "#22c55e",

            "#2563eb",

            "#f59e0b",

            "#ef4444",

            "#8b5cf6",

            "#06b6d4",

            "#ec4899",

            "#84cc16",
          ],

          borderWidth: 0,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      cutout: "60%",

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
// CURRENCY CHANGE
// ==========================================================

function setupCurrencyChange() {
  window.addEventListener("currencyChanged", function () {
    console.log("Budget currency changed.");

    displayBudgets();

    updateSummary();

    updateMonthlyUsage();

    updateCharts();
  });

  window.addEventListener("storage", function (event) {
    if (event.key === "currency") {
      displayBudgets();

      updateSummary();

      updateMonthlyUsage();

      updateCharts();
    }

    if (event.key === "profileImage") {
      const image = document.getElementById("profileImage");

      if (image && event.newValue) {
        image.src = event.newValue;
      }
    }
  });
}

// ==========================================================
// MONTH CHANGE
// ==========================================================

document.addEventListener("change", function (event) {
  if (event.target.id === "budgetMonth") {
    updateMonthlyUsage();
  }
});

// ==========================================================
// HELPERS
// ==========================================================

function getValue(id) {
  const element = document.getElementById(id);

  return element ? element.value : "";
}

// ==========================================================

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

// ==========================================================

function focusElement(id) {
  const element = document.getElementById(id);

  if (element) {
    element.focus();
  }
}

// ==========================================================

function normalizeDate(value) {
  if (!value) {
    return "";
  }

  return String(value).split("T")[0].substring(0, 10);
}

// ==========================================================

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================================

function showTableMessage(message) {
  const tableBody = document.getElementById("budgetTableBody");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="text-center"
            >

                ${escapeHTML(message)}

            </td>

        </tr>

    `;
}

// ==========================================================
// CLEAR FORM
// ==========================================================

function clearBudgetForm() {
  const name = document.getElementById("budgetName");

  const category = document.getElementById("category");

  const amount = document.getElementById("budgetAmount");

  if (name) {
    name.value = "";
  }

  if (category) {
    category.value = "";
  }

  if (amount) {
    amount.value = "";
  }

  setDefaultMonth();
}

// ==========================================================
// GLOBAL FUNCTIONS
// ==========================================================

window.saveBudget = saveBudget;

window.editBudget = editBudget;

window.deleteBudget = deleteBudget;

