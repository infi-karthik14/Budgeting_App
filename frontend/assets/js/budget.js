// ==========================================================
// BACHAT BUDDY - BUDGET PAGE
// ==========================================================

// ==========================================================
// GLOBAL VARIABLES
// ==========================================================

let editingBudgetId = null;

let allBudgets = [];

// ==========================================================
// PAGE LOAD
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {
  loadUserData();

  loadBudgets();

  setupSearch();

  setupTableHeader();
});

// ==========================================================
// LOAD USER DATA
// ==========================================================

function loadUserData() {
  const profileImage = localStorage.getItem("profileImage");

  const userName =
    sessionStorage.getItem("fullName") ||
    localStorage.getItem("userName") ||
    "User";

  const profileImageElement = document.getElementById("profileImage");

  const userNameElement = document.getElementById("userName");

  // --------------------------------------------------------
  // PROFILE IMAGE
  // --------------------------------------------------------

  if (profileImage && profileImageElement) {
    profileImageElement.src = profileImage;
  }

  // --------------------------------------------------------
  // USER NAME
  // --------------------------------------------------------

  if (userNameElement) {
    userNameElement.textContent = userName;
  }
}

// ==========================================================
// SETUP TABLE HEADER
// ==========================================================

function setupTableHeader() {
  const tableBody = document.getElementById("budgetTableBody");

  if (!tableBody) {
    return;
  }

  const table = tableBody.closest("table");

  if (!table) {
    return;
  }

  const tableHead = table.querySelector("thead");

  if (!tableHead) {
    return;
  }

  const headerRow = tableHead.querySelector("tr");

  if (!headerRow) {
    return;
  }

  // --------------------------------------------------------
  // CHECK IF ACTIONS ALREADY EXISTS
  // --------------------------------------------------------

  const existingActions = headerRow.querySelector(".budget-actions-header");

  if (existingActions) {
    return;
  }

  // --------------------------------------------------------
  // ADD ACTIONS HEADER
  // --------------------------------------------------------

  const actionsHeader = document.createElement("th");

  actionsHeader.className = "budget-actions-header";

  actionsHeader.textContent = "Actions";

  headerRow.appendChild(actionsHeader);
}

// ==========================================================
// SAVE / UPDATE BUDGET
// ==========================================================

async function saveBudget() {
  // ========================================================
  // GET FORM ELEMENTS
  // ========================================================

  const budgetNameElement = document.getElementById("budgetName");

  const categoryElement = document.getElementById("category");

  const budgetAmountElement = document.getElementById("budgetAmount");

  const budgetMonthElement = document.getElementById("budgetMonth");

  // ========================================================
  // CHECK HTML ELEMENTS
  // ========================================================

  if (
    !budgetNameElement ||
    !categoryElement ||
    !budgetAmountElement ||
    !budgetMonthElement
  ) {
    console.error("Budget form elements not found.");

    alert("Budget form is not configured correctly.");

    return;
  }

  // ========================================================
  // GET VALUES
  // ========================================================

  const budgetName = budgetNameElement.value.trim();

  const category = categoryElement.value.trim();

  const budgetAmount = Number(budgetAmountElement.value);

  const budgetMonth = budgetMonthElement.value;

  // ========================================================
  // VALIDATION
  // ========================================================

  if (!budgetName) {
    alert("Please enter budget name.");

    budgetNameElement.focus();

    return;
  }

  if (!category) {
    alert("Please select category.");

    categoryElement.focus();

    return;
  }

  if (!budgetAmount || budgetAmount <= 0) {
    alert("Please enter a valid budget amount.");

    budgetAmountElement.focus();

    return;
  }

  if (!budgetMonth) {
    alert("Please select a month.");

    budgetMonthElement.focus();

    return;
  }

  // ========================================================
  // GET USER ID
  // ========================================================

  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    alert("User ID not found. Please login again.");

    window.location.href = "login.html";

    return;
  }

  // ========================================================
  // CREATE START DATE
  // ========================================================

  const startDate = budgetMonth + "-01";

  // ========================================================
  // CREATE END DATE
  // ========================================================

  const parts = budgetMonth.split("-");

  const year = Number(parts[0]);

  const month = Number(parts[1]);

  const lastDay = new Date(year, month, 0).getDate();

  const endDate = budgetMonth + "-" + String(lastDay).padStart(2, "0");

  // ========================================================
  // REQUEST DATA
  // ========================================================

  const budgetData = {
    userId: Number(userId),

    monthlyIncome: 50000,

    monthlyBudget: budgetAmount,

    category: category,

    startDate: startDate,

    endDate: endDate,

    budgetAmount: String(budgetAmount),

    budgetName: budgetName,
  };

  console.log("Budget Data:", budgetData);

  // ========================================================
  // DETERMINE ADD OR UPDATE
  // ========================================================

  let url = "http://localhost:8080/api/budgets";

  let method = "POST";

  if (editingBudgetId !== null) {
    url = "http://localhost:8080/api/budgets/" + editingBudgetId;

    method = "PUT";
  }

  // ========================================================
  // SEND REQUEST
  // ========================================================

  try {
    const response = await fetch(url, {
      method: method,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(budgetData),
    });

    // ====================================================
    // SERVER ERROR
    // ====================================================

    if (!response.ok) {
      let errorMessage = "Unable to save budget.";

      try {
        const errorData = await response.json();

        console.error("Spring Boot Error:", errorData);

        errorMessage = errorData.message || errorMessage;
      } catch (error) {
        console.error("Could not read server error.", error);
      }

      throw new Error(errorMessage);
    }

    // ====================================================
    // GET RESPONSE
    // ====================================================

    const savedBudget = await response.json();

    console.log("Saved Budget:", savedBudget);

    // ====================================================
    // SUCCESS MESSAGE
    // ====================================================

    if (editingBudgetId !== null) {
      alert("Budget updated successfully!");
    } else {
      alert("Budget saved successfully!");
    }

    // ====================================================
    // RESET FORM
    // ====================================================

    resetBudgetForm();

    // ====================================================
    // RELOAD
    // ====================================================

    await loadBudgets();
  } catch (error) {
    console.error("Error saving budget:", error);

    alert(error.message || "Unable to save budget.");
  }
}

