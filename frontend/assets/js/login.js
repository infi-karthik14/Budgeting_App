document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // ELEMENTS
  // ==========================================

  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const remember = document.getElementById("remember");
  const errorMessage = document.getElementById("errorMessage");

  const togglePassword = document.getElementById("togglePassword");
  const eyeIcon = document.getElementById("eyeIcon");

  // ==========================================
  // PASSWORD SHOW / HIDE
  // ==========================================

  if (togglePassword && password && eyeIcon) {
    togglePassword.onclick = function () {
      if (password.type === "password") {
        password.type = "text";

        eyeIcon.className = "fa-solid fa-eye-slash";
      } else {
        password.type = "password";

        eyeIcon.className = "fa-solid fa-eye";
      }
    };
  } else {
    console.error("Password toggle elements not found.");
  }

  // ==========================================
  // REMEMBERED EMAIL
  // ==========================================

  const rememberedEmail = localStorage.getItem("rememberedEmail");

  if (rememberedEmail) {
    email.value = rememberedEmail;

    if (remember) {
      remember.checked = true;
    }
  }

  // ==========================================
  // LOGIN
  // ==========================================

  if (form) {
    form.onsubmit = function (event) {
      event.preventDefault();

      errorMessage.textContent = "";

      const emailValue = email.value.trim().toLowerCase();

      const passwordValue = password.value;

      // ==================================
      // VALIDATION
      // ==================================

      if (emailValue === "") {
        errorMessage.textContent = "Please enter your email.";

        return;
      }

      if (passwordValue === "") {
        errorMessage.textContent = "Please enter your password.";

        return;
      }

      // ==================================
      // GET USERS
      // ==================================

      const users = JSON.parse(localStorage.getItem("users")) || [];

      // ==================================
      // FIND USER
      // ==================================

      const user = users.find(function (user) {
        return (
          user.email &&
          user.email.trim().toLowerCase() === emailValue &&
          user.password === passwordValue
        );
      });

      // ==================================
      // INVALID LOGIN
      // ==================================

      if (!user) {
        errorMessage.textContent = "Invalid Email or Password.";

        return;
      }

      // ==================================
      // REMEMBER ME
      // ==================================

      if (remember && remember.checked) {
        localStorage.setItem("rememberedEmail", emailValue);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // ==================================
      // LOGGED-IN USER
      // ==================================

      const loggedInUser = {
        id: user.id || null,

        name: user.name || user.fullName || "",

        email: user.email,

        phone: user.phone || "",
      };

      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

      // ==================================
      // USERNAME
      // ==================================

      if (loggedInUser.name) {
        localStorage.setItem("userName", loggedInUser.name);
      }

      // ==================================
      // SUCCESS
      // ==================================

      errorMessage.classList.remove("text-danger");

      errorMessage.classList.add("text-success");

      errorMessage.textContent = "Login successful!";

      // ==================================
      // REDIRECT
      // ==================================

      setTimeout(function () {
        window.location.href = "dashboard.html";
      }, 700);
    };
  }
});
