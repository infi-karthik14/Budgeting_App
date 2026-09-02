// ==========================================================
// BACHAT BUDDY - ADD / EDIT TRANSACTION
// Backend Connected + Dynamic Currency
// Secure User Ownership
// ==========================================================

"use strict";

const TRANSACTION_API_URL = "http://localhost:8080/api/transactions";

// ==========================================================
// PAGE LOAD
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {
  initializeTransactionPage();
});

// ==========================================================
// INITIALIZE
// ==========================================================

function initializeTransactionPage() {
  const loggedIn = sessionStorage.getItem("loggedIn");

  const userId = sessionStorage.getItem("userId");

  if (loggedIn !== "true" || !userId) {
    window.location.href = "login.html";

    return;
  }

  loadUserData();

  setDefaultDate();

  updateCurrencySymbol();

  checkEditMode();

  setupTransactionForm();

  setupCurrencyEvents();
}

// ==========================================================
// USER
// ==========================================================

function loadUserData() {
  const name =
    sessionStorage.getItem("fullName") ||
    sessionStorage.getItem("userName") ||
    "User";

  const element = document.getElementById("userName");

  if (element) {
    element.textContent = name;
  }
}

// ==========================================================
// DATE
// ==========================================================

function setDefaultDate() {
  const input = document.getElementById("transactionDate");

  if (!input || input.value) {
    return;
  }

  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  input.value = `${year}-${month}-${day}`;
}

// ==========================================================
// CURRENCY
// ==========================================================

function getSelectedCurrency() {
  return localStorage.getItem("currency") || "INR";
}

function getCurrencySymbol() {
  const symbols = {
    INR: "₹",

    USD: "$",

    EUR: "€",

    GBP: "£",

    JPY: "¥",

    CNY: "¥",

    AUD: "A$",

    CAD: "C$",
  };

  return symbols[getSelectedCurrency()] || getSelectedCurrency();
}

function updateCurrencySymbol() {
  const element = document.querySelector(".amount-input span");

  if (element) {
    element.textContent = getCurrencySymbol();
  }
}

// ==========================================================
// EDIT MODE
// ==========================================================

function checkEditMode() {
  const params = new URLSearchParams(window.location.search);

  const editId = params.get("edit");

  const stored = sessionStorage.getItem("editTransaction");

  // ======================================================
  // ADD MODE
  // ======================================================

  if (!editId && !stored) {
    setPageToAddMode();

    return;
  }

  // ======================================================
  // EDIT MODE
  // ======================================================

  setPageToEditMode();

  // ======================================================
  // STORED TRANSACTION
  // ======================================================

  if (stored) {
    try {
      const transaction = JSON.parse(stored);

      populateTransactionForm(transaction);

      return;
    } catch (error) {
      console.error("Invalid stored transaction:", error);

      sessionStorage.removeItem("editTransaction");
    }
  }

  // ======================================================
  // LOAD FROM BACKEND
  // ======================================================

  if (editId) {
    loadTransactionById(editId);
  }
}

// ==========================================================
// ADD MODE
// ==========================================================

function setPageToAddMode() {
  const title = document.getElementById("transactionPageTitle");

  const button = document.querySelector(".save-transaction-btn span");

  sessionStorage.removeItem("editTransaction");

  sessionStorage.removeItem("editingTransactionId");

  if (title) {
    title.textContent = "Add Transaction";
  }

  if (button) {
    button.textContent = "Save Transaction";
  }
}

// ==========================================================
// EDIT MODE
// ==========================================================

function setPageToEditMode() {
  const title = document.getElementById("transactionPageTitle");

  const button = document.querySelector(".save-transaction-btn span");

  if (title) {
    title.textContent = "Edit Transaction";
  }

  if (button) {
    button.textContent = "Update Transaction";
  }
}

// ==========================================================
// LOAD TRANSACTION BY ID
// ==========================================================