// ==========================================================
// RESET BUDGET FORM
// ==========================================================

function resetBudgetForm() {
  const budgetNameElement = document.getElementById("budgetName");

  const categoryElement = document.getElementById("category");

  const budgetAmountElement = document.getElementById("budgetAmount");

  const budgetMonthElement = document.getElementById("budgetMonth");

  if (budgetNameElement) {
    budgetNameElement.value = "";
  }

  if (categoryElement) {
    categoryElement.value = "";
  }

  if (budgetAmountElement) {
    budgetAmountElement.value = "";
  }

  if (budgetMonthElement) {
    budgetMonthElement.value = "";
  }

  // --------------------------------------------------------
  // EXIT EDIT MODE
  // --------------------------------------------------------

  editingBudgetId = null;

  // --------------------------------------------------------
  // CHANGE BUTTON BACK TO SAVE
  // --------------------------------------------------------

  const saveButton = document.querySelector('button[onclick="saveBudget()"]');

  if (saveButton) {
    saveButton.textContent = "Save";

    saveButton.classList.remove("btn-warning");

    saveButton.classList.add("btn-primary");
  }
}

// ==========================================================
// EDIT BUDGET
// ==========================================================

function editBudget(id) {
  console.log("Editing Budget ID:", id);

  // ========================================================
  // FIND BUDGET
  // ========================================================

  const budget = allBudgets.find(function (item) {
    return Number(item.id) === Number(id);
  });

  if (!budget) {
    alert("Budget not found.");

    return;
  }

  // ========================================================
  // GET FORM ELEMENTS
  // ========================================================

  const budgetNameElement = document.getElementById("budgetName");

  const categoryElement = document.getElementById("category");

  const budgetAmountElement = document.getElementById("budgetAmount");

  const budgetMonthElement = document.getElementById("budgetMonth");

  // ========================================================
  // FILL FORM
  // ========================================================

  if (budgetNameElement) {
    budgetNameElement.value = budget.budgetName || "";
  }

  if (categoryElement) {
    categoryElement.value = budget.category || "";
  }

  if (budgetAmountElement) {
    budgetAmountElement.value = Number(budget.budgetAmount || 0);
  }

  // ========================================================
  // SET MONTH
  // ========================================================

  if (budgetMonthElement) {
    let month = "";

    if (budget.startDate) {
      const date = normalizeDate(budget.startDate);

      if (date) {
        month = date.substring(0, 7);
      }
    }

    budgetMonthElement.value = month;
  }

  // ========================================================
  // SAVE ID FOR UPDATE
  // ========================================================

  editingBudgetId = Number(id);

  // ========================================================
  // CHANGE BUTTON
  // ========================================================

  const saveButton = document.querySelector('button[onclick="saveBudget()"]');

  if (saveButton) {
    saveButton.textContent = "Update";

    saveButton.classList.remove("btn-primary");

    saveButton.classList.add("btn-warning");
  }

  // ========================================================
  // SCROLL TO FORM
  // ========================================================

  const formCard = document.querySelector(".form-card");

  if (formCard) {
    formCard.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}

// ==========================================================
// CANCEL EDIT
// ==========================================================

function cancelEdit() {
  resetBudgetForm();
}

// ==========================================================
// DELETE BUDGET
// ==========================================================

async function deleteBudget(id) {
  // ========================================================
  // CONFIRM
  // ========================================================

  const confirmed = confirm("Are you sure you want to delete this budget?");

  if (!confirmed) {
    return;
  }

  // ========================================================
  // GET USER ID
  // ========================================================

  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    alert("User ID not found. Please login again.");

    window.location.href = "login.html";

    return;
  }

  // ========================================================
  // DELETE REQUEST
  // ========================================================

  try {
    const response = await fetch("http://localhost:8080/api/budgets/" + id, {
      method: "DELETE",
    });

    // ====================================================
    // ERROR
    // ====================================================

    if (!response.ok) {
      let errorMessage = "Unable to delete budget.";

      try {
        const errorData = await response.json();

        errorMessage = errorData.message || errorMessage;
      } catch (error) {
        console.error("Could not read delete error.", error);
      }

      throw new Error(errorMessage);
    }

    // ====================================================
    // SUCCESS
    // ====================================================

    alert("Budget deleted successfully!");

    // ====================================================
    // RESET IF EDITING SAME BUDGET
    // ====================================================

    if (editingBudgetId !== null && Number(editingBudgetId) === Number(id)) {
      resetBudgetForm();
    }

    // ====================================================
    // RELOAD
    // ====================================================

    await loadBudgets();
  } catch (error) {
    console.error("Error deleting budget:", error);

    alert(error.message || "Unable to delete budget.");
  }
}

