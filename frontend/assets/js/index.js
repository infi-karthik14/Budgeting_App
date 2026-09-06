"use strict";

/* =========================================================
   BACHAT BUDDY - INDEX PAGE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  console.log("Bachat Buddy Index Page Loaded");

  /* =====================================================
       NAVBAR
    ===================================================== */

  const navLinks = document.querySelectorAll(".landing-navbar .nav-link");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.forEach(function (item) {
        item.classList.remove("active");
      });

      this.classList.add("active");
    });
  });

  /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  /* =====================================================
       NAVBAR ACTIVE SECTION ON SCROLL
    ===================================================== */

  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", function () {
    let currentSection = "";

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;

      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    if (currentSection === "features") {
      navLinks.forEach(function (link) {
        link.classList.remove("active");
      });

      const featureLink = document.querySelector(
        '.landing-navbar a[href="#features"]',
      );

      if (featureLink) {
        featureLink.classList.add("active");
      }
    } else if (window.scrollY < 300) {
      navLinks.forEach(function (link) {
        link.classList.remove("active");
      });

      const homeLink = document.querySelector(
        '.landing-navbar a[href="index.html"]',
      );

      if (homeLink) {
        homeLink.classList.add("active");
      }
    }
  });

  /* =====================================================
       COUNTER ANIMATION
    ===================================================== */

  const counters = document.querySelectorAll(".stat-item h3");

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          const counter = entry.target;

          /*
           * Do not animate 24/7.
           */

          if (counter.innerText.includes("/")) {
            observer.unobserve(counter);

            return;
          }

          const originalText = counter.innerText.trim();

          const target = parseInt(originalText.replace(/[^0-9]/g, ""), 10);

          if (isNaN(target)) {
            observer.unobserve(counter);

            return;
          }

          let suffix = "";

          if (originalText.includes("%")) {
            suffix = "%";
          } else if (originalText.includes("K")) {
            suffix = "K+";
          } else {
            suffix = "+";
          }

          let current = 0;

          const duration = 1200;

          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;

            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = 1 - Math.pow(1 - progress, 3);

            current = Math.floor(target * easedProgress);

            counter.innerText = current + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.innerText = target + suffix;
            }
          }

          requestAnimationFrame(updateCounter);

          observer.unobserve(counter);
        });
      },
      {
        threshold: 0.5,
      },
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  /* =====================================================
       FEATURE CARD ANIMATION
    ===================================================== */

  const featureCards = document.querySelectorAll(".feature-card");

  if ("IntersectionObserver" in window) {
    const featureObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      },
    );

    featureCards.forEach(function (card) {
      card.classList.add("feature-hidden");

      featureObserver.observe(card);
    });
  }

  /* =====================================================
       TESTIMONIAL CARD ANIMATION
    ===================================================== */

  const testimonialCards = document.querySelectorAll(".testimonial-card");

  if ("IntersectionObserver" in window) {
    const testimonialObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      },
    );

    testimonialCards.forEach(function (card) {
      card.classList.add("testimonial-hidden");

      testimonialObserver.observe(card);
    });
  }

  /* =====================================================
       BUTTON CLICK EFFECT
    ===================================================== */

  const actionButtons = document.querySelectorAll(
    ".primary-btn, .secondary-btn, .cta-btn",
  );

  actionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      this.classList.add("button-clicked");

      setTimeout(function () {
        button.classList.remove("button-clicked");
      }, 250);
    });
  });

  /* =====================================================
       MOBILE NAVBAR AUTO CLOSE
    ===================================================== */

  const navbarMenu = document.getElementById("mainMenu");

  const navbarToggler = document.querySelector(".navbar-toggler");

  if (navbarMenu && navbarToggler) {
    const menuLinks = navbarMenu.querySelectorAll("a");

    menuLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth < 992 && navbarMenu.classList.contains("show")) {
          navbarToggler.click();
        }
      });
    });
  }

  /* =====================================================
       BACK TO TOP BUTTON
    ===================================================== */

  const backToTop = document.createElement("button");

  backToTop.id = "backToTop";

  backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';

  backToTop.setAttribute("aria-label", "Back to top");

  document.body.appendChild(backToTop);

  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  /* =====================================================
       CURRENT YEAR
    ===================================================== */

  const yearElements = document.querySelectorAll(".current-year");

  yearElements.forEach(function (element) {
    element.textContent = new Date().getFullYear();
  });

  /* =====================================================
       TESTIMONIAL INTERACTION
    ===================================================== */

  const testimonials = document.querySelectorAll(".testimonial-card");

  testimonials.forEach(function (card) {
    card.addEventListener("click", function () {
      testimonials.forEach(function (item) {
        item.classList.remove("testimonial-selected");
      });

      this.classList.add("testimonial-selected");
    });
  });
});
