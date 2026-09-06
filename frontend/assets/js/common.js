// ==========================================================
// BACHAT BUDDY - COMMON JAVASCRIPT
// ==========================================================

"use strict";

// ==========================================================
// UPDATE CURRENCY SYMBOLS
// ==========================================================

function updateCurrencyDisplay() {
  const currency = getSelectedCurrency();

  console.log("Current currency:", currency);

  // Dispatch event so other pages can refresh
  window.dispatchEvent(
    new CustomEvent("currencyChanged", {
      detail: {
        currency: currency,
      },
    }),
  );
}

// ==========================================================
// BACHAT BUDDY - LOAD USER PROFILE IN SIDEBAR
// ==========================================================
async function loadSidebarProfile() {
  const userId = sessionStorage.getItem("userId");
  const loggedIn = sessionStorage.getItem("loggedIn");

  if (loggedIn !== "true" || !userId) {
    return;
  }

  const userName = document.getElementById("userName");

  try {
    const response = await fetch(`https://budgetingapp-production-a92b.up.railway.app/api/users/${userId}`);

    if (!response.ok) {
      throw new Error("Unable to load user profile");
    }

    const user = await response.json();

    const name = user.fullName || user.name || "User";

    if (userName) {
      userName.textContent = name;
    }

    sessionStorage.setItem("fullName", name);
    sessionStorage.setItem("userName", name);
  } catch (error) {
    console.error("SIDEBAR PROFILE ERROR:", error);
  }
}

// ==========================================================
// LOAD SIDEBAR PROFILE
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {
  loadSidebarProfile();
});
