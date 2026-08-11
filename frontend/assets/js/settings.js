document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const emailToggle = document.getElementById("emailToggle");
  const budgetAlertToggle = document.getElementById("budgetAlertToggle");
  const autoSaveToggle = document.getElementById("autoSaveToggle");

  const currency = document.getElementById("currency");
  const language = document.getElementById("language");

  const saveBtn = document.getElementById("saveBtn");
  const resetBtn = document.getElementById("resetBtn");

  // ==========================================
  // LOAD SETTINGS
  // ==========================================

  const savedSettings =
    JSON.parse(localStorage.getItem("budgetSettings")) || {};

  if (savedSettings.emailNotifications !== undefined) {
    emailToggle.checked = savedSettings.emailNotifications;
  }

  if (savedSettings.budgetAlerts !== undefined) {
    budgetAlertToggle.checked = savedSettings.budgetAlerts;
  }

  if (savedSettings.autoSave !== undefined) {
    autoSaveToggle.checked = savedSettings.autoSave;
  }

  if (savedSettings.currency) {
    currency.value = savedSettings.currency;
  }

  if (savedSettings.language) {
    language.value = savedSettings.language;
  }

  // ==========================================
  // SYNC DARK MODE TOGGLE
  // ==========================================

  if (localStorage.getItem("darkMode") === "enabled") {
    darkModeToggle.checked = true;
  } else {
    darkModeToggle.checked = false;
  }

  darkModeToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-mode");

      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");

      localStorage.setItem("darkMode", "disabled");
    }
  });

  // ==========================================
  // SAVE SETTINGS
  // ==========================================

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

  // ==========================================
  // RESET SETTINGS
  // ==========================================

  resetBtn.addEventListener("click", function () {
    const confirmReset = confirm(
      "Are you sure you want to reset all settings?",
    );

    if (!confirmReset) {
      return;
    }

    darkModeToggle.checked = false;

    emailToggle.checked = true;

    budgetAlertToggle.checked = true;

    autoSaveToggle.checked = true;

    currency.value = "INR";

    language.value = "English";

    document.body.classList.remove("dark-mode");

    localStorage.setItem("darkMode", "disabled");

    localStorage.removeItem("budgetSettings");

    showMessage("Settings have been reset.");
  });

  // ==========================================
  // SUCCESS MESSAGE
  // ==========================================

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

// =================================
// LOAD USER PROFILE DATA
// =================================

const profileImage = localStorage.getItem("profileImage");
const userName = localStorage.getItem("userName");

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
