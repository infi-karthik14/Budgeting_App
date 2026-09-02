// ==========================================================
// BACHAT BUDDY - TRANSACTIONS.JS
// Backend Connected + Dynamic User + Currency + Filters
// Add / Edit / Delete + Secure User Ownership
// ==========================================================

"use strict";

// ==========================================================
// API
// ==========================================================

const API_URL = "http://localhost:8080/api/transactions";

// ==========================================================
// PAGE LOAD
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {
  // ======================================================
  // ELEMENTS
  // ======================================================

  const tableBody = document.getElementById("transactionTableBody");

  const searchInput = document.getElementById("searchTransaction");

  const headerSearchInput = document.getElementById("headerTransactionSearch");

  const typeFilter = document.getElementById("typeFilter");

  const categoryFilter = document.getElementById("categoryFilter");

  const monthFilter = document.getElementById("monthFilter");

  const activityList = document.getElementById("activityList");

  // ======================================================
  // TABLE CHECK
  // ======================================================

  if (!tableBody) {
    console.error("ERROR: transactionTableBody not found.");

    return;
  }

  // ======================================================
  // LOGIN CHECK
  // ======================================================

  const loggedIn = sessionStorage.getItem("loggedIn");

  const userId = sessionStorage.getItem("userId");

  if (loggedIn !== "true" || !userId) {
    console.error("User is not logged in or userId is missing.");

    window.location.href = "login.html";

    return;
  }

  console.log("Logged-in User ID:", userId);

  // ======================================================
  // GLOBAL DATA
  // ======================================================

  let transactions = [];

  let transactionChart = null;

  // ======================================================
  // HTML ESCAPE
  // ======================================================

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ======================================================
  // NORMALIZE TYPE
  // ======================================================

  function normalizeType(type) {
    return String(type || "")
      .trim()
      .toLowerCase();
  }

  // ======================================================
  // GET TRANSACTION TYPE
  // ======================================================

  function getTransactionType(transaction) {
    if (!transaction) {
      return "";
    }

    const rawType = normalizeType(transaction.type);

    const category = String(transaction.category || "")
      .trim()
      .toLowerCase();

    // Salary is always income

    if (category === "salary" || category === "salary income") {
      return "income";
    }

    if (rawType === "income" || rawType === "expense") {
      return rawType;
    }

    return "expense";
  }

  // ======================================================
  // NORMALIZE DATE
  // ======================================================

  function normalizeDate(value) {
    if (!value) {
      return "";
    }

    return String(value).split("T")[0];
  }

  // ======================================================
  // FORMAT DATE
  // ======================================================

  function formatDate(dateValue) {
    const normalized = normalizeDate(dateValue);

    if (!normalized) {
      return "-";
    }

    const date = new Date(normalized + "T00:00:00");

    if (isNaN(date.getTime())) {
      return normalized;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // ======================================================
  // GET TRANSACTION DATE
  // ======================================================

  function getTransactionDate(transaction) {
    return (
      transaction.transactionDate ||
      transaction.date ||
      transaction.createdAt ||
      ""
    );
  }

  // ======================================================
  // LOAD TRANSACTIONS
  // ======================================================

  async function loadTransactions() {
    try {
      tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        class="text-center"
                        style="padding:30px;"
                    >
                        Loading transactions...
                    </td>
                </tr>
            `;

      const response = await fetch(
        `${API_URL}/user/${encodeURIComponent(userId)}`,
      );

      console.log("Transaction API status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(errorText || `Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid transaction data received.");
      }

      // ==================================================
      // FRONTEND OWNERSHIP CHECK
      // ==================================================

      transactions = data.filter(function (transaction) {
        return (
          transaction.userId != null &&
          String(transaction.userId) === String(userId)
        );
      });

      console.log("Transactions loaded:", transactions);

      displayTransactions(transactions);
    } catch (error) {
      console.error("TRANSACTION LOAD ERROR:", error);

      tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        class="text-center"
                        style="
                            padding:30px;
                            color:#dc2626;
                        "
                    >

                        Unable to load transactions.

                        <br><br>

                        ${escapeHTML(error.message)}

                    </td>
                </tr>
            `;

      updateSummary([]);

      updateRecentActivity([]);

      updateTransactionChart([]);
    }
  }

  // ======================================================
  // DISPLAY TRANSACTIONS
  // ======================================================

  function displayTransactions(data) {
    tableBody.innerHTML = "";

    if (!data || data.length === 0) {
      tableBody.innerHTML = `
                <tr>

                    <td
                        colspan="7"
                        class="text-center"
                        style="padding:30px;"
                    >

                        No transactions found.

                        <br><br>

                        <a href="add-transaction.html">
                            + Add Transaction
                        </a>

                    </td>

                </tr>
            `;

      updateSummary([]);

      updateRecentActivity([]);

      updateTransactionChart([]);

      return;
    }

    data.forEach(function (transaction) {
      const row = document.createElement("tr");

      const id = transaction.id;

      const transactionType = getTransactionType(transaction);

      const typeText = transactionType === "income" ? "Income" : "Expense";

      const typeClass =
        transactionType === "income" ? "income-tag" : "expense-tag";

      const merchant = transaction.merchant || transaction.description || "-";

      const category = transaction.category || "-";

      const transactionDate = getTransactionDate(transaction);

      const amount = Number(transaction.amount) || 0;

      const status = transaction.status || "Completed";

      const amountClass =
        transactionType === "income" ? "text-success" : "text-danger";

      const amountPrefix = transactionType === "income" ? "+ " : "- ";

      row.innerHTML = `

                <td class="date">
                    ${escapeHTML(formatDate(transactionDate))}
                </td>

                <td class="merchant">
                    ${escapeHTML(merchant)}
                </td>

                <td class="category">
                    ${escapeHTML(category)}
                </td>

                <td>

                    <span class="${typeClass}">
                        ${typeText}
                    </span>

                </td>

                <td class="${amountClass} fw-bold">

                    ${amountPrefix}

                    ${formatCurrency(amount)}

                </td>

                <td>

                    <span class="badge bg-success">
                        ${escapeHTML(status)}
                    </span>

                </td>

                <td>

                    <button
                        type="button"
                        class="btn btn-warning btn-sm edit-btn"
                        data-id="${escapeHTML(id)}"
                        title="Edit Transaction"
                    >

                        <i class="bi bi-pencil-fill"></i>

                    </button>


                    <button
                        type="button"
                        class="btn btn-danger btn-sm ms-1 delete-btn"
                        data-id="${escapeHTML(id)}"
                        title="Delete Transaction"
                    >

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </td>
            `;

      tableBody.appendChild(row);
    });

    updateSummary(data);

    updateRecentActivity(data);

    updateTransactionChart(data);

    attachActionButtons();
  }

  // ======================================================
  // SUMMARY
  // ======================================================

  function updateSummary(data) {
    let income = 0;

    let expense = 0;

    data.forEach(function (transaction) {
      const amount = Number(transaction.amount) || 0;

      const type = getTransactionType(transaction);

      if (type === "income") {
        income += amount;
      } else if (type === "expense") {
        expense += amount;
      }
    });

    const balance = income - expense;

    const incomeElement = document.getElementById("transactionTotalIncome");

    const expenseElement = document.getElementById("transactionTotalExpense");

    const balanceElement = document.getElementById(
      "transactionTotalCurrentBalance",
    );

    const countElement = document.getElementById("transactionTotalCount");

    if (incomeElement) {
      incomeElement.textContent = formatCurrency(income);
    }

    if (expenseElement) {
      expenseElement.textContent = formatCurrency(expense);
    }

    if (balanceElement) {
      balanceElement.textContent = formatCurrency(balance);
    }

    if (countElement) {
      countElement.textContent = data.length;
    }
  }

  // ======================================================
  // RECENT ACTIVITY
  // ======================================================

  function updateRecentActivity(data) {
    if (!activityList) {
      return;
    }

    activityList.innerHTML = "";

    if (!data || data.length === 0) {
      activityList.innerHTML = `

                <li>

                    <span>
                        <i class="bi bi-info-circle"></i>
                    </span>

                    <div>

                        <strong>
                            No recent activity
                        </strong>

                        <small>
                            No transactions available
                        </small>

                    </div>

                </li>
            `;

      return;
    }

    const recent = [...data]
      .sort(function (a, b) {
        const dateA = new Date(
          normalizeDate(getTransactionDate(a)) + "T00:00:00",
        );

        const dateB = new Date(
          normalizeDate(getTransactionDate(b)) + "T00:00:00",
        );

        return dateB - dateA;
      })
      .slice(0, 5);

    recent.forEach(function (transaction) {
      const type = getTransactionType(transaction);

      const amount = Number(transaction.amount) || 0;

      const category = transaction.category || "Transaction";

      const description = transaction.description || category;

      const icon =
        type === "income"
          ? "bi bi-arrow-down-circle-fill"
          : "bi bi-arrow-up-circle-fill";

      const text =
        type === "income"
          ? `${description} credited`
          : `${description} expense`;

      const li = document.createElement("li");

      li.innerHTML = `

                <span>

                    <i class="${icon}"></i>

                </span>

                <div>

                    <strong class="${
                      type === "income" ? "activity-income" : "activity-expense"
                    }">

                        ${escapeHTML(text)}

                    </strong>


                    <small class="${
                      type === "income"
                        ? "activity-income-amount"
                        : "activity-expense-amount"
                    }">

                        ${formatCurrency(amount)}

                    </small>

                </div>
            `;

      activityList.appendChild(li);
    });
  }

  // ======================================================
  // TRANSACTION CHART
  // ======================================================

  function updateTransactionChart(data) {
    const canvas = document.getElementById("transactionChart");

    if (!canvas) {
      return;
    }

    if (typeof Chart === "undefined") {
      console.error("Chart.js is not loaded.");

      return;
    }

    const monthlyIncome = new Array(12).fill(0);

    const monthlyExpense = new Array(12).fill(0);

    data.forEach(function (transaction) {
      const dateValue = getTransactionDate(transaction);

      if (!dateValue) {
        return;
      }

      const date = new Date(normalizeDate(dateValue) + "T00:00:00");

      if (isNaN(date.getTime())) {
        return;
      }

      const month = date.getMonth();

      const amount = Number(transaction.amount) || 0;

      const type = getTransactionType(transaction);

      if (type === "income") {
        monthlyIncome[month] += amount;
      } else {
        monthlyExpense[month] += amount;
      }
    });

    const months = [
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
    ];

    if (transactionChart) {
      transactionChart.destroy();

      transactionChart = null;
    }

    transactionChart = new Chart(canvas, {
      type: "bar",

      data: {
        labels: months,

        datasets: [
          {
            label: "Income",

            data: monthlyIncome,

            backgroundColor: "#22c55e",

            borderRadius: 6,
          },

          {
            label: "Expense",

            data: monthlyExpense,

            backgroundColor: "#ef4444",

            borderRadius: 6,
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        interaction: {
          mode: "index",
          intersect: false,
        },

        plugins: {
          legend: {
            display: true,
            position: "top",
          },

          tooltip: {
            callbacks: {
              label: function (context) {
                return (
                  context.dataset.label + ": " + formatCurrency(context.raw)
                );
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

  // ======================================================
  // FILTER TRANSACTIONS
  // ======================================================

  function filterTransactions() {
    const search = searchInput ? searchInput.value.trim().toLowerCase() : "";

    const selectedType = typeFilter
      ? typeFilter.value.trim().toLowerCase()
      : "all";

    const selectedCategory = categoryFilter ? categoryFilter.value : "all";

    const selectedMonth = monthFilter ? monthFilter.value : "all";

    const filtered = transactions.filter(function (transaction) {
      const searchableText = [
        transaction.category,

        transaction.type,

        transaction.description,

        transaction.paymentMethod,

        transaction.merchant,

        transaction.status,

        transaction.amount,

        transaction.transactionDate,

        transaction.date,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (search && !searchableText.includes(search)) {
        return false;
      }

      const transactionType = getTransactionType(transaction);

      if (selectedType !== "all" && transactionType !== selectedType) {
        return false;
      }

      if (
        selectedCategory !== "all" &&
        String(transaction.category || "").toLowerCase() !==
          String(selectedCategory).toLowerCase()
      ) {
        return false;
      }

      if (selectedMonth !== "all") {
        const dateValue = getTransactionDate(transaction);

        if (!dateValue) {
          return false;
        }

        const date = new Date(normalizeDate(dateValue) + "T00:00:00");

        if (isNaN(date.getTime())) {
          return false;
        }

        const month = date.toLocaleString("en-US", {
          month: "long",
        });

        if (month !== selectedMonth) {
          return false;
        }
      }

      return true;
    });

    displayTransactions(filtered);
  }

  // ======================================================
  // EDIT + DELETE
  // ======================================================

  function attachActionButtons() {
    // ==================================================
    // DELETE
    // ==================================================

    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(function (button) {
      button.addEventListener("click", async function () {
        const id = this.dataset.id;

        if (!id) {
          alert("Transaction ID not found.");

          return;
        }

        const currentUserId = sessionStorage.getItem("userId");

        if (!currentUserId) {
          alert("Session expired. Please login again.");

          window.location.href = "login.html";

          return;
        }

        const confirmDelete = confirm(
          "Are you sure you want to delete this transaction?",
        );

        if (!confirmDelete) {
          return;
        }

        try {
          this.disabled = true;

          // ==================================================
          // FIXED DELETE URL
          // ==================================================

          const response = await fetch(
            `${API_URL}/${encodeURIComponent(id)}?userId=${encodeURIComponent(currentUserId)}`,
            {
              method: "DELETE",
            },
          );

          if (!response.ok) {
            const errorText = await response.text();

            throw new Error(
              errorText ||
                `Failed to delete transaction. Status: ${response.status}`,
            );
          }

          alert("Transaction deleted successfully!");

          await loadTransactions();
        } catch (error) {
          console.error("DELETE ERROR:", error);

          alert("Unable to delete transaction.\n\n" + error.message);

          this.disabled = false;
        }
      });
    });

    // ==================================================
    // EDIT
    // ==================================================

    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const id = this.dataset.id;

        if (!id) {
          alert("Transaction ID not found.");

          return;
        }

        const currentUserId = sessionStorage.getItem("userId");

        if (!currentUserId) {
          alert("Session expired. Please login again.");

          window.location.href = "login.html";

          return;
        }

        // ==================================================
        // OPEN EDIT PAGE
        // ==================================================

        window.location.href = `add-transaction.html?edit=${encodeURIComponent(id)}`;
      });
    });
  }

  // ======================================================
  // SEARCH EVENTS
  // ======================================================

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      filterTransactions();
    });
  }

  // ======================================================
  // HEADER SEARCH
  // ======================================================

  if (headerSearchInput) {
    headerSearchInput.addEventListener("input", function () {
      if (searchInput) {
        searchInput.value = this.value;
      }

      filterTransactions();
    });
  }

  // ======================================================
  // TYPE FILTER
  // ======================================================

  if (typeFilter) {
    typeFilter.addEventListener("change", function () {
      filterTransactions();
    });
  }

  // ======================================================
  // CATEGORY FILTER
  // ======================================================

  if (categoryFilter) {
    categoryFilter.addEventListener("change", function () {
      filterTransactions();
    });
  }

  // ======================================================
  // MONTH FILTER
  // ======================================================

  if (monthFilter) {
    monthFilter.addEventListener("change", function () {
      filterTransactions();
    });
  }

  // ======================================================
  // CURRENCY CHANGE
  // ======================================================

  window.addEventListener("currencyChanged", function () {
    displayTransactions(transactions);
  });

  // ======================================================
  // STORAGE CURRENCY CHANGE
  // ======================================================

  window.addEventListener("storage", function (event) {
    if (event.key === "currency") {
      displayTransactions(transactions);
    }
  });

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  loadTransactions();
});
