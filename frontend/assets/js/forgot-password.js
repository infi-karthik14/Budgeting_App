document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("forgotPasswordForm");

    const email =
        document.getElementById("email");

    const newPassword =
        document.getElementById("newPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const message =
        document.getElementById("message");


    // =================================
    // SHOW / HIDE NEW PASSWORD
    // =================================

    const toggleNewPassword =
        document.getElementById("toggleNewPassword");

    toggleNewPassword.addEventListener("click", function () {

        if (newPassword.type === "password") {

            newPassword.type = "text";

            this.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        } else {

            newPassword.type = "password";

            this.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        }

    });


    // =================================
    // SHOW / HIDE CONFIRM PASSWORD
    // =================================

    const toggleConfirmPassword =
        document.getElementById("toggleConfirmPassword");

    toggleConfirmPassword.addEventListener("click", function () {

        if (confirmPassword.type === "password") {

            confirmPassword.type = "text";

            this.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        } else {

            confirmPassword.type = "password";

            this.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        }

    });


    // =================================
    // RESET PASSWORD
    // =================================

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        message.textContent = "";
        message.className = "text-center mb-3";


        const userEmail =
            email.value.trim().toLowerCase();

        const password =
            newPassword.value;

        const confirm =
            confirmPassword.value;


        // =================================
        // PASSWORD VALIDATION
        // =================================

        if (password.length < 6) {

            message.textContent =
                "Password must contain at least 6 characters.";

            message.classList.add("text-warning");

            return;

        }


        if (password !== confirm) {

            message.textContent =
                "Passwords do not match.";

            message.classList.add("text-danger");

            return;

        }


        // =================================
        // GET USERS
        // =================================

        const users =
            JSON.parse(
                localStorage.getItem("users")
            ) || [];


        // =================================
        // FIND USER
        // =================================

        const userIndex =
            users.findIndex(
                user =>
                    user.email.trim().toLowerCase()
                    === userEmail
            );


        if (userIndex === -1) {

            message.textContent =
                "No account found with this email.";

            message.classList.add("text-danger");

            return;

        }


        // =================================
        // UPDATE PASSWORD
        // =================================

        users[userIndex].password =
            password;


        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        // =================================
        // SUCCESS
        // =================================

        message.textContent =
            "Password reset successfully!";

        message.classList.add("text-success");


        // Redirect after 1.5 seconds

        setTimeout(function () {

            window.location.href =
                "login.html";

        }, 1500);

    });

});