const WHATSAPP_NUMBER = "917500551110";

const programs = {
  funds: {
    title: "Mutual Fund Solutions",
    body: "Explore mutual fund options and relevant scheme information, subject to authorised services. Smart Alpha is an AMFI registered mutual fund distributor, ARN-142487. Scheme documents, scope and any fees are explained before you proceed. Mutual fund in investment are subject to sentiment risk. Mutual fund investments are subject to market risks."
  },
  workshops: {
    title: "Corporate Workshops",
    body: "Educational sessions for companies and employees covering budgeting, saving, investment fundamentals, risk awareness and financial goals. A workshop can be online or in person, and is tailored to the organisation."
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

document.querySelector("#detail-close").addEventListener("click", () => detail.close());
document.querySelector("#detail-cta").addEventListener("click", () => {
  const program = detail.dataset.program || "";
  detail.close();
  document.querySelectorAll('input[name="program"]').forEach((input) => {
    input.value = program;
  });
  showWho(program === "funds" || program === "review" ? "person" : "company");
  document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
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
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "")) message = "Enter a valid email.";
    else if (phone.length < 8 || phone.length > 14) message = "Enter a valid phone number.";
    error.textContent = message;
    if (message) return;
    const saved = JSON.parse(localStorage.getItem("smartalpha-leads") || "[]");
    saved.push({ ...data, phone, at: new Date().toISOString() });
    localStorage.setItem("smartalpha-leads", JSON.stringify(saved));
    const lines = Object.entries(data)
      .filter(([, value]) => String(value).trim())
      .map(([key, value]) => `${key}: ${value}`);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Smart Alpha enquiry\n${lines.join("\n")}`)}`;
    const fallback = success.querySelector("a");
    if (fallback) fallback.href = url;
    window.open(url, "_blank", "noopener");
    form.classList.add("hide");
    success.classList.add("show");
  });
});

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(`#${button.dataset.open}`).scrollIntoView({ behavior: "smooth" });
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
  button.addEventListener("click", () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank", "noopener");
  });
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
