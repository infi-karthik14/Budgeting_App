// ==========================================================
// BACHAT BUDDY - COMMON PROFILE IMAGE
// Loads profile image from MySQL on every page
// ==========================================================

"use strict";

document.addEventListener("DOMContentLoaded", async function () {
  // ======================================================
  // LOGIN
  // ======================================================

  const loggedIn = sessionStorage.getItem("loggedIn");

  const userId = sessionStorage.getItem("userId");

  if (loggedIn !== "true" || !userId) {
    console.log("User is not logged in.");
    return;
  }

  // ======================================================
  // API
  // ======================================================

  const API_URL = "https://budgetingapp-production-a92b.up.railway.app/api/users";

  const DEFAULT_IMAGE = "assets/images/default-user.png";

  // ======================================================
  // FIND PROFILE IMAGES
  // ======================================================

  const profileImages = document.querySelectorAll(
    "#profileImage, #profilePic, .profile-image",
  );

  console.log("Found profile images:", profileImages.length);

  if (profileImages.length === 0) {
    console.log("No profile image element found.");
    return;
  }

  // ======================================================
  // LOAD IMAGE
  // ======================================================

  try {
    const imageUrl = `${API_URL}/${userId}/profile-image?t=${Date.now()}`;

    console.log("Fetching profile image:", imageUrl);

    const response = await fetch(imageUrl);

    console.log(
      "Profile image response:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      throw new Error(`Image request failed: ${response.status}`);
    }

    // ==================================================
    // GET BLOB
    // ==================================================

    const blob = await response.blob();

    console.log("Profile image downloaded:", blob.type, blob.size, "bytes");

    if (!blob.size) {
      throw new Error("Image data is empty.");
    }

    // ==================================================
    // CONVERT BLOB TO BASE64
    // ==================================================

    const reader = new FileReader();

    reader.onloadend = function () {
      const base64Image = reader.result;

      console.log("Image converted to Base64.");

      // ==================================================
      // APPLY IMAGE
      // ==================================================

      profileImages.forEach(function (image) {
        image.onerror = function () {
          console.error("Browser could not display profile image.");

          this.onerror = null;

          this.src = DEFAULT_IMAGE;
        };

        image.onload = function () {
          console.log("Profile image displayed successfully.");
        };

        image.src = base64Image;
      });

      // ==================================================
      // SAVE CURRENT IMAGE URL FOR PAGE SESSION
      // ==================================================

      sessionStorage.setItem("profileImageData", base64Image);
    };

    reader.onerror = function () {
      throw new Error("Unable to convert image to Base64.");
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error("PROFILE IMAGE ERROR:", error);

    profileImages.forEach(function (image) {
      image.src = DEFAULT_IMAGE;
    });
  }
});