// ==========================================================
// LOAD BUDGETS + TRANSACTIONS
// ==========================================================

async function loadBudgets() {
  // ========================================================
  // GET USER ID
  // ========================================================

  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    console.log("User ID not available.");

    return;
  }

  try {
    // ====================================================
    // GET USER BUDGETS
    // ====================================================

    const budgetResponse = await fetch(
      "http://localhost:8080/api/budgets/user/" + userId,
    );

    if (!budgetResponse.ok) {
      throw new Error("Failed to load budgets: " + budgetResponse.status);
    }

    const budgets = await budgetResponse.json();

    console.log("User Budgets:", budgets);

    // ====================================================
    // STORE GLOBALLY
    // ====================================================

    allBudgets = Array.isArray(budgets) ? budgets : [];

    // ====================================================
    // GET TRANSACTIONS
    // ====================================================

    const transactionResponse = await fetch(
      "http://localhost:8080/api/transactions/user/" + userId,
    );

    if (!transactionResponse.ok) {
      throw new Error(
        "Failed to load transactions: " + transactionResponse.status,
      );
    }

    const transactions = await transactionResponse.json();

    console.log("User Transactions:", transactions);

    // ====================================================
    // CALCULATE SPENDING
    // ====================================================

    allBudgets.forEach(function (budget) {
      const budgetCategory = String(budget.category || "")
        .trim()
        .toLowerCase();

      const budgetStartDate = normalizeDate(budget.startDate);

      const budgetEndDate = normalizeDate(budget.endDate);

      let spent = 0;

      // ==========================================
      // CHECK TRANSACTIONS
      // ==========================================

      transactions.forEach(function (transaction) {
        const transactionCategory = String(transaction.category || "")
          .trim()
          .toLowerCase();

        const transactionType = String(transaction.type || "")
          .trim()
          .toLowerCase();

        // ----------------------------------
        // ONLY EXPENSE
        // ----------------------------------

        if (transactionType !== "expense") {
          return;
        }

        // ----------------------------------
        // CATEGORY MATCH
        // ----------------------------------

        if (transactionCategory !== budgetCategory) {
          return;
        }

        // ----------------------------------
        // TRANSACTION DATE
        // ----------------------------------

        const transactionDate = normalizeDate(
          transaction.transactionDate || transaction.date,
        );

        // ----------------------------------
        // START DATE
        // ----------------------------------

        if (budgetStartDate && transactionDate) {
          if (transactionDate < budgetStartDate) {
            return;
          }
        }

        // ----------------------------------
        // END DATE
        // ----------------------------------

        if (budgetEndDate && transactionDate) {
          if (transactionDate > budgetEndDate) {
            return;
          }
        }

        // ----------------------------------
        // ADD EXPENSE
        // ----------------------------------

        spent += Number(transaction.amount || 0);
      });

      // ==========================================
      // SAVE SPENT
      // ==========================================

      budget.spent = spent;

      console.log(
        "Category:",
        budget.category,
        "| Budget:",
        budget.budgetAmount,
        "| Spent:",
        spent,
      );
    });

    // ====================================================
    // DISPLAY
    // ====================================================

    displayBudgets(allBudgets);

    updateBudgetSummary(allBudgets);

    updateMonthlyBudgetUsage(allBudgets);

    updateBudgetCharts(allBudgets);
  } catch (error) {
    console.error("Error loading budgets:", error);

    displayLoadingError();
  }
}

