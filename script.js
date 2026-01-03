// ============================================================
// LOADING SCREEN
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  window.onload = () => {
    const loadingScreen = document.getElementById("loading-screen");
    const content = document.getElementById("content");

    loadingScreen.style.transition = "opacity 0.5s";
    loadingScreen.style.opacity = "0";

    setTimeout(() => {
      loadingScreen.style.display = "none";
      if (content) content.style.display = "block";
    }, 500);
  };
});

// ============================================================
// PROJECT ORDER OVERLAY
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const orderButton = document.getElementById("projects");
  const orderOverlay = document.getElementById("orderOverlay");
  const closeOverlay = document.getElementById("closeOverlay");

  if (orderButton && orderOverlay && closeOverlay) {
    orderButton.addEventListener("click", () => {
      orderOverlay.style.display = "flex";
    });

    closeOverlay.addEventListener("click", () => {
      orderOverlay.style.display = "none";
    });

    orderOverlay.addEventListener("click", (e) => {
      if (e.target === orderOverlay) orderOverlay.style.display = "none";
    });
  }
});

// ============================================================
// SCROLL-TO-TOP BUTTON
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const scrollToTopBtn = document.getElementById("scrollToTop");

  if (!scrollToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

// ============================================================
// TELEGRAM FORM SUBMISSIONS
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  function handleFormSubmission(formId, botToken, chatId, type) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const fullName = form.querySelector("#fullName")?.value;
      const phoneNumber = form.querySelector("#phoneNumber")?.value;

      let isValid = true;
      const errorMessages = form.querySelectorAll(".error-message");
      errorMessages.forEach((msg) => (msg.style.display = "none"));

      if (!fullName) {
        form.querySelector("#fullName + .error-message").style.display = "block";
        isValid = false;
      }
      if (!phoneNumber) {
        form.querySelector("#phoneNumber + .error-message").style.display = "block";
        isValid = false;
      }

      let message = `*New Submission:*\n- Full Name: ${fullName}\n- Phone Number: ${phoneNumber}`;

      if (type === "order") {
        const city = form.querySelector("#city")?.value;
        const surface = form.querySelector("#surface")?.value;
        if (!city) {
          form.querySelector("#city + .error-message").style.display = "block";
          isValid = false;
        }
        message += `\n- City: ${city}\n- Surface: ${surface || "Not provided"}`;
      } else if (type === "professional") {
        const profession = form.querySelector("#profession")?.value;
        if (!profession) {
          form.querySelector("#profession + .error-message").style.display = "block";
          isValid = false;
        }
        message += `\n- Profession: ${profession}`;
      }

      if (!isValid) return;

      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      })
        .then((response) => {
          if (response.ok) {
            const formWrapper = form.closest(".form-wrapper");
            formWrapper.style.height = `${formWrapper.offsetHeight}px`;
            form.style.display = "none";
            formWrapper.querySelector(".thank-you-message").style.display = "block";
          } else {
            alert("An error occurred. Please try again later.");
          }
        })
        .catch(() => {
          alert("An error occurred. Please check your internet connection.");
        });
    });
  }

  const botToken = "7526772728:AAE8xfyUfEb-zq1KL3uE0OdYlq4wLVdoPAc";
  const chatId = "7285884938";

  handleFormSubmission("orderForm", botToken, chatId, "order");
  handleFormSubmission("professionalForm", botToken, chatId, "professional");
});

// ============================================================
// SLIDESHOW
// ============================================================
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showSlides() {
  slides.forEach((slide) => slide.classList.remove("active"));
  if (slides.length > 0) {
    slides[currentSlide].classList.add("active");
    currentSlide = (currentSlide + 1) % slides.length;
  }
}
setInterval(showSlides, 3000);
window.addEventListener("load", showSlides);


// ============================================================
// NAVBAR DROPDOWN TOGGLE
// ============================================================
function toggleDropdown() {
  const dropdown = document.getElementById("projects-dropdown");
  if (!dropdown) return;

  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

const projectsBtn = document.getElementById("projects-btn");
if (projectsBtn) {
  projectsBtn.addEventListener("click", toggleDropdown);
}

// Force column layout for small screens
if (window.innerWidth <= 768) {
  const navbar = document.querySelector(".navbar");
  if (navbar) navbar.style.flexDirection = "column";
}

// ============================================================
// SMOOTH SCROLL DOWN FUNCTION
// ============================================================
function scrollDown() {
  const scrollTarget = window.innerHeight;
  const startPosition = window.scrollY;
  const distance = scrollTarget - startPosition;
  const duration = 900;
  const startTime = performance.now();

  function smoothScroll(currentTime) {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const newPosition = startPosition + distance * progress;
    window.scrollTo(0, newPosition);
    if (progress < 1) requestAnimationFrame(smoothScroll);
  }

  requestAnimationFrame(smoothScroll);
}

// ============================================================
// COURSE BUY BUTTON DEMO ALERT
// ============================================================
  // Buy button demo
  // document.body.addEventListener("click", (e) => {
  //   const btn = e.target.closest(".buy-btn");
  //   if (!btn) return;
  //   e.preventDefault();
  //   const card = btn.closest(".course-card");
  //   const title = card?.querySelector(".course-title")?.textContent || "Course";
  //   alert(`Buying: ${title}`);
  // });

// ============================================================
// GALLERY SLIDESHOW
// ============================================================

  const gallerySlides = document.querySelectorAll(".gallery-slide");
  const dots = document.querySelectorAll(".gallery-dots .dot");
  const prevBtn = document.querySelector(".gallery-prev");
  const nextBtn = document.querySelector(".gallery-next");
  const caption = document.querySelector(".gallery-caption");
  let currentGalleryIndex = 0;

  function showGallerySlide(index) {
    gallerySlides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
      dots[i].classList.toggle("active", i === index);
    });
    caption.textContent = gallerySlides[index].dataset.caption || "";
  }

  function nextGallerySlide() {
    currentGalleryIndex = (currentGalleryIndex + 1) % gallerySlides.length;
    showGallerySlide(currentGalleryIndex);
  }

  function prevGallerySlide() {
    currentGalleryIndex =
      (currentGalleryIndex - 1 + gallerySlides.length) % gallerySlides.length;
    showGallerySlide(currentGalleryIndex);
  }

  nextBtn.addEventListener("click", nextGallerySlide);
  prevBtn.addEventListener("click", prevGallerySlide);

  dots.forEach((dot, i) =>
    dot.addEventListener("click", () => {
      currentGalleryIndex = i;
      showGallerySlide(i);
    })
  );

  // Initialize caption and auto-slide
  showGallerySlide(0);
  setInterval(nextGallerySlide, 5000);

// ====== HAMBURGER TOGGLE ======
const hamburger = document.getElementById("hamburger");
const academyLinks = document.getElementById("academyLinks");

if (hamburger && academyLinks) {
  hamburger.addEventListener("click", () => {
    academyLinks.classList.toggle("show-links");
  });
}

// ====== DROPDOWN (Courses & Training) ======
const academyCoursesBtn = document.getElementById("academy-courses-btn");
const academyDropdown = document.getElementById("academy-dropdown");

if (academyCoursesBtn && academyDropdown) {
  academyCoursesBtn.addEventListener("click", (e) => {
    // Only trigger dropdown on mobile
    if (window.innerWidth <= 960) {
      e.preventDefault();
      e.stopPropagation();
      academyDropdown.classList.toggle("show-dropdown");
    }
  });

  // Close dropdown if user clicks outside
  document.addEventListener("click", (e) => {
    if (
      !academyDropdown.contains(e.target) &&
      !academyCoursesBtn.contains(e.target)
    ) {
      academyDropdown.classList.remove("show-dropdown");
    }
  });
}

