// ==========================================================
// BACHAT BUDDY - SAVINGS GOALS
// Dashboard Connected + Dynamic Currency + Dark Mode
// ==========================================================

"use strict";

// ==========================================================
// PAGE LOAD
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("Savings Goals JS loaded.");

  applySavedDarkMode();

  loadUserData();

  loadSavedGoal();

  setupSaveGoal();

  setupResetGoal();

  setupDeleteGoal();
});

// ==========================================================
// USER DATA
// ==========================================================

function loadUserData() {
  const userName =
    sessionStorage.getItem("fullName") ||
    sessionStorage.getItem("userName") ||
    localStorage.getItem("userName") ||
    "User";

  const userNameElement = document.getElementById("userName");

  if (userNameElement) {
    userNameElement.textContent = userName;
  }
}

// ==========================================================
// DARK MODE
// ==========================================================

function applySavedDarkMode() {
  const savedDarkMode = localStorage.getItem("darkMode");

  const isDark = savedDarkMode === "enabled";

  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light",
  );

  document.body.classList.toggle("dark-mode", isDark);
}

// ==========================================================
// CURRENCY
// ==========================================================

function getSelectedCurrency() {
  return localStorage.getItem("currency") || "INR";
}

// ==========================================================
// CURRENCY CONFIG
// ==========================================================

function getCurrencyConfig() {
  const currency = getSelectedCurrency();

  const currencies = {
    INR: {
      code: "INR",
      locale: "en-IN",
      symbol: "₹",
    },

    USD: {
      code: "USD",
      locale: "en-US",
      symbol: "$",
    },

    EUR: {
      code: "EUR",
      locale: "de-DE",
      symbol: "€",
    },

    GBP: {
      code: "GBP",
      locale: "en-GB",
      symbol: "£",
    },

    JPY: {
      code: "JPY",
      locale: "ja-JP",
      symbol: "¥",
    },

    CNY: {
      code: "CNY",
      locale: "zh-CN",
      symbol: "¥",
    },

    AUD: {
      code: "AUD",
      locale: "en-AU",
      symbol: "A$",
    },

    CAD: {
      code: "CAD",
      locale: "en-CA",
      symbol: "C$",
    },
  };

  return currencies[currency] || currencies.INR;
}

// ==========================================================
// FORMAT CURRENCY
// ==========================================================

