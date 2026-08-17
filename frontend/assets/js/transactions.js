/* =========================================================
   BACHAT BUDDY - TRANSACTIONS
   Backend Connected Version
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       ELEMENTS
    ===================================================== */

  const tableBody = document.getElementById("transactionTableBody");

  const searchInput = document.getElementById("searchTransaction");

  const typeFilter = document.getElementById("typeFilter");

  const categoryFilter = document.getElementById("categoryFilter");

  const monthFilter = document.getElementById("monthFilter");

  /* =====================================================
       CHECK TABLE
    ===================================================== */

  if (!tableBody) {
    console.error("ERROR: #transactionTableBody was not found.");

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
    console.error("User is not logged in or userId is missing.");

    window.location.href = "login.html";

    return;
  }

  /* =====================================================
       BACKEND URL
    ===================================================== */

  const API_URL = "http://localhost:8080/api/transactions";

  /* =====================================================
       TRANSACTIONS ARRAY
    ===================================================== */

  let transactions = [];

  /* =====================================================
       LOAD TRANSACTIONS
    ===================================================== */

  async function loadTransactions() {
    try {
      console.log("Loading transactions for user:", userId);

      /* ---------------------------------------------
               LOADING
            --------------------------------------------- */

      tableBody.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="text-align:center; padding:30px;">

                        Loading transactions...

                    </td>
                </tr>
            `;

      /* ---------------------------------------------
               URL
            --------------------------------------------- */

      const url = `${API_URL}/user/${userId}`;

      console.log("Fetching:", url);

      /* ---------------------------------------------
               FETCH
            --------------------------------------------- */

      const response = await fetch(url);

      console.log("GET status:", response.status);

      /* ---------------------------------------------
               ERROR
            --------------------------------------------- */

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Backend error:", errorText);

        throw new Error(`Server returned ${response.status}`);
      }

      /* ---------------------------------------------
               JSON
            --------------------------------------------- */

      const data = await response.json();

      console.log("Transactions received:", data);

      /* ---------------------------------------------
               ARRAY CHECK
            --------------------------------------------- */

      if (!Array.isArray(data)) {
        console.error("Backend response is not an array:", data);

        throw new Error("Invalid transaction data.");
      }

      /* ---------------------------------------------
               SAVE DATA
            --------------------------------------------- */

      transactions = data;

      console.log("Number of transactions:", transactions.length);

      /* ---------------------------------------------
               DISPLAY
            --------------------------------------------- */

      displayTransactions(transactions);
    } catch (error) {
      console.error("TRANSACTION LOAD ERROR:", error);

      tableBody.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="
                            text-align:center;
                            padding:30px;
                            color:red;
                        ">

                        Failed to load transactions.

                        <br><br>

                        ${escapeHTML(error.message)}

                    </td>
                </tr>
            `;
    }
  }

  /* =====================================================
       NORMALIZE TYPE
    ===================================================== */

  function normalizeType(type) {
    return String(type || "")
      .trim()
      .toLowerCase();
  }

  /* =====================================================
       DISPLAY TRANSACTIONS
    ===================================================== */

  function displayTransactions(data) {
    console.log("Displaying transactions:", data);

    /* ---------------------------------------------
           CLEAR TABLE
        --------------------------------------------- */

    tableBody.innerHTML = "";

    /* ---------------------------------------------
           NO DATA
        --------------------------------------------- */

    if (!data || data.length === 0) {
      tableBody.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="
                            text-align:center;
                            padding:30px;
                        ">

                        No transactions found.

                        <br><br>

                        <a href="add-transaction.html">
                            + Add Transaction
                        </a>

                    </td>
                </tr>
            `;

      updateSummary([]);

      return;
    }

    /* =================================================
           CREATE ROWS
        ================================================= */

    data.forEach(function (transaction, index) {
      console.log(`Rendering transaction ${index + 1}:`, transaction);

      const row = document.createElement("tr");

      /* ---------------------------------------------
               ID
            --------------------------------------------- */

      const id = transaction.id;

      /* ---------------------------------------------
               TYPE
            --------------------------------------------- */

      const transactionType = normalizeType(transaction.type);

      const typeText = transactionType === "income" ? "Income" : "Expense";

      const typeClass =
        transactionType === "income" ? "income-tag" : "expense-tag";

      /* ---------------------------------------------
               CATEGORY
            --------------------------------------------- */

      const category = transaction.category || "-";

      /* ---------------------------------------------
               DATE
            --------------------------------------------- */

      const transactionDate =
        transaction.transactionDate || transaction.date || "";

      const formattedDate = formatDate(transactionDate);

      /* ---------------------------------------------
               AMOUNT
            --------------------------------------------- */

      const amount = Number(transaction.amount) || 0;

      const formattedAmount = amount.toLocaleString("en-IN");

      /* ---------------------------------------------
               STATUS
            --------------------------------------------- */

      const status = transaction.status || "Completed";

      /* ---------------------------------------------
               DESCRIPTION
            --------------------------------------------- */

      const description = transaction.description || "";

      /* =================================================
               ROW
            ================================================= */

      row.innerHTML = `

                <td>
                    ${escapeHTML(formattedDate)}
                </td>


                <td>
                    ${escapeHTML(category)}
                </td>


                <td>

                    <span class="${typeClass}">
                        ${typeText}
                    </span>

                </td>


                <td>

                    ₹${formattedAmount}

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
                        data-id="${id}"
                        title="Edit Transaction">

                        <i class="bi bi-pencil-fill"></i>

                    </button>


                    <button
                        type="button"
                        class="btn btn-danger btn-sm ms-1 delete-btn"
                        data-id="${id}"
                        title="Delete Transaction">

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </td>

            `;

      /* ---------------------------------------------
               ADD ROW
            --------------------------------------------- */

      tableBody.appendChild(row);
    });

    /* =================================================
           CHECK RENDERING
        ================================================= */

    console.log(
      "Rows currently in table:",
      tableBody.querySelectorAll("tr").length,
    );

    /* =================================================
           SUMMARY
        ================================================= */

    updateSummary(data);

    /* =================================================
           BUTTONS
        ================================================= */

    attachActionButtons();
  }

  /* =====================================================
       FORMAT DATE
    ===================================================== */

  function formatDate(dateString) {
    if (!dateString) {
      return "-";
    }

    try {
      const date = new Date(dateString + "T00:00:00");

      if (isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  }

  /* =====================================================
       SUMMARY
    ===================================================== */

  function updateSummary(data) {
    let income = 0;

    let expense = 0;

    data.forEach(function (transaction) {
      const amount = Number(transaction.amount) || 0;

      const type = normalizeType(transaction.type);

      if (type === "income") {
        income += amount;
      } else {
        expense += amount;
      }
    });

    const balance = income - expense;

    console.log("Summary:", {
      income,
      expense,
      balance,
      transactions: data.length,
    });

    /* =================================================
           DASHBOARD CARDS
        ================================================= */

    const cards = document.querySelectorAll(".dashboard-card");

    if (cards.length >= 4) {
      /* INCOME */

      const incomeHeading = cards[0].querySelector("h2");

      if (incomeHeading) {
        incomeHeading.textContent = "₹" + income.toLocaleString("en-IN");
      }

      /* EXPENSE */

      const expenseHeading = cards[1].querySelector("h2");

      if (expenseHeading) {
        expenseHeading.textContent = "₹" + expense.toLocaleString("en-IN");
      }

      /* BALANCE */

      const balanceHeading = cards[2].querySelector("h2");

      if (balanceHeading) {
        balanceHeading.textContent = "₹" + balance.toLocaleString("en-IN");
      }

      /* TOTAL */

      const transactionHeading = cards[3].querySelector("h2");

      if (transactionHeading) {
        transactionHeading.textContent = data.length;
      }
    }
  }

  /* =====================================================
       FILTER
    ===================================================== */

  function filterTransactions() {
    const search = searchInput ? searchInput.value.trim().toLowerCase() : "";

    const selectedType = typeFilter
      ? typeFilter.value.trim().toLowerCase()
      : "all";

    const selectedCategory = categoryFilter ? categoryFilter.value : "all";

    const selectedMonth = monthFilter ? monthFilter.value : "all";

    const filtered = transactions.filter(function (transaction) {
      /* SEARCH */

      const searchableText = (
        (transaction.category || "") +
        " " +
        (transaction.type || "") +
        " " +
        (transaction.description || "") +
        " " +
        (transaction.paymentMethod || "") +
        " " +
        (transaction.amount || "")
      ).toLowerCase();

      if (search && !searchableText.includes(search)) {
        return false;
      }

      /* TYPE */

      const transactionType = normalizeType(transaction.type);

      if (selectedType !== "all" && transactionType !== selectedType) {
        return false;
      }

      /* CATEGORY */

      if (
        selectedCategory !== "all" &&
        transaction.category !== selectedCategory
      ) {
        return false;
      }

      /* MONTH */

      if (selectedMonth !== "all") {
        const dateValue = transaction.transactionDate || transaction.date;

        if (!dateValue) {
          return false;
        }

        const transactionDate = new Date(dateValue + "T00:00:00");

        if (isNaN(transactionDate.getTime())) {
          return false;
        }

        const month = transactionDate.toLocaleString("en-US", {
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

  /* =====================================================
       EDIT + DELETE BUTTONS
    ===================================================== */

  function attachActionButtons() {
    /* =================================================
           DELETE
        ================================================= */

    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(function (button) {
      button.addEventListener("click", async function () {
        const id = this.dataset.id;

        if (!id) {
          alert("Transaction ID not found.");

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

          const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete transaction.");
          }

          alert("Transaction deleted successfully!");

          await loadTransactions();
        } catch (error) {
          console.error("DELETE ERROR:", error);

          alert("Unable to delete transaction:\n\n" + error.message);

          this.disabled = false;
        }
      });
    });

    /* =================================================
           EDIT
        ================================================= */

    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const id = this.dataset.id;

        const transaction = transactions.find(function (item) {
          return String(item.id) === String(id);
        });

        if (!transaction) {
          alert("Transaction not found.");

          return;
        }

        sessionStorage.setItem("editTransaction", JSON.stringify(transaction));

        window.location.href =
          "add-transaction.html?edit=" + encodeURIComponent(id);
      });
    });
  }

  /* =====================================================
       SEARCH EVENTS
    ===================================================== */

  if (searchInput) {
    searchInput.addEventListener("input", filterTransactions);
  }

  if (typeFilter) {
    typeFilter.addEventListener("change", filterTransactions);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterTransactions);
  }

  if (monthFilter) {
    monthFilter.addEventListener("change", filterTransactions);
  }

  /* =====================================================
       PROFILE
    ===================================================== */

  const profileImage = sessionStorage.getItem("profileImage");

  const userName =
    sessionStorage.getItem("fullName") || sessionStorage.getItem("userName");

  if (profileImage) {
    const image = document.getElementById("profileImage");

    if (image) {
      image.src = profileImage;
    }
  }

  if (userName) {
    const name = document.getElementById("userName");

    if (name) {
      name.textContent = userName;
    }
  }

  /* =====================================================
       HTML ESCAPE
    ===================================================== */

  function escapeHTML(value) {
    const div = document.createElement("div");

    div.textContent = value == null ? "" : String(value);

    return div.innerHTML;
  }

  /* =====================================================
       INITIAL LOAD
    ===================================================== */

  loadTransactions();
});
