/* =====================================================
   PMR STUDIO — main.js (PRODUCTION SAFE) — 2026-01-10a
   Fixes:
   - i18n: cleaned keys, removed broken/duplicate entries
   - Adds chat_placeholder (used by index.html)
   - Section isolation: one init failing won't kill the rest
   - Reveal failsafe (prevents “only titles” syndrome)
   ===================================================== */

(() => {
  "use strict";

  // Helpful for verifying production is serving the new file:
  const PMR_MAIN_VERSION = "2026-11-26a";
  try { window.PMR_MAIN_VERSION = PMR_MAIN_VERSION; } catch (_) {}

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Mark JS enabled early
  try { document.documentElement.classList.add("js"); } catch (_) {}

  // -------------------------
  // 0) Year
  // -------------------------
  try {
    const y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  } catch (_) {}

  // -------------------------
  // 1) i18n (SAFE + COMPLETE for current index.html)
  // -------------------------
  function initI18n() {
    // Texts live in assets/js/i18n.js (loaded before this file)
    const I18N = (window.PMR_I18N && typeof window.PMR_I18N === "object") ? window.PMR_I18N : {};

    // Expose i18n for other scripts (chatbot, etc.)
    try { window.PMR_I18N = I18N; } catch (_) {}

    const LANGS = ["en", "es", "it"];
    const LANG_KEY = "pmr_lang";

    const normalizeLang = (l) => {
      const s = String(l || "").toLowerCase();
      if (s.startsWith("es")) return "es";
      if (s.startsWith("it")) return "it";
      return "en";
    };

    const getLang = () => {
      try {
        const stored = (localStorage.getItem(LANG_KEY) || "").toLowerCase();
        if (LANGS.includes(stored)) return stored;
      } catch (_) {}
      return normalizeLang(document.documentElement.lang || "en");
    };

    /**
     * SAFE apply rules:
     * - data-i18n="key" => textContent
     * - data-i18n-html="key" => innerHTML
     * - data-i18n-attr="placeholder" + data-i18n="key" => set attribute
     * - If key missing => do nothing (never blank)
     */
    const applyI18n = (lang) => {
      const dict = I18N[lang] || I18N.en || {};

      $$("[data-i18n], [data-i18n-html]").forEach((el) => {
        const key = el.getAttribute("data-i18n-html") || el.getAttribute("data-i18n");
        if (!key) return;

        const val = dict[key];
        if (typeof val !== "string") return;

        const attr = el.getAttribute("data-i18n-attr");
        if (attr) {
          el.setAttribute(attr, val);
          return;
        }

        if (el.hasAttribute("data-i18n-html")) el.innerHTML = val;
        else el.textContent = val;
      });
    };

    const setActiveChip = (lang) => {
      $$("[data-lang]").forEach((btn) => {
        const is = btn.getAttribute("data-lang") === lang;
        btn.classList.toggle("is-active", is);
        btn.setAttribute("aria-pressed", is ? "true" : "false");
      });
    };

    const setLang = (lang) => {
      const next = LANGS.includes(lang) ? lang : "en";
      try { localStorage.setItem(LANG_KEY, next); } catch (_) {}

      document.documentElement.lang = next;
      setActiveChip(next);
      applyI18n(next);

      // notify other scripts (chatbot, etc.)
      try {
        document.dispatchEvent(new CustomEvent("pmr:langchange", { detail: { lang: next } }));
      } catch (_) {}
    };

    // init language chips
    $$("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
    });

    // initial language
    setLang(getLang());
  }

  try { initI18n(); } catch (e) { console.error("i18n init failed:", e); }

  // -------------------------
  // 2) Burger menu
  // -------------------------
  function initBurger() {
    const burger = $("[data-burger]");
    const navLinks = $$(".nav a[href^='#']");

    const openMenu = () => {
      document.body.classList.add("nav-open");
      if (burger) burger.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      document.body.classList.remove("nav-open");
      if (burger) burger.setAttribute("aria-expanded", "false");
    };

    const toggleMenu = () => {
      if (document.body.classList.contains("nav-open")) closeMenu();
      else openMenu();
    };

    if (burger) burger.addEventListener("click", toggleMenu);

    document.addEventListener("click", (e) => {
      if (!document.body.classList.contains("nav-open")) return;
      const t = e.target;
      if (t.closest("[data-navwrap]") || t.closest("[data-burger]")) return;
      closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    navLinks.forEach((a) => a.addEventListener("click", closeMenu));
  }

  try { initBurger(); } catch (e) { console.error("burger init failed:", e); }

  // -------------------------
  // 3) Scroll UX (compact header + offset + smooth anchors)
  // -------------------------
  function initScrollUX() {
    const header = document.querySelector("[data-header]") || document.querySelector(".header");
    const burger = document.querySelector("[data-burger]");
    if (!header) return;

    const isMobile = () => window.matchMedia("(max-width: 900px)").matches;

    const setHeaderOffsetVar = () => {
      const h = Math.round(header.getBoundingClientRect().height || 92);
      const offset = h + 14;
      document.documentElement.style.setProperty("--header-offset", `${offset}px`);
      return offset;
    };

    const closeMobileMenu = () => {
      if (!document.body.classList.contains("nav-open")) return;
      document.body.classList.remove("nav-open");
      if (burger) burger.setAttribute("aria-expanded", "false");
    };

    let headerOffset = setHeaderOffsetVar();
    let lastY = window.pageYOffset || 0;

    // IMPORTANT: initialize BEFORE any apply() call
    let compact = false;

    const apply = () => {
      const y = window.pageYOffset || 0;

      // Compact only desktop
      const nextCompact = (!isMobile()) && y > 16;
      if (nextCompact !== compact) {
        compact = nextCompact;
        header.classList.toggle("is-compact", compact);
        headerOffset = setHeaderOffsetVar();
      }

      // Close menu on scroll
      if (Math.abs(y - lastY) > 6) closeMobileMenu();
      lastY = y;
    };

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        apply();
        ticking = false;
      });
    }, { passive: true });

    window.addEventListener("resize", () => {
      headerOffset = setHeaderOffsetVar();
      apply();
    });

    window.addEventListener("load", () => {
      headerOffset = setHeaderOffsetVar();
      apply();
    });

    // Smooth anchors with offset
    const navLinks = document.querySelectorAll(".nav a[href^='#']");
    navLinks.forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        headerOffset = setHeaderOffsetVar();

        const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({
          top,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });

        history.pushState(null, "", href);
        closeMobileMenu();
      });
    });

    apply();
  }

  try { initScrollUX(); } catch (e) { console.error("scrollUX failed:", e); }

  // -------------------------
  // 4) Reveal (with failsafe)
  // -------------------------
  function initReveal() {
    const els = $$(".reveal");
    if (!els.length) return;

    const showAll = () => els.forEach((el) => el.classList.add("is-visible"));

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((ent) => {
          if (ent.isIntersecting) {
            ent.target.classList.add("is-visible");
            io.unobserve(ent.target);
          }
        });
      }, { threshold: 0.12 });

      els.forEach((el) => io.observe(el));
    } else {
      showAll();
    }

    // failsafe if something else breaks later
    window.setTimeout(() => {
      const visibleCount = document.querySelectorAll(".reveal.is-visible").length;
      if (visibleCount < Math.min(3, els.length)) showAll();
    }, 900);
  }

  try { initReveal(); } catch (e) {
    console.error("reveal init failed:", e);
    try { $$(".reveal").forEach((el) => el.classList.add("is-visible")); } catch (_) {}
  }

  // -------------------------
  // 5) Scrollspy (safe)
  // -------------------------
  function initScrollSpy() {
    const navAnchors = $$(".nav a[href^='#']");
    if (!navAnchors.length) return;

    const sections = navAnchors
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    const setActive = () => {
      const offsetRaw = getComputedStyle(document.documentElement).getPropertyValue("--header-offset");
      const offset = parseInt(offsetRaw, 10) || 92;
      const y = window.scrollY + offset + 6;

      let current = null;
      for (const sec of sections) {
        if (sec.offsetTop <= y) current = sec;
      }

      navAnchors.forEach((a) => {
        const href = a.getAttribute("href");
        const is = current && href === ("#" + current.id);
        a.classList.toggle("is-active", !!is);
      });
    };

    const rafSetActive = () => requestAnimationFrame(setActive);

    window.addEventListener("scroll", rafSetActive, { passive: true });
    window.addEventListener("load", setActive);
    window.addEventListener("resize", setActive);
    setActive();
  }

  try { initScrollSpy(); } catch (e) { console.error("scrollspy failed:", e); }

})();
