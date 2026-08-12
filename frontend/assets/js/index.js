/* =========================================================
   BUDGETING APP - INDEX PAGE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       NAVBAR - ACTIVE LINK
    ===================================================== */

  const navLinks = document.querySelectorAll(".landing-navbar .nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((item) => {
        item.classList.remove("active");
      });

      this.classList.add("active");
    });
  });

  /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");

      if (targetId === "#") {
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

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;

      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    if (currentSection === "features") {
      navLinks.forEach((link) => {
        link.classList.remove("active");
      });

      const featureLink = document.querySelector(
        '.landing-navbar a[href="#features"]',
      );

      if (featureLink) {
        featureLink.classList.add("active");
      }
    } else if (window.scrollY < 300) {
      navLinks.forEach((link) => {
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

  const counterObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach((entry) => {
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

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });
  /* =====================================================
       FEATURE CARD ANIMATION
       ===================================================== */

  const featureCards = document.querySelectorAll(".feature-card");

  const featureObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach((entry) => {
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

  featureCards.forEach((card) => {
    card.classList.add("feature-hidden");

    featureObserver.observe(card);
  });

  /* =====================================================
       TESTIMONIAL CARD ANIMATION
       ===================================================== */

  const testimonialCards = document.querySelectorAll(".testimonial-card");

  const testimonialObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach((entry) => {
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

  testimonialCards.forEach((card) => {
    card.classList.add("testimonial-hidden");

    testimonialObserver.observe(card);
  });

  /* =====================================================
       BUTTON CLICK FEEDBACK
       ===================================================== */

  const actionButtons = document.querySelectorAll(
    ".primary-btn, .secondary-btn, .cta-btn",
  );

  actionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      this.classList.add("button-clicked");

      setTimeout(() => {
        this.classList.remove("button-clicked");
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

    menuLinks.forEach((link) => {
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

  yearElements.forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  document.addEventListener("DOMContentLoaded", function () {
    /* ==========================================
       MOBILE NAVBAR AUTO CLOSE
    ========================================== */

    const menu = document.getElementById("menu");

    if (menu) {
      const links = menu.querySelectorAll(".nav-link");

      links.forEach((link) => {
        link.addEventListener("click", function () {
          if (window.innerWidth < 992) {
            const navbar = bootstrap.Collapse.getInstance(menu);

            if (navbar) {
              navbar.hide();
            }
          }
        });
      });
    }

    /* ==========================================
       SMOOTH SCROLL
    ========================================== */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", function (event) {
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

    /* ==========================================
       BUTTON CLICK EFFECT
    ========================================== */

    const buttons = document.querySelectorAll(".btn");

    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        this.classList.add("clicked");

        setTimeout(() => {
          this.classList.remove("clicked");
        }, 200);
      });
    });

    console.log("Budgeting App Index initialized");
  });

  /* ==========================================
   FEATURE CARD INTERACTION
========================================== */

  const featureCards = document.querySelectorAll(".card");

  featureCards.forEach((card) => {
    const heading = card.querySelector("h4");

    if (!heading) {
      return;
    }

    card.addEventListener("mouseenter", function () {
      this.style.cursor = "pointer";
    });

    card.addEventListener("click", function () {
      const featureName = heading.textContent.trim();

      console.log("Selected feature:", featureName);
    });
  });

  /* ==========================================
   TESTIMONIAL INTERACTION
========================================== */

  const testimonials = document.querySelectorAll(".testimonials .card");

  testimonials.forEach((card) => {
    card.addEventListener("click", function () {
      // Remove selected state from other testimonials
      testimonials.forEach((item) => {
        item.classList.remove("testimonial-selected");
      });

      // Select clicked testimonial
      this.classList.add("testimonial-selected");
    });
  });

  console.log("Budgeting App Index Page Loaded");
});
