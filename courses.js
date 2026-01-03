// ============================================================
// 1. LOADING SCREEN
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  window.onload = () => {
    const loadingScreen = document.getElementById("loading-screen");
    const content = document.getElementById("content");
    if (!loadingScreen) return;

    loadingScreen.style.transition = "opacity 0.5s";
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
      loadingScreen.style.display = "none";
      if (content) content.style.display = "block";
    }, 500);
  };
});

// ============================================================
// 2. SCROLL-TO-TOP BUTTON
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const scrollToTopBtn = document.getElementById("scrollToTop");
  if (!scrollToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) scrollToTopBtn.classList.add("show");
    else scrollToTopBtn.classList.remove("show");
  });

  scrollToTopBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
});

// ============================================================
// 3. SLIDESHOW
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
// 4. NAVBAR DROPDOWN
// ============================================================
function toggleDropdown() {
  const dropdown = document.getElementById("projects-dropdown");
  if (!dropdown) return;
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}
document.getElementById("projects-btn")?.addEventListener("click", toggleDropdown);

// ============================================================
// 5. SMOOTH SCROLL DOWN
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
    window.scrollTo(0, startPosition + distance * progress);
    if (progress < 1) requestAnimationFrame(smoothScroll);
  }
  requestAnimationFrame(smoothScroll);
}

// ============================================================
// 6. BUY COURSE OVERLAY — UNIVERSAL VERSION
// ============================================================
function initBuyOverlay() {
  const buyOverlay = document.getElementById("buyOverlay");
  const closeBuyOverlay = document.getElementById("closeBuyOverlay");
  const buyForm = document.getElementById("buyCourseForm");
  const botToken = "7526772728:AAE8xfyUfEb-zq1KL3uE0OdYlq4wLVdoPAc";
  const chatId = "7285884938";
  const contentCard = document.querySelector(".content-card");

  if (!buyOverlay || !buyForm) return;

  console.log("✅ Buy Overlay initialized");

  // Handle buy button click
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".buy-btn");
    if (!btn) return;
    e.preventDefault();

    const card = btn.closest(".course-card");
    const titleInput = document.getElementById("buyCourseTitle");
    const optionsSelect = document.getElementById("buyCourseOptions");
    const priceEl = document.getElementById("buyDynamicPrice");

    titleInput.style.display = "block";
    optionsSelect.style.display = "none";
    optionsSelect.innerHTML = "";
    priceEl.textContent = "—";

    // Detect source
    let title = "";
    if (card)
      title = card.querySelector(".course-title")?.textContent.trim() || "";
    else
      title =
        btn.dataset.courseTitle ||
        document.querySelector(".content-card .course-title")?.textContent.trim() ||
        "Unknown Course";

    // Multi-option (selectable) courses
    const dataSource = card || contentCard;
    if (dataSource?.dataset.courseType === "select") {
      titleInput.style.display = "none";
      optionsSelect.style.display = "block";
      try {
        const opts = JSON.parse(dataSource.dataset.options || "[]");
        opts.forEach((opt) => {
          const o = document.createElement("option");
          o.value = opt.label;
          o.textContent = `${opt.label} — ${opt.price} DZD`;
          o.dataset.price = opt.price;
          optionsSelect.appendChild(o);
        });
        if (opts.length > 0) priceEl.textContent = `${opts[0].price} DZD`;
        optionsSelect.addEventListener("change", (e) => {
          const selected = e.target.selectedOptions[0];
          priceEl.textContent = selected.dataset.price + " DZD";
        });
      } catch (err) {
        console.error("Invalid data-options JSON", err);
      }
    } else {
      titleInput.value = title;
      priceEl.textContent =
        card?.querySelector(".price-new")?.textContent ||
        document.querySelector("#newPrice")?.textContent ||
        "—";
    }

    buyForm.style.display = "block";
    buyOverlay.querySelector(".buy-thank-you")?.style.setProperty("display", "none");
    buyOverlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  // Close overlay
  closeBuyOverlay?.addEventListener("click", () => {
    buyOverlay.style.display = "none";
    document.body.style.overflow = "";
  });
  buyOverlay.addEventListener("click", (e) => {
    if (e.target === buyOverlay) {
      buyOverlay.style.display = "none";
      document.body.style.overflow = "";
    }
  });

  // Submit form
  buyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("buyName").value.trim();
    const phone = document.getElementById("buyPhone").value.trim();
    const city = document.getElementById("buyCity").value.trim();
    const type = document.getElementById("buyCourseType").value;
    const message = document.getElementById("buyMessage").value.trim();
    const course =
      document.getElementById("buyCourseOptions").offsetParent !== null
        ? document.getElementById("buyCourseOptions").value
        : document.getElementById("buyCourseTitle").value;
    const price = document.getElementById("buyDynamicPrice").textContent.trim();

    // Validation
    let valid = true;
    document.querySelectorAll(".buy-error-message").forEach((el) => (el.style.display = "none"));
    if (!name) {
      document.querySelector("#buyName + .buy-error-message").style.display = "block";
      valid = false;
    }
    if (!phone) {
      document.querySelector("#buyPhone + .buy-error-message").style.display = "block";
      valid = false;
    }
    if (!city) {
      document.querySelector("#buyCity + .buy-error-message").style.display = "block";
      valid = false;
    }
    if (!type) {
      document.querySelector("#buyCourseType + .buy-error-message").style.display = "block";
      valid = false;
    }
    if (!valid) return;

    const msg = `*New Course Purchase:*\n📘 Course: ${course}\n💰 Price: ${price}\n🎓 Type: ${type}\n👤 Name: ${name}\n📞 Phone: ${phone}\n📍 City: ${city}\n📝 Message: ${message || "None"}`;
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "Markdown" }),
      });
      if (res.ok) {
        buyForm.style.display = "none";
        buyOverlay.querySelector(".buy-thank-you").style.display = "block";
      } else alert("Error sending message. Try again later.");
    } catch (err) {
      alert("Connection error. Please check your internet.");
      console.error(err);
    }
  });
}

