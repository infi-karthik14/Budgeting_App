/* =========================================================
   BACHAT BUDDY - ADD / EDIT TRANSACTION
   Spring Boot Backend Connected
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

  const pageTitle = document.getElementById("transactionPageTitle");
  const submitButton = form
    ? form.querySelector('button[type="submit"]')
    : null;

  /* =====================================================
       ELEMENT CHECK
    ===================================================== */

  if (
    !form ||
    !type ||
    !category ||
    !amount ||
    !date ||
    !paymentMethod ||
    !description ||
    !message
  ) {
    console.error("Required transaction form elements are missing.");
    return;
  }

  /* =====================================================
       LOGIN CHECK
    ===================================================== */

  const loggedIn = sessionStorage.getItem("loggedIn");
  const userId = sessionStorage.getItem("userId");

  console.log("========== SESSION ==========");
  console.log("Logged In:", loggedIn);
  console.log("User ID:", userId);
  console.log("=============================");

  if (loggedIn !== "true" || !userId) {
    showMessage("Session expired. Please login again.", "error");

    setTimeout(function () {
      window.location.href = "login.html";
    }, 1500);

    return;
  }

  /* =====================================================
       VALIDATE USER ID
    ===================================================== */

  const numericUserId = Number(userId);

  if (!Number.isInteger(numericUserId) || numericUserId <= 0) {
    showMessage("Invalid user ID. Please login again.", "error");

    return;
  }

  /* =====================================================
       API
    ===================================================== */

  const API_URL = "http://localhost:8080/api/transactions";

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

  date.value = today;

  /* =====================================================
       CHECK EDIT MODE
    ===================================================== */

  const storedTransaction = sessionStorage.getItem("editTransaction");

  let editTransaction = null;

  if (storedTransaction) {
    try {
      editTransaction = JSON.parse(storedTransaction);

      console.log("Edit transaction:", editTransaction);
    } catch (error) {
      console.error("Invalid edit transaction:", error);

      sessionStorage.removeItem("editTransaction");
    }
  }

  /* =====================================================
       GET EDIT ID
    ===================================================== */

  let editId = null;

  if (editTransaction && editTransaction.id) {
    editId = editTransaction.id;
  }

  /* =====================================================
       ALSO SUPPORT ?edit=ID
    ===================================================== */

  const urlParams = new URLSearchParams(window.location.search);

  const urlEditId = urlParams.get("edit");

  if (urlEditId) {
    editId = urlEditId;
  }

  /* =====================================================
       EDIT MODE
    ===================================================== */

  if (editTransaction && editId) {
    console.log("========== EDIT MODE ==========");
    console.log("Transaction ID:", editId);
    console.log("===============================");

    /* TYPE */

    type.value = String(editTransaction.type || "").toLowerCase();

    /* CATEGORY */

    category.value = editTransaction.category || "";

    /* AMOUNT */

    amount.value = editTransaction.amount || "";

    /* DATE */

    date.value =
      normalizeDate(editTransaction.transactionDate || editTransaction.date) ||
      today;

    /* PAYMENT METHOD */

    paymentMethod.value = editTransaction.paymentMethod || "";

    /* DESCRIPTION */

    description.value = editTransaction.description || "";

    /* TITLE */

    if (pageTitle) {
      pageTitle.textContent = "Edit Transaction";
    }

    /* BUTTON */

    if (submitButton) {
      submitButton.innerHTML =
        '<i class="fa-solid fa-pen-to-square"></i> ' +
        "<span>Update Transaction</span>";
    }

    updateTypeStyle();
  } else {
    console.log("========== ADD MODE ==========");

    if (pageTitle) {
      pageTitle.textContent = "Add Transaction";
    }

    if (submitButton) {
      submitButton.innerHTML =
        '<i class="fa-solid fa-check"></i> ' + "<span>Save Transaction</span>";
    }
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
       TYPE COLOR
    ===================================================== */

  function updateTypeStyle() {
    type.classList.remove("income-selected", "expense-selected");

    if (type.value === "income") {
      type.classList.add("income-selected");
    }

    if (type.value === "expense") {
      type.classList.add("expense-selected");
    }
  }

  /* =====================================================
       TYPE CHANGE
    ===================================================== */

  type.addEventListener("change", updateTypeStyle);

  /* =====================================================
       FORM SUBMIT
    ===================================================== */

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    /* ---------------------------------------------
               CLEAR MESSAGE
            --------------------------------------------- */

    message.textContent = "";

    message.className = "transaction-message";

    /* ---------------------------------------------
               GET VALUES
            --------------------------------------------- */

    const transactionType = type.value.trim().toLowerCase();

    const transactionCategory = category.value.trim();

    const transactionAmount = Number(amount.value);

    const transactionDate = date.value;

    const transactionPaymentMethod = paymentMethod.value.trim();

    const transactionDescription = description.value.trim();

    /* ---------------------------------------------
               VALIDATION
            --------------------------------------------- */

    if (!transactionType) {
      showMessage("Please select transaction type.", "error");

      return;
    }

    if (transactionType !== "income" && transactionType !== "expense") {
      showMessage("Invalid transaction type.", "error");

      return;
    }

    if (!transactionCategory) {
      showMessage("Please select a category.", "error");

      return;
    }

    if (!Number.isFinite(transactionAmount) || transactionAmount <= 0) {
      showMessage("Please enter a valid amount.", "error");

      amount.focus();

      return;
    }

    if (!transactionDate) {
      showMessage("Please select a date.", "error");

      return;
    }

    if (!transactionPaymentMethod) {
      showMessage("Please select a payment method.", "error");

      return;
    }

    /* ---------------------------------------------
               REQUEST BODY
            --------------------------------------------- */

    const transactionData = {
      userId: numericUserId,

      type: transactionType,

      category: transactionCategory,

      amount: transactionAmount,

      transactionDate: transactionDate,

      paymentMethod: transactionPaymentMethod,

      description: transactionDescription || transactionCategory,

      /*
       * These values match the fields
       * supported by TransactionRequest.
       */

      status: "Completed",

      merchant: "",
    };

    console.log("========== REQUEST ==========");

    console.log(JSON.stringify(transactionData, null, 2));

    console.log("=============================");

    /* ---------------------------------------------
               DETERMINE ADD / UPDATE
            --------------------------------------------- */

    let url = API_URL;

    let method = "POST";

    const isEdit = editTransaction && editId;

    if (isEdit) {
      url = API_URL + "/" + encodeURIComponent(editId);

      method = "PUT";
    }

    console.log("URL:", url);
    console.log("METHOD:", method);

    /* ---------------------------------------------
               DISABLE BUTTON
            --------------------------------------------- */

    const originalButtonHTML = submitButton ? submitButton.innerHTML : "";

    if (submitButton) {
      submitButton.disabled = true;

      submitButton.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2"></span>' +
        (isEdit ? "Updating..." : "Saving...");
    }

    /* ---------------------------------------------
               SEND REQUEST
            --------------------------------------------- */

    try {
      const response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(transactionData),
      });

      console.log("HTTP Status:", response.status);

      /* -----------------------------------------
                   READ RESPONSE
                ----------------------------------------- */

      const responseText = await response.text();

      console.log("Backend response:", responseText);

      /* -----------------------------------------
                   ERROR
                ----------------------------------------- */

      if (!response.ok) {
        let errorMessage = "Unable to save transaction.";

        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);

            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (error) {
            errorMessage = responseText;
          }
        }

        throw new Error(errorMessage);
      }

      /* -----------------------------------------
                   SUCCESS
                ----------------------------------------- */

      console.log(isEdit ? "Transaction updated." : "Transaction created.");

      showMessage(
        isEdit
          ? "Transaction updated successfully!"
          : "Transaction added successfully!",
        "success",
      );

      /* -----------------------------------------
                   REMOVE EDIT DATA
                ----------------------------------------- */

      sessionStorage.removeItem("editTransaction");

      /* -----------------------------------------
                   REDIRECT
                ----------------------------------------- */

      setTimeout(function () {
        window.location.href = "transactions.html";
      }, 1000);
    } catch (error) {
      console.error("TRANSACTION ERROR:", error);

      showMessage(error.message || "Unable to connect to backend.", "error");

      /* -----------------------------------------
                   ENABLE BUTTON
                ----------------------------------------- */

      if (submitButton) {
        submitButton.disabled = false;

        submitButton.innerHTML = originalButtonHTML;
      }
    }
  });

  /* =====================================================
       MESSAGE
    ===================================================== */

  function showMessage(text, type) {
    message.textContent = text;

    message.className = "transaction-message " + type;
  }

  /* =====================================================
       LOAD USER NAME
    ===================================================== */

  const storedName =
    sessionStorage.getItem("fullName") || sessionStorage.getItem("userName");

  if (storedName) {
    const nameElement = document.getElementById("userName");

    if (nameElement) {
      nameElement.textContent = storedName;
    }
  }

  /* =====================================================
       DEBUG
    ===================================================== */

  console.log("Transaction form initialized.");

  console.log("Mode:", editTransaction ? "EDIT" : "ADD");
});
