/* ==========================================================
   GLOBAL INITIALIZATION
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initLoadingScreen();
  initHeaderFooter();
  initNavbar();
  initScrollToTop();
  initSlideshow();
  initSmoothScroll();
  initBuyOverlay();
  initCourseSearch();
  initCourseCardNavigation();
  initCourseChapters();
});

/* ==========================================================
   1. LOADING SCREEN
========================================================== */

function initLoadingScreen() {
  const loader = document.getElementById("loading-screen");
  const content = document.getElementById("content");
  if (!loader) return;

  window.addEventListener("load", () => {
    loader.style.transition = "opacity 0.5s";
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
      if (content) content.style.display = "block";
    }, 500);
  });
}

/* ==========================================================
   2. HEADER & FOOTER LOADER (jQuery)
========================================================== */

function initHeaderFooter() {
  if (typeof $ === "undefined") return;

  const isInsideFolder =
    location.pathname.includes("/education/") ||
    location.pathname.includes("/projects/");

  const pathPrefix = isInsideFolder ? "../" : "";
  const isDarkPage =
    document.getElementById("darkFooter") ||
    location.pathname.includes("education");

  const headerPath = isDarkPage
    ? "elements/headerDark.html"
    : "elements/header.html";
  const footerPath = isDarkPage
    ? "elements/footerDark.html"
    : "elements/footer.html";
  const footerTarget = isDarkPage ? "#darkFooter" : "#footer";

  $("#header-container").load(pathPrefix + headerPath);
  $(footerTarget).load(pathPrefix + footerPath);
}

/* ==========================================================
   3. NAVBAR + DROPDOWNS
========================================================== */

function initNavbar() {
  document.addEventListener("click", (e) => {
    const target = e.target;

    if (target.closest("#hamburger")) {
      document.getElementById("academyLinks")?.classList.toggle("show-links");
    }

    if (target.closest("#projects-btn, #academy-courses-btn")) {
      if (window.innerWidth <= 960) {
        e.preventDefault();
        target
          .closest(".nav-item-container")
          ?.querySelector(
            ".dropdown-lge-menu, .academy-dropdown, #projects-dropdown"
          )
          ?.classList.toggle("show-dropdown");
      }
    }

    if (!target.closest(".nav-item-container, #hamburger")) {
      document
        .querySelectorAll(
          ".dropdown-lge-menu, .academy-dropdown, #projects-dropdown, #academyLinks"
        )
        .forEach((el) => el.classList.remove("show-dropdown", "show-links"));
    }
  });
}

/* ==========================================================
   4. SCROLL TO TOP
========================================================== */

function initScrollToTop() {
  const btn = document.getElementById("scrollToTop");
  if (!btn) return;

  window.addEventListener("scroll", () =>
    btn.classList.toggle("show", window.scrollY > 500)
  );

  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

/* ==========================================================
   5. SLIDESHOW
========================================================== */

function initSlideshow() {
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  let index = 0;
  setInterval(() => {
    slides.forEach((s) => s.classList.remove("active"));
    slides[index].classList.add("active");
    index = (index + 1) % slides.length;
  }, 3000);
}

/* ==========================================================
   6. SMOOTH SCROLL DOWN
========================================================== */

function initSmoothScroll() {
  window.scrollDown = function () {
    const start = scrollY;
    const target = innerHeight;
    const startTime = performance.now();
    const duration = 900;

    function animate(t) {
      const p = Math.min((t - startTime) / duration, 1);
      scrollTo(0, start + target * p);
      if (p < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  };
}

/* ==========================================================
   7. BUY COURSE OVERLAY (UNIFIED)
========================================================== */

function initBuyOverlay() {
  const overlay = document.getElementById("buyOverlay");
  const form = document.getElementById("buyCourseForm");
  if (!overlay || !form) return;

  // ⚠️ Move to backend later
  const botToken = "7526772728:AAE8xfyUfEb-zq1KL3uE0OdYlq4wLVdoPAc";
  const chatId = "7285884938";

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".buy-btn");
    if (!btn) return;

    e.preventDefault();

    const card = btn.closest(".course-card");
    const title =
      btn.dataset.courseTitle ||
      card?.querySelector(".course-title")?.textContent.trim() ||
      document.querySelector(".content-card .course-title")?.textContent.trim() ||
      "Unknown Course";

    document.getElementById("buyCourseTitle").value = title;
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  document.getElementById("closeBuyOverlay")?.addEventListener("click", close);
  overlay.addEventListener("click", (e) => e.target === overlay && close());

  function close() {
    overlay.style.display = "none";
    document.body.style.overflow = "";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: buyName.value.trim(),
      phone: buyPhone.value.trim(),
      city: buyCity.value.trim(),
      type: buyCourseType.value,
      course: buyCourseTitle.value.trim(),
      message: buyMessage.value.trim() || "None",
    };

    if (!data.name || !data.phone || !data.city || !data.type) return;

    const text = `*New Course Purchase*\n
📘 ${data.course}
🎓 ${data.type}
👤 ${data.name}
📞 ${data.phone}
📍 ${data.city}
📝 ${data.message}`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });

    form.style.display = "none";
    overlay.querySelector(".buy-thank-you").style.display = "block";
  });
}

/* ==========================================================
   8. COURSE SEARCH
========================================================== */

function initCourseSearch() {
  const search = document.getElementById("search");
  if (!search) return;

  search.addEventListener("input", () => {
    const q = search.value.toLowerCase();
    document.querySelectorAll(".course-card").forEach((card) => {
      card.style.display = card.textContent.toLowerCase().includes(q)
        ? ""
        : "none";
    });
  });
}

/* ==========================================================
   9. COURSE CARD NAVIGATION
========================================================== */

function initCourseCardNavigation() {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".buy-btn")) return;
    const card = e.target.closest(".course-card");
    if (card?.dataset.link) location.href = card.dataset.link;
  });
}

/* ==========================================================
   10. COURSE COLLAPSIBLE CHAPTERS
========================================================== */

function initCourseChapters() {
  document.addEventListener("click", (e) => {
    const chapter = e.target.closest(".chapter.collapsible");
    if (!chapter) return;

    const index = chapter.dataset.index;
    const list = document.getElementById(`episodes-${index}`);
    if (!list) return;

    const open = chapter.getAttribute("aria-expanded") === "true";

    document.querySelectorAll(".chapter.collapsible").forEach((c) => {
      c.setAttribute("aria-expanded", "false");
      c.classList.remove("open");
    });

    document.querySelectorAll(".episode-list").forEach((l) => {
      l.setAttribute("aria-hidden", "true");
      l.style.maxHeight = null;
    });

    if (!open) {
      chapter.setAttribute("aria-expanded", "true");
      chapter.classList.add("open");
      list.setAttribute("aria-hidden", "false");
      list.style.maxHeight = list.scrollHeight + "px";
    }
  });
}
/* ==========================================================
   STICKY BUY BAR (MOBILE SAFE) — OPTIMAL
========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const stickyBar = document.querySelector(".sticky-buy-bar");
  const sidebarBuy = document.querySelector(".sidebar .buy-btn");
  
  if (!stickyBar || !sidebarBuy) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      stickyBar.classList.toggle("hide-sticky", entry.isIntersecting);
    },
    { 
      threshold: 0.15,  // Slightly finer than 0.2 for smoother mobile trigger
      rootMargin: '0px' // Explicit for consistency
    }
  );
  
  observer.observe(sidebarBuy);

  document.getElementById("stickyBuyBtn")?.addEventListener("click", () => {
    sidebarBuy.click();
  });
});
