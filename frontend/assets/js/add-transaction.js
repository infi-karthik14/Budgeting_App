/* =========================================================
   BACHAT BUDDY - ADD / EDIT TRANSACTION
   Backend Connected Version
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       ELEMENTS
    ===================================================== */

  const form = document.getElementById("transactionForm");

  const type = document.getElementById("transactionType");

  const category = document.getElementById("category");

  const amount = document.getElementById("amount");

  const date = document.getElementById("transactionDate");

  const paymentMethod = document.getElementById("paymentMethod");

  const description = document.getElementById("description");

  const message = document.getElementById("transactionMessage");

  /* =====================================================
       CHECK ELEMENTS
    ===================================================== */

  if (!form) {
    console.error("ERROR: transactionForm not found.");
    return;
  }

  if (!type) {
    console.error("ERROR: transactionType not found.");
    return;
  }

  if (!category) {
    console.error("ERROR: category not found.");
    return;
  }

  if (!amount) {
    console.error("ERROR: amount not found.");
    return;
  }

  if (!date) {
    console.error("ERROR: transactionDate not found.");
    return;
  }

  if (!paymentMethod) {
    console.error("ERROR: paymentMethod not found.");
    return;
  }

  if (!description) {
    console.error("ERROR: description not found.");
    return;
  }

  if (!message) {
    console.error("ERROR: transactionMessage not found.");
    return;
  }

  /* =====================================================
       LOGIN CHECK
    ===================================================== */

  const loggedIn = sessionStorage.getItem("loggedIn");

  const userId = sessionStorage.getItem("userId");

  const userEmail = sessionStorage.getItem("userEmail");

  console.log("========== SESSION CHECK ==========");
  console.log("loggedIn:", loggedIn);
  console.log("userId:", userId);
  console.log("userEmail:", userEmail);
  console.log("===================================");

  if (loggedIn !== "true") {
    showError("Session expired. Please login again.");

    setTimeout(function () {
      window.location.href = "login.html";
    }, 1500);

    return;
  }

  if (!userId) {
    showError("User ID not found. Please login again.");

    console.error("ERROR: sessionStorage userId is missing.");

    return;
  }

  /* =====================================================
       BACKEND API
    ===================================================== */

  const API_URL = "http://localhost:8080/api/transactions";

  /* =====================================================
       TODAY'S DATE
    ===================================================== */

  const today = new Date();

  const formattedDate =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  date.value = formattedDate;

  /* =====================================================
       CHECK EDIT MODE
    ===================================================== */

  const urlParams = new URLSearchParams(window.location.search);

  const editId = urlParams.get("edit");

  /*
   * IMPORTANT:
   * transactions.js stores editTransaction
   * in sessionStorage.
   */

  let editTransaction = null;

  const storedEditTransaction = sessionStorage.getItem("editTransaction");

  if (storedEditTransaction) {
    try {
      editTransaction = JSON.parse(storedEditTransaction);

      console.log("Edit transaction loaded:", editTransaction);
    } catch (error) {
      console.error("Unable to parse edit transaction:", error);

      sessionStorage.removeItem("editTransaction");
    }
  }

  /* =====================================================
       LOAD EDIT TRANSACTION
    ===================================================== */

  if (editTransaction && editId) {
    console.log("EDIT MODE");
    console.log("Edit ID:", editId);

    /* ==============================================
           TYPE
        ============================================== */

    type.value = String(editTransaction.type || "").toLowerCase();

    /* ==============================================
           CATEGORY
        ============================================== */

    category.value = editTransaction.category || "";

    /* ==============================================
           AMOUNT
        ============================================== */

    amount.value = editTransaction.amount || "";

    /* ==============================================
           DATE
        ============================================== */

    /*
     * Backend field is transactionDate.
     *
     * Your old code was using:
     * editTransaction.date
     *
     * which is incorrect.
     */

    date.value =
      editTransaction.transactionDate || editTransaction.date || formattedDate;

    /* ==============================================
           PAYMENT METHOD
        ============================================== */

    paymentMethod.value = editTransaction.paymentMethod || "";

    /* ==============================================
           DESCRIPTION
        ============================================== */

    description.value = editTransaction.description || "";

    /* ==============================================
           TYPE COLOR
        ============================================== */

    type.classList.remove("income-selected", "expense-selected");

    if (type.value === "income") {
      type.classList.add("income-selected");
    }

    if (type.value === "expense") {
      type.classList.add("expense-selected");
    }

    /* ==============================================
           CHANGE PAGE TITLE
        ============================================== */

    const title = document.getElementById("transactionPageTitle");

    if (title) {
      title.textContent = "Edit Transaction";
    }

    /* ==============================================
           CHANGE BUTTON TEXT
        ============================================== */

    const button = form.querySelector(".save-transaction-btn span");

    if (button) {
      button.textContent = "Update Transaction";
    }

    /*
     * If your button doesn't contain a span,
     * update the button text directly.
     */

    const saveButton = form.querySelector(".save-transaction-btn");

    if (saveButton && !saveButton.querySelector("span")) {
      saveButton.textContent = "✓ Update Transaction";
    }
  }

  /* =====================================================
       TYPE CHANGE
    ===================================================== */

  type.addEventListener("change", function () {
    type.classList.remove("income-selected", "expense-selected");

    if (this.value === "income") {
      type.classList.add("income-selected");
    }

    if (this.value === "expense") {
      type.classList.add("expense-selected");
    }
  });

  /* =====================================================
       FORM SUBMIT
    ===================================================== */

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    /* ==========================================
               CLEAR OLD MESSAGE
            ========================================== */

    message.textContent = "";

    message.className = "transaction-message";

    /* ==========================================
               GET VALUES
            ========================================== */

    const transactionType = type.value;

    const transactionCategory = category.value;

    const transactionAmount = Number(amount.value);

    const transactionDate = date.value;

    const transactionPaymentMethod = paymentMethod.value;

    const transactionDescription = description.value.trim();

    /* ==========================================
               VALIDATION
            ========================================== */

    if (!transactionType) {
      showError("Please select transaction type.");

      return;
    }

    if (!transactionCategory) {
      showError("Please select a category.");

      return;
    }

    if (!transactionAmount || transactionAmount <= 0) {
      showError("Please enter a valid amount.");

      amount.focus();

      return;
    }

    if (!transactionDate) {
      showError("Please select a date.");

      return;
    }

    if (!transactionPaymentMethod) {
      showError("Please select a payment method.");

      return;
    }

    /* ==========================================
               GET USER ID
            ========================================== */

    /*
     * VERY IMPORTANT:
     *
     * Use sessionStorage because your login
     * system stores the logged-in user there.
     */

    const currentUserId = sessionStorage.getItem("userId");

    if (!currentUserId) {
      showError("User ID not found. Please login again.");

      console.error("sessionStorage userId:", currentUserId);

      return;
    }

    /* ==========================================
               VERIFY USER ID
            ========================================== */

    const numericUserId = Number(currentUserId);

    if (!Number.isInteger(numericUserId) || numericUserId <= 0) {
      showError("Invalid User ID. Please login again.");

      console.error("Invalid userId:", currentUserId);

      return;
    }

    /* ==========================================
               REQUEST BODY
            ========================================== */

    const transactionData = {
      userId: numericUserId,

      type: transactionType,

      category: transactionCategory,

      amount: transactionAmount,

      transactionDate: transactionDate,

      paymentMethod: transactionPaymentMethod,

      description: transactionDescription,
    };

    console.log("========== TRANSACTION REQUEST ==========");

    console.log("User ID:", numericUserId);

    console.log("Transaction data:", transactionData);

    console.log("==========================================");

    /* ==========================================
               API URL
            ========================================== */

    let url = API_URL;

    let method = "POST";

    /* ==========================================
               EDIT MODE
            ========================================== */

    if (editTransaction && editId) {
      url = API_URL + "/" + encodeURIComponent(editId);

      method = "PUT";
    }

    console.log("Request URL:", url);

    console.log("Request method:", method);

    /* ==========================================
               DISABLE BUTTON
            ========================================== */

    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;

      submitButton.dataset.originalText = submitButton.innerHTML;

      submitButton.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2"></span>' +
        (editTransaction && editId ? "Updating..." : "Saving...");
    }

    /* ==========================================
               SEND REQUEST
            ========================================== */

    try {
      const response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(transactionData),
      });

      /* ======================================
                   READ BACKEND RESPONSE
                ====================================== */

      const responseText = await response.text();

      console.log("HTTP Status:", response.status);

      console.log("Backend response:", responseText);

      /* ======================================
                   CHECK RESPONSE
                ====================================== */

      if (!response.ok) {
        let errorMessage = "Failed to save transaction.";

        try {
          const errorData = JSON.parse(responseText);

          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          if (responseText) {
            errorMessage = responseText;
          }
        }

        throw new Error(errorMessage);
      }

      /* ======================================
                   SUCCESS
                ====================================== */

      let savedTransaction = null;

      if (responseText) {
        try {
          savedTransaction = JSON.parse(responseText);
        } catch (e) {
          console.log("Backend returned non-JSON response.");
        }
      }

      console.log("Saved transaction:", savedTransaction);

      /* ======================================
                   SUCCESS MESSAGE
                ====================================== */

      message.textContent =
        editTransaction && editId
          ? "Transaction updated successfully!"
          : "Transaction added successfully!";

      message.classList.add("success");

      /* ======================================
                   REMOVE EDIT SESSION
                ====================================== */

      sessionStorage.removeItem("editTransaction");

      /* ======================================
                   REDIRECT
                ====================================== */

      setTimeout(function () {
        window.location.href = "transactions.html";
      }, 1000);
    } catch (error) {
      console.error("TRANSACTION ERROR:", error);

      showError(
        error.message ||
          "Unable to save transaction. Please check whether the backend is running.",
      );

      /* ======================================
                   ENABLE BUTTON AGAIN
                ====================================== */

      if (submitButton) {
        submitButton.disabled = false;

        submitButton.innerHTML =
          submitButton.dataset.originalText ||
          (editTransaction && editId
            ? "✓ Update Transaction"
            : "✓ Save Transaction");
      }
    }
  });

  /* =====================================================
       ERROR FUNCTION
    ===================================================== */

  function showError(text) {
    message.textContent = text;

    message.className = "transaction-message error";
  }

  /* =====================================================
       LOAD USER NAME
    ===================================================== */

  const userName =
    sessionStorage.getItem("fullName") || sessionStorage.getItem("userName");

  if (userName) {
    const name = document.getElementById("userName");

    if (name) {
      name.textContent = userName;
    }
  }
});
