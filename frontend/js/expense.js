const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    if (themeToggle) themeToggle.innerHTML = "☀️";
}

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");

        if (document.body.classList.contains("dark-theme")) {
            localStorage.setItem("theme", "dark");
            themeToggle.innerHTML = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            themeToggle.innerHTML = "🌙";
        }
    });
}