async function loadTransactionById(id) {
  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    window.location.href = "login.html";

    return;
  }

  try {
    showMessage("Loading transaction...", "info");

    // ==================================================
    // IMPORTANT FIX
    // Backend requires userId
    // ==================================================

    const response = await fetch(
      `${TRANSACTION_API_URL}/${encodeURIComponent(id)}?userId=${encodeURIComponent(userId)}`,
    );

    console.log("Load transaction status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(errorText || `Server returned ${response.status}`);
    }

    const transaction = await response.json();

    // ==================================================
    // EXTRA OWNERSHIP CHECK
    // ==================================================

    if (
      transaction.userId != null &&
      String(transaction.userId) !== String(userId)
    ) {
      throw new Error("You are not allowed to edit this transaction.");
    }

    populateTransactionForm(transaction);

    clearMessage();
  } catch (error) {
    console.error("LOAD TRANSACTION ERROR:", error);

    showMessage("Unable to load transaction.\n\n" + error.message, "error");
  }
}

// ==========================================================
// POPULATE FORM
// ==========================================================

function populateTransactionForm(transaction) {
  if (!transaction) {
    return;
  }

  const type = document.getElementById("transactionType");

  const category = document.getElementById("category");

  const amount = document.getElementById("amount");

  const date = document.getElementById("transactionDate");

  const payment = document.getElementById("paymentMethod");

  const description = document.getElementById("description");

  // ======================================================
  // TYPE
  // ======================================================

  if (type) {
    type.value = String(transaction.type || "")
      .trim()
      .toLowerCase();
  }

  // ======================================================
  // CATEGORY
  // ======================================================

  if (category) {
    category.value = transaction.category || "";
  }

  // ======================================================
  // AMOUNT
  // ======================================================

  if (amount) {
    amount.value = transaction.amount ?? "";
  }

  // ======================================================
  // DATE
  // ======================================================

  if (date) {
    date.value = normalizeDate(
      transaction.transactionDate || transaction.date || transaction.createdAt,
    );
  }

  // ======================================================
  // PAYMENT METHOD
  // ======================================================

  if (payment) {
    payment.value = transaction.paymentMethod || "";
  }

  // ======================================================
  // DESCRIPTION
  // ======================================================

  if (description) {
    description.value = transaction.description || "";
  }

  // ======================================================
  // STORE EDITING ID
  // ======================================================

  if (transaction.id != null) {
    sessionStorage.setItem("editingTransactionId", String(transaction.id));
  }

  sessionStorage.removeItem("editTransaction");
}

// ==========================================================
// NORMALIZE DATE
// ==========================================================

function normalizeDate(value) {
  if (!value) {
    return "";
  }

  return String(value).split("T")[0].substring(0, 10);
}

// ==========================================================
// FORM SETUP
// ==========================================================

function setupTransactionForm() {
  const form = document.getElementById("transactionForm");

  if (!form) {
    console.error("transactionForm not found.");

    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    await saveTransaction();
  });
}

// ==========================================================
// SAVE / UPDATE TRANSACTION
// ==========================================================

