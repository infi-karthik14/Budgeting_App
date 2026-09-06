// ==========================================================
// BACHAT BUDDY - PROFILE.JS
// Backend Connected Profile
// Profile Image Stored in MySQL
// ==========================================================

"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // ======================================================
  // LOGIN CHECK
  // ======================================================

  const loggedIn = sessionStorage.getItem("loggedIn");

  const userId = sessionStorage.getItem("userId");

  if (loggedIn !== "true" || !userId) {
    console.error("User is not logged in or userId is missing.");

    window.location.href = "login.html";

    return;
  }

  console.log("Logged-in User ID:", userId);

  // ======================================================
  // API
  // ======================================================

  const API_URL = "https://budgetingapp-production-a92b.up.railway.app/api/users";

  // ======================================================
  // DEFAULT IMAGE
  // ======================================================

  const DEFAULT_PROFILE_IMAGE = "assets/images/default-user.png";

  // ======================================================
  // PROFILE ELEMENTS
  // ======================================================

  const profileName = document.getElementById("profileName");

  const profileEmail = document.getElementById("profileEmail");

  const profilePhone = document.getElementById("profilePhone");

  const profileAddress = document.getElementById("profileAddress");

  const profileJoinedDate = document.getElementById("profileJoinedDate");

  // ======================================================
  // FORM ELEMENTS
  // ======================================================

  const fullNameInput = document.getElementById("fullName");

  const emailInput = document.getElementById("email");

  const phoneInput = document.getElementById("phoneNumber");

  const dobInput = document.getElementById("dateOfBirth");

  const addressInput = document.getElementById("address");

  const bioInput = document.getElementById("bio");

  // ======================================================
  // BUTTONS
  // ======================================================

  const saveBtn = document.getElementById("saveBtn");

  const cancelBtn = document.querySelector(".cancel-btn");

  // ======================================================
  // PROFILE IMAGES
  // ======================================================

  const profilePic = document.getElementById("profilePic");

  const profileImage = document.getElementById("profileImage");

  const uploadImage = document.getElementById("uploadImage");

  // ======================================================
  // SIDEBAR USER NAME
  // ======================================================

  const userNameElement = document.getElementById("userName");

  // ======================================================
  // LOAD PROFILE
  // ======================================================

  async function loadProfile() {
    try {
      console.log("Loading profile for User ID:", userId);

      const response = await fetch(`${API_URL}/${userId}`);

      if (!response.ok) {
        throw new Error(`Unable to load profile. Status: ${response.status}`);
      }

      const user = await response.json();

      console.log("User profile:", user);

      displayProfile(user);
    } catch (error) {
      console.error("PROFILE LOAD ERROR:", error);

      alert("Unable to load your profile.\n\n" + error.message);
    }
  }

  // ======================================================
  // DISPLAY PROFILE
  // ======================================================

  function displayProfile(user) {
    // ==================================================
    // USER NAME
    // ==================================================

    const name = user.fullName || user.name || "User";

    // ==================================================
    // SIDEBAR NAME
    // ==================================================

    if (userNameElement) {
      userNameElement.textContent = name;
    }

    // ==================================================
    // PROFILE CARD
    // ==================================================

    if (profileName) {
      profileName.textContent = name;
    }

    // ==================================================
    // EMAIL
    // ==================================================

    if (profileEmail) {
      profileEmail.textContent = user.email || "Not provided";
    }

    // ==================================================
    // PHONE
    // ==================================================

    if (profilePhone) {
      profilePhone.textContent = user.phoneNumber || "Not provided";
    }

    // ==================================================
    // ADDRESS
    // ==================================================

    if (profileAddress) {
      profileAddress.textContent = user.address || "Not provided";
    }

    // ==================================================
    // JOINED DATE
    // ==================================================

    if (profileJoinedDate) {
      if (user.joinedDate) {
        const date = new Date(user.joinedDate + "T00:00:00");

        if (!isNaN(date.getTime())) {
          profileJoinedDate.textContent =
            "Joined " +
            date.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
        } else {
          profileJoinedDate.textContent = "Joined date unavailable";
        }
      } else {
        profileJoinedDate.textContent = "Joined date unavailable";
      }
    }

    // ==================================================
    // FORM VALUES
    // ==================================================

    if (fullNameInput) {
      fullNameInput.value = user.fullName || user.name || "";
    }

    if (emailInput) {
      emailInput.value = user.email || "";
    }

    if (phoneInput) {
      phoneInput.value = user.phoneNumber || "";
    }

    if (dobInput) {
      dobInput.value = user.dateOfBirth || "";
    }

    if (addressInput) {
      addressInput.value = user.address || "";
    }

    if (bioInput) {
      bioInput.value = user.bio || "";
    }

    // ==================================================
    // SAVE USER NAME TO SESSION
    // ==================================================

    sessionStorage.setItem("fullName", name);

    sessionStorage.setItem("userName", name);
  }

  // ======================================================
  // SAVE PROFILE
  // ======================================================

  if (saveBtn) {
    saveBtn.addEventListener("click", async function () {
      try {
        // ==========================================
        // DISABLE BUTTON
        // ==========================================

        saveBtn.disabled = true;

        saveBtn.innerHTML = `
                        <i class="fa-solid fa-spinner fa-spin"></i>
                        Saving...
                    `;

        // ==========================================
        // GET FORM DATA
        // ==========================================

        const updatedUser = {
          name: fullNameInput ? fullNameInput.value.trim() : "",

          fullName: fullNameInput ? fullNameInput.value.trim() : "",

          email: emailInput ? emailInput.value.trim() : "",

          phoneNumber: phoneInput ? phoneInput.value.trim() : "",

          dateOfBirth: dobInput && dobInput.value ? dobInput.value : null,

          address: addressInput ? addressInput.value.trim() : "",

          bio: bioInput ? bioInput.value.trim() : "",
        };

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!updatedUser.fullName) {
          alert("Please enter your full name.");

          resetSaveButton();

          return;
        }

        if (!updatedUser.email) {
          alert("Please enter your email.");

          resetSaveButton();

          return;
        }

        if (!updatedUser.phoneNumber) {
          alert("Please enter your phone number.");

          resetSaveButton();

          return;
        }

        // ==========================================
        // UPDATE PROFILE
        // ==========================================

        console.log("Updating profile:", updatedUser);

        const response = await fetch(`${API_URL}/${userId}`, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(updatedUser),
        });

        // ==========================================
        // CHECK RESPONSE
        // ==========================================

        if (!response.ok) {
          const errorText = await response.text();

          throw new Error(
            errorText || `Update failed. Status: ${response.status}`,
          );
        }

        // ==========================================
        // GET UPDATED USER
        // ==========================================

        const updatedProfile = await response.json();

        console.log("Updated profile:", updatedProfile);

        // ==========================================
        // UPDATE PAGE
        // ==========================================

        displayProfile(updatedProfile);

        // ==========================================
        // SUCCESS
        // ==========================================

        alert("Profile updated successfully!");
      } catch (error) {
        console.error("PROFILE UPDATE ERROR:", error);

        alert("Unable to update profile.\n\n" + error.message);
      } finally {
        resetSaveButton();
      }
    });
  }

  // ======================================================
  // RESET SAVE BUTTON
  // ======================================================

  function resetSaveButton() {
    if (!saveBtn) {
      return;
    }

    saveBtn.disabled = false;

    saveBtn.innerHTML = `
            <i class="fa-solid fa-check"></i>
            Save Changes
        `;
  }

  // ======================================================
  // CANCEL BUTTON
  // ======================================================

  if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
      loadProfile();
    });
  }

  // ======================================================
  // UPLOAD PROFILE IMAGE TO DATABASE
  // ======================================================

  if (uploadImage) {
    uploadImage.addEventListener("change", async function () {
      const file = this.files[0];

      if (!file) {
        return;
      }

      // ==========================================
      // CHECK IMAGE TYPE
      // ==========================================

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");

        this.value = "";

        return;
      }

      // ==========================================
      // CHECK IMAGE SIZE
      // Maximum 2 MB
      // ==========================================

      if (file.size > 2 * 1024 * 1024) {
        alert("Please select an image smaller than 2 MB.");

        this.value = "";

        return;
      }

      try {
        console.log("Uploading profile image...");

        // ==========================================
        // FORM DATA
        // ==========================================

        const formData = new FormData();

        formData.append("image", file);

        // ==========================================
        // UPLOAD TO BACKEND
        // ==========================================

        const response = await fetch(`${API_URL}/${userId}/profile-image`, {
          method: "POST",
          body: formData,
        });

        // ==========================================
        // CHECK RESPONSE
        // ==========================================

        if (!response.ok) {
          const errorText = await response.text();

          throw new Error(
            errorText || `Image upload failed. Status: ${response.status}`,
          );
        }

        // ==========================================
        // SUCCESS
        // ==========================================

        console.log("Profile image uploaded successfully.");

        window.dispatchEvent(new CustomEvent("profileImageChanged"));

        // ==========================================
        // LOAD IMAGE FROM DATABASE
        // ==========================================

        const imageUrl = `${API_URL}/${userId}/profile-image?t=${Date.now()}`;

        if (profilePic) {
          profilePic.src = imageUrl;
        }

        if (profileImage) {
          profileImage.src = imageUrl;
        }

        alert("Profile image updated successfully!");
      } catch (error) {
        console.error("PROFILE IMAGE UPLOAD ERROR:", error);

        alert("Unable to upload profile image.\n\n" + error.message);
      } finally {
        // Allow selecting same file again
        this.value = "";
      }
    });
  }

  // ======================================================
  // SEARCH
  // ======================================================

  const profileSearch = document.getElementById("profileSearch");

  if (profileSearch) {
    profileSearch.addEventListener("input", function () {
      const search = this.value.trim().toLowerCase();

      if (!search) {
        return;
      }

      const profileText = document.body.innerText.toLowerCase();

      if (!profileText.includes(search)) {
        console.log("No matching profile information found.");
      }
    });
  }

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  loadProfile();
});
