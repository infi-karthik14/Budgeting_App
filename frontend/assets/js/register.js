document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");

  const name = document.getElementById("name");
  const email = document.getElementById("email");

  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  const terms = document.getElementById("terms");

  const errorMessage = document.getElementById("errorMessage");

  // =================================
  // SHOW / HIDE PASSWORD
  // =================================

  const togglePassword = document.getElementById("togglePassword");

  togglePassword.addEventListener("click", function () {
    if (password.type === "password") {
      password.type = "text";

      this.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
      password.type = "password";

      this.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
  });

  // =================================
  // SHOW / HIDE CONFIRM PASSWORD
  // =================================

  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword",
  );

  toggleConfirmPassword.addEventListener("click", function () {
    if (confirmPassword.type === "password") {
      confirmPassword.type = "text";

      this.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
      confirmPassword.type = "password";

      this.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
  });

  // =================================
  // REGISTER USER
  // =================================

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    errorMessage.textContent = "";

    const userName = name.value.trim();

    const userEmail = email.value.trim().toLowerCase();

    const userPassword = password.value;

    const userConfirmPassword = confirmPassword.value;

    // =================================
    // VALIDATION
    // =================================

    if (userName.length < 3) {
      errorMessage.textContent = "Name must contain at least 3 characters.";

      return;
    }

    if (userPassword.length < 6) {
      errorMessage.textContent = "Password must contain at least 6 characters.";

      return;
    }

    if (userPassword !== userConfirmPassword) {
      errorMessage.textContent = "Passwords do not match.";

      return;
    }

    if (!terms.checked) {
      errorMessage.textContent = "Please accept the Terms & Conditions.";

      return;
    }

    // =================================
    // GET EXISTING USERS
    // =================================

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // =================================
    // CHECK DUPLICATE EMAIL
    // =================================

    const existingUser = users.find(
      (user) => user.email.toLowerCase() === userEmail,
    );

    if (existingUser) {
      errorMessage.textContent = "An account with this email already exists.";

      return;
    }

    // =================================
    // CREATE USER
    // =================================

    const newUser = {
      name: userName,

      email: userEmail,

      password: userPassword,
    };

    users.push(newUser);

    // =================================
    // SAVE USER
    // =================================

    localStorage.setItem("users", JSON.stringify(users));

    // =================================
    // SUCCESS
    // =================================

    alert("Account created successfully!");

    window.location.href = "login.html";
  });
});