// ==========================================================
// NORMALIZE DATE
// ==========================================================

function normalizeDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  // --------------------------------------------------------
  // DATE OBJECT
  // --------------------------------------------------------

  if (dateValue instanceof Date) {
    return dateValue.toISOString().split("T")[0];
  }

  // --------------------------------------------------------
  // STRING
  // --------------------------------------------------------

  const dateString = String(dateValue);

  // --------------------------------------------------------
  // ISO DATE
  // --------------------------------------------------------

  if (dateString.includes("T")) {
    return dateString.split("T")[0];
  }

  return dateString.substring(0, 10);
}

// ==========================================================
// UPDATE BUDGET SUMMARY
// ==========================================================

function updateBudgetSummary(budgets) {
  let totalBudget = 0;

  let totalSpent = 0;

  // ========================================================
  // CALCULATE TOTALS
  // ========================================================

  budgets.forEach(function (budget) {
    const budgetAmount = Number(budget.budgetAmount || 0);

    const spent = Number(budget.spent || 0);

    totalBudget += budgetAmount;

    totalSpent += spent;
  });

  // ========================================================
  // REMAINING
  // ========================================================

  const remaining = totalBudget - totalSpent;

  // ========================================================
  // UNIQUE CATEGORIES
  // ========================================================

  const uniqueCategories = new Set();

  budgets.forEach(function (budget) {
    const category = String(budget.category || "")
      .trim()
      .toLowerCase();

    if (category) {
      uniqueCategories.add(category);
    }
  });

  const categoryCount = uniqueCategories.size;

  // ========================================================
  // UPDATE HTML
  // ========================================================

  const totalBudgetElement = document.getElementById("totalBudget");

  const totalSpentElement = document.getElementById("totalSpent");

  const remainingElement = document.getElementById("remainingBudget");

  const categoryCountElement = document.getElementById("budgetCategoryCount");

  if (totalBudgetElement) {
    totalBudgetElement.textContent = "₹" + totalBudget.toLocaleString("en-IN");
  }

  if (totalSpentElement) {
    totalSpentElement.textContent = "₹" + totalSpent.toLocaleString("en-IN");
  }

  if (remainingElement) {
    remainingElement.textContent = "₹" + remaining.toLocaleString("en-IN");
  }

  if (categoryCountElement) {
    categoryCountElement.textContent = categoryCount;
  }
}

// ==========================================================
// UPDATE MONTHLY BUDGET USAGE
// ==========================================================