window.addEventListener("load", () => {
  setTimeout(() => {
    console.log("🚀 Initializing unified Buy Overlay...");
    initBuyOverlay();
  }, 800);
});

// ============================================================
// 7. COURSE CARD CLICK NAVIGATION
// ============================================================
document.addEventListener("click", (e) => {
  const buyButton = e.target.closest(".buy-btn");
  if (buyButton) return;
  const card = e.target.closest(".course-card");
  if (card?.dataset.link) window.location.href = card.dataset.link;
});

// ============================================================
// 8. COURSE PAGE — YOUTUBE EMBED
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const holder = document.getElementById("video-embed");
  if (!holder) return;
  const id = holder.dataset.youtubeId;
  if (!id || id === "YOUTUBE_VIDEO_ID") {
    holder.innerHTML = `<div style="position:absolute;inset:0;display:grid;place-items:center;color:#fff;text-align:center;">
      <p>Replace <strong>data-youtube-id</strong> with your YouTube video ID.</p></div>`;
    return;
  }
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${id}?rel=0&showinfo=0`;
  iframe.allowFullscreen = true;
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  holder.appendChild(iframe);
});

// ============================================================
// 9. COLLAPSIBLE CHAPTERS
// ============================================================
function initCourseChapters() {
  document.querySelectorAll(".chapter.collapsible").forEach((chapter) => {
    const index = chapter.dataset.index;
    const list = document.getElementById(`episodes-${index}`);
    if (!list) return;
    chapter.addEventListener("click", () => {
      const isOpen = chapter.getAttribute("aria-expanded") === "true";
      chapter.setAttribute("aria-expanded", !isOpen);
      list.classList.toggle("open", !isOpen);
      list.setAttribute("aria-hidden", isOpen);
    });
  });
}
window.addEventListener("load", initCourseChapters);

// ============================================================
// 10. STICKY BUY BAR VISIBILITY
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const stickyBar = document.querySelector(".sticky-buy-bar");
  const sidebarBuy = document.querySelector(".sidebar .buy-btn");
  if (!stickyBar || !sidebarBuy) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        stickyBar.classList.toggle("hide-sticky", entry.isIntersecting);
      });
    },
    { threshold: 0.2 }
  );
  observer.observe(sidebarBuy);

  document.getElementById("stickyBuyBtn")?.addEventListener("click", () => sidebarBuy.click());
});

// ============================================================
// 11. COURSE PAGE FILTER, SEARCH & CHIP TOGGLE
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");
  const grid = document.getElementById("coursesGridA");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".course-card"));
  const selectedSoftwares = new Set();

  function matches(card, q) {
    if (!q) return true;
    q = q.toLowerCase();
    const title = card.querySelector(".course-title")?.textContent.toLowerCase() || "";
    const desc = card.querySelector(".course-desc")?.textContent.toLowerCase() || "";
    return title.includes(q) || desc.includes(q);
  }

  function matchesSoftware(card) {
    if (selectedSoftwares.size === 0) return true;
    const tags = (card.dataset.software || "").split(",").map((s) => s.trim().toLowerCase());
    return Array.from(selectedSoftwares).some((s) => tags.includes(s));
  }

  function applyFilters() {
    const q = searchInput?.value || "";
    cards.forEach((card) => {
      card.style.display = matches(card, q) && matchesSoftware(card) ? "" : "none";
    });
  }

  searchInput?.addEventListener("input", applyFilters);
  document.querySelectorAll(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      const sof = chip.dataset.sof.toLowerCase();
      if (selectedSoftwares.has(sof)) {
        selectedSoftwares.delete(sof);
        chip.classList.remove("active");
      } else {
        selectedSoftwares.add(sof);
        chip.classList.add("active");
      }
      applyFilters();
    })
  );

  applyFilters();
});
