const WHATSAPP_NUMBER = "917500551110";

const programs = {
  funds: {
    title: "Mutual Fund Solutions",
    body: "Explore mutual fund solutions, SIP, SIF, PMS, AIF and relevant scheme information, subject to authorised services. Smart Alpha is an AMFI registered mutual fund distributor, ARN-142487. Scheme documents, scope and any fees are explained before you proceed. Mutual fund in investment are subject to sentiment risk. Mutual fund investments are subject to market risks."
  },
  workshops: {
    title: "Corporate Workshops",
    body: "In-person sessions for companies and employees covering budgeting, saving, investment fundamentals, risk awareness and financial goals. Sachin comes to your office. The workshop is tailored to the organisation."
  },
  review: {
    title: "Investment Support & Portfolio Review",
    body: "Tell us what you want to understand. Smart Alpha will describe the review, monitoring or distribution service it is authorised to provide, including the scope and any fees, before you decide on a next step."
  }
};

const topics = {
  "Personal budgeting and saving habits": "A workshop topic on personal budgeting and saving habits, so employees can see where money goes before they talk about investing.",
  "Understanding mutual funds and SIPs": "A plain-language session on how mutual funds and SIPs work. It is education, not a product recommendation.",
  "Basics of risk and return": "The basics of risk and return, so people can read a scheme or a market move without treating a number as a promise.",
  "Financial goal-setting and investment horizons": "How a financial goal and a time horizon change the kind of decision a person is making.",
  "Investor behaviour and common financial mistakes": "Investor behaviour and the mistakes that show up when decisions are made in a hurry.",
  "Understanding market volatility": "What market volatility is, and why a move in the market is not the same thing as a plan."
};

const stories = [
  "Workshops are designed to make financial concepts easier to understand, including for people who do not work in finance.",
  "The point of the session is informed decision-making: people should understand their options before they act.",
  "Employees get time to ask questions. The session is a learning room, not a one-way presentation.",
  "The experience is tailored to the organisation, the audience, the format and the topics you choose."
];

const burger = document.querySelector("#nav-burger");
const menu = document.querySelector("#nav-menu");
const detail = document.querySelector("#detail");
const detailTitle = document.querySelector("#detail-title");
const detailBody = document.querySelector("#detail-body");

function closeMenu() {
  menu.classList.remove("open");
  burger.setAttribute("aria-expanded", "false");
}

burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

function openDetail(title, body, program) {
  detailTitle.textContent = title;
  detailBody.textContent = body;
  detail.dataset.program = program || "";
  if (typeof detail.showModal === "function") detail.showModal();
  else detail.setAttribute("open", "");
}

const waCopy = {
  funds: "Hi Smart Alpha, I want to enquire about Mutual Fund Solutions.",
  workshops: "Hi Smart Alpha, I want to organise a corporate workshop.",
  review: "Hi Smart Alpha, I want to discuss a portfolio review.",
  contact: "Hi Smart Alpha, I want to book a workshop."
};

function openWhatsApp(text) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  return url;
}

document.querySelector("#detail-close").addEventListener("click", () => detail.close());
document.querySelector("#detail-cta").addEventListener("click", () => {
  const program = detail.dataset.program || "contact";
  detail.close();
  openWhatsApp(waCopy[program] || waCopy.contact);
});

document.querySelectorAll("[data-program]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = programs[button.dataset.program];
    openDetail(item.title, item.body, button.dataset.program);
  });
});

document.querySelectorAll("[data-course]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const name = button.dataset.course;
    openDetail(name, topics[name] || name, "workshops");
  });
});

function showWho(who) {
  document.querySelectorAll("[data-who]").forEach((button) => {
    button.classList.toggle("on", button.dataset.who === who);
  });
  document.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.panel !== who;
  });
}

document.querySelectorAll("[data-who]").forEach((button) => {
  button.addEventListener("click", () => showWho(button.dataset.who));
});

document.querySelectorAll(".note button, #faq-list button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    const open = item.classList.toggle("open");
    button.querySelector("span").textContent = open ? "–" : "+";
  });
});

const faqSearch = document.querySelector("#faq-search");
if (faqSearch) {
  const faqItems = [...document.querySelectorAll("#faq-list .faq-item")];
  const faqEmpty = document.querySelector("#faq-empty");
  faqSearch.addEventListener("input", () => {
    const query = faqSearch.value.trim().toLowerCase();
    let shown = 0;
    faqItems.forEach((item) => {
      const hit = item.textContent.toLowerCase().includes(query);
      item.style.display = hit ? "" : "none";
      if (hit) shown += 1;
    });
    if (faqEmpty) faqEmpty.style.display = shown ? "none" : "block";
  });
}

