// ==========================================================
// BACHAT BUDDY - USER SETTINGS
// Loads user settings from backend on every page
// ==========================================================

"use strict";

(function () {
  const userId = sessionStorage.getItem("userId");

  const loggedIn = sessionStorage.getItem("loggedIn");

  // ------------------------------------------------------
  // Login check
  // ------------------------------------------------------

  if (loggedIn !== "true" || !userId) {
    return;
  }

  // ------------------------------------------------------
  // API
  // ------------------------------------------------------

  const SETTINGS_API = `https://budgetingapp-production-a92b.up.railway.app/api/users/${userId}/settings`;

  // ------------------------------------------------------
  // LOAD SETTINGS
  // ------------------------------------------------------

  async function loadUserSettings() {
    try {
      const response = await fetch(SETTINGS_API);

      if (!response.ok) {
        throw new Error(`Settings request failed: ${response.status}`);
      }

      const settings = await response.json();

      console.log("User settings:", settings);

      // ------------------------------------------------
      // DARK MODE
      // ------------------------------------------------

      if (window.BachatTheme) {
        window.BachatTheme.applyTheme(settings.darkMode ? "dark" : "light");
      }

      // ------------------------------------------------
      // CURRENCY
      // ------------------------------------------------

      if (settings.currency) {
        localStorage.setItem("currency", settings.currency);

        if (typeof notifyCurrencyChanged === "function") {
          notifyCurrencyChanged(settings.currency);
        } else {
          localStorage.setItem("currency", settings.currency);
        }
      }

      // ------------------------------------------------
      // LANGUAGE
      // ------------------------------------------------

      if (settings.language) {
        document.documentElement.setAttribute("lang", settings.language);

        localStorage.setItem("language", settings.language);
      }

      // ------------------------------------------------
      // SAVE CACHE
      // ------------------------------------------------

      localStorage.setItem(
        "darkMode",
        settings.darkMode ? "enabled" : "disabled",
      );

      localStorage.setItem(
        "notifications",
        settings.notifications ? "enabled" : "disabled",
      );

      localStorage.setItem(
        "budgetAlerts",
        settings.budgetAlerts ? "enabled" : "disabled",
      );
    } catch (error) {
      console.error("Unable to load user settings:", error);
    }
  }
  
  // ------------------------------------------------------
  // START
  // ------------------------------------------------------

  loadUserSettings();
})();
