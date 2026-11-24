// =====================================================
// PMR STUDIO — CHATBOT (V3, Lite / No AI)
// Uses main.js i18n dictionary (window.PMR_I18N)
// - Multilingual UI + answers
// - Pricing auto-sync (reads #tiers prices so it never goes stale)
// - Portfolio PDF auto-sync (reads the actual deck link in #portfolio)
// =====================================================
(function(){
  "use strict";

  const $open  = document.querySelector("[data-chat-open]");
  const $panel = document.querySelector("[data-chat-panel]");
  const $close = document.querySelector("[data-chat-close]");
  const $msgs  = document.querySelector("[data-chat-msgs]");
  const $form  = document.querySelector("[data-chat-form]");
  const $text  = document.querySelector("[data-chat-text]");
  const $send  = document.querySelector("[data-chat-send]");

  if(!$open || !$panel || !$close || !$msgs || !$form || !$text) return;

  // -------------------------
  // i18n helpers (from main.js)
  // -------------------------
  const FALLBACK = {
    en: {
      hello: "Hi — I’m PMR Assistant. Ask about services, pricing, languages, payments, or how we work.",
      fallback: "I can help with services, pricing, languages, payments, and next steps. What do you need?",
      sendPlaceholder: "Type a question…"
    },
    es: {
      hello: "Hola — soy el asistente de PMR. Preguntame por servicios, precios, idiomas, pagos o cómo trabajamos.",
      fallback: "Te puedo ayudar con servicios, precios, idiomas, pagos y próximos pasos. ¿Qué necesitás?",
      sendPlaceholder: "Escribí tu consulta…"
    },
    it: {
      hello: "Ciao — sono l’assistente di PMR. Chiedimi servizi, prezzi, lingue, pagamenti o come lavoriamo.",
      fallback: "Posso aiutarti con servizi, prezzi, lingue, pagamenti e prossimi step. Di cosa hai bisogno?",
      sendPlaceholder: "Scrivi la tua domanda…"
    }
  };

  function currentLang(){
    const active = document.querySelector(".lang .chip.is-active");
    const dl = active?.getAttribute("data-lang");
    if(dl === "es" || dl === "it" || dl === "en") return dl;

    const l = (document.documentElement.lang || "en").toLowerCase();
    if(l.startsWith("es")) return "es";
    if(l.startsWith("it")) return "it";
    return "en";
  }

  function getDict(lang){
    const all = (window.PMR_I18N && typeof window.PMR_I18N === "object") ? window.PMR_I18N : null;
    const d = all && all[lang] ? all[lang] : null;
    const en = all && all.en ? all.en : null;
    return { d, en };
  }

  function t(key, lang){
    const { d, en } = getDict(lang);
    if(d && typeof d[key] === "string") return d[key];
    if(en && typeof en[key] === "string") return en[key];
    return null;
  }

  function uiText(lang, which){
    // Optional keys you may add later to I18N:
    // chat_hello, chat_fallback, chat_input_placeholder
    if(which === "hello") return t("chat_hello", lang) || FALLBACK[lang].hello;
    if(which === "fallback") return t("chat_fallback", lang) || FALLBACK[lang].fallback;
    if(which === "placeholder") return t("chat_input_placeholder", lang) || FALLBACK[lang].sendPlaceholder;
    return "";
  }

  function quickLabels(lang){
    // Prefer i18n NAV labels (already in your dict), fallback per language
    return [
      t("nav_services", lang)  || (lang==="es"?"Servicios":lang==="it"?"Servizi":"Services"),
      t("nav_tiers", lang)     || (lang==="es"?"Precios":lang==="it"?"Prezzi":"Pricing"),
      t("nav_process", lang)   || (lang==="es"?"Proceso":lang==="it"?"Processo":"Process"),
      t("nav_portfolio", lang) || "Portfolio",
      t("nav_contact", lang)   || (lang==="es"?"Contacto":lang==="it"?"Contatto":"Contact"),
      t("nav_faq", lang)       || "FAQ"
    ];
  }

  // -------------------------
  // Text normalization + matching
  // -------------------------
  function norm(s){
    return (s || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenSet(s){
    const tks = norm(s).split(" ").filter(Boolean);
    return new Set(tks);
  }

  function jaccard(a, b){
    const A = tokenSet(a);
    const B = tokenSet(b);
    if(!A.size || !B.size) return 0;
    let inter = 0;
    A.forEach(x => { if(B.has(x)) inter++; });
    const union = A.size + B.size - inter;
    return union ? inter / union : 0;
  }

  // -------------------------
  // DOM-backed helpers (keeps chatbot aligned with site)
  // -------------------------
  function readTierInfo(){
    // Returns array: [{title, priceText}]
    const tiers = Array.from(document.querySelectorAll("#tiers .tier"));
    return tiers.map(tier => {
      const title = (tier.querySelector("h3")?.textContent || "").trim();
      const priceText = (tier.querySelector(".price")?.textContent || "").replace(/\s+/g,"").trim(); // e.g. "$20/hour"
      return { title, priceText };
    }).filter(x => x.title || x.priceText);
  }

  function readPortfolioPdfHref(){
    // Prefer the main deck button in portfolio section
    const a =
      document.querySelector("#portfolio a.btn.primary[href$='.pdf']") ||
      document.querySelector("#portfolio a[href$='.pdf']") ||
      document.querySelector("a[href$='.pdf']");
    const href = a?.getAttribute("href");
    return href ? href.trim() : null;
  }

  function readContact(){
    const emailA = document.querySelector("a[href^='mailto:']");
    const waA = document.querySelector("a[href^='https://wa.me/']");
    const email = emailA ? emailA.getAttribute("href").replace(/^mailto:/i,"").trim() : "info@pmr-studio.com";
    const wa = waA ? waA.getAttribute("href").trim() : "https://wa.me/5492612593729";
    return { email, wa };
  }

  // -------------------------
  // Answers (use PMR_I18N when possible)
  // -------------------------
  function answerServices(lang){
    // Optional: if you later add chat_services_answer in I18N, it will override.
    const fromDict = t("chat_services_answer", lang);
    if(fromDict) return fromDict;

    if(lang === "es"){
      return "Trabajo en sistemas internos y operaciones digitales: herramientas internas y dashboards, digitalización de procesos y trazabilidad, automatización/integraciones, documentación operativa y localización trilingüe (ES/EN/IT). Ver: #services";
    }
    if(lang === "it"){
      return "Lavoro su sistemi interni e operazioni digitali: strumenti interni e dashboard, digitalizzazione processi e tracciabilità, automazioni/integrazioni, documentazione operativa e localizzazione trilingue (ES/EN/IT). Vedi: #services";
    }
    return "I build internal systems and digital ops: internal tools & dashboards, process digitization & traceability, automations/integrations, ops documentation, and trilingual localization (ES/EN/IT). See: #services";
  }

  function answerPricing(lang){
    const fromDict = t("chat_pricing_answer", lang);
    if(fromDict) return fromDict;

    const tiers = readTierInfo();
    // Expecting 3 tiers; handle gracefully if structure changes
    const t1 = tiers[0] || { title: "One-off / Quick tasks", priceText: "$20/hour" };
    const t2 = tiers[1] || { title: "Recurring support", priceText: "$15/hour" };
    const t3 = tiers[2] || { title: "Long-term (custom)", priceText: "Custom" };

    // Keep numbers always synced with page; phrasing localized
    if(lang === "es"){
      return `Tarifas: ${t1.title} ${t1.priceText}, ${t2.title} ${t2.priceText}, y ${t3.title} ${t3.priceText}. Si me decís alcance + herramientas + tiempos, te propongo el punto de arranque más simple. Ver: #tiers`;
    }
    if(lang === "it"){
      return `Tariffe: ${t1.title} ${t1.priceText}, ${t2.title} ${t2.priceText}, e ${t3.title} ${t3.priceText}. Se mi dai scope + strumenti + tempi, ti propongo il punto di partenza più semplice. Vedi: #tiers`;
    }
    return `Rates: ${t1.title} ${t1.priceText}, ${t2.title} ${t2.priceText}, and ${t3.title} ${t3.priceText}. Share scope + tools + timeline and I’ll propose the simplest starting point. See: #tiers`;
  }

  function answerLanguages(lang){
    const fromDict = t("chat_languages_answer", lang);
    if(fromDict) return fromDict;

    // If langs_line exists in i18n, use it (strip "Languages:" etc if needed)
    const line = t("langs_line", lang);
    if(line) return line;

    if(lang === "es") return "Idiomas: Español (nativo) · Inglés (C2) · Italiano (B2).";
    if(lang === "it") return "Lingue: Spagnolo (madrelingua) · Inglese (C2) · Italiano (B2).";
    return "Languages: Spanish (Native) · English (C2) · Italian (B2).";
  }

  function answerPayments(lang){
    const fromDict = t("chat_payments_answer", lang);
    if(fromDict) return fromDict;

    const pay = t("pay_v", lang) || "PayPal · Skrill · Crypto (USDT, USDC, DAI)";
    if(lang === "es") return `Pagos: ${pay}. En proyectos grandes, se puede trabajar por hitos.`;
    if(lang === "it") return `Pagamenti: ${pay}. Per progetti grandi: milestone.`;
    return `Payments: ${pay}. For bigger projects, we can agree milestones.`;
  }

  function answerPortfolio(lang){
    const fromDict = t("chat_portfolio_answer", lang);
    if(fromDict) return fromDict;

    const href = readPortfolioPdfHref() || "/docs/portfolio/pmrstudio_portfolio_v3.pdf";
    if(lang === "es") return `Service Deck (PDF): ${href}  · Ver: #portfolio`;
    if(lang === "it") return `Service Deck (PDF): ${href}  · Vedi: #portfolio`;
    return `Service Deck (PDF): ${href}  · See: #portfolio`;
  }

  function answerContact(lang){
    const fromDict = t("chat_contact_answer", lang);
    if(fromDict) return fromDict;

    const c = readContact();
    const email = c.email || "info@pmr-studio.com";
    const wa = c.wa || "https://wa.me/5492612593729";

    if(lang === "es") return `Contacto: WhatsApp ${wa} o ${email}. Contame objetivo + herramientas + tiempos. Ver: #contact`;
    if(lang === "it") return `Contatto: WhatsApp ${wa} o ${email}. Dimmi obiettivo + strumenti + tempi. Vedi: #contact`;
    return `Contact: WhatsApp ${wa} or ${email}. Tell me goal + tools + timeline. See: #contact`;
  }

  function answerProcess(lang){
    const fromDict = t("chat_process_answer", lang);
    if(fromDict) return fromDict;

    if(lang === "es") return "Cómo trabajamos: brief corto → definimos estructura y MVP → entregamos y iteramos. Ver: #process";
    if(lang === "it") return "Come lavoriamo: brief breve → struttura e MVP → consegna e iterazione. Vedi: #process";
    return "How we work: short brief → define structure and MVP → deliver and iterate. See: #process";
  }

  function answerFAQ(lang){
    const fromDict = t("chat_faq_answer", lang);
    if(fromDict) return fromDict;

    if(lang === "es") return "Podés ver respuestas rápidas en la sección FAQ. Si me das tu contexto, te propongo un plan mínimo. Ver: #faq";
    if(lang === "it") return "Puoi vedere risposte rapide nella sezione FAQ. Se mi dai contesto, ti propongo un piano minimo. Vedi: #faq";
    return "You can find quick answers in the FAQ section. If you share context, I’ll propose a minimal plan. See: #faq";
  }

  // -------------------------
  // Knowledge base (triggers -> answer function)
  // -------------------------
  const KB = [
    {
      id: "services",
      triggers: ["services","service","what do you do","what you do","help with","deliverables","servicios","servicio","que haces","qué haces","que ofreces","qué ofrecés","servizi","cosa fai","cosa offri"],
      answer: answerServices
    },
    {
      id: "pricing",
      triggers: ["pricing","price","rates","rate","hourly","cost","tiers","precios","precio","tarifa","tarifas","costo","costos","prezzi","tariffa","tariffe","costo","livelli"],
      answer: answerPricing
    },
    {
      id: "languages",
      triggers: ["languages","language","spanish","english","italian","idiomas","idioma","español","ingles","inglés","italiano","lingue","lingua"],
      answer: answerLanguages
    },
    {
      id: "payments",
      triggers: ["payments","pay","paypal","crypto","usdt","usdc","skrill","pagos","pago","cripto","pagamenti","pagamento"],
      answer: answerPayments
    },
    {
      id: "portfolio",
      triggers: ["portfolio","deck","pdf","work samples","examples","ejemplos","muestras","campioni","esempi"],
      answer: answerPortfolio
    },
    {
      id: "contact",
      triggers: ["contact","email","whatsapp","reach you","book","call","contacto","contactarte","mail","correo","contatto"],
      answer: answerContact
    },
    {
      id: "process",
      triggers: ["process","how you work","workflow","steps","next steps","proceso","como trabajan","cómo trabajas","cómo trabajamos","processo","come lavori","come lavoriamo"],
      answer: answerProcess
    },
    {
      id: "faq",
      triggers: ["faq","questions","preguntas","domande"],
      answer: answerFAQ
    }
  ];

  function bestAnswer(userText){
    const q = norm(userText);
    if(!q) return null;

    let best = { score: 0, item: null };
    for(const item of KB){
      for(const trig of item.triggers){
        const tt = norm(trig);
        let score = 0;
        if(tt && q.includes(tt)) score = 1;
        else score = jaccard(q, tt);
        if(score > best.score) best = { score, item };
      }
    }

    if(!best.item || best.score < 0.22) return null;

    const l = currentLang();
    return best.item.answer(l);
  }

  // -------------------------
  // Rendering
  // -------------------------
  function addRow(who, content, asHtml){
    const row = document.createElement("div");
    row.className = `chat-row ${who}`;

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";

    if(asHtml) bubble.innerHTML = content;
    else bubble.textContent = content;

    row.appendChild(bubble);
    $msgs.appendChild(row);
    $msgs.scrollTop = $msgs.scrollHeight;
  }

  function addQuickChips(labels){
    const wrap = document.createElement("div");
    wrap.className = "chat-quick";

    labels.forEach(label => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chat-chip";
      b.textContent = label;

      b.addEventListener("click", () => {
        $text.value = label;
        $form.dispatchEvent(new Event("submit", { cancelable:true }));
      });

      wrap.appendChild(b);
    });

    const row = document.createElement("div");
    row.className = "chat-row bot";

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.appendChild(wrap);

    row.appendChild(bubble);
    $msgs.appendChild(row);
    $msgs.scrollTop = $msgs.scrollHeight;
  }

  function linkifyAnchors(text){
    return (text || "")
      .replaceAll("#services", `<a href="#services" class="underline">#services</a>`)
      .replaceAll("#tiers", `<a href="#tiers" class="underline">#tiers</a>`)
      .replaceAll("#portfolio", `<a href="#portfolio" class="underline">#portfolio</a>`)
      .replaceAll("#contact", `<a href="#contact" class="underline">#contact</a>`)
      .replaceAll("#process", `<a href="#process" class="underline">#process</a>`)
      .replaceAll("#faq", `<a href="#faq" class="underline">#faq</a>`);
  }

  // -------------------------
  // Open/close + lifecycle
  // -------------------------
  function open(){
    $panel.hidden = false;
    document.body.classList.add("chat-open");
    $text.focus();
  }

  function close(){
    $panel.hidden = true;
    document.body.classList.remove("chat-open");
  }

  $open.addEventListener("click", open);
  $close.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && !$panel.hidden) close();
  });

  document.addEventListener("click", (e) => {
    if($panel.hidden) return;
    if(e.target.closest("[data-chat-panel]") || e.target.closest("[data-chat-open]")) return;
    close();
  });

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = $text.value.trim();
    if(!msg) return;

    addRow("user", msg, false);
    $text.value = "";

    const l = currentLang();
    const ans = bestAnswer(msg) || uiText(l, "fallback");
    addRow("bot", linkifyAnchors(ans), true);
  });

  // -------------------------
  // Init + react to language change
  // -------------------------
  function bootstrap(forceReset){
    const l = currentLang();

    // Update placeholder and send label (if present)
    $text.setAttribute("placeholder", uiText(l, "placeholder"));
    if($send){
      const s = t("chat_send", l);
      if(typeof s === "string" && s.trim()) $send.textContent = s;
    }

    if(forceReset){
      $msgs.innerHTML = "";
    }

    // Only add greeting if empty (or after reset)
    if(!$msgs.children.length){
      addRow("bot", uiText(l, "hello"), false);
      addQuickChips(quickLabels(l));
    }
  }

  // First init
  bootstrap(false);

  // Listen to language switch from main.js (pmr:langchange)
  document.addEventListener("pmr:langchange", () => {
    // If chat is closed (or still basically empty), reset to keep language consistent
    const isClosed = $panel.hidden === true;
    const fewMsgs = $msgs.children.length <= 2; // hello + chips
    bootstrap(isClosed && fewMsgs);
  });

})();
