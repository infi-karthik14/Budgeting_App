document.addEventListener("DOMContentLoaded", () => {

    // ============================
    // Elements
    // ============================

    const editBtn = document.getElementById("editBtn");
    const saveBtn = document.getElementById("saveBtn");
    const uploadImage = document.getElementById("uploadImage");

    const inputs = document.querySelectorAll(
        ".profile-details input, .profile-details textarea"
    );

    // ============================
    // Disable fields initially
    // ============================

    inputs.forEach(input => {
        input.disabled = true;
    });

    saveBtn.style.display = "none";

    // ============================
    // Load Saved Data
    // ============================

    loadProfile();

    // ============================
    // Edit Button
    // ============================

    editBtn.addEventListener("click", () => {

        inputs.forEach(input => {
            input.disabled = false;
        });

        saveBtn.style.display = "inline-block";
        editBtn.style.display = "none";

    });

    // ============================
    // Save Button
    // ============================

    saveBtn.addEventListener("click", () => {

        const profile = {

            fullName: document.getElementById("fullName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            bio: document.getElementById("bio").value

        };

        localStorage.setItem("profile", JSON.stringify(profile));

        inputs.forEach(input => {
            input.disabled = true;
        });

        saveBtn.style.display = "none";
        editBtn.style.display = "inline-block";

        showToast("Profile Updated Successfully");

    });

    // ============================
    // Upload Image
    // ============================

    uploadImage.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            document.getElementById("profilePic").src = e.target.result;

            localStorage.setItem(
                "profileImage",
                e.target.result
            );

        };

        reader.readAsDataURL(file);

    });

    // ============================
    // Load Function
    // ============================

    function loadProfile() {

        const saved = JSON.parse(localStorage.getItem("profile"));

        if (saved) {

            document.getElementById("fullName").value = saved.fullName;
            document.getElementById("email").value = saved.email;
            document.getElementById("phone").value = saved.phone;
            document.getElementById("address").value = saved.address;
            document.getElementById("bio").value = saved.bio;

        }

        const image = localStorage.getItem("profileImage");

        if (image) {

            document.getElementById("profilePic").src = image;

        }

    }

    function showToast(message) {

        const toast = document.createElement("div");

        toast.className = "toast";

        toast.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        ${message}
    `;

        document.body.appendChild(toast);

        setTimeout(() => {

            toast.classList.add("show");

        }, 100);

        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            }, 300);

        }, 2500);

    }

});