"use strict";

/*
==========================================================
BACHAT BUDDY
DYNAMIC THEME CONTROLLER
==========================================================
*/

(function () {
  const STORAGE_KEY = "darkMode";

  // ======================================================
  // GET CURRENT THEME
  // ======================================================

  function getTheme() {
    return localStorage.getItem(STORAGE_KEY) === "enabled" ? "dark" : "light";
  }

  // ======================================================
  // APPLY THEME
  // ======================================================

  function applyTheme(theme) {
    const isDark = theme === "dark";

    document.documentElement.setAttribute("data-theme", theme);

    /*
        Keep dark-mode class too.
        This makes it compatible with your
        existing project CSS.
        */

    document.body.classList.toggle("dark-mode", isDark);

    localStorage.setItem(STORAGE_KEY, isDark ? "enabled" : "disabled");

    updateThemeControls(isDark);

    /*
        Tell dashboard.js and other pages
        that the theme changed.
        */

    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: {
          theme: theme,
          darkMode: isDark,
        },
      }),
    );
  }

  // ======================================================
  // UPDATE TOGGLE / BUTTON
  // ======================================================

  function updateThemeControls(isDark) {
    const toggle = document.getElementById("darkModeToggle");

    if (toggle) {
      toggle.checked = isDark;
    }

    const themeButton = document.getElementById("themeToggle");

    if (themeButton) {
      const icon = themeButton.querySelector("i");

      if (icon) {
        icon.classList.remove("bi-moon-fill", "bi-sun-fill");

        icon.classList.add(isDark ? "bi-sun-fill" : "bi-moon-fill");
      }
    }
  }

  // ======================================================
  // INITIALIZE
  // ======================================================

  function initializeTheme() {
    const theme = getTheme();

    applyTheme(theme);
  }

  // ======================================================
  // DOM READY
  // ======================================================

  document.addEventListener("DOMContentLoaded", function () {
    initializeTheme();

    // ==============================================
    // SETTINGS TOGGLE
    // ==============================================

    const toggle = document.getElementById("darkModeToggle");

    if (toggle) {
      toggle.addEventListener("change", function () {
        applyTheme(this.checked ? "dark" : "light");
      });
    }

    // ==============================================
    // HEADER BUTTON
    // ==============================================

    const themeButton = document.getElementById("themeToggle");

    if (themeButton) {
      themeButton.addEventListener("click", function () {
        const currentTheme = getTheme();

        applyTheme(currentTheme === "dark" ? "light" : "dark");
      });
    }
  });

  // ======================================================
  // EXPOSE FUNCTIONS
  // ======================================================

  window.BachatTheme = {
    getTheme: getTheme,

    applyTheme: applyTheme,

    isDark: function () {
      return getTheme() === "dark";
    },
  };
})();
