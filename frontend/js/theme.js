// ==========================================
// Budgeting App - Global Theme Manager
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const themeToggle = document.getElementById("themeToggle");

    // Default theme = Light
    let currentTheme = localStorage.getItem("theme") || "light";

    if (!currentTheme) {
        currentTheme = "light";
        localStorage.setItem("theme", currentTheme);
    }

    // Apply saved theme
    applyTheme(currentTheme);

    // Toggle button (only available on Settings page)
    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            if (document.body.classList.contains("dark-mode")) {

                currentTheme = "light";

            } else {

                currentTheme = "dark";

            }

            localStorage.setItem("theme", currentTheme);

            applyTheme(currentTheme);

        });

    }

});

// ==========================================
// Apply Theme
// ==========================================

function applyTheme(theme) {

    const themeToggle = document.getElementById("themeToggle");

    if (theme === "dark") {

        document.body.classList.add("dark-mode");

        if (themeToggle) {

            themeToggle.innerHTML =
                '<i class="fa-solid fa-sun"></i> Light Mode';

            themeToggle.classList.remove("btn-primary");
            themeToggle.classList.add("btn-warning");

        }

    } else {

        document.body.classList.remove("dark-mode");

        if (themeToggle) {

            themeToggle.innerHTML =
                '<i class="fa-solid fa-moon"></i> Dark Mode';

            themeToggle.classList.remove("btn-warning");
            themeToggle.classList.add("btn-primary");

        }

    }

}