document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const error = document.getElementById("errorMessage");

    const togglePassword = document.getElementById("togglePassword");

    // Show / Hide Password
    togglePassword.addEventListener("click", () => {

        if (password.type === "password") {
            password.type = "text";
            togglePassword.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        } else {
            password.type = "password";
            togglePassword.innerHTML = '<i class="fa-solid fa-eye"></i>';
        }

    });

// ===========================
// Login User
// ===========================

form.addEventListener("submit", function (e) {

    e.preventDefault();

    error.textContent = "";

    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(user =>
        user.email.trim().toLowerCase() === email.value.trim().toLowerCase() &&
        user.password === password.value
    );

    if (!user) {

        error.textContent = "Invalid Email or Password!";
        return;

    }

    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
    );

    alert("Login Successful!");

    window.location.href = "dashboard.html";

});
});