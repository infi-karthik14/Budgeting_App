// Wait until page loads
document.addEventListener("DOMContentLoaded", () => {

    // -------------------------
    // Add Budget Button
    // -------------------------
    const addBtn = document.querySelector(".add-btn");

    if (addBtn) {
        addBtn.addEventListener("click", () => {
            alert("Add Budget feature will be connected to the backend soon.");
        });
    }

    // -------------------------
    // Sidebar Active Menu
    // -------------------------
    const menuItems = document.querySelectorAll(".menu li");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {

            menuItems.forEach(i => i.classList.remove("active"));

            item.classList.add("active");

        });
    });

    // -------------------------
    // Animate Progress Bars
    // -------------------------

    const progressBars = document.querySelectorAll(".progress-bar");

    progressBars.forEach(bar => {

        const width = window.getComputedStyle(bar).width;

        bar.style.width = "0";

        setTimeout(() => {
            bar.style.transition = "1.2s";
            bar.style.width = width;
        }, 300);

    });

    // -------------------------
    // Card Hover Effect
    // -------------------------

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-8px)";
            card.style.transition = ".3s";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0)";
        });

    });

    // -------------------------
// Show Today's Date
// -------------------------

const dateElement = document.getElementById("todayDate");

if (dateElement) {

    const today = new Date();

    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    };

    dateElement.textContent = today.toLocaleDateString("en-US", options);
}

});