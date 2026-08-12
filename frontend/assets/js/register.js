/* =========================================================
   REGISTER PAGE
   Bachat Buddy
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");


  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phoneNumber = document.getElementById("phoneNumber");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const terms = document.getElementById("terms");

  const registerBtn = document.getElementById("registerBtn");

  const errorMessage = document.getElementById("errorMessage");
  const successMessage = document.getElementById("successMessage");

  const togglePassword = document.getElementById("togglePassword");
  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword",
  );

  const eyeIcon = document.getElementById("eyeIcon");
  const confirmEyeIcon = document.getElementById("confirmEyeIcon");

  /* =====================================================
       PASSWORD VISIBILITY
    ===================================================== */

  togglePassword.addEventListener("click", function () {
    if (password.type === "password") {
      password.type = "text";

      eyeIcon.classList.remove("fa-eye");
      eyeIcon.classList.add("fa-eye-slash");
    } else {
      password.type = "password";

      eyeIcon.classList.remove("fa-eye-slash");
      eyeIcon.classList.add("fa-eye");
    }
  });

  /* =====================================================
       CONFIRM PASSWORD VISIBILITY
    ===================================================== */

  toggleConfirmPassword.addEventListener("click", function () {
    if (confirmPassword.type === "password") {
      confirmPassword.type = "text";

      confirmEyeIcon.classList.remove("fa-eye");
      confirmEyeIcon.classList.add("fa-eye-slash");
    } else {
      confirmPassword.type = "password";

      confirmEyeIcon.classList.remove("fa-eye-slash");
      confirmEyeIcon.classList.add("fa-eye");
    }
  });

  /* =====================================================
       REGISTER FORM
    ===================================================== */

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    /* Clear previous messages */

    errorMessage.textContent = "";
    successMessage.textContent = "";

    /* =================================================
           GET FORM VALUES
        ================================================= */

    const nameValue = fullName.value.trim();

    const emailValue = email.value.trim();

    const phoneValue = phoneNumber.value.trim();

    const passwordValue = password.value;

    const confirmValue = confirmPassword.value;

    /* =================================================
           FULL NAME VALIDATION
        ================================================= */

    if (nameValue.length < 2) {
      errorMessage.textContent = "Please enter your full name.";

      fullName.focus();

      return;
    }

    /* =================================================
           EMAIL VALIDATION
        ================================================= */

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailValue)) {
      errorMessage.textContent = "Please enter a valid email address.";

      email.focus();

      return;
    }

    /* =================================================
           PHONE VALIDATION
        ================================================= */

    if (!/^[0-9]{10}$/.test(phoneValue)) {
      errorMessage.textContent = "Please enter a valid 10-digit phone number.";

      phoneNumber.focus();

      return;
    }

    /* =================================================
           PASSWORD VALIDATION
        ================================================= */

    if (passwordValue.length < 8) {
      errorMessage.textContent = "Password must contain at least 8 characters.";

      password.focus();

      return;
    }

    /* =================================================
           CONFIRM PASSWORD
        ================================================= */

    if (passwordValue !== confirmValue) {
      errorMessage.textContent = "Passwords do not match.";

      confirmPassword.focus();

      return;
    }

    /* =================================================
           TERMS & CONDITIONS
        ================================================= */

    if (!terms.checked) {
      errorMessage.textContent = "Please accept the Terms & Conditions.";

      return;
    }

    /* =================================================
           REQUEST DATA
        ================================================= */

    const userData = {
      fullName: nameValue,

      email: emailValue,

      password: passwordValue,

      phoneNumber: Number(phoneValue),
    };

    /* =================================================
           BUTTON LOADING STATE
        ================================================= */

    registerBtn.disabled = true;

    registerBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>' +
      "Creating Account...";

    try {
      /* =================================================
               SEND DATA TO SPRING BOOT
            ================================================= */

      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(userData),
      });

      /* =================================================
               GET SERVER RESPONSE
            ================================================= */

      const result = await response.text();

      console.log("Server response:", result);

      /* =================================================
               REGISTRATION SUCCESS
            ================================================= */

      if (result === "Registration Successful!") {
        successMessage.textContent =
          "Account created successfully! Redirecting to login...";

        registerForm.reset();

        setTimeout(function () {
          window.location.href = "login.html";
        }, 1500);
      } else if (result === "Email already exists!") {
        /* =================================================
               EMAIL ALREADY EXISTS
            ================================================= */
        errorMessage.textContent = "This email is already registered.";

        registerBtn.disabled = false;

        registerBtn.innerHTML =
          '<i class="fa-solid fa-user-plus me-2"></i>' + "Create Account";
      } else {
        /* =================================================
               OTHER SERVER RESPONSE
            ================================================= */
        errorMessage.textContent = result || "Registration failed.";

        registerBtn.disabled = false;

        registerBtn.innerHTML =
          '<i class="fa-solid fa-user-plus me-2"></i>' + "Create Account";
      }
    } catch (error) {
      /* =================================================
           SERVER CONNECTION ERROR
        ================================================= */

      console.error("Registration error:", error);

      errorMessage.textContent =
        "Unable to connect to the server. " +
        "Make sure Spring Boot is running.";

      registerBtn.disabled = false;

      registerBtn.innerHTML =
        '<i class="fa-solid fa-user-plus me-2"></i>' + "Create Account";
    }
  });
});
