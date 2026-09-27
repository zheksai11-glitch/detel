/* OBSIDIAN DETAILING — интерактив демо-лендинга (копия структуры шаблона Auto Detailing).
   Всю заглушку бренда и контактов менять в CONFIG. */
"use strict";

const CONFIG = {
  brand: "OBSIDIAN DETAILING",
  city: "Казань",
  phone: "+7 (843) 000-00-00",
  phoneHref: "+78430000000",
  address: "ул. Тихорецкая, 12к3",
  hours: "9:00–21:00, ежедневно",
  demo: true
};

const ICONS = {
  diamond: '<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18M9 3 7 9l5 12 5-12-2-6"/>',
  phone: '<path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a1 1 0 0 1-1 1A19 19 0 0 1 3 4a1 1 0 0 1 1-1z"/>',
  "arrow-r": '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  shield: '<path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
  layers: '<path d="m12 3 8 4-8 4-8-4z"/><path d="m4 12 8 4 8-4M4 16.5l8 4 8-4"/>',
  sparkle: '<path d="M11 3.5 12.7 8 17 9.7 12.7 11.4 11 16l-1.7-4.6L5 9.7 9.3 8z"/><path d="M18 14.5 18.9 17l2.1.9-2.1 1-.9 2-1-2-2-1 2-.9z"/>',
  whatsapp: '<path d="M4 20.5 5.4 16A8.2 8.2 0 1 1 8.6 19z"/><path d="M9 9.6c.4 2.6 2.8 5 5.4 5.4l1-1.4 2 1v1.4c-2.8.6-7.6-2.4-9-6z"/>',
  telegram: '<path d="M21 4.5 2.8 11.4l5.6 2.1L20 6.6l-8.4 8.3.4 5.4 3-3.9 5 3.7z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  star: '<path d="M12 3.6l2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z"/>'
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const svgIcon = (n, s) =>
  `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ""}</svg>`;

document.addEventListener("DOMContentLoaded", () => {
  /* --- config bindings --- */
  $$("[data-bind]").forEach((el) => {
    const v = CONFIG[el.dataset.bind];
    if (v != null) el.textContent = v;
  });
  $$('a[href^="tel:"]').forEach((a) => (a.href = "tel:" + CONFIG.phoneHref));

  /* --- icons --- */
  $$("[data-icon]").forEach((el) => {
    const rate = el.dataset.iconRate ? +el.dataset.iconRate : null;
    if (rate != null) {
      el.innerHTML = Array.from({ length: 5 }, (_, i) => {
        const on = i < rate;
        return `<span class="${on ? "on" : "off"}" aria-hidden="true"><svg viewBox="0 0 24 24" width="15" height="15" fill="${on ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">${ICONS.star}</svg></span>`;
      }).join("");
      return;
    }
    el.innerHTML = svgIcon(el.dataset.icon, +(el.dataset.iconSize || 24));
  });

  /* --- header --- */
  const hdr = $("#hdr");
  const onScrollHdr = () => hdr.classList.toggle("scr", window.scrollY > 40);
  onScrollHdr();
  window.addEventListener("scroll", onScrollHdr, { passive: true });

  const burger = $("#burger");
  const closeMenu = () => {
    document.body.classList.remove("nav-open");
    burger.setAttribute("aria-expanded", "false");
  };
  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));
    document.body.classList.toggle("nav-open", !open);
  });
  $$(".nav-l").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
      closeMenu();
      burger.focus();
    }
  });

  /* --- scrollspy --- */
  const links = $$(".nav-l");
  const byId = new Map();
  links.forEach((a) => {
    const sec = $(a.getAttribute("href"));
    if (sec) byId.set(sec, a);
  });
  if ("IntersectionObserver" in window && byId.size) {
    const spy = new IntersectionObserver(
      (es) => {
        es.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((l) => l.classList.remove("act"));
          const a = byId.get(en.target);
          if (a) a.classList.add("act");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    byId.forEach((_, sec) => spy.observe(sec));
  }

  /* --- reveal --- */
  const revs = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver(
      (es, o) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            o.unobserve(en.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revs.forEach((el) => ro.observe(el));
  } else {
    revs.forEach((el) => el.classList.add("in"));
  }

  /* --- counters --- */
  const fmt = (n) => n.toLocaleString("ru-RU");
  const counters = $$("[data-count]");
  const runCount = (el) => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = fmt(target) + suffix;
      return;
    }
    const t0 = performance.now();
    const dur = 1400;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased)) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      (es, o) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            runCount(en.target);
            o.unobserve(en.target);
          }
        }),
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );
    counters.forEach((el) => co.observe(el));
  } else counters.forEach(runCount);

  /* --- FAQ: по одному открытым --- */
  const qas = $$("details.qa");
  qas.forEach((d) =>
    d.addEventListener("toggle", () => {
      if (d.open) qas.forEach((o) => o !== d && (o.open = false));
    })
  );

  /* --- form --- */
  const form = $("#bookForm");
  const done = $("#done");
  const btn = $("#submitBtn");
  const lbl = $(".btn-lbl", btn);
  const phone = $("#f-phone");
  const dateEl = $("#f-date");

  const today = () => {
    const n = new Date();
    return [n.getFullYear(), String(n.getMonth() + 1).padStart(2, "0"), String(n.getDate()).padStart(2, "0")].join("-");
  };
  dateEl.min = today();
  dateEl.value = dateEl.min;

  const digits = (s) => s.replace(/\D/g, "");
  const maskPhone = (raw) => {
    let d = digits(raw);
    if (!d) return "";
    if (d[0] === "8") d = "7" + d.slice(1);
    if (d[0] !== "7") d = "7" + d;
    d = d.slice(0, 11);
    let out = "+7";
    if (d.length > 1) out += " (" + d.slice(1, 4);
    if (d.length >= 5) out += ") " + d.slice(4, 7);
    if (d.length >= 8) out += "-" + d.slice(7, 9);
    if (d.length >= 10) out += "-" + d.slice(9, 11);
    return out;
  };
  phone.addEventListener("input", () => {
    const d = digits(phone.value);
    phone.value = d ? maskPhone(d) : "";
  });
  phone.addEventListener("focus", () => { if (!phone.value) phone.value = "+7 ("; });

  const field = (input) => input.closest(".f");
  const errOf = (f) => f.querySelector(".f-err");
  const fail = (input, msg) => {
    const f = field(input);
    f.classList.add("bad");
    input.setAttribute("aria-invalid", "true");
    const e = errOf(f);
    if (e) e.textContent = msg;
    return true;
  };
  const clear = (input) => {
    const f = field(input);
    f.classList.remove("bad");
    input.removeAttribute("aria-invalid");
    const e = errOf(f);
    if (e) e.textContent = "";
  };
  form.addEventListener("input", (e) => {
    const t = e.target;
    if (t.matches("input,select,textarea") && field(t) && field(t).classList.contains("bad")) clear(t);
  });

  const prettyDate = (isoStr) => {
    if (!isoStr) return "в ближайший удобный день";
    const d = new Date(isoStr + "T00:00:00");
    if (isNaN(d)) return isoStr;
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  };

  const validate = () => {
    const name = $("#f-name");
    const service = $("#f-service");
    clear(name); clear(phone);
    const nameOk = name.value.trim().length >= 2;
    const digitsLen = digits(phone.value).length;
    const phoneOk = digitsLen === 11;
    if (!nameOk) fail(name, "Напишите, как к вам обращаться");
    if (!phoneOk) {
      fail(phone, digitsLen ? "Нужны все 11 цифр: +7 (999) 123-45-67" : "Без телефона не сможем перезвонить");
    }
    if (!nameOk || !phoneOk) {
      (nameOk ? phone : name).focus({ preventScroll: true });
      return false;
    }
    return { name: name.value.trim(), phone: phone.value, service: service.value };
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = validate();
    if (!data) return;

    btn.disabled = true;
    lbl.textContent = "Отправляем…";
    setTimeout(() => {
      $("#doneTxt").innerHTML =
        "<b>" + data.name + "</b>, заявка «" + data.service + "» на " + prettyDate(dateEl.value) +
        ". Перезвоним на " + data.phone + " в течение 15 минут в рабочее время (" + CONFIG.hours + ") " +
        "и назовём точную вилку по цене после осмотра.";
      form.hidden = true;
      done.hidden = false;
      btn.disabled = false;
      lbl.textContent = "Отправить заявку";
      done.setAttribute("tabindex", "-1");
      done.focus();
    }, 900);
  });

  $("#againBtn").addEventListener("click", () => {
    done.hidden = true;
    form.hidden = false;
    form.reset();
    /* value, выставленный скриптом (маска телефона), reset() не трогает */
    ["f-name", "f-phone", "f-car", "f-note"].forEach((id) => ($("#" + id).value = ""));
    dateEl.min = today();
    dateEl.value = dateEl.min;
    $$("#bookForm .f").forEach((f) => clear(f.querySelector("input,select,textarea")));
    $("#f-name").focus({ preventScroll: true });
  });

  /* --- предвыбор услуги из карточек --- */
  const serviceSel = $("#f-service");
  $$("a[data-service]").forEach((a) => {
    a.addEventListener("click", () => {
      const opt = Array.from(serviceSel.options).find((o) => o.value === a.dataset.service);
      if (opt) serviceSel.value = opt.value;
    });
  });
});
