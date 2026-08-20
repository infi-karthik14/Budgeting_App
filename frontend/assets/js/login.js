/* =========================================================
   BACHAT BUDDY - LOGIN
   Backend Connected Version
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       GET HTML ELEMENTS
    ===================================================== */

  const loginForm = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const remember = document.getElementById("remember");
  const loginBtn = document.getElementById("loginBtn");
  const errorMessage = document.getElementById("errorMessage");
  const togglePassword = document.getElementById("togglePassword");
  const eyeIcon = document.getElementById("eyeIcon");

  /* =====================================================
       CHECK REQUIRED ELEMENTS
    ===================================================== */

  if (!loginForm) {
    console.error("ERROR: loginForm not found.");
    return;
  }

  if (!email) {
    console.error("ERROR: email input not found.");
    return;
  }

  if (!password) {
    console.error("ERROR: password input not found.");
    return;
  }

  if (!loginBtn) {
    console.error("ERROR: loginBtn not found.");
    return;
  }

  if (!errorMessage) {
    console.error("ERROR: errorMessage not found.");
    return;
  }

  /* =====================================================
       PASSWORD VISIBILITY
    ===================================================== */

  if (togglePassword && eyeIcon) {
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
  }

  /* =====================================================
       LOGIN FORM SUBMIT
    ===================================================== */

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    /* =================================================
           CLEAR OLD MESSAGE
        ================================================= */

    errorMessage.textContent = "";

    /* =================================================
           GET INPUT VALUES
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

    console.log("=================================");
    console.log("LOGIN REQUEST");
    console.log("Email:", emailValue);
    console.log("=================================");

    /* =================================================
           BUTTON LOADING
        ================================================= */

    loginBtn.disabled = true;

    loginBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>' +
      "Logging in...";

    /* =================================================
           SEND LOGIN REQUEST
        ================================================= */

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(loginData),
      });

      /* =================================================
               READ RESPONSE
            ================================================= */

      const responseText = await response.text();

      console.log("Login HTTP Status:", response.status);

      console.log("Raw Login Response:", responseText);

      let data = {};

      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.warn("Backend did not return JSON.");

        data = {
          message: responseText.trim(),
        };
      }

      const message = data.message || "";

      console.log("Login Message:", message);

      /* =================================================
               LOGIN SUCCESS
            ================================================= */

      if (response.ok && message === "Login Successful!") {
        console.log("LOGIN SUCCESSFUL");

        /* =================================================
                   STEP 1 - SAVE LOGIN STATUS
                ================================================= */

        sessionStorage.setItem("loggedIn", "true");

        sessionStorage.setItem("userEmail", emailValue);

        console.log("loggedIn:", sessionStorage.getItem("loggedIn"));

        console.log("userEmail:", sessionStorage.getItem("userEmail"));

        /* =================================================
                   STEP 2 - GET USER PROFILE
                   
                   IMPORTANT:
                   This gets the user's database ID.
                ================================================= */

        try {
          console.log("Getting user profile...");

          const userResponse = await fetch(
            "http://localhost:8080/api/auth/user?email=" +
              encodeURIComponent(emailValue),
            {
              method: "GET",

              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (!userResponse.ok) {
            throw new Error(
              "Unable to get user profile. HTTP Status: " + userResponse.status,
            );
          }

          const userData = await userResponse.json();

          console.log("USER PROFILE:", userData);

          /* =================================================
                       STEP 3 - GET USER ID
                    ================================================= */

          const userId = userData.id ?? userData.userId;

          if (userId === null || userId === undefined) {
            throw new Error("User ID was not returned by backend.");
          }

          /* =================================================
                       STEP 4 - SAVE USER ID
                    ================================================= */

          sessionStorage.setItem("userId", userId);

          console.log("USER ID SAVED:", sessionStorage.getItem("userId"));

          /* =================================================
                       STEP 5 - SAVE USER NAME
                    ================================================= */

          const fullName =
            userData.fullName ?? userData.name ?? userData.username;

          if (fullName) {
            sessionStorage.setItem("fullName", fullName);
          }

          /* =================================================
                       STEP 6 - SAVE OTHER USER DATA
                    ================================================= */

          if (userData.email) {
            sessionStorage.setItem("userEmail", userData.email);
          }

          if (userData.profileImage) {
            sessionStorage.setItem("profileImage", userData.profileImage);
          }

          /* =================================================
                       VERIFY SESSION
                    ================================================= */

          console.log("=================================");

          console.log("SESSION DATA");

          console.log("loggedIn:", sessionStorage.getItem("loggedIn"));

          console.log("userId:", sessionStorage.getItem("userId"));

          console.log("userEmail:", sessionStorage.getItem("userEmail"));

          console.log("fullName:", sessionStorage.getItem("fullName"));

          console.log("=================================");
        } catch (profileError) {
          console.error("USER PROFILE ERROR:", profileError);

          errorMessage.textContent =
            "Login successful, but unable to load user profile.";

          resetLoginButton();

          return;
        }

        /* =================================================
                   REMEMBER ME
                ================================================= */

        if (remember && remember.checked) {
          localStorage.setItem("rememberedEmail", emailValue);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        /* =================================================
                   SUCCESS MESSAGE
                ================================================= */

        errorMessage.textContent = "Login Successful!";

        /* =================================================
                   REDIRECT
                ================================================= */

        console.log("Redirecting to dashboard...");

        setTimeout(function () {
          window.location.href = "./dashboard.html";
        }, 500);

        return;
      }

      /* =================================================
               USER NOT FOUND
            ================================================= */

      if (message === "User not found!") {
        errorMessage.textContent = "No account found with this email.";

        resetLoginButton();

        return;
      }

      /* =================================================
               INVALID PASSWORD
            ================================================= */

      if (message === "Invalid Password!") {
        errorMessage.textContent = "Incorrect password.";

        resetLoginButton();

        return;
      }

      /* =================================================
               OTHER BACKEND RESPONSE
            ================================================= */

      errorMessage.textContent = message || "Login failed.";

      resetLoginButton();
    } catch (error) {
      /* =================================================
               CONNECTION ERROR
            ================================================= */

      console.error("LOGIN ERROR:", error);

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

    loginBtn.innerHTML = "Login";
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
