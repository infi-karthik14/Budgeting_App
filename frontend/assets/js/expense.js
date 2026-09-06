/* =========================================================
   BACHAT BUDDY - EXPENSE
   Backend Connected + Dynamic Currency + Dynamic Username
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       LOGIN CHECK
    ===================================================== */

  const loggedIn = sessionStorage.getItem("loggedIn");

  const userId = sessionStorage.getItem("userId");

  if (loggedIn !== "true" || !userId) {
    window.location.href = "login.html";

    return;
  }

  console.log("Logged-in User ID:", userId);

  /* =====================================================
       API
    ===================================================== */

  const TRANSACTION_API = "https://budgetingapp-production-a92b.up.railway.app/api/transactions";

  /* =====================================================
       ELEMENTS
    ===================================================== */

  const form = document.getElementById("expenseForm");

  const amountInput = document.getElementById("expenseAmount");

  const categoryInput = document.getElementById("expenseCategory");

  const dateInput = document.getElementById("expenseDate");

  const merchantInput = document.getElementById("merchant");

  const paymentInput = document.getElementById("paymentMethod");

  const descriptionInput = document.getElementById("expenseDescription");

  const notesInput = document.getElementById("expenseNotes");

  const message = document.getElementById("expenseMessage");

  const tableBody = document.getElementById("expenseTableBody");

  const totalExpenseElement = document.getElementById("totalExpense");

  const todayExpenseElement = document.getElementById("todayExpense");

  const expenseCountElement = document.getElementById("expenseCount");

  /* =====================================================
       CHECK ELEMENTS
    ===================================================== */

  if (!form) {
    console.error("expenseForm not found.");

    return;
  }

  if (!tableBody) {
    console.error("expenseTableBody not found.");

    return;
  }

  /* =====================================================
       DYNAMIC USERNAME
    ===================================================== */

  function loadUserName() {
    const userName =
      sessionStorage.getItem("fullName") ||
      sessionStorage.getItem("userName") ||
      localStorage.getItem("userName") ||
      "User";

    const userNameElement = document.getElementById("userName");

    const navbarUserNameElement = document.getElementById("navbarUserName");

    if (userNameElement) {
      userNameElement.textContent = userName;
    }

    if (navbarUserNameElement) {
      navbarUserNameElement.textContent = userName;
    }
  }

  loadUserName();

  /* =====================================================
       PROFILE IMAGE
    ===================================================== */

  const profileImage = localStorage.getItem("profileImage");

  const profileImageElement = document.getElementById("profileImage");

  if (profileImage && profileImageElement) {
    profileImageElement.src = profileImage;
  }

  /* =====================================================
       TODAY'S DATE
    ===================================================== */

  function getToday() {
    const today = new Date();

    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0")
    );
  }

  const today = getToday();

  if (dateInput) {
    dateInput.value = today;
  }

  /* =====================================================
       EXPENSE DATA
    ===================================================== */

  let expenses = [];

  /* =====================================================
       DYNAMIC CURRENCY
    ===================================================== */

  function getSelectedCurrency() {
    return localStorage.getItem("currency") || "INR";
  }

  /* =====================================================
       FORMAT CURRENCY
    ===================================================== */

  function formatCurrency(amount) {
    const currency = getSelectedCurrency();

    return new Intl.NumberFormat("en-IN", {
      style: "currency",

      currency: currency,

      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  }

  /* =====================================================
       LOAD EXPENSES
    ===================================================== */

  async function loadExpenses() {
    try {
      console.log("Loading expenses from backend...");

      tableBody.innerHTML = `
                <tr>
                    <td colspan="5"
                        class="text-center py-4">
                        Loading expenses...
                    </td>
                </tr>
            `;

      const response = await fetch(
        `${TRANSACTION_API}/user/${userId}/type/expense`,
      );

      console.log("Expense API status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(errorText || `Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid expense data received.");
      }

      expenses = data;

      console.log("Expenses loaded:", expenses);

      renderExpenses();
    } catch (error) {
      console.error("Error loading expenses:", error);

      tableBody.innerHTML = `
                <tr>
                    <td colspan="5"
                        class="text-center text-danger py-4">

                        Unable to load expenses.

                        <br><br>

                        ${escapeHTML(error.message)}

                    </td>
                </tr>
            `;

      updateSummary();
    }
  }

  /* =====================================================
       RENDER EXPENSES
    ===================================================== */

  function renderExpenses() {
    tableBody.innerHTML = "";

    if (expenses.length === 0) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="5"
                        class="text-center text-muted py-4">

                        No expenses recorded yet.

                    </td>
                </tr>
            `;
    } else {
      const recentExpenses = [...expenses]
        .sort(function (a, b) {
          return (
            new Date(normalizeDate(b.transactionDate || b.date)) -
            new Date(normalizeDate(a.transactionDate || a.date))
          );
        })
        .slice(0, 10);

      recentExpenses.forEach(function (expense) {
        const row = document.createElement("tr");

        const transactionDate = expense.transactionDate || expense.date;

        row.innerHTML = `

                        <td>
                            ${escapeHTML(formatDate(transactionDate))}
                        </td>


                        <td>
                            ${escapeHTML(expense.category || "-")}
                        </td>


                        <td>
                            ${escapeHTML(expense.merchant || "-")}
                        </td>


                        <td>
                            ${escapeHTML(expense.paymentMethod || "-")}
                        </td>


                        <td class="expense-amount">

                            - ${formatCurrency(expense.amount)}

                        </td>

                    `;

        tableBody.appendChild(row);
      });
    }

    updateSummary();
  }

  /* =====================================================
       UPDATE SUMMARY
    ===================================================== */

  function updateSummary() {
    const currentDate = new Date();

    const currentMonth = currentDate.getMonth();

    const currentYear = currentDate.getFullYear();

    /* ================================================
           CURRENT MONTH EXPENSES
        ================================================= */

    const monthExpenses = expenses.filter(function (expense) {
      const date = parseDate(expense.transactionDate || expense.date);

      if (!date) {
        return false;
      }

      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    /* ================================================
           TOTAL MONTHLY EXPENSE
        ================================================= */

    const total = monthExpenses.reduce(function (sum, expense) {
      return sum + Number(expense.amount || 0);
    }, 0);

    /* ================================================
           TODAY'S EXPENSE
        ================================================= */

    const todayTotal = expenses
      .filter(function (expense) {
        return normalizeDate(expense.transactionDate || expense.date) === today;
      })
      .reduce(function (sum, expense) {
        return sum + Number(expense.amount || 0);
      }, 0);

    /* ================================================
           DISPLAY
        ================================================= */

    if (totalExpenseElement) {
      totalExpenseElement.textContent = formatCurrency(total);
    }

    if (todayExpenseElement) {
      todayExpenseElement.textContent = formatCurrency(todayTotal);
    }

    if (expenseCountElement) {
      expenseCountElement.textContent = monthExpenses.length;
    }
  }

  /* =====================================================
       ADD EXPENSE
    ===================================================== */

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    /* ============================================
               CLEAR MESSAGE
            ============================================ */

    if (message) {
      message.textContent = "";

      message.className = "expense-message";
    }

    /* ============================================
               GET FORM VALUES
            ============================================ */

    const amount = Number(amountInput.value);

    const category = categoryInput.value;

    const date = dateInput.value;

    const merchant = merchantInput.value.trim();

    const paymentMethod = paymentInput.value;

    const description = descriptionInput.value.trim();

    const notes = notesInput.value.trim();

    /* ============================================
               VALIDATION
            ============================================ */

    if (!amount || amount <= 0) {
      showError("Please enter a valid amount.");

      return;
    }

    if (!category) {
      showError("Please select an expense category.");

      return;
    }

    if (!date) {
      showError("Please select a date.");

      return;
    }

    if (!paymentMethod) {
      showError("Please select a payment method.");

      return;
    }

    /* ============================================
               USER ID
            ============================================ */

    const currentUserId = Number(sessionStorage.getItem("userId"));

    if (!Number.isInteger(currentUserId) || currentUserId <= 0) {
      showError("Invalid user session. Please login again.");

      return;
    }

    /* ============================================
               DESCRIPTION
            ============================================ */

    const finalDescription = description || merchant || notes || "Expense";

    /* ============================================
               CREATE REQUEST
            ============================================ */

    const transactionData = {
      userId: currentUserId,

      type: "expense",

      category: category,

      amount: amount,

      transactionDate: date,

      description: finalDescription,

      paymentMethod: paymentMethod,

      status: "Completed",
    };

    console.log("Sending expense:", transactionData);

    /* ============================================
               DISABLE BUTTON
            ============================================ */

    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;

      submitButton.dataset.originalText = submitButton.innerHTML;

      submitButton.innerHTML = "Saving...";
    }

    /* ============================================
               SEND TO SPRING BOOT
            ============================================ */

    try {
      const response = await fetch(TRANSACTION_API, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(transactionData),
      });

      console.log("Add expense status:", response.status);

      const responseText = await response.text();

      /* ========================================
                   HANDLE ERROR
                ======================================== */

      if (!response.ok) {
        let errorMessage = "Unable to save expense.";

        try {
          const errorData = JSON.parse(responseText);

          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (error) {
          if (responseText) {
            errorMessage = responseText;
          }
        }

        throw new Error(errorMessage);
      }

      /* ========================================
                   SUCCESS
                ======================================== */

      console.log("Expense saved:", responseText);

      if (message) {
        message.textContent = "Expense added successfully!";

        message.style.color = "#198754";
      }

      /* ========================================
                   RESET FORM
                ======================================== */

      form.reset();

      if (dateInput) {
        dateInput.value = today;
      }

      /* ========================================
                   RELOAD DATABASE
                ======================================== */

      await loadExpenses();
    } catch (error) {
      console.error("ADD EXPENSE ERROR:", error);

      showError(
        error.message ||
          "Unable to add expense. Please make sure the backend is running.",
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;

        submitButton.innerHTML =
          submitButton.dataset.originalText || "Add Expense";
      }
    }
  });

  /* =====================================================
       SHOW ERROR
    ===================================================== */

  function showError(text) {
    if (!message) {
      return;
    }

    message.textContent = text;

    message.style.color = "#dc3545";
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
       PARSE DATE
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
       FORMAT DATE
    ===================================================== */

  function formatDate(dateValue) {
    const date = parseDate(dateValue);

    if (!date) {
      return "-";
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
       CURRENCY CHANGE
    ===================================================== */

  window.addEventListener("currencyChanged", function () {
    console.log("Expense currency changed:", getSelectedCurrency());

    renderExpenses();
  });

  /* =====================================================
       INITIAL LOAD
    ===================================================== */

  loadExpenses();
});
