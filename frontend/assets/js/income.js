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

  console.log("Logged in user ID:", userId);

  /* =====================================================
       API
  ===================================================== */

  const TRANSACTION_API = "http://localhost:8080/api/transactions";

  /* =====================================================
       ELEMENTS
  ===================================================== */

  const incomeForm = document.getElementById("incomeForm");
  const incomeTableBody = document.getElementById("incomeTableBody");

  const totalIncomeElement = document.getElementById("totalIncome");
  const todayIncomeElement = document.getElementById("todayIncome");
  const incomeCountElement = document.getElementById("incomeCount");

  const incomeDate = document.getElementById("incomeDate");
  const incomeMessage = document.getElementById("incomeMessage");

  /* =====================================================
       TODAY
  ===================================================== */

  const today = new Date().toISOString().split("T")[0];

  incomeDate.value = today;

  /* =====================================================
       FORMAT MONEY
  ===================================================== */

  function formatCurrency(amount) {
    return (
      "₹" +
      Number(amount || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })
    );
  }

  /* =====================================================
       NORMALIZE DATE
  ===================================================== */

  function normalizeDate(value) {
    if (!value) {
      return "";
    }

    return String(value).split("T")[0];
  }

  /* =====================================================
       LOAD INCOME FROM BACKEND
  ===================================================== */

  async function loadIncome() {
    try {
      console.log("Loading income from backend...");

      const response = await fetch(
        `${TRANSACTION_API}/user/${userId}/type/income`,
      );

      console.log("Income API status:", response.status);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const incomeData = await response.json();

      console.log("Income received:", incomeData);

      displayIncome(incomeData);
    } catch (error) {
      console.error("Income loading error:", error);

      showMessage("Unable to load income from server.", "danger");
    }
  }

  /* =====================================================
       DISPLAY INCOME
  ===================================================== */

  function displayIncome(incomeData) {
    incomeTableBody.innerHTML = "";

    let total = 0;
    let todayTotal = 0;

    const count = incomeData.length;

    incomeData.forEach(function (income) {
      /* ---------------------------------------------
           AMOUNT
      --------------------------------------------- */

      const amount = Number(income.amount) || 0;

      total += amount;

      /* ---------------------------------------------
           DATE
      --------------------------------------------- */

      const incomeDateValue = normalizeDate(
        income.transactionDate || income.date,
      );

      if (incomeDateValue === today) {
        todayTotal += amount;
      }

      /* ---------------------------------------------
           DATA
      --------------------------------------------- */

      const date = incomeDateValue || "-";

      const category = income.category || "-";

      /*
       * Merchant is now stored in the backend.
       *
       * For old transactions, fallback to description.
       */
      const merchant = income.merchant || income.description || "-";

      const paymentMethod = income.paymentMethod || "-";

      /* ---------------------------------------------
           CREATE TABLE ROW
      --------------------------------------------- */

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          ${escapeHTML(date)}
        </td>

        <td>
          ${escapeHTML(category)}
        </td>

        <td>
          ${escapeHTML(merchant)}
        </td>

        <td>
          ${escapeHTML(paymentMethod)}
        </td>

        <td class="income-amount text-success fw-bold">
          + ${formatCurrency(amount)}
        </td>
      `;

      incomeTableBody.appendChild(row);
    });

    /* =================================================
         UPDATE SUMMARY
    ================================================= */

    totalIncomeElement.textContent = formatCurrency(total);

    todayIncomeElement.textContent = formatCurrency(todayTotal);

    incomeCountElement.textContent = count;

    console.log("Income summary:", {
      total,
      todayTotal,
      count,
    });
  }

  /* =====================================================
       ADD INCOME
  ===================================================== */

  incomeForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    /* ---------------------------------------------
           GET FORM VALUES
      --------------------------------------------- */

    const amount = Number(document.getElementById("incomeAmount").value);

    const category = document.getElementById("incomeCategory").value;

    const date = document.getElementById("incomeDate").value;

    /*
     * Income Source is now stored as merchant.
     */
    const merchant = document.getElementById("incomeSource").value.trim();

    const paymentMethod = document.getElementById("paymentMethod").value;

    const description = document
      .getElementById("incomeDescription")
      .value.trim();

    const notes = document.getElementById("incomeNotes").value.trim();

    /* ---------------------------------------------
           VALIDATION
      --------------------------------------------- */

    if (!amount || amount <= 0 || !category || !date || !paymentMethod) {
      showMessage("Please fill all required fields.", "danger");

      return;
    }

    /* =================================================
           CREATE BACKEND REQUEST
      ================================================= */

    const transactionData = {
      userId: Number(userId),

      type: "income",

      category: category,

      amount: amount,

      transactionDate: date,

      paymentMethod: paymentMethod,

      /*
       * NEW
       * Income Source → merchant
       */
      merchant: merchant,

      description: description || notes || "Income",

      status: "Completed",
    };

    console.log("Sending income to backend:", transactionData);

    try {
      /* =================================================
             SEND TO SPRING BOOT
        ================================================= */

      const response = await fetch(TRANSACTION_API, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(transactionData),
      });

      console.log("Add income status:", response.status);

      /* =================================================
             HANDLE ERROR
        ================================================= */

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Backend error:", errorText);

        throw new Error(errorText || `Server returned ${response.status}`);
      }

      /* =================================================
             SUCCESS
        ================================================= */

      const savedIncome = await response.json();

      console.log("Income successfully saved:", savedIncome);

      showMessage("Income added successfully!", "success");

      /* ---------------------------------------------
             CLEAR FORM
        --------------------------------------------- */

      incomeForm.reset();

      incomeDate.value = today;

      /* ---------------------------------------------
             RELOAD DATABASE DATA
        --------------------------------------------- */

      await loadIncome();
    } catch (error) {
      console.error("ADD INCOME ERROR:", error);

      showMessage(
        "Income could not be saved. Check the backend console.",
        "danger",
      );
    }
  });

  /* =====================================================
       MESSAGE
  ===================================================== */

  function showMessage(message, type) {
    if (!incomeMessage) {
      return;
    }

    incomeMessage.className = `income-message alert alert-${type}`;

    incomeMessage.textContent = message;

    setTimeout(function () {
      incomeMessage.textContent = "";

      incomeMessage.className = "income-message";
    }, 4000);
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

  loadIncome();
});
