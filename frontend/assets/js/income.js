/* =========================================================
   BACHAT BUDDY - INCOME
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
       CHECK ELEMENTS
    ===================================================== */

  if (!incomeForm) {
    console.error("incomeForm not found.");
    return;
  }

  if (!incomeTableBody) {
    console.error("incomeTableBody not found.");
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
       TODAY
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

  if (incomeDate) {
    incomeDate.value = today;
  }

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
    }).format(Number(amount || 0));
  }

  /* =====================================================
       NORMALIZE DATE
    ===================================================== */

  function normalizeDate(value) {
    if (!value) {
      return "";
    }

    return String(value).trim().split("T")[0].split(" ")[0].substring(0, 10);
  }

  /* =====================================================
       FORMAT DATE
    ===================================================== */

  function formatDate(value) {
    const normalized = normalizeDate(value);

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
       LOAD INCOME
    ===================================================== */

  async function loadIncome() {
    try {
      incomeTableBody.innerHTML = `
                <tr>
                    <td colspan="5"
                        style="
                            text-align:center;
                            padding:30px;
                        ">
                        Loading income...
                    </td>
                </tr>
            `;

      const response = await fetch(
        `${TRANSACTION_API}/user/${userId}/type/income`,
      );

      console.log("Income API status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(errorText || `Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid income data received.");
      }

      console.log("Income received:", data);

      displayIncome(data);
    } catch (error) {
      console.error("INCOME LOAD ERROR:", error);

      incomeTableBody.innerHTML = `
                <tr>
                    <td colspan="5"
                        style="
                            text-align:center;
                            padding:30px;
                            color:red;
                        ">

                        Unable to load income.

                        <br><br>

                        ${escapeHTML(error.message)}

                    </td>
                </tr>
            `;

      updateSummary([]);
    }
  }

  /* =====================================================
       DISPLAY INCOME
    ===================================================== */

  function displayIncome(data) {
    incomeTableBody.innerHTML = "";

    let totalIncome = 0;

    let todayIncome = 0;

    /* =================================================
           NO INCOME
        ================================================= */

    if (!data || data.length === 0) {
      incomeTableBody.innerHTML = `
                <tr>
                    <td colspan="5"
                        style="
                            text-align:center;
                            padding:30px;
                        ">

                        No income transactions found.

                        <br><br>

                        Add your first income transaction.

                    </td>
                </tr>
            `;

      updateSummary([]);

      return;
    }

    /* =================================================
           CREATE ROWS
        ================================================= */

    data.forEach(function (income) {
      const amount = Number(income.amount) || 0;

      totalIncome += amount;

      const transactionDate = normalizeDate(
        income.transactionDate || income.date,
      );

      if (transactionDate === today) {
        todayIncome += amount;
      }

      const category = income.category || "-";

      const source = income.merchant || income.description || category || "-";

      const paymentMethod = income.paymentMethod || "-";

      const row = document.createElement("tr");

      row.innerHTML = `

                <td>
                    ${escapeHTML(formatDate(transactionDate))}
                </td>

                <td>
                    ${escapeHTML(category)}
                </td>

                <td>
                    ${escapeHTML(source)}
                </td>

                <td>
                    ${escapeHTML(paymentMethod)}
                </td>

                <td class="text-success fw-bold">
                    + ${formatCurrency(amount)}
                </td>

            `;

      incomeTableBody.appendChild(row);
    });

    /* =================================================
           UPDATE SUMMARY
        ================================================= */

    if (totalIncomeElement) {
      totalIncomeElement.textContent = formatCurrency(totalIncome);
    }

    if (todayIncomeElement) {
      todayIncomeElement.textContent = formatCurrency(todayIncome);
    }

    if (incomeCountElement) {
      incomeCountElement.textContent = data.length;
    }
  }

  /* =====================================================
       SUMMARY
    ===================================================== */

  function updateSummary(data) {
    let totalIncome = 0;

    let todayIncome = 0;

    data.forEach(function (income) {
      const amount = Number(income.amount) || 0;

      totalIncome += amount;

      const transactionDate = normalizeDate(
        income.transactionDate || income.date,
      );

      if (transactionDate === today) {
        todayIncome += amount;
      }
    });

    if (totalIncomeElement) {
      totalIncomeElement.textContent = formatCurrency(totalIncome);
    }

    if (todayIncomeElement) {
      todayIncomeElement.textContent = formatCurrency(todayIncome);
    }

    if (incomeCountElement) {
      incomeCountElement.textContent = data.length;
    }
  }

  /* =====================================================
       ADD INCOME
    ===================================================== */

  incomeForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    /* ---------------------------------------------
               GET VALUES
            --------------------------------------------- */

    const amountInput = document.getElementById("incomeAmount");

    const categoryInput = document.getElementById("incomeCategory");

    const dateInput = document.getElementById("incomeDate");

    const paymentInput = document.getElementById("paymentMethod");

    const descriptionInput = document.getElementById("incomeDescription");

    const notesInput = document.getElementById("incomeNotes");

    const sourceInput = document.getElementById("incomeSource");

    const amount = Number(amountInput?.value);

    const category = categoryInput?.value || "";

    const transactionDate = dateInput?.value || "";

    const paymentMethod = paymentInput?.value || "";

    const description = descriptionInput?.value.trim() || "";

    const notes = notesInput?.value.trim() || "";

    const source = sourceInput?.value.trim() || "";

    /* ---------------------------------------------
               VALIDATION
            --------------------------------------------- */

    if (!amount || amount <= 0) {
      showMessage("Please enter a valid amount.", "danger");

      return;
    }

    if (!category) {
      showMessage("Please select an income category.", "danger");

      return;
    }

    if (!transactionDate) {
      showMessage("Please select a date.", "danger");

      return;
    }

    if (!paymentMethod) {
      showMessage("Please select a payment method.", "danger");

      return;
    }

    /* ---------------------------------------------
               USER ID
            --------------------------------------------- */

    const currentUserId = Number(sessionStorage.getItem("userId"));

    if (!Number.isInteger(currentUserId) || currentUserId <= 0) {
      showMessage("Invalid user session. Please login again.", "danger");

      return;
    }

    /* ---------------------------------------------
               DESCRIPTION
            --------------------------------------------- */

    const finalDescription = description || source || notes || "Income";

    /* ---------------------------------------------
               REQUEST BODY
            --------------------------------------------- */

    const transactionData = {
      userId: currentUserId,

      type: "income",

      category: category,

      amount: amount,

      transactionDate: transactionDate,

      paymentMethod: paymentMethod,

      description: finalDescription,

      status: "Completed",
    };

    console.log("Sending income:", transactionData);

    /* ---------------------------------------------
               DISABLE BUTTON
            --------------------------------------------- */

    const submitButton = incomeForm.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;

      submitButton.dataset.originalText = submitButton.innerHTML;

      submitButton.innerHTML = "Saving...";
    }

    /* ---------------------------------------------
               SEND REQUEST
            --------------------------------------------- */

    try {
      const response = await fetch(TRANSACTION_API, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(transactionData),
      });

      const responseText = await response.text();

      console.log("Add income status:", response.status);

      if (!response.ok) {
        let errorMessage = "Unable to save income.";

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

      /* -----------------------------------------
                   SUCCESS
                ----------------------------------------- */

      showMessage("Income added successfully!", "success");

      incomeForm.reset();

      if (incomeDate) {
        incomeDate.value = today;
      }

      await loadIncome();
    } catch (error) {
      console.error("ADD INCOME ERROR:", error);

      showMessage(error.message || "Income could not be saved.", "danger");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;

        submitButton.innerHTML =
          submitButton.dataset.originalText || "Save Income";
      }
    }
  });

  /* =====================================================
       MESSAGE
    ===================================================== */

  function showMessage(messageText, type) {
    if (!incomeMessage) {
      return;
    }

    incomeMessage.className = `income-message alert alert-${type}`;

    incomeMessage.textContent = messageText;

    setTimeout(function () {
      incomeMessage.textContent = "";

      incomeMessage.className = "income-message";
    }, 4000);
  }

  /* =====================================================
       CURRENCY CHANGE
    ===================================================== */

  window.addEventListener("currencyChanged", function () {
    console.log("Income currency changed:", getSelectedCurrency());

    loadIncome();
  });

  /* =====================================================
       INITIAL LOAD
    ===================================================== */

  loadIncome();
});
