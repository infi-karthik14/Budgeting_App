// ==========================================================
// BACHAT BUDDY - SETTINGS.JS
// Backend Connected Settings
// ==========================================================

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  console.log("Bachat Buddy Settings JS loaded.");

  // ======================================================
  // LOGIN CHECK
  // ======================================================

  const loggedIn = sessionStorage.getItem("loggedIn");
  const userId = sessionStorage.getItem("userId");

  if (loggedIn !== "true" || !userId) {
    console.warn("User is not logged in.");

    window.location.href = "login.html";

    return;
  }

  console.log("Logged-in User ID:", userId);

  // ======================================================
  // API
  // ======================================================

  const API_URL = `http://localhost:8080/api/users/${userId}/settings`;

  // ======================================================
  // ELEMENTS
  // ======================================================

  const darkModeToggle = document.getElementById("darkModeToggle");

  const currencySelect = document.getElementById("currencySelect");

  const languageSelect = document.getElementById("languageSelect");

  const notificationToggle = document.getElementById("notificationToggle");

  const budgetAlertToggle = document.getElementById("budgetAlertToggle");

  const resetSettingsBtn = document.getElementById("resetSettingsBtn");

  const logoutBtn = document.getElementById("logoutBtn");

  const userNameElement = document.getElementById("userName");

  // ======================================================
  // LOAD USER NAME
  // ======================================================

  function loadUserName() {
    const name =
      sessionStorage.getItem("fullName") ||
      sessionStorage.getItem("userName") ||
      "User";

    if (userNameElement) {
      userNameElement.textContent = name;
    }
  }

  // ======================================================
  // LOAD SETTINGS FROM MYSQL
  // ======================================================

  async function loadSettings() {
    try {
      console.log("Loading settings from backend...");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Unable to load settings. Status: ${response.status}`);
      }

      const settings = await response.json();

      console.log("Settings received:", settings);

      // ==================================================
      // APPLY SETTINGS TO PAGE
      // ==================================================

      if (darkModeToggle) {
        darkModeToggle.checked = settings.darkMode;
      }

      if (currencySelect) {
        currencySelect.value = settings.currency || "INR";
      }

      if (languageSelect) {
        languageSelect.value = settings.language || "en";
      }

      if (notificationToggle) {
        notificationToggle.checked = settings.notifications;
      }

      if (budgetAlertToggle) {
        budgetAlertToggle.checked = settings.budgetAlerts;
      }

      // Apply theme immediately

      applyTheme(settings.darkMode);

      // Apply language

      applyLanguage(settings.language || "en");

      localStorage.setItem("currency", settings.currency);
      localStorage.setItem("language", settings.language);

      localStorage.setItem(
        "darkMode",
        settings.darkMode ? "enabled" : "disabled",
      );

      notifyCurrencyChanged(settings.currency);
      notifyThemeChanged(settings.darkMode);

      console.log("Settings loaded successfully.");
    } catch (error) {
      console.error("SETTINGS LOAD ERROR:", error);

      showMessage("Unable to load settings.", "danger");
    }
  }

  // ======================================================
  // SAVE SETTINGS TO MYSQL
  // ======================================================

  async function saveSettings() {
    const settings = {
      darkMode: darkModeToggle ? darkModeToggle.checked : false,

      currency: currencySelect ? currencySelect.value : "INR",

      language: languageSelect ? languageSelect.value : "en",

      notifications: notificationToggle ? notificationToggle.checked : true,

      budgetAlerts: budgetAlertToggle ? budgetAlertToggle.checked : true,
    };

    console.log("Saving settings:", settings);

    try {
      const response = await fetch(API_URL, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || `Failed to save settings. Status: ${response.status}`,
        );
      }

      const updatedSettings = await response.json();

      console.log("Settings saved:", updatedSettings);

      // Keep localStorage only as a small cache

      localStorage.setItem(
        "darkMode",
        updatedSettings.darkMode ? "enabled" : "disabled",
      );

      localStorage.setItem("currency", updatedSettings.currency);

      localStorage.setItem("language", updatedSettings.language);

      localStorage.setItem(
        "notifications",
        updatedSettings.notifications ? "enabled" : "disabled",
      );

      localStorage.setItem(
        "budgetAlerts",
        updatedSettings.budgetAlerts ? "enabled" : "disabled",
      );

      notifyCurrencyChanged(updatedSettings.currency);

      notifyThemeChanged(updatedSettings.darkMode);

      showMessage("Settings saved successfully.", "success");
    } catch (error) {
      console.error("SETTINGS SAVE ERROR:", error);

      showMessage("Unable to save settings.", "danger");
    }
  }

  // ======================================================
  // DARK MODE
  // ======================================================

  function applyTheme(enabled) {
    document.body.classList.toggle("dark-mode", enabled);

    document.documentElement.setAttribute(
      "data-theme",
      enabled ? "dark" : "light",
    );
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", async function () {
      applyTheme(this.checked);

      await saveSettings();
    });
  }

  // ======================================================
  // CURRENCY
  // ======================================================

  if (currencySelect) {
    currencySelect.addEventListener("change", async function () {
      await saveSettings();
    });
  }

  // ======================================================
  // LANGUAGE
  // ======================================================

  if (languageSelect) {
    languageSelect.addEventListener("change", async function () {
      applyLanguage(this.value);

      await saveSettings();
    });
  }

  function applyLanguage(language) {
    document.documentElement.setAttribute("lang", language);
  }

  // ======================================================
  // NOTIFICATIONS
  // ======================================================

  if (notificationToggle) {
    notificationToggle.addEventListener("change", async function () {
      await saveSettings();
    });
  }

  // ======================================================
  // BUDGET ALERTS
  // ======================================================

  if (budgetAlertToggle) {
    budgetAlertToggle.addEventListener("change", async function () {
      await saveSettings();
    });
  }

  // ======================================================
  // RESET SETTINGS
  // ======================================================

  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener("click", async function () {
      const confirmed = confirm("Are you sure you want to reset all settings?");

      if (!confirmed) {
        return;
      }

      try {
        const response = await fetch(`${API_URL}/reset`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Unable to reset settings.");
        }

        const settings = await response.json();

        // Update UI

        if (darkModeToggle) {
          darkModeToggle.checked = settings.darkMode;
        }

        if (currencySelect) {
          currencySelect.value = settings.currency;
        }

        if (languageSelect) {
          languageSelect.value = settings.language;
        }

        if (notificationToggle) {
          notificationToggle.checked = settings.notifications;
        }

        if (budgetAlertToggle) {
          budgetAlertToggle.checked = settings.budgetAlerts;
        }

        applyTheme(settings.darkMode);

        applyLanguage(settings.language);

        showMessage("Settings reset successfully.", "success");
      } catch (error) {
        console.error("RESET ERROR:", error);

        showMessage("Unable to reset settings.", "danger");
      }
    });
  }

  // ======================================================
  // LOGOUT
  // ======================================================

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      const confirmed = confirm("Are you sure you want to logout?");

      if (!confirmed) {
        return;
      }

      sessionStorage.removeItem("loggedIn");

      sessionStorage.removeItem("userId");

      sessionStorage.removeItem("fullName");

      sessionStorage.removeItem("userName");

      window.location.href = "login.html";
    });
  }

  // ======================================================
  // THEME EVENT
  // ======================================================

  function notifyThemeChanged(enabled) {
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: {
          darkMode: enabled,
        },
      }),
    );
  }

  // ======================================================
  // MESSAGE
  // ======================================================

  function showMessage(message, type) {
    const existing = document.getElementById("settingsMessage");

    if (existing) {
      existing.remove();
    }

    const element = document.createElement("div");

    element.id = "settingsMessage";

    element.className = `alert alert-${type} position-fixed`;

    element.style.top = "20px";

    element.style.right = "20px";

    element.style.zIndex = "9999";

    element.textContent = message;

    document.body.appendChild(element);

    setTimeout(function () {
      element.remove();
    }, 2500);
  }

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  loadUserName();

  loadSettings();
});