document.querySelectorAll(".lead-form").forEach((form) => {
  const error = form.querySelector(".form-error");
  const success = form.nextElementSibling;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const phone = String(data.phone || "").replace(/\D/g, "");
    let message = "";
    if (!form.checkValidity()) message = "Fill in the required fields.";
    else if (String(data.email || "").trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) message = "Enter a valid email.";
    else if (phone.length < 8 || phone.length > 14) message = "Enter a valid phone number.";
    error.textContent = message;
    if (message) return;
    const saved = JSON.parse(localStorage.getItem("smartalpha-leads") || "[]");
    saved.push({ ...data, phone, at: new Date().toISOString() });
    localStorage.setItem("smartalpha-leads", JSON.stringify(saved));
    const labels = {
      enquiry: "Enquiry",
      company: "Company",
      name: "Name",
      email: "Email",
      phone: "Phone",
      audience: "Who will attend",
      date: "Preferred date",
      format: "Format",
      topics: "Topics",
      interest: "Interest",
      program: "Service"
    };
    const services = { funds: "Mutual Fund Solutions", workshops: "Corporate Workshops", review: "Portfolio Review" };
    const lines = ["Hi Smart Alpha,"];
    Object.entries(data).forEach(([key, value]) => {
      const text = String(value || "").trim();
      if (!text || !labels[key]) return;
      lines.push(`${labels[key]}: ${key === "program" ? (services[text] || text) : text}`);
    });
    const url = openWhatsApp(lines.join("\n"));
    const fallback = success.querySelector("a");
    if (fallback) fallback.href = url;
    form.classList.add("hide");
    success.classList.add("show");
  });
});

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.open === "contact") openWhatsApp(waCopy.contact);
    else document.querySelector(`#${button.dataset.open}`).scrollIntoView({ behavior: "smooth" });
  });
});

const sticky = document.querySelector("#sticky-bar");
const toTop = document.querySelector("#to-top");
function onScroll() {
  const show = window.scrollY > 700;
  sticky.classList.toggle("show", show);
  toTop.classList.toggle("show", show);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.querySelectorAll("[data-wa]").forEach((button) => {
  button.addEventListener("click", () => openWhatsApp("Hi Smart Alpha, I would like to talk."));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const galleryTrack = document.querySelector("#gallery-track");
if (galleryTrack) {
  const slides = [...galleryTrack.children];
  const dots = document.querySelector("#gallery-dots");
  const stage = galleryTrack.parentElement;
  let index = 0;
  let timer;

  slides.forEach((slide, i) => {
    const img = slide.querySelector("img");
    if (img) slide.style.setProperty("--bg", `url("${img.src}")`);
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Photo ${i + 1}`);
    dot.addEventListener("click", () => go(i));
    dots.appendChild(dot);
  });

  function go(i) {
    index = (i + slides.length) % slides.length;
    galleryTrack.style.transform = `translateX(-${index * 100}%)`;
    dots.querySelectorAll("button").forEach((dot, n) => dot.classList.toggle("on", n === index));
    restart();
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(index + 1), 4000);
  }

  document.querySelector("#gallery-prev").addEventListener("click", () => go(index - 1));
  document.querySelector("#gallery-next").addEventListener("click", () => go(index + 1));
  stage.addEventListener("mouseenter", () => clearInterval(timer));
  stage.addEventListener("mouseleave", restart);

  let startX = 0;
  stage.addEventListener("pointerdown", (event) => { startX = event.clientX; });
  stage.addEventListener("pointerup", (event) => {
    const dx = event.clientX - startX;
    if (Math.abs(dx) > 40) go(dx < 0 ? index + 1 : index - 1);
  });

  go(0);
}

/* =========================================================
   PREDICTION CHATS CAROUSEL & LIGHTBOX
   ========================================================= */
(function initPredictionChats() {
  const slider = document.querySelector("#chats-slider");
  const prevBtn = document.querySelector("#chat-prev");
  const nextBtn = document.querySelector("#chat-next");
  const cards = [...document.querySelectorAll(".chat-card")];
  const lightbox = document.querySelector("#chat-lightbox");
  const lightboxImg = document.querySelector("#lightbox-img");
  const lightboxTag = document.querySelector("#lightbox-tag");
  const lightboxCounter = document.querySelector("#lightbox-counter");
  const lightboxDirect = document.querySelector("#lightbox-direct");
  const lightboxClose = document.querySelector("#lightbox-close");
  const lightboxBackdrop = document.querySelector("#lightbox-backdrop");
  const lightboxPrev = document.querySelector("#lightbox-prev");
  const lightboxNext = document.querySelector("#lightbox-next");

  if (!slider || !cards.length) return;

  const chatData = cards.map((card, i) => ({
    src: card.dataset.src,
    title: card.dataset.title || `Market Prediction ${i + 1}`
  }));

  // Slider navigation
  function scrollSlider(direction) {
    const cardWidth = cards[0] ? cards[0].offsetWidth + 20 : 270;
    const scrollAmount = cardWidth * (window.innerWidth < 680 ? 1 : 2);
    slider.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
  }

  if (prevBtn) prevBtn.addEventListener("click", () => scrollSlider(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => scrollSlider(1));

  // Desktop click & drag scroll
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let dragDistance = 0;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    dragDistance = 0;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    slider.classList.add("is-dragging");
  });

  window.addEventListener("mouseup", () => {
    if (!isDown) return;
    isDown = false;
    slider.classList.remove("is-dragging");
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX);
    dragDistance = Math.abs(walk);
    slider.scrollLeft = scrollLeft - walk;
  });

  // Lightbox
  let currentIdx = 0;

  function updateLightbox(idx) {
    currentIdx = (idx + chatData.length) % chatData.length;
    const item = chatData[currentIdx];
    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.title;
    }
    if (lightboxTag) lightboxTag.textContent = `Call #${String(currentIdx + 1).padStart(2, "0")}`;
    if (lightboxCounter) lightboxCounter.textContent = `${currentIdx + 1} / ${chatData.length}`;
    if (lightboxDirect) lightboxDirect.href = item.src;
  }

  function openLightbox(idx) {
    if (!lightbox) return;
    updateLightbox(idx);
    if (typeof lightbox.showModal === "function") {
      try { lightbox.showModal(); } catch (err) { lightbox.setAttribute("open", ""); }
    } else {
      lightbox.setAttribute("open", "");
    }
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    if (typeof lightbox.close === "function" && lightbox.open) {
      lightbox.close();
    } else {
      lightbox.removeAttribute("open");
    }
    document.body.style.overflow = "";
  }

  cards.forEach((card, i) => {
    card.addEventListener("click", () => {
      // Don't trigger lightbox if user was dragging
      if (dragDistance > 6) return;
      openLightbox(i);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); updateLightbox(currentIdx - 1); });
  if (lightboxNext) lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); updateLightbox(currentIdx + 1); });

  // Lightbox touch swipe
  let lbTouchStartX = 0;
  if (lightbox) {
    lightbox.addEventListener("touchstart", (e) => {
      lbTouchStartX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener("touchend", (e) => {
      const diffX = e.changedTouches[0].clientX - lbTouchStartX;
      if (Math.abs(diffX) > 45) {
        updateLightbox(diffX < 0 ? currentIdx + 1 : currentIdx - 1);
      }
    }, { passive: true });
  }

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.open) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") updateLightbox(currentIdx - 1);
    else if (e.key === "ArrowRight") updateLightbox(currentIdx + 1);
  });
})();