function updateMonthlyBudgetUsage(budgets) {
  let totalBudget = 0;

  let totalSpent = 0;

  // ========================================================
  // CALCULATE TOTALS
  // ========================================================

  budgets.forEach(function (budget) {
    totalBudget += Number(budget.budgetAmount || 0);

    totalSpent += Number(budget.spent || 0);
  });

  // ========================================================
  // CALCULATE PERCENTAGE
  // ========================================================

  let percentage = 0;

  if (totalBudget > 0) {
    percentage = Math.round((totalSpent / totalBudget) * 100);
  }

  // ========================================================
  // PROGRESS WIDTH
  // ========================================================

  const progressWidth = Math.min(Math.max(percentage, 0), 100);

  // ========================================================
  // FIND HTML ELEMENTS
  // ========================================================

  const percentageElement = document.getElementById("monthlyBudgetPercentage");

  const progressElement = document.getElementById("monthlyBudgetProgress");

  const spentElement = document.getElementById("monthlySpent");

  const budgetElement = document.getElementById("monthlyBudgetLimit");

  // ========================================================
  // UPDATE PERCENTAGE
  // ========================================================

  if (percentageElement) {
    percentageElement.textContent = percentage + "%";
  }

  // ========================================================
  // UPDATE SPENT
  // ========================================================

  if (spentElement) {
    spentElement.textContent = "₹" + totalSpent.toLocaleString("en-IN");
  }

  // ========================================================
  // UPDATE LIMIT
  // ========================================================

  if (budgetElement) {
    budgetElement.textContent = "₹" + totalBudget.toLocaleString("en-IN");
  }

  // ========================================================
  // UPDATE PROGRESS BAR
  // ========================================================

  if (progressElement) {
    progressElement.style.width = progressWidth + "%";

    progressElement.textContent = percentage + "%";

    progressElement.setAttribute("aria-valuenow", percentage);

    // -----------------------------------------------
    // REMOVE OLD COLORS
    // -----------------------------------------------

    progressElement.classList.remove("bg-success", "bg-warning", "bg-danger");

    // -----------------------------------------------
    // ADD NEW COLOR
    // -----------------------------------------------

    if (percentage >= 100) {
      progressElement.classList.add("bg-danger");
    } else if (percentage >= 80) {
      progressElement.classList.add("bg-danger");
    } else if (percentage >= 50) {
      progressElement.classList.add("bg-warning");
    } else {
      progressElement.classList.add("bg-success");
    }
  }

  console.log("Monthly Budget:", totalBudget);

  console.log("Monthly Spent:", totalSpent);

  console.log("Monthly Usage:", percentage + "%");
}

// ==========================================================
// UPDATE BUDGET CHARTS
// ==========================================================

