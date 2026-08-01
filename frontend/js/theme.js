// ===============================
// Global Theme Manager
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    // Get toggle button (only available on Settings page)
    const themeToggle = document.getElementById("theme-toggle");

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");

        if (themeToggle) {
            themeToggle.checked = true;
        }
    }

    // Toggle theme (only on Settings page)
    if (themeToggle) {

        themeToggle.addEventListener("change", function () {

            if (this.checked) {

                document.body.classList.add("dark");
                localStorage.setItem("theme", "dark");

            } else {

                document.body.classList.remove("dark");
                localStorage.setItem("theme", "light");

            }

        });

    }

});