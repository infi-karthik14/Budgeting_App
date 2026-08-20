/* =========================================================
   BACHAT BUDDY - EDIT TRANSACTION
   Backend Connected Version
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  console.log("=================================");
  console.log("EDIT TRANSACTION PAGE");
  console.log("=================================");

  /* =====================================================
       ELEMENTS
    ===================================================== */

  const form = document.getElementById("editTransactionForm");

  const transactionIdInput = document.getElementById("transactionId");

  const dateInput = document.getElementById("transactionDate");

  const typeInput = document.getElementById("transactionType");

  const categoryInput = document.getElementById("category");

  const amountInput = document.getElementById("amount");

  const descriptionInput = document.getElementById("description");

  const paymentMethodInput = document.getElementById("paymentMethod");

  const statusInput = document.getElementById("status");

  const updateButton = document.getElementById("updateButton");

  /* =====================================================
       CHECK ELEMENTS
    ===================================================== */

  console.log("Form:", form);
  console.log("Transaction ID:", transactionIdInput);
  console.log("Date:", dateInput);
  console.log("Type:", typeInput);
  console.log("Category:", categoryInput);
  console.log("Amount:", amountInput);
  console.log("Description:", descriptionInput);
  console.log("Payment Method:", paymentMethodInput);
  console.log("Status:", statusInput);
  console.log("Update Button:", updateButton);

  if (!form) {
    console.error("ERROR: #editTransactionForm not found.");
    return;
  }

  /* =====================================================
       LOGIN CHECK
    ===================================================== */

  const loggedIn = sessionStorage.getItem("loggedIn");

  const userId = sessionStorage.getItem("userId");

  console.log("Logged In:", loggedIn);
  console.log("User ID:", userId);

  if (loggedIn !== "true" || !userId) {
    alert("Please login first.");

    window.location.href = "login.html";

    return;
  }

  /* =====================================================
       API
    ===================================================== */

  const API_URL = "http://localhost:8080/api/transactions";

  /* =====================================================
       GET TRANSACTION FROM SESSION STORAGE
    ===================================================== */

  const storedTransaction = sessionStorage.getItem("editTransaction");

  if (!storedTransaction) {
    alert("No transaction selected for editing.");

    window.location.href = "transactions.html";

    return;
  }

  /* =====================================================
       PARSE TRANSACTION
    ===================================================== */

  let transaction;

  try {
    transaction = JSON.parse(storedTransaction);
  } catch (error) {
    console.error("Invalid transaction data:", error);

    alert("Invalid transaction data.");

    window.location.href = "transactions.html";

    return;
  }

  console.log("Transaction being edited:", transaction);

  /* =====================================================
       TRANSACTION ID
    ===================================================== */

  const transactionId = transaction.id;

  if (!transactionId) {
    alert("Transaction ID is missing.");

    console.error("Transaction ID missing:", transaction);

    window.location.href = "transactions.html";

    return;
  }

  console.log("Editing Transaction ID:", transactionId);

  /* =====================================================
       STORE ID IN HIDDEN INPUT
    ===================================================== */

  if (transactionIdInput) {
    transactionIdInput.value = transactionId;
  }

  /* =====================================================
       DATE
    ===================================================== */

  if (dateInput) {
    const date = transaction.transactionDate || transaction.date || "";

    dateInput.value = convertDateForInput(date);
  }

  /* =====================================================
       TYPE
       
       IMPORTANT:
       HTML uses #transactionType
    ===================================================== */

  if (typeInput) {
    let savedType = String(transaction.type || "")
      .trim()
      .toLowerCase();

    const savedCategory = String(transaction.category || "")
      .trim()
      .toLowerCase();

    /*
     * Salary is always income
     */

    if (savedCategory === "salary") {
      savedType = "income";
    }

    console.log("Saved transaction type:", savedType);

    /*
     * Set select value directly
     */

    if (savedType === "income" || savedType === "expense") {
      typeInput.value = savedType;
    }

    console.log("Type selected:", typeInput.value);
  }

  /* =====================================================
       CATEGORY
    ===================================================== */

  if (categoryInput) {
    categoryInput.value = transaction.category || "";
  }

  /* =====================================================
       AMOUNT
    ===================================================== */

  if (amountInput) {
    amountInput.value = transaction.amount ?? "";
  }

  /* =====================================================
       DESCRIPTION
    ===================================================== */

  if (descriptionInput) {
    descriptionInput.value = transaction.description || "";
  }

  /* =====================================================
       PAYMENT METHOD
    ===================================================== */

  if (paymentMethodInput) {
    paymentMethodInput.value = transaction.paymentMethod || "";
  }

  /* =====================================================
       STATUS
    ===================================================== */

  if (statusInput) {
    statusInput.value = transaction.status || "Completed";
  }

  /* =====================================================
       LOG FORM VALUES
    ===================================================== */

  console.log("=================================");
  console.log("FORM VALUES AFTER LOADING");
  console.log("Date:", dateInput?.value);
  console.log("Type:", typeInput?.value);
  console.log("Category:", categoryInput?.value);
  console.log("Amount:", amountInput?.value);
  console.log("Description:", descriptionInput?.value);
  console.log("Payment:", paymentMethodInput?.value);
  console.log("Status:", statusInput?.value);
  console.log("=================================");

  /* =====================================================
       DATE CONVERSION
    ===================================================== */

  function convertDateForInput(dateValue) {
    if (!dateValue) {
      return "";
    }

    dateValue = String(dateValue);

    /*
     * Already correct:
     * 2026-08-18
     */

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }

    /*
     * Convert:
     * 18-08-2026
     *
     * to:
     * 2026-08-18
     */

    if (/^\d{2}-\d{2}-\d{4}$/.test(dateValue)) {
      const parts = dateValue.split("-");

      return parts[2] + "-" + parts[1] + "-" + parts[0];
    }

    /*
     * Try JavaScript Date
     */

    const date = new Date(dateValue);

    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }

    return "";
  }

  /* =====================================================
       CATEGORY CHANGE
       
       Salary = Income
    ===================================================== */

  if (categoryInput) {
    categoryInput.addEventListener("change", function () {
      const category = this.value.trim().toLowerCase();

      if (category === "salary") {
        typeInput.value = "income";

        console.log("Salary selected -> Income");
      }
    });
  }

  /* =====================================================
       TYPE CHANGE
    ===================================================== */

  if (typeInput) {
    typeInput.addEventListener("change", function () {
      console.log("Transaction type changed:", this.value);
    });
  }

  /* =====================================================
       UPDATE TRANSACTION
    ===================================================== */

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    console.log("=================================");

    console.log("UPDATE BUTTON CLICKED");

    console.log("=================================");

    /* ---------------------------------------------
               GET VALUES
            --------------------------------------------- */

    const date = dateInput ? dateInput.value.trim() : "";

    const type = typeInput ? typeInput.value.trim().toLowerCase() : "";

    const category = categoryInput ? categoryInput.value.trim() : "";

    const amount = amountInput ? Number(amountInput.value) : 0;

    const description = descriptionInput ? descriptionInput.value.trim() : "";

    const paymentMethod = paymentMethodInput ? paymentMethodInput.value : "";

    const status = statusInput ? statusInput.value : "Completed";

    /* ---------------------------------------------
               LOG VALUES
            --------------------------------------------- */

    console.log("Date:", date);
    console.log("Type:", type);
    console.log("Category:", category);
    console.log("Amount:", amount);
    console.log("Description:", description);
    console.log("Payment:", paymentMethod);
    console.log("Status:", status);
    console.log("ID:", transactionId);
    console.log("User ID:", userId);

    /* =================================================
               VALIDATION
            ================================================= */

    if (!date) {
      alert("Please select a date.");

      return;
    }

    if (type !== "income" && type !== "expense") {
      alert("Please select a valid transaction type.");

      console.error("Invalid type:", type);

      return;
    }

    if (!category) {
      alert("Please select a category.");

      return;
    }

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");

      return;
    }

    /* =================================================
               SALARY = INCOME
            ================================================= */

    let finalType = type;

    if (category.toLowerCase() === "salary") {
      finalType = "income";
    }

    /* =================================================
               REQUEST BODY
            ================================================= */

    const updatedTransaction = {
      id: transactionId,

      userId: Number(userId),

      type: finalType,

      category: category,

      amount: amount,

      transactionDate: date,

      description: description,

      paymentMethod: paymentMethod,

      status: status,
    };

    console.log("=================================");

    console.log("SENDING UPDATE TO BACKEND:");

    console.log(updatedTransaction);

    console.log("=================================");

    /* =================================================
               DISABLE BUTTON
            ================================================= */

    if (updateButton) {
      updateButton.disabled = true;

      updateButton.innerHTML =
        '<i class="bi bi-hourglass-split"></i> Updating...';
    }

    /* =================================================
               PUT REQUEST
            ================================================= */

    try {
      const response = await fetch(`${API_URL}/${transactionId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(updatedTransaction),
      });

      console.log("PUT status:", response.status);

      /* ---------------------------------------------
                   READ RESPONSE
                --------------------------------------------- */

      const responseText = await response.text();

      console.log("Backend response:", responseText);

      /* ---------------------------------------------
                   CHECK RESPONSE
                --------------------------------------------- */

      if (!response.ok) {
        throw new Error(responseText || `Server returned ${response.status}`);
      }

      /* =================================================
                   SUCCESS
                ================================================= */

      alert("Transaction updated successfully!");

      /*
       * Remove temporary edit data
       */

      sessionStorage.removeItem("editTransaction");

      /*
       * Return to transactions
       */

      window.location.href = "transactions.html";
    } catch (error) {
      console.error("UPDATE ERROR:", error);

      alert("Unable to update transaction.\n\n" + error.message);

      /*
       * Enable button again
       */

      if (updateButton) {
        updateButton.disabled = false;

        updateButton.innerHTML =
          '<i class="bi bi-check-lg"></i> Update Transaction';
      }
    }
  });

  /* =====================================================
       INITIALIZATION COMPLETE
    ===================================================== */

  console.log("Edit transaction form ready.");
});

/* =========================================================
   GO BACK FUNCTION

   IMPORTANT:
   Your HTML uses:
   onclick="goBack()"

   Therefore this function must be outside
   DOMContentLoaded.
========================================================= */

function goBack() {
  console.log("Cancel / Back clicked.");

  /*
   * Remove temporary transaction
   */

  sessionStorage.removeItem("editTransaction");

  /*
   * Return to transactions page
   */

  window.location.href = "transactions.html";
}