function updateBudgetCharts(budgets) {
  const categoryData = {};

  // ========================================================
  // COMBINE SAME CATEGORIES
  // ========================================================

  budgets.forEach(function (budget) {
    const category = String(budget.category || "Other").trim();

    const budgetAmount = Number(budget.budgetAmount || 0);

    const spent = Number(budget.spent || 0);

    if (!categoryData[category]) {
      categoryData[category] = {
        budget: 0,

        spent: 0,
      };
    }

    categoryData[category].budget += budgetAmount;

    categoryData[category].spent += spent;
  });

  // ========================================================
  // CHART DATA
  // ========================================================

  const labels = Object.keys(categoryData);

  const budgetValues = labels.map(function (category) {
    return categoryData[category].budget;
  });

  const spentValues = labels.map(function (category) {
    return categoryData[category].spent;
  });

  // ========================================================
  // BAR CHART
  // ========================================================

  const budgetCanvas = document.getElementById("budgetChart");

  if (budgetCanvas && typeof Chart !== "undefined") {
    const oldChart = Chart.getChart(budgetCanvas);

    if (oldChart) {
      oldChart.destroy();
    }

    new Chart(budgetCanvas, {
      type: "bar",

      data: {
        labels: labels,

        datasets: [
          {
            label: "Budget",

            data: budgetValues,

            backgroundColor: "#2563eb",

            borderRadius: 10,
          },

          {
            label: "Spent",

            data: spentValues,

            backgroundColor: "#22c55e",

            borderRadius: 10,
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

        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // ========================================================
  // DOUGHNUT CHART
  // ========================================================

  const pieCanvas = document.getElementById("pieChart");

  if (pieCanvas && typeof Chart !== "undefined") {
    const oldPieChart = Chart.getChart(pieCanvas);

    if (oldPieChart) {
      oldPieChart.destroy();
    }

    new Chart(pieCanvas, {
      type: "doughnut",

      data: {
        labels: labels,

        datasets: [
          {
            label: "Spent",

            data: spentValues,

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

        cutout: "65%",

        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }
}

// ==========================================================
// DISPLAY BUDGETS
// ==========================================================

function displayBudgets(budgets) {
  const tableBody = document.getElementById("budgetTableBody");

  if (!tableBody) {
    console.error("Budget table body not found.");

    return;
  }

  // ========================================================
  // CLEAR TABLE
  // ========================================================

  tableBody.innerHTML = "";

  // ========================================================
  // NO BUDGETS
  // ========================================================

  if (!budgets || budgets.length === 0) {
    tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center text-muted"
                >

                    No budgets found.

                </td>

            </tr>

        `;

    return;
  }

  // ========================================================
  // DISPLAY EACH BUDGET
  // ========================================================

  budgets.forEach(function (budget) {
    const budgetAmount = Number(budget.budgetAmount || 0);

    const spent = Number(budget.spent || 0);

    const remaining = budgetAmount - spent;

    // ==============================================
    // PERCENTAGE
    // ==============================================

    let percentage = 0;

    if (budgetAmount > 0) {
      percentage = Math.round((spent / budgetAmount) * 100);
    }

    // ==============================================
    // PROGRESS WIDTH
    // ==============================================

    const progressWidth = Math.min(Math.max(percentage, 0), 100);

    // ==============================================
    // PROGRESS COLOR
    // ==============================================

    let progressClass = "bg-success";

    if (percentage >= 80) {
      progressClass = "bg-danger";
    } else if (percentage >= 50) {
      progressClass = "bg-warning";
    }

    // ==============================================
    // REMAINING COLOR
    // ==============================================

    let remainingClass = "text-success";

    if (remaining < 0) {
      remainingClass = "text-danger";
    }

    // ==============================================
    // CREATE ROW
    // ==============================================

    const row = document.createElement("tr");

    row.innerHTML = `

                <td>

                    <strong>
                        ${escapeHtml(budget.category || "N/A")}
                    </strong>

                    <br>

                    <small class="text-muted">

                        ${escapeHtml(budget.budgetName || "")}

                    </small>

                </td>


                <td>

                    ₹${budgetAmount.toLocaleString("en-IN")}

                </td>


                <td>

                    ₹${spent.toLocaleString("en-IN")}

                </td>


                <td>

                    <strong
                        class="${remainingClass}"
                    >

                        ₹${remaining.toLocaleString("en-IN")}

                    </strong>

                </td>


                <td>

                    <div
                        class="progress"
                        style="height: 22px;"
                    >

                        <div

                            class="progress-bar
                            ${progressClass}"

                            role="progressbar"

                            style="
                                width:
                                ${progressWidth}%;
                            "

                            aria-valuenow="${percentage}"

                            aria-valuemin="0"

                            aria-valuemax="100"

                        >

                            ${percentage}%

                        </div>

                    </div>

                </td>


                <td>

                    <div
                        class="d-flex gap-2"
                    >

                        <button
                            type="button"
                            class="btn btn-sm btn-outline-primary"
                            onclick="editBudget(${budget.id})"
                            title="Edit Budget"
                        >

                            <i
                                class="fa-solid fa-pen-to-square"
                            ></i>

                        </button>


                        <button
                            type="button"
                            class="btn btn-sm btn-outline-danger"
                            onclick="deleteBudget(${budget.id})"
                            title="Delete Budget"
                        >

                            <i
                                class="fa-solid fa-trash"
                            ></i>

                        </button>

                    </div>

                </td>

            `;

    tableBody.appendChild(row);
  });
}

// ==========================================================
// SEARCH BUDGETS
// ==========================================================

function setupSearch() {
  const searchInput = document.getElementById("budgetSearch");

  if (!searchInput) {
    return;
  }

  searchInput.addEventListener("input", function () {
    const searchText = this.value.trim().toLowerCase();

    const filteredBudgets = allBudgets.filter(function (budget) {
      const name = String(budget.budgetName || "").toLowerCase();

      const category = String(budget.category || "").toLowerCase();

      return name.includes(searchText) || category.includes(searchText);
    });

    displayBudgets(filteredBudgets);
  });
}

// ==========================================================
// DISPLAY LOADING ERROR
// ==========================================================

function displayLoadingError() {
  const tableBody = document.getElementById("budgetTableBody");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="text-center text-danger"
            >

                Unable to load budgets.

                <br>

                Please make sure the backend
                server is running.

            </td>

        </tr>

    `;
}

// ==========================================================
// ESCAPE HTML
// ==========================================================

function escapeHtml(value) {
  const div = document.createElement("div");

  div.textContent = value;

  return div.innerHTML;
}
