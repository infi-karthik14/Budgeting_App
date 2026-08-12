document.addEventListener("DOMContentLoaded", function () {
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

  /* ==========================================
       SET TODAY'S DATE
    ========================================== */

  const today = new Date().toISOString().split("T")[0];

  dateInput.value = today;

  /* ==========================================
       GET EXPENSES
    ========================================== */

  function getExpenses() {
    return JSON.parse(localStorage.getItem("expenses")) || [];
  }

  /* ==========================================
       SAVE EXPENSES
    ========================================== */

  function saveExpenses(expenses) {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  /* ==========================================
       FORMAT CURRENCY
    ========================================== */

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /* ==========================================
       DISPLAY EXPENSES
    ========================================== */

  function renderExpenses() {
    const expenses = getExpenses();

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
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);

      recentExpenses.forEach((expense) => {
        const row = document.createElement("tr");

        row.innerHTML = `

                    <td>
                        ${expense.date}
                    </td>

                    <td>
                        ${expense.category}
                    </td>

                    <td>
                        ${expense.merchant || "-"}
                    </td>

                    <td>
                        ${expense.paymentMethod}
                    </td>

                    <td class="expense-amount">
                        - ${formatCurrency(expense.amount)}
                    </td>

                `;

        tableBody.appendChild(row);
      });
    }

    updateSummary(expenses);
  }

  /* ==========================================
       UPDATE SUMMARY
    ========================================== */

  function updateSummary(expenses) {
    const currentMonth = new Date().getMonth();

    const currentYear = new Date().getFullYear();

    const monthExpenses = expenses.filter((expense) => {
      const date = new Date(expense.date);

      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    const total = monthExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    );

    const todayTotal = expenses
      .filter((expense) => expense.date === today)
      .reduce((sum, expense) => sum + Number(expense.amount), 0);

    totalExpenseElement.textContent = formatCurrency(total);

    todayExpenseElement.textContent = formatCurrency(todayTotal);

    expenseCountElement.textContent = monthExpenses.length;
  }

  /* ==========================================
       ADD EXPENSE
    ========================================== */

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    message.textContent = "";
    message.className = "expense-message";

    const amount = Number(amountInput.value);

    const category = categoryInput.value;

    const date = dateInput.value;

    const merchant = merchantInput.value.trim();

    const paymentMethod = paymentInput.value;

    const description = descriptionInput.value.trim();

    const notes = notesInput.value.trim();

    /* VALIDATION */

    if (!amount || amount <= 0) {
      message.textContent = "Please enter a valid amount.";

      message.style.color = "#dc3545";

      return;
    }

    if (!category) {
      message.textContent = "Please select an expense category.";

      message.style.color = "#dc3545";

      return;
    }

    if (!date) {
      message.textContent = "Please select a date.";

      message.style.color = "#dc3545";

      return;
    }

    if (!paymentMethod) {
      message.textContent = "Please select a payment method.";

      message.style.color = "#dc3545";

      return;
    }

    /* CREATE OBJECT */

    const expense = {
      id: Date.now(),

      amount: amount,

      category: category,

      date: date,

      merchant: merchant,

      paymentMethod: paymentMethod,

      description: description,

      notes: notes,
    };

    /* GET OLD DATA */

    const expenses = getExpenses();

    /* ADD NEW DATA */

    expenses.push(expense);

    /* SAVE */

    saveExpenses(expenses);

    /* MESSAGE */

    message.textContent = "Expense added successfully!";

    message.style.color = "#198754";

    /* RESET */

    form.reset();

    dateInput.value = today;

    /* REFRESH */

    renderExpenses();
  });

  /* ==========================================
       INITIAL LOAD
    ========================================== */

  renderExpenses();
});