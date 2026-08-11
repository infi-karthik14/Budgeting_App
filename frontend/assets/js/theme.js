// ==========================================
// GLOBAL THEME MANAGEMENT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  const savedTheme = localStorage.getItem("darkMode");

  // Apply saved theme when page loads
  if (savedTheme === "enabled") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }

  // ==========================================
  // THEME TOGGLE BUTTON
  // ==========================================

  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {
    updateThemeIcon();

    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");

      const darkMode = document.body.classList.contains("dark-mode");

      if (darkMode) {
        localStorage.setItem("darkMode", "enabled");
      } else {
        localStorage.setItem("darkMode", "disabled");
      }

      updateThemeIcon();
    });
  }

  // ==========================================
  // UPDATE ICON
  // ==========================================

  function updateThemeIcon() {
    const icon = document.querySelector("#themeToggle i");

    if (!icon) {
      return;
    }

    if (document.body.classList.contains("dark-mode")) {
      icon.classList.remove("bi-moon-fill");
      icon.classList.add("bi-sun-fill");
    } else {
      icon.classList.remove("bi-sun-fill");
      icon.classList.add("bi-moon-fill");
    }
  }
});
