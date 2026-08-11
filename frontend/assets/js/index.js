// ===============================
// Budgeting App - Home Page JS
// ===============================

// Navbar shadow on scroll
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.classList.add("shadow-lg");
    } else {
        navbar.classList.remove("shadow-lg");
    }
});


// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }

    });

});


// Card animation on scroll
const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

        }

    });

}, {
    threshold: 0.2
});

cards.forEach(card => {

    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";
    card.style.transition = "all 0.6s ease";

    observer.observe(card);

});


document.querySelectorAll(".counter").forEach(counter => {

    const target = Number(counter.dataset.target);
    let count = 0;

    const update = () => {

        const increment = Math.ceil(target / 100);

        if (count < target) {

            count += increment;

            if (count > target) count = target;

            counter.textContent = count + "+";

            requestAnimationFrame(update);

        } else {

            counter.textContent = target + "+";

        }

    };

    update();

});

document.querySelectorAll(".counter-value").forEach(counter => {
    const text = counter.textContent.trim();
    const number = parseInt(text);

    if (isNaN(number)) return;

    let finalText = text;
    let target = number;
    let current = 0;
    const duration = 1200;
    const step = Math.ceil(target / 60);

    const update = () => {
        current += step;
        if (current >= target) {
            counter.textContent = finalText;
            return;
        }
        counter.textContent = current + (text.includes("%") ? "%" : text.includes("/") ? "/7" : "+");
        requestAnimationFrame(update);
    };

    update();
});

// Hero Image Floating Animation
const image = document.querySelector(".hero img");

if (image) {

    let direction = 1;

    setInterval(() => {

        image.style.transform =
            `translateY(${direction * 10}px)`;

        direction *= -1;

    }, 1500);

}


// Welcome Message
window.addEventListener("load", () => {

    console.log("Welcome to Budgeting App");

});


// Button Hover Ripple Effect
document.querySelectorAll(".btn").forEach(btn => {

    btn.addEventListener("mouseenter", () => {

        btn.style.transform = "scale(1.05)";

    });

    btn.addEventListener("mouseleave", () => {

        btn.style.transform = "scale(1)";

    });

});
