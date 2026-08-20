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

  const TRANSACTION_API = "http://localhost:8080/api/transactions";

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
       TODAY'S DATE
    ===================================================== */

  const today = new Date().toISOString().split("T")[0];

  dateInput.value = today;

  /* =====================================================
       EXPENSE DATA
    ===================================================== */

  let expenses = [];

  /* =====================================================
       FORMAT CURRENCY
    ===================================================== */

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  }

  /* =====================================================
       LOAD EXPENSES FROM BACKEND
    ===================================================== */

  async function loadExpenses() {
    try {
      console.log("Loading expenses from backend...");

      const response = await fetch(
        `${TRANSACTION_API}/user/${userId}/type/expense`,
      );

      console.log("Expense API status:", response.status);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
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
                    </td>
                </tr>
            `;
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
          return new Date(b.transactionDate) - new Date(a.transactionDate);
        })
        .slice(0, 10);

      recentExpenses.forEach(function (expense) {
        const row = document.createElement("tr");

        row.innerHTML = `

                    <td>
                        ${escapeHTML(formatDate(expense.transactionDate))}
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
      const date = parseDate(expense.transactionDate);

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
        return normalizeDate(expense.transactionDate) === today;
      })
      .reduce(function (sum, expense) {
        return sum + Number(expense.amount || 0);
      }, 0);

    /* ================================================
           DISPLAY
        ================================================= */

    totalExpenseElement.textContent = formatCurrency(total);

    todayExpenseElement.textContent = formatCurrency(todayTotal);

    expenseCountElement.textContent = monthExpenses.length;
  }

  /* =====================================================
       ADD EXPENSE
    ===================================================== */

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    /* ============================================
               CLEAR MESSAGE
            ============================================ */

    message.textContent = "";

    message.className = "expense-message";

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
               CREATE TRANSACTION REQUEST
            ============================================ */

    const transactionData = {
      userId: Number(userId),

      type: "expense",

      category: category,

      amount: amount,

      transactionDate: date,

      description: description || merchant || notes,

      paymentMethod: paymentMethod,

      status: "Completed",
    };

    console.log("Sending expense:", transactionData);

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

      /* ========================================
                   HANDLE ERROR
                ======================================== */

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(errorText || `Server returned ${response.status}`);
      }

      /* ========================================
                   GET SAVED TRANSACTION
                ======================================== */

      const savedExpense = await response.json();

      console.log("Expense saved:", savedExpense);

      /* ========================================
                   SUCCESS MESSAGE
                ======================================== */

      message.textContent = "Expense added successfully!";

      message.style.color = "#198754";

      /* ========================================
                   RESET FORM
                ======================================== */

      form.reset();

      dateInput.value = today;

      /* ========================================
                   RELOAD FROM DATABASE
                ======================================== */

      await loadExpenses();
    } catch (error) {
      console.error("ADD EXPENSE ERROR:", error);

      showError(
        "Unable to add expense. " + "Please make sure the backend is running.",
      );
    }
  });

  /* =====================================================
       SHOW ERROR
    ===================================================== */

  function showError(text) {
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
       INITIAL LOAD
    ===================================================== */

  loadExpenses();
});
