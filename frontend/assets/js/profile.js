/* =========================================================
   BACHAT BUDDY - PROFILE
========================================================= */

document.addEventListener("DOMContentLoaded", async function () {
  /* =====================================================
       CHECK LOGIN
    ===================================================== */

  const loggedIn = sessionStorage.getItem("loggedIn");

  const userEmail = sessionStorage.getItem("userEmail");

  if (loggedIn !== "true" || !userEmail) {
    window.location.href = "login.html";

    return;
  }

  /* =====================================================
       GET HTML ELEMENTS
    ===================================================== */

  const userName = document.getElementById("userName");

  const navbarUserName = document.getElementById("navbarUserName");

  const profileName = document.getElementById("profileName");

  const fullNameInput = document.getElementById("fullName");

  const emailInput = document.getElementById("email");

  const phoneInput = document.getElementById("phone");

  const profileEmail = document.getElementById("profileEmail");

  const profilePhone = document.getElementById("profilePhone");

  /* =====================================================
       GET USER FROM BACKEND
    ===================================================== */

  try {
    const response = await fetch(
      "http://localhost:8080/api/auth/user?email=" +
        encodeURIComponent(userEmail),
    );

    if (!response.ok) {
      throw new Error("Unable to fetch user information.");
    }

    const user = await response.json();

    console.log("User data:", user);

    /* =================================================
           USER DATA
        ================================================= */

    const fullName = user.fullName || user.name || "User";

    const email = user.email || "";

    const phone = user.phoneNumber || "";

    /* =================================================
           UPDATE SIDEBAR
        ================================================= */

    if (userName) {
      userName.textContent = fullName;
    }

    /* =================================================
           UPDATE NAVBAR
        ================================================= */

    if (navbarUserName) {
      navbarUserName.textContent = fullName;
    }

    /* =================================================
           UPDATE PROFILE NAME
        ================================================= */

    if (profileName) {
      profileName.textContent = fullName;
    }

    /* =================================================
           UPDATE FULL NAME INPUT
        ================================================= */

    if (fullNameInput) {
      fullNameInput.value = fullName;
    }

    /* =================================================
           UPDATE EMAIL INPUT
        ================================================= */

    if (emailInput) {
      emailInput.value = email;
    }

    /* =================================================
           UPDATE PHONE INPUT
        ================================================= */

    if (phoneInput) {
      phoneInput.value = phone;
    }

    /* =================================================
           UPDATE PROFILE SUMMARY EMAIL
        ================================================= */

    if (profileEmail) {
      profileEmail.textContent = email;
    }

    /* =================================================
           UPDATE PROFILE SUMMARY PHONE
        ================================================= */

    if (profilePhone) {
      profilePhone.textContent = "+91 " + phone;
    }

    /* =================================================
           UPDATE SESSION DATA
        ================================================= */

    sessionStorage.setItem("userId", user.id);

    sessionStorage.setItem("userName", user.name);

    sessionStorage.setItem("fullName", fullName);

    sessionStorage.setItem("userEmail", email);

    sessionStorage.setItem("phoneNumber", phone);
  } catch (error) {
    console.error("Profile error:", error);

    alert("Unable to load your profile. Please try again.");
  }

  /* =====================================================
       LOGOUT
    ===================================================== */

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      const confirmLogout = confirm("Are you sure you want to logout?");

      if (!confirmLogout) {
        return;
      }

      sessionStorage.clear();

      window.location.href = "login.html";
    });
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  const email = sessionStorage.getItem("userEmail");

  if (!email) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/auth/user?email=${encodeURIComponent(email)}`,
    );

    if (!response.ok) {
      throw new Error("Unable to load profile");
    }

    const user = await response.json();

    console.log("User from backend:", user);

    // Name
    const profileName = document.getElementById("profileName");

    if (profileName) {
      profileName.textContent = user.fullName || user.name;
    }

    // Email
    const profileEmail = document.getElementById("profileEmail");

    if (profileEmail) {
      profileEmail.textContent = user.email;
    }

    // Phone
    const profilePhone = document.getElementById("profilePhone");

    if (profilePhone) {
      profilePhone.textContent = user.phoneNumber;
    }
  } catch (error) {
    console.error("Profile loading error:", error);

    alert("Unable to load your profile. Please try again.");
  }
});
