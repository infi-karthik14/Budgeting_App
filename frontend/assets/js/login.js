/* =========================================================
   BACHAT BUDDY - LOGIN
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  const email = document.getElementById("email");
  const password = document.getElementById("password");

  const remember = document.getElementById("remember");

  const loginBtn = document.getElementById("loginBtn");

  const errorMessage = document.getElementById("errorMessage");

  const togglePassword = document.getElementById("togglePassword");
  const eyeIcon = document.getElementById("eyeIcon");

  /* =====================================================
       PASSWORD VISIBILITY
    ===================================================== */

  if (togglePassword) {
    togglePassword.addEventListener("click", function () {
      if (password.type === "password") {
        password.type = "text";

        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");

        togglePassword.setAttribute("aria-label", "Hide password");
      } else {
        password.type = "password";

        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");

        togglePassword.setAttribute("aria-label", "Show password");
      }
    });
  }

  /* =====================================================
       LOGIN FORM
    ===================================================== */

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    errorMessage.textContent = "";

    /* =================================================
           GET VALUES
        ================================================= */

    const emailValue = email.value.trim();

    const passwordValue = password.value;

    /* =================================================
           VALIDATION
        ================================================= */

    if (!emailValue) {
      errorMessage.textContent = "Please enter your email address.";

      email.focus();

      return;
    }

    if (!passwordValue) {
      errorMessage.textContent = "Please enter your password.";

      password.focus();

      return;
    }

    /* =================================================
           LOGIN DATA
        ================================================= */

    const loginData = {
      email: emailValue,

      password: passwordValue,
    };

    /* =================================================
           BUTTON LOADING
        ================================================= */

    loginBtn.disabled = true;

    loginBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>' +
      "Logging in...";

    try {
      /* =================================================
               SEND LOGIN REQUEST
            ================================================= */

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(loginData),
      });

      /* =================================================
               READ JSON RESPONSE
            ================================================= */

      const result = await response.json();

      console.log("Login response:", result);

      /* =================================================
               LOGIN SUCCESS
            ================================================= */

      if (result.success === true) {
        /*
         * Store login/session information
         */

        sessionStorage.setItem("loggedIn", "true");

        sessionStorage.setItem("userId", result.id);

        sessionStorage.setItem("userName", result.name);

        sessionStorage.setItem("fullName", result.fullName);

        sessionStorage.setItem("userEmail", result.email);

        sessionStorage.setItem("phoneNumber", result.phoneNumber);

        /* =================================================
                   REMEMBER ME
                ================================================= */

        if (remember && remember.checked) {
          localStorage.setItem("rememberedEmail", emailValue);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        /* =================================================
                   REDIRECT TO DASHBOARD
                ================================================= */

        window.location.href = "dashboard.html";

        return;
      }

      /* =================================================
               LOGIN FAILED
            ================================================= */

      if (result.message === "User not found!") {
        errorMessage.textContent = "No account found with this email.";
      } else if (result.message === "Invalid Password!") {
        errorMessage.textContent = "Incorrect password.";
      } else {
        errorMessage.textContent = result.message || "Login failed.";
      }

      resetLoginButton();
    } catch (error) {
      console.error("Login error:", error);

      errorMessage.textContent =
        "Unable to connect to the server. " +
        "Make sure Spring Boot is running.";

      resetLoginButton();
    }
  });

  /* =====================================================
       RESET LOGIN BUTTON
    ===================================================== */

  function resetLoginButton() {
    loginBtn.disabled = false;

    loginBtn.innerHTML =
      '<i class="fa-solid fa-right-to-bracket me-2"></i>' + "Login";
  }

  /* =====================================================
       REMEMBERED EMAIL
    ===================================================== */

  const rememberedEmail = localStorage.getItem("rememberedEmail");

  if (rememberedEmail && email) {
    email.value = rememberedEmail;

    if (remember) {
      remember.checked = true;
    }
  }
});