async function saveTransaction() {
  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    showMessage("Session expired. Please login again.", "error");

    return;
  }

  // ======================================================
  // ELEMENTS
  // ======================================================

  const typeElement = document.getElementById("transactionType");

  const categoryElement = document.getElementById("category");

  const amountElement = document.getElementById("amount");

  const dateElement = document.getElementById("transactionDate");

  const paymentElement = document.getElementById("paymentMethod");

  const descriptionElement = document.getElementById("description");

  // ======================================================
  // SAFETY CHECK
  // ======================================================

  if (
    !typeElement ||
    !categoryElement ||
    !amountElement ||
    !dateElement ||
    !paymentElement ||
    !descriptionElement
  ) {
    showMessage("Transaction form is incomplete.", "error");

    return;
  }

  // ======================================================
  // VALUES
  // ======================================================

  const type = typeElement.value.trim().toLowerCase();

  const category = categoryElement.value.trim();

  const amount = Number(amountElement.value);

  const transactionDate = dateElement.value;

  const paymentMethod = paymentElement.value.trim();

  const description = descriptionElement.value.trim();

  // ======================================================
  // VALIDATION
  // ======================================================

  if (!type) {
    showMessage("Please select transaction type.", "error");

    typeElement.focus();

    return;
  }

  if (type !== "income" && type !== "expense") {
    showMessage("Invalid transaction type.", "error");

    return;
  }

  if (!category) {
    showMessage("Please select a category.", "error");

    categoryElement.focus();

    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    showMessage("Please enter a valid amount greater than 0.", "error");

    amountElement.focus();

    return;
  }

  if (!transactionDate) {
    showMessage("Please select a transaction date.", "error");

    dateElement.focus();

    return;
  }

  if (!paymentMethod) {
    showMessage("Please select a payment method.", "error");

    paymentElement.focus();

    return;
  }

  // ======================================================
  // REQUEST BODY
  // ======================================================

  const requestBody = {
    userId: Number(userId),

    type: type,

    category: category,

    amount: amount,

    transactionDate: transactionDate,

    description: description || null,

    paymentMethod: paymentMethod,

    status: "Completed",

    merchant: description || null,
  };

  console.log("Transaction request:", requestBody);

  // ======================================================
  // DETERMINE ADD / EDIT
  // ======================================================

  const params = new URLSearchParams(window.location.search);

  const editId =
    params.get("edit") || sessionStorage.getItem("editingTransactionId");

  const isEditMode = Boolean(editId);

  const url = isEditMode
    ? `${TRANSACTION_API_URL}/${encodeURIComponent(editId)}`
    : TRANSACTION_API_URL;

  const method = isEditMode ? "PUT" : "POST";

  // ======================================================
  // BUTTON
  // ======================================================

  const saveButton = document.querySelector(".save-transaction-btn");

  const buttonText = saveButton ? saveButton.querySelector("span") : null;

  if (saveButton) {
    saveButton.disabled = true;
  }

  if (buttonText) {
    buttonText.textContent = isEditMode ? "Updating..." : "Saving...";
  }

  // ======================================================
  // API REQUEST
  // ======================================================

  try {
    showMessage(
      isEditMode ? "Updating transaction..." : "Saving transaction...",
      "info",
    );

    const response = await fetch(url, {
      method: method,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(responseText || `Server returned ${response.status}`);
    }

    console.log(
      isEditMode
        ? "Transaction updated successfully."
        : "Transaction created successfully.",
    );

    // ==================================================
    // CLEAN SESSION
    // ==================================================

    sessionStorage.removeItem("editTransaction");

    sessionStorage.removeItem("editingTransactionId");

    // ==================================================
    // SUCCESS
    // ==================================================

    showMessage(
      isEditMode
        ? "Transaction updated successfully!"
        : "Transaction added successfully!",
      "success",
    );

    // ==================================================
    // REDIRECT
    // ==================================================

    setTimeout(function () {
      window.location.href = "transactions.html";
    }, 1000);
  } catch (error) {
    console.error("TRANSACTION SAVE ERROR:", error);

    showMessage("Unable to save transaction.\n\n" + error.message, "error");

    if (saveButton) {
      saveButton.disabled = false;
    }

    if (buttonText) {
      buttonText.textContent = isEditMode
        ? "Update Transaction"
        : "Save Transaction";
    }
  }
}

// ==========================================================
// MESSAGE
// ==========================================================

function showMessage(message, type) {
  const element = document.getElementById("transactionMessage");

  if (!element) {
    alert(message);

    return;
  }

  element.textContent = message;

  element.className = "transaction-message";

  if (type === "success") {
    element.classList.add("success");
  } else if (type === "error") {
    element.classList.add("error");
  } else {
    element.classList.add("info");
  }

  element.style.display = "block";
}

// ==========================================================
// CLEAR MESSAGE
// ==========================================================

function clearMessage() {
  const element = document.getElementById("transactionMessage");

  if (!element) {
    return;
  }

  element.textContent = "";

  element.className = "transaction-message";

  element.style.display = "none";
}

// ==========================================================
// CURRENCY EVENTS
// ==========================================================

function setupCurrencyEvents() {
  window.addEventListener("currencyChanged", function () {
    updateCurrencySymbol();
  });

  window.addEventListener("storage", function (event) {
    if (event.key === "currency") {
      updateCurrencySymbol();
    }
  });
}
