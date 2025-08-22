     // Set current year
      document.getElementById("year").textContent = new Date().getFullYear();

      // Mobile menu functionality
      const body = document.body;
      const hamburger = document.getElementById("hamburger");
      const offcanvas = document.getElementById("offcanvas");
      const menuOverlay = document.getElementById("menu-overlay");

      function closeMenu() {
        body.classList.remove("menu-open");
        hamburger.setAttribute("aria-expanded", "false");
        offcanvas.setAttribute("aria-hidden", "true");
      }

      function openMenu() {
        body.classList.add("menu-open");
        hamburger.setAttribute("aria-expanded", "true");
        offcanvas.setAttribute("aria-hidden", "false");
      }

      hamburger.addEventListener("click", () => {
        const isOpen = body.classList.contains("menu-open");
        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      // Close menu when clicking overlay
      menuOverlay.addEventListener("click", closeMenu);

      // Close menu when clicking navigation links
      offcanvas.addEventListener("click", (e) => {
        if (
          e.target.classList.contains("navlink") ||
          e.target.classList.contains("button")
        ) {
          closeMenu();
        }
      });

      // Close menu on escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && body.classList.contains("menu-open")) {
          closeMenu();
        }
      });

      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          const href = this.getAttribute("href");
          if (!href || href === "#") return;

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();

            // Close mobile menu if open
            if (body.classList.contains("menu-open")) {
              closeMenu();
            }

            // Smooth scroll to target
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      });

      // Header scroll effect
      let lastScrollY = window.scrollY;
      const header = document.querySelector(".site-header");

      window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
          header.style.background = "rgba(249, 246, 238, 0.98)";
          header.style.boxShadow = "0 4px 20px rgba(23, 53, 66, 0.1)";
        } else {
          header.style.background = "rgba(249, 246, 238, 0.95)";
          header.style.boxShadow = "none";
        }

        lastScrollY = currentScrollY;
      });

      // Form handling with enhanced validation
      const form = document.getElementById("consult-form");
      const statusEl = document.getElementById("form-status");

      function showStatus(message, type = "info") {
        statusEl.textContent = message;
        statusEl.className = `status ${type}`;

        if (type === "success") {
          statusEl.style.color = "var(--amber)";
        } else if (type === "error") {
          statusEl.style.color = "#e74c3c";
        } else {
          statusEl.style.color = "var(--slate)";
        }
      }

      function validateForm(formData) {
        const name = formData.get("name").trim();
        const phone = formData.get("phone").trim();
        const email = formData.get("email").trim();

        if (!name) {
          return "Please enter your full name";
        }

        if (!phone) {
          return "Please enter your phone number";
        }

        if (!email) {
          return "Please enter your email address";
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return "Please enter a valid email address";
        }

        return null;
      }

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const validationError = validateForm(formData);

        if (validationError) {
          showStatus(validationError, "error");
          return;
        }

        showStatus("Submitting your consultation request...", "info");

        try {
          // Simulate form submission (replace with actual endpoint)
          await new Promise((resolve) => setTimeout(resolve, 1500));

          showStatus(
            "Success! We'll contact you within 24 hours to schedule your free consultation.",
            "success"
          );
          form.reset();

          // Scroll to status message
          statusEl.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch (error) {
          showStatus(
            "Something went wrong. Please try again or call us directly at (501) 555-1234.",
            "error"
          );
        }
      });

      // Enhanced form interactions
      const inputs = form.querySelectorAll("input, select, textarea");
      inputs.forEach((input) => {
        input.addEventListener("focus", () => {
          input.style.transform = "scale(1.02)";
          input.style.boxShadow = "0 4px 12px rgba(212, 148, 61, 0.15)";
        });

        input.addEventListener("blur", () => {
          input.style.transform = "scale(1)";
          input.style.boxShadow = "none";
        });
      });

      // Intersection Observer for animation on scroll
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      }, observerOptions);

      // Observe cards for scroll animations
      document.querySelectorAll(".card").forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(card);
      });

      // Add loading state to buttons
      document.querySelectorAll(".button").forEach((button) => {
        button.addEventListener("click", function (e) {
          if (this.type === "submit") return; // Let form handle submit buttons

          this.style.transform = "scale(0.98)";
          setTimeout(() => {
            this.style.transform = "";
          }, 150);
        });
      });

      // Preload critical resources
      const criticalImages = [
        // Add any critical images here
      ];

      criticalImages.forEach((src) => {
        const img = new Image();
        img.src = src;
      });

      // Performance: Reduce motion for users who prefer it
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.documentElement.style.setProperty("scroll-behavior", "auto");
        document.querySelectorAll("*").forEach((el) => {
          el.style.animationDuration = "0.01ms !important";
          el.style.animationIterationCount = "1 !important";
          el.style.transitionDuration = "0.01ms !important";
        });
      }
      // Form handling
      document
        .getElementById("consultation-form")
        .addEventListener("submit", async function (e) {
          e.preventDefault();

          const submitBtn = document.getElementById("submitBtn");
          const formStatus = document.getElementById("formStatus");
          const originalText = submitBtn.textContent;

          // Show loading state
          submitBtn.disabled = true;
          submitBtn.textContent = "Submitting...";
          formStatus.style.display = "none";

          // Collect form data
          const formData = new FormData(this);
          const services = [];
          formData
            .getAll("services")
            .forEach((service) => services.push(service));

          const data = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            city: formData.get("city"),
            zipCode: formData.get("zipCode"),
            preferredHub: formData.get("preferredHub"),
            services: services,
            goals: formData.get("goals"),
          };

          try {
            // Simulate API call (replace with your actual endpoint)
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Success
            formStatus.textContent =
              "Success! We'll contact you within 24 hours to schedule your free consultation.";
            formStatus.className = "form-status success";
            formStatus.style.display = "block";

            // Reset form
            this.reset();

            // Scroll to status
            formStatus.scrollIntoView({ behavior: "smooth", block: "center" });
          } catch (error) {
            // Error
            formStatus.textContent =
              "Something went wrong. Please try again or call us directly at (501) 555-1234.";
            formStatus.className = "form-status error";
            formStatus.style.display = "block";
          } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        });

      // Form field interactions
      document
        .querySelectorAll(".form-input, .form-select, .form-textarea")
        .forEach((field) => {
          field.addEventListener("focus", function () {
            this.parentElement.style.transform = "translateY(-2px)";
          });

          field.addEventListener("blur", function () {
            this.parentElement.style.transform = "translateY(0)";
          });
        });

      // Checkbox interactions
      document.querySelectorAll(".checkbox-item").forEach((item) => {
        item.addEventListener("click", function (e) {
          if (e.target.type !== "checkbox") {
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
          }
        });
      });

      // Auto-format phone number
      document.getElementById("phone").addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length >= 6) {
          value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(
            6,
            10
          )}`;
        } else if (value.length >= 3) {
          value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        e.target.value = value;
      });
    
