/* =========================================================
   BACHAT BUDDY - SETTINGS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       ELEMENTS
    ===================================================== */

  const darkModeToggle = document.getElementById("darkModeToggle");

  const emailToggle = document.getElementById("emailToggle");

  const budgetAlertToggle = document.getElementById("budgetAlertToggle");

  const autoSaveToggle = document.getElementById("autoSaveToggle");

  const currency = document.getElementById("currency");

  const language = document.getElementById("language");

  const saveBtn = document.getElementById("saveBtn");

  const resetBtn = document.getElementById("resetBtn");

  const logoutBtn = document.getElementById("logoutBtn");

  const profileImage = document.getElementById("profileImage");

  const userName = document.getElementById("userName");

  /* =====================================================
       AUTHENTICATION CHECK
    ===================================================== */

  const loggedIn = sessionStorage.getItem("loggedIn");

  const userEmail = sessionStorage.getItem("userEmail");

  /*
   * If the user is not logged in,
   * send them back to login.
   */

  if (loggedIn !== "true") {
    window.location.href = "login.html";

    return;
  }

  /* =====================================================
       LOAD USER NAME
    ===================================================== */

  const savedUserName = sessionStorage.getItem("userName");

  if (userName) {
    if (savedUserName) {
      userName.textContent = savedUserName;
    } else if (userEmail) {
      userName.textContent = userEmail;
    }
  }

  /* =====================================================
       LOAD PROFILE IMAGE
    ===================================================== */

  const savedProfileImage = localStorage.getItem("profileImage");

  if (savedProfileImage && profileImage) {
    profileImage.src = savedProfileImage;
  }

  /* =====================================================
       LOAD SETTINGS
    ===================================================== */

  let savedSettings = {};

  try {
    savedSettings = JSON.parse(localStorage.getItem("budgetSettings")) || {};
  } catch (error) {
    console.error("Unable to load settings:", error);
  }

  /* =====================================================
       EMAIL NOTIFICATIONS
    ===================================================== */

  if (savedSettings.emailNotifications !== undefined) {
    emailToggle.checked = savedSettings.emailNotifications;
  }

  /* =====================================================
       BUDGET ALERTS
    ===================================================== */

  if (savedSettings.budgetAlerts !== undefined) {
    budgetAlertToggle.checked = savedSettings.budgetAlerts;
  }

  /* =====================================================
       AUTO SAVE
    ===================================================== */

  if (savedSettings.autoSave !== undefined) {
    autoSaveToggle.checked = savedSettings.autoSave;
  }

  /* =====================================================
       CURRENCY
    ===================================================== */

  if (savedSettings.currency) {
    currency.value = savedSettings.currency;
  }

  /* =====================================================
       LANGUAGE
    ===================================================== */

  if (savedSettings.language) {
    language.value = savedSettings.language;
  }

  /* =====================================================
       DARK MODE
    ===================================================== */

  const darkMode = localStorage.getItem("darkMode");

  if (darkMode === "enabled") {
    darkModeToggle.checked = true;

    document.body.classList.add("dark-mode");
  } else {
    darkModeToggle.checked = false;

    document.body.classList.remove("dark-mode");
  }

  /* =====================================================
       DARK MODE TOGGLE
    ===================================================== */

  darkModeToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-mode");

      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");

      localStorage.setItem("darkMode", "disabled");
    }
  });

  /* =====================================================
       SAVE SETTINGS
    ===================================================== */

  saveBtn.addEventListener("click", function () {
    const settings = {
      emailNotifications: emailToggle.checked,

      budgetAlerts: budgetAlertToggle.checked,

      autoSave: autoSaveToggle.checked,

      currency: currency.value,

      language: language.value,
    };

    localStorage.setItem("budgetSettings", JSON.stringify(settings));

    showMessage("Settings saved successfully!");
  });

  /* =====================================================
       RESET SETTINGS
    ===================================================== */

  resetBtn.addEventListener("click", function () {
    const confirmReset = confirm(
      "Are you sure you want to reset all settings?",
    );

    if (!confirmReset) {
      return;
    }

    /* Default settings */

    darkModeToggle.checked = false;

    emailToggle.checked = true;

    budgetAlertToggle.checked = true;

    autoSaveToggle.checked = true;

    currency.value = "INR";

    language.value = "English";

    /* Disable dark mode */

    document.body.classList.remove("dark-mode");

    localStorage.setItem("darkMode", "disabled");

    /* Remove saved settings */

    localStorage.removeItem("budgetSettings");

    showMessage("Settings have been reset.");
  });

  /* =====================================================
       LOGOUT
    ===================================================== */

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      const confirmLogout = confirm("Are you sure you want to logout?");

      if (!confirmLogout) {
        return;
      }

      /*
       * Remove the SAME session information
       * that login.js created.
       */

      sessionStorage.removeItem("loggedIn");

      sessionStorage.removeItem("userEmail");

      sessionStorage.removeItem("userName");

      /*
       * Do NOT remove:
       *
       * darkMode
       * budgetSettings
       * profileImage
       *
       * because these are application
       * preferences.
       */

      window.location.href = "login.html";
    });
  }

  /* =====================================================
       SUCCESS MESSAGE
    ===================================================== */

  function showMessage(message) {
    const oldMessage = document.querySelector(".settings-message");

    if (oldMessage) {
      oldMessage.remove();
    }

    const messageBox = document.createElement("div");

    messageBox.className = "settings-message";

    messageBox.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <span>${message}</span>
        `;

    document.body.appendChild(messageBox);

    setTimeout(function () {
      messageBox.classList.add("hide");

      setTimeout(function () {
        messageBox.remove();
      }, 300);
    }, 2500);
  }
});
