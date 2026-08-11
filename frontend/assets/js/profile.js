// ==========================================
// PROFILE PAGE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  const profilePic = document.getElementById("profilePic");
  const uploadImage = document.getElementById("uploadImage");

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");
  const bio = document.getElementById("bio");

  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.querySelector(".cancel-btn");

  // ==========================================
  // LOAD PROFILE DATA
  // ==========================================

  const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};

  if (savedProfile.fullName) {
    fullName.value = savedProfile.fullName;
  }

  if (savedProfile.email) {
    email.value = savedProfile.email;
  }

  if (savedProfile.phone) {
    phone.value = savedProfile.phone;
  }

  if (savedProfile.address) {
    address.value = savedProfile.address;
  }

  if (savedProfile.bio) {
    bio.value = savedProfile.bio;
  }

  if (savedProfile.profileImage) {
    profilePic.src = savedProfile.profileImage;
  }

  // ==========================================
  // PROFILE IMAGE UPLOAD
  // ==========================================

  uploadImage.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");

      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      profilePic.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  saveBtn.addEventListener("click", function () {
    const profile = {
      fullName: fullName.value.trim(),

      email: email.value.trim(),

      phone: phone.value.trim(),

      address: address.value.trim(),

      bio: bio.value.trim(),

      profileImage: profilePic.src,
    };

    localStorage.setItem("userProfile", JSON.stringify(profile));

    // Keep existing sidebar data synchronized
    localStorage.setItem("userName", profile.fullName);

    localStorage.setItem("profileImage", profile.profileImage);

    showMessage("Profile updated successfully!");
  });

  // ==========================================
  // CANCEL
  // ==========================================

  cancelBtn.addEventListener("click", function () {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};

    fullName.value = savedProfile.fullName || "Archita";

    email.value = savedProfile.email || "archita@example.com";

    phone.value = savedProfile.phone || "+91 98765 43210";

    address.value = savedProfile.address || "Lucknow, Uttar Pradesh";

    bio.value =
      savedProfile.bio ||
      "Passionate about personal finance and smart budgeting.";

    profilePic.src = savedProfile.profileImage || "https://i.pravatar.cc/200";
  });

  // ==========================================
  // SUCCESS MESSAGE
  // ==========================================

  function showMessage(message) {
    const oldMessage = document.querySelector(".profile-message");

    if (oldMessage) {
      oldMessage.remove();
    }

    const messageBox = document.createElement("div");

    messageBox.className = "profile-message";

    messageBox.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <span>${message}</span>
        `;

    document.body.appendChild(messageBox);

    setTimeout(function () {
      messageBox.classList.add("hide");

      setTimeout(function () {
        messageBox.remove();
      }, 300);
    }, 2500);
  }
});
