document.addEventListener("DOMContentLoaded", function () {
  const incomeForm = document.getElementById("incomeForm");

  const incomeTableBody = document.getElementById("incomeTableBody");

  const totalIncome = document.getElementById("totalIncome");

  const incomeCount = document.getElementById("incomeCount");

  const averageIncome = document.getElementById("averageIncome");

  const cancelIncome = document.getElementById("cancelIncome");

  const incomeDate = document.getElementById("incomeDate");

  /* ==========================================
       SET TODAY'S DATE
    =========================================== */

  const today = new Date().toISOString().split("T")[0];

  incomeDate.value = today;

  /* ==========================================
       LOAD INCOME
    =========================================== */

  function getIncomeData() {
    return JSON.parse(localStorage.getItem("incomeData")) || [];
  }

  /* ==========================================
       FORMAT CURRENCY
    =========================================== */

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /* ==========================================
       DISPLAY INCOME
    =========================================== */

  function displayIncome() {
    const incomeData = getIncomeData();

    incomeTableBody.innerHTML = "";

    let total = 0;

    incomeData.forEach(function (income) {
      total += Number(income.amount);

      const row = document.createElement("tr");

      row.innerHTML = `

                <td>
                    ${income.date}
                </td>

                <td>
                    ${income.source}
                </td>

                <td>
                    ${income.paymentMethod}
                </td>

                <td class="income-amount">
                    + ${formatCurrency(income.amount)}
                </td>

                <td>
                    ${income.description || "-"}
                </td>

            `;

      incomeTableBody.appendChild(row);
    });

    const count = incomeData.length;

    const average = count > 0 ? total / count : 0;

    totalIncome.textContent = formatCurrency(total);

    incomeCount.textContent = count;

    averageIncome.textContent = formatCurrency(average);
  }

  /* ==========================================
       ADD INCOME
    =========================================== */

  incomeForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const source = document.getElementById("incomeSource").value;

    const amount = Number(document.getElementById("incomeAmount").value);

    const date = document.getElementById("incomeDate").value;

    const paymentMethod = document.getElementById("paymentMethod").value;

    const description = document
      .getElementById("incomeDescription")
      .value.trim();

    if (!source || !amount || amount <= 0 || !date || !paymentMethod) {
      alert("Please fill all required fields.");

      return;
    }

    const incomeData = getIncomeData();

    const newIncome = {
      id: Date.now(),

      type: "income",

      source: source,

      amount: amount,

      date: date,

      paymentMethod: paymentMethod,

      description: description,

      createdAt: new Date().toISOString(),
    };

    incomeData.push(newIncome);

    localStorage.setItem("incomeData", JSON.stringify(incomeData));

    alert("Income added successfully!");

    incomeForm.reset();

    incomeDate.value = today;

    displayIncome();
  });

  /* ==========================================
       CANCEL
    =========================================== */

  cancelIncome.addEventListener("click", function () {
    incomeForm.reset();

    incomeDate.value = today;
  });

  /* ==========================================
       INITIAL DISPLAY
    =========================================== */

  displayIncome();
});