/* =========================================================
   PRESS ARTICLE SWITCHER & LIGHTBOX ZOOM
   ========================================================= */
(function initPressSwitcher() {
  const tabs = [...document.querySelectorAll("[data-press-tab]")];
  const slides = [...document.querySelectorAll("[data-press-slide]")];
  const prevBtn = document.querySelector("#press-prev");
  const nextBtn = document.querySelector("#press-next");
  const zoomWraps = [...document.querySelectorAll("[data-press-zoom]")];
  let current = 0;

  if (!tabs.length || !slides.length) return;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    tabs.forEach((tab, i) => {
      const active = i === current;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    slides.forEach((slide, i) => {
      slide.style.display = i === current ? "block" : "none";
      slide.classList.toggle("active", i === current);
    });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => showSlide(i));
  });

  if (prevBtn) prevBtn.addEventListener("click", () => showSlide(current - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => showSlide(current + 1));

  // Lightbox zoom for press images
  const lightbox = document.querySelector("#chat-lightbox");
  const lightboxImg = document.querySelector("#lightbox-img");
  const lightboxTag = document.querySelector("#lightbox-tag");
  const lightboxCounter = document.querySelector("#lightbox-counter");
  const lightboxDirect = document.querySelector("#lightbox-direct");

  zoomWraps.forEach((wrap, i) => {
    const trigger = () => {
      if (!lightbox) return;
      const src = wrap.dataset.pressZoom;
      const title = wrap.dataset.pressTitle || "Hindustan Article";
      if (lightboxImg) {
        lightboxImg.src = src;
        lightboxImg.alt = title;
      }
      if (lightboxTag) lightboxTag.textContent = "Hindustan Press";
      if (lightboxCounter) lightboxCounter.textContent = `${i + 1} / ${zoomWraps.length}`;
      if (lightboxDirect) lightboxDirect.href = src;
      if (typeof lightbox.showModal === "function") {
        try { lightbox.showModal(); } catch (err) { lightbox.setAttribute("open", ""); }
      } else {
        lightbox.setAttribute("open", "");
      }
      document.body.style.overflow = "hidden";
    };

    wrap.addEventListener("click", trigger);
    wrap.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        trigger();
      }
    });
  });
})();