function formatCurrency(amount) {
  const config = getCurrencyConfig();

  const value = Number(amount) || 0;

  /*
   * IMPORTANT:
   *
   * We manually control the symbol.
   *
   * This prevents:
   * EUR -> EUR 1,000
   * JPY -> JP¥1,000
   *
   * and gives:
   * EUR -> 1.000 €
   * JPY -> ¥1,000
   */

  let formattedNumber;

  // --------------------------------------------------------
  // EUROPEAN NUMBER FORMAT FOR EUR
  // --------------------------------------------------------

  if (config.code === "EUR") {
    formattedNumber = value.toLocaleString("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    return formattedNumber + " €";
  }

  // --------------------------------------------------------
  // JPY
  // --------------------------------------------------------

  if (config.code === "JPY") {
    formattedNumber = value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return "¥" + formattedNumber;
  }

  // --------------------------------------------------------
  // CNY
  // --------------------------------------------------------

  if (config.code === "CNY") {
    formattedNumber = value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    return "¥" + formattedNumber;
  }

  // --------------------------------------------------------
  // NORMAL CURRENCIES
  // --------------------------------------------------------

  formattedNumber = value.toLocaleString(config.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return config.symbol + formattedNumber;
}

// ==========================================================
// LOAD SAVED GOAL
// ==========================================================

function loadSavedGoal() {
  const goalName = localStorage.getItem("savingsGoalName") || "";

  const saved = Number(localStorage.getItem("savingsGoalSaved") || 0);

  const target = Number(localStorage.getItem("savingsGoalTarget") || 0);

  const deadline = localStorage.getItem("savingsGoalDeadline") || "";

  // --------------------------------------------------------
  // FORM ELEMENTS
  // --------------------------------------------------------

  const goalNameElement = document.getElementById("goalName");

  const goalTargetElement = document.getElementById("goalTarget");

  const goalSavedElement = document.getElementById("goalSaved");

  const goalDeadlineElement = document.getElementById("goalDeadline");

  // --------------------------------------------------------
  // LOAD FORM
  // --------------------------------------------------------

  if (goalNameElement) {
    goalNameElement.value = goalName;
  }

  if (goalTargetElement) {
    goalTargetElement.value = target > 0 ? target : "";
  }

  if (goalSavedElement) {
    goalSavedElement.value = saved > 0 ? saved : "";
  }

  if (goalDeadlineElement) {
    goalDeadlineElement.value = deadline;
  }

  // --------------------------------------------------------
  // DISPLAY
  // --------------------------------------------------------

  displayGoal(goalName, saved, target, deadline);
}

// ==========================================================
// SAVE GOAL
// ==========================================================

function setupSaveGoal() {
  const saveButton = document.getElementById("saveGoalBtn");

  if (!saveButton) {
    console.error("Save Goal button not found.");
    return;
  }

  saveButton.addEventListener("click", function () {
    const goalNameElement = document.getElementById("goalName");

    const goalTargetElement = document.getElementById("goalTarget");

    const goalSavedElement = document.getElementById("goalSaved");

    const goalDeadlineElement = document.getElementById("goalDeadline");

    if (
      !goalNameElement ||
      !goalTargetElement ||
      !goalSavedElement ||
      !goalDeadlineElement
    ) {
      alert("Savings goal form is not configured correctly.");

      return;
    }

    const goalName = goalNameElement.value.trim();

    const target = Number(goalTargetElement.value);

    const saved = Number(goalSavedElement.value || 0);

    const deadline = goalDeadlineElement.value;

    // ------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------

    if (!goalName) {
      alert("Please enter a goal name.");

      goalNameElement.focus();

      return;
    }

    if (!target || target <= 0) {
      alert("Please enter a valid target amount.");

      goalTargetElement.focus();

      return;
    }

    if (saved < 0) {
      alert("Saved amount cannot be negative.");

      goalSavedElement.focus();

      return;
    }

    if (saved > target) {
      alert("Saved amount cannot be greater than the target amount.");

      goalSavedElement.focus();

      return;
    }

    // ------------------------------------------------------
    // SAVE
    // ------------------------------------------------------

    localStorage.setItem("savingsGoalName", goalName);

    localStorage.setItem("savingsGoalTarget", String(target));

    localStorage.setItem("savingsGoalSaved", String(saved));

    if (deadline) {
      localStorage.setItem("savingsGoalDeadline", deadline);
    } else {
      localStorage.removeItem("savingsGoalDeadline");
    }

    // ------------------------------------------------------
    // UPDATE DISPLAY
    // ------------------------------------------------------

    displayGoal(goalName, saved, target, deadline);

    // ------------------------------------------------------
    // NOTIFY DASHBOARD
    // ------------------------------------------------------

    notifyDashboard();

    alert("Savings goal saved successfully!");

    console.log("Savings Goal Saved:", {
      goalName,
      saved,
      target,
      deadline,
    });
  });
}

// ==========================================================
// DISPLAY GOAL
// ==========================================================

function displayGoal(goalName, saved, target, deadline) {
  let percentage = 0;

  if (target > 0) {
    percentage = Math.round((saved / target) * 100);
  }

  const progress = Math.min(Math.max(percentage, 0), 100);

  const remaining = Math.max(target - saved, 0);

  // --------------------------------------------------------
  // ELEMENTS
  // --------------------------------------------------------

  const nameElement = document.getElementById("displayGoalName");

  const savedElement = document.getElementById("displaySaved");

  const targetElement = document.getElementById("displayTarget");

  const percentageElement = document.getElementById("displayPercentage");

  const progressElement = document.getElementById("goalProgress");

  const deadlineElement = document.getElementById("displayDeadline");

  const remainingElement = document.getElementById("displayRemaining");

  // --------------------------------------------------------
  // NAME
  // --------------------------------------------------------

  if (nameElement) {
    nameElement.textContent = goalName || "No Goal Set";
  }

  // --------------------------------------------------------
  // SAVED
  // --------------------------------------------------------

  if (savedElement) {
    savedElement.textContent = formatCurrency(saved);
  }

  // --------------------------------------------------------
  // TARGET
  // --------------------------------------------------------

  if (targetElement) {
    targetElement.textContent = formatCurrency(target);
  }

  // --------------------------------------------------------
  // PERCENTAGE
  // --------------------------------------------------------

  if (percentageElement) {
    percentageElement.textContent = percentage + "%";
  }

  // --------------------------------------------------------
  // PROGRESS
  // --------------------------------------------------------

  if (progressElement) {
    progressElement.style.width = progress + "%";

    progressElement.textContent = percentage + "%";

    progressElement.setAttribute("aria-valuenow", percentage);

    progressElement.classList.remove(
      "bg-primary",
      "bg-success",
      "bg-warning",
      "bg-danger",
    );

    if (percentage >= 100) {
      progressElement.classList.add("bg-success");
    } else if (percentage >= 80) {
      progressElement.classList.add("bg-warning");
    } else {
      progressElement.classList.add("bg-primary");
    }
  }

  // --------------------------------------------------------
  // DEADLINE
  // --------------------------------------------------------

  if (deadlineElement) {
    if (deadline) {
      const date = new Date(deadline + "T00:00:00");

      if (!isNaN(date.getTime())) {
        deadlineElement.textContent = date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      } else {
        deadlineElement.textContent = deadline;
      }
    } else {
      deadlineElement.textContent = "Not set";
    }
  }

  // --------------------------------------------------------
  // REMAINING
  // --------------------------------------------------------

  if (remainingElement) {
    remainingElement.textContent = formatCurrency(remaining);

    remainingElement.classList.remove(
      "text-primary",
      "text-success",
      "text-danger",
    );

    if (target > 0 && remaining === 0) {
      remainingElement.classList.add("text-success");
    } else {
      remainingElement.classList.add("text-primary");
    }
  }
}

// ==========================================================
// RESET FORM
// ==========================================================

function setupResetGoal() {
  const resetButton = document.getElementById("resetGoalBtn");

  if (!resetButton) {
    return;
  }

  resetButton.addEventListener("click", function () {
    const goalNameElement = document.getElementById("goalName");

    const goalTargetElement = document.getElementById("goalTarget");

    const goalSavedElement = document.getElementById("goalSaved");

    const goalDeadlineElement = document.getElementById("goalDeadline");

    if (goalNameElement) {
      goalNameElement.value = "";
    }

    if (goalTargetElement) {
      goalTargetElement.value = "";
    }

    if (goalSavedElement) {
      goalSavedElement.value = "";
    }

    if (goalDeadlineElement) {
      goalDeadlineElement.value = "";
    }
  });
}

// ==========================================================
// DELETE GOAL
// ==========================================================

function setupDeleteGoal() {
  const deleteButton = document.getElementById("deleteGoalBtn");

  if (!deleteButton) {
    return;
  }

  deleteButton.addEventListener("click", function () {
    const goalName = localStorage.getItem("savingsGoalName");

    if (!goalName) {
      alert("No savings goal to delete.");

      return;
    }

    const confirmed = confirm(
      "Are you sure you want to delete this savings goal?",
    );

    if (!confirmed) {
      return;
    }

    // ----------------------------------------------------
    // REMOVE DATA
    // ----------------------------------------------------

    localStorage.removeItem("savingsGoalName");

    localStorage.removeItem("savingsGoalSaved");

    localStorage.removeItem("savingsGoalTarget");

    localStorage.removeItem("savingsGoalDeadline");

    // ----------------------------------------------------
    // CLEAR FORM
    // ----------------------------------------------------

    const goalNameElement = document.getElementById("goalName");

    const goalTargetElement = document.getElementById("goalTarget");

    const goalSavedElement = document.getElementById("goalSaved");

    const goalDeadlineElement = document.getElementById("goalDeadline");

    if (goalNameElement) {
      goalNameElement.value = "";
    }

    if (goalTargetElement) {
      goalTargetElement.value = "";
    }

    if (goalSavedElement) {
      goalSavedElement.value = "";
    }

    if (goalDeadlineElement) {
      goalDeadlineElement.value = "";
    }

    // ----------------------------------------------------
    // RESET DISPLAY
    // ----------------------------------------------------

    displayGoal("", 0, 0, "");

    // ----------------------------------------------------
    // NOTIFY DASHBOARD
    // ----------------------------------------------------

    notifyDashboard();

    alert("Savings goal deleted successfully!");
  });
}

// ==========================================================
// NOTIFY DASHBOARD
// ==========================================================

function notifyDashboard() {
  window.dispatchEvent(
    new CustomEvent("savingsGoalChanged", {
      detail: {
        goalName: localStorage.getItem("savingsGoalName") || "",

        saved: Number(localStorage.getItem("savingsGoalSaved") || 0),

        target: Number(localStorage.getItem("savingsGoalTarget") || 0),
      },
    }),
  );
}

// ==========================================================
// CURRENCY CHANGE
// ==========================================================

window.addEventListener("currencyChanged", function () {
  console.log("Savings Goal currency changed:", getSelectedCurrency());

  const goalName = localStorage.getItem("savingsGoalName") || "";

  const saved = Number(localStorage.getItem("savingsGoalSaved") || 0);

  const target = Number(localStorage.getItem("savingsGoalTarget") || 0);

  const deadline = localStorage.getItem("savingsGoalDeadline") || "";

  displayGoal(goalName, saved, target, deadline);
});

// ==========================================================
// STORAGE CHANGE
// ==========================================================

window.addEventListener("storage", function (event) {
  if (event.key === "currency") {
    const goalName = localStorage.getItem("savingsGoalName") || "";

    const saved = Number(localStorage.getItem("savingsGoalSaved") || 0);

    const target = Number(localStorage.getItem("savingsGoalTarget") || 0);

    const deadline = localStorage.getItem("savingsGoalDeadline") || "";

    displayGoal(goalName, saved, target, deadline);
  }
});

// ==========================================================
// THEME CHANGE
// ==========================================================

window.addEventListener("themeChanged", function (event) {
  const isDark = event.detail && event.detail.darkMode === true;

  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light",
  );

  document.body.classList.toggle("dark-mode", isDark);
});
