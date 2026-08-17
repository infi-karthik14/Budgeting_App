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

  const dateOfBirthInput = document.getElementById("dateOfBirth");
  const addressInput = document.getElementById("address");
  const bioInput = document.getElementById("bio");

  const profileEmail = document.getElementById("profileEmail");
  const profilePhone = document.getElementById("profilePhone");

  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.querySelector(".cancel-btn");

  const logoutBtn = document.getElementById("logoutBtn");

  /* =====================================================
       GET USER FROM BACKEND
  ===================================================== */

  try {
    const response = await fetch(
      "http://localhost:8080/api/auth/user?email=" +
        encodeURIComponent(userEmail),
    );

    if (!response.ok) {
      throw new Error("Server returned status: " + response.status);
    }

    let user = await response.json();

    console.log("User data from backend:", user);

    /* =================================================
           USER DATA
    ================================================= */

    let fullName = user.fullName || user.name || "User";
    let email = user.email || "";
    let phone = user.phoneNumber || "";
    let dateOfBirth = user.dateOfBirth || "";
    let address = user.address || "";
    let bio = user.bio || "";

    /* =================================================
           DISPLAY USER NAME
    ================================================= */

    if (userName) {
      userName.textContent = fullName;
    }

    if (navbarUserName) {
      navbarUserName.textContent = fullName;
    }

    if (profileName) {
      profileName.textContent = fullName;
    }

    /* =================================================
           LOAD FORM VALUES
    ================================================= */

    if (fullNameInput) {
      fullNameInput.value = fullName;
    }

    if (emailInput) {
      emailInput.value = email;
    }

    if (phoneInput) {
      phoneInput.value = phone;
    }

    if (dateOfBirthInput) {
      dateOfBirthInput.value = dateOfBirth;
    }

    if (addressInput) {
      addressInput.value = address;
    }

    if (bioInput) {
      bioInput.value = bio;
    }

    /* =================================================
           PROFILE SUMMARY
    ================================================= */

    if (profileEmail) {
      profileEmail.textContent = email;
    }

    if (profilePhone) {
      if (phone) {
        profilePhone.textContent = "+91 " + phone;
      } else {
        profilePhone.textContent = "Not provided";
      }
    }

    /* =================================================
           UPDATE SESSION DATA
    ================================================= */

    sessionStorage.setItem("userId", user.id);

    sessionStorage.setItem("userName", user.name || fullName);

    sessionStorage.setItem("fullName", fullName);

    sessionStorage.setItem("userEmail", email);

    sessionStorage.setItem("phoneNumber", phone);

    /* =====================================================
       SAVE PROFILE CHANGES
    ===================================================== */

    if (saveBtn) {
      saveBtn.addEventListener("click", async function () {
        /* =================================================
             GET UPDATED VALUES FROM INPUTS
        ================================================= */

        const updatedFullName = fullNameInput.value.trim();

        const updatedEmail = emailInput.value.trim();

        const updatedPhone = phoneInput.value.trim();

        const updatedDateOfBirth = dateOfBirthInput.value || null;

        const updatedAddress = addressInput.value.trim();

        const updatedBio = bioInput.value.trim();

        /* =================================================
             VALIDATE FULL NAME
        ================================================= */

        if (updatedFullName.length < 2) {
          alert("Please enter a valid full name.");

          fullNameInput.focus();

          return;
        }

        /* =================================================
             VALIDATE EMAIL
        ================================================= */

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(updatedEmail)) {
          alert("Please enter a valid email address.");

          emailInput.focus();

          return;
        }

        /* =================================================
             VALIDATE PHONE
        ================================================= */

        if (!/^[0-9]{10}$/.test(updatedPhone)) {
          alert("Please enter a valid 10-digit phone number.");

          phoneInput.focus();

          return;
        }

        /* =================================================
             BUTTON LOADING
        ================================================= */

        saveBtn.disabled = true;

        saveBtn.innerHTML =
          '<span class="spinner-border spinner-border-sm me-2"></span>' +
          "Saving...";

        try {
          /* =================================================
               SEND UPDATE TO SPRING BOOT
          ================================================= */

          const updateResponse = await fetch(
            "http://localhost:8080/api/auth/user?email=" +
              encodeURIComponent(userEmail),
            {
              method: "PUT",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                fullName: updatedFullName,

                email: updatedEmail,

                phoneNumber: updatedPhone,

                dateOfBirth: updatedDateOfBirth,

                address: updatedAddress,

                bio: updatedBio,
              }),
            },
          );

          /* =================================================
               CHECK RESPONSE
          ================================================= */

          if (!updateResponse.ok) {
            const errorText = await updateResponse.text();

            throw new Error(errorText || "Unable to update profile.");
          }

          /* =================================================
               GET UPDATED USER
          ================================================= */

          const updatedUser = await updateResponse.json();

          console.log("Updated user:", updatedUser);

          /* =================================================
               UPDATE LOCAL USER OBJECT
          ================================================= */

          user = updatedUser;

          fullName = updatedUser.fullName || updatedUser.name || "User";

          email = updatedUser.email || "";

          phone = updatedUser.phoneNumber || "";

          dateOfBirth = updatedUser.dateOfBirth || "";

          address = updatedUser.address || "";

          bio = updatedUser.bio || "";

          /* =================================================
               UPDATE FORM AFTER SAVE
          ================================================= */

          if (fullNameInput) {
            fullNameInput.value = fullName;
          }

          if (emailInput) {
            emailInput.value = email;
          }

          if (phoneInput) {
            phoneInput.value = phone;
          }

          if (dateOfBirthInput) {
            dateOfBirthInput.value = dateOfBirth;
          }

          if (addressInput) {
            addressInput.value = address;
          }

          if (bioInput) {
            bioInput.value = bio;
          }

          /* =================================================
               UPDATE SESSION
          ================================================= */

          sessionStorage.setItem("userId", updatedUser.id);

          sessionStorage.setItem("userName", updatedUser.name || fullName);

          sessionStorage.setItem("fullName", fullName);

          sessionStorage.setItem("userEmail", email);

          sessionStorage.setItem("phoneNumber", phone);

          /* =================================================
               UPDATE PAGE
          ================================================= */

          if (profileName) {
            profileName.textContent = fullName;
          }

          if (userName) {
            userName.textContent = fullName;
          }

          if (navbarUserName) {
            navbarUserName.textContent = fullName;
          }

          if (profileEmail) {
            profileEmail.textContent = email;
          }

          if (profilePhone) {
            profilePhone.textContent = phone ? "+91 " + phone : "Not provided";
          }

          /* =================================================
               SUCCESS
          ================================================= */

          alert("Profile updated successfully!");
        } catch (error) {
          console.error("Profile update error:", error);

          alert("Profile update failed:\n\n" + error.message);
        } finally {
          saveBtn.disabled = false;

          saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Save Changes';
        }
      });
    }

    /* =====================================================
       CANCEL PROFILE CHANGES
    ===================================================== */

    if (cancelBtn) {
      cancelBtn.addEventListener("click", function () {
        /* Restore values from current user */

        if (fullNameInput) {
          fullNameInput.value = user.fullName || user.name || "";
        }

        if (emailInput) {
          emailInput.value = user.email || "";
        }

        if (phoneInput) {
          phoneInput.value = user.phoneNumber || "";
        }

        if (dateOfBirthInput) {
          dateOfBirthInput.value = user.dateOfBirth || "";
        }

        if (addressInput) {
          addressInput.value = user.address || "";
        }

        if (bioInput) {
          bioInput.value = user.bio || "";
        }
      });
    }

    /* =====================================================
       LOGOUT
    ===================================================== */

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
  } catch (error) {
    console.error("PROFILE LOADING ERROR:", error);

    alert("PROFILE ERROR:\n\n" + "Message: " + error.message);
  }
});

