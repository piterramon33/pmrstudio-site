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
  const PMR_MAIN_VERSION = "2026-01-10a";
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
    const I18N = {
      en: {
        // NAV
        nav_services: "Services",
        nav_tiers: "Pricing",
        nav_portfolio: "Portfolio",
        nav_faq: "FAQ",
        nav_process: "Process",
        nav_contact: "Contact",

        // HERO
        hero_pill: "Business Systems & Digital Operations · Internal Tools · ES/EN/IT",
        hero_h1: "Transforming manual chaos into scalable business systems.",
        hero_lead: "I design internal tools, dashboards, and workflows so your operation runs on reliable data—without the spreadsheet/WhatsApp chaos.",
        hero_micro: "Web development (PHP/JS/MySQL) + real operations & quality control experience. Clean deliverables, minimal friction, measurable clarity.",
        hero_stack: "Stack: PHP · MySQL · JavaScript · Google Workspace · APIs · n8n/Zapier · Automation",

        // CTA
        cta_whatsapp: "Message on WhatsApp",
        cta_email: "Email",
        cta_services: "View services",

        // HERO CARD
        hero_card_title2: "What you get",
        hero_card_b1: "A single source of truth: structured data you can trust.",
        hero_card_b2: "Dashboards & trackers that reflect real operations (not guesswork).",
        hero_card_b3: "Digitized logs & traceability-ready records for fast reporting.",
        hero_card_b4: "Trilingual writing & localization (ES/EN/IT) with business tone.",
        hero_kpi1_v: "Operations + Systems",
        hero_kpi1_l: "Process clarity, less friction, better control",
        hero_kpi2_v: "Internal Tools",
        hero_kpi2_l: "Dashboards, databases, lightweight automation",
        hero_kpi3_v: "ES / EN / IT",
        hero_kpi3_l: "Trilingual communication for global teams",
        hero_small2: "Practical approach: minimal system first, then iterate. No overengineering.",

        // OUTCOMES
        proof_title: "Outcomes you can expect",
        proof_sub: "Systems that reduce manual work, improve control, and make reporting faster.",
        proof1_t: "Single source of truth (internal control)",
        proof1_d: "One place to see what’s happening: structured data, clear ownership, and less “Where’s the latest version?” noise.",
        proof2_t: "Digitized logs & audit-ready exports",
        proof2_d: "Replace manual logs with simple digital records (forms/tables) and exports that support traceability and operational reporting.",
        proof3_t: "Dashboards + operating rhythm",
        proof3_d: "Trackers and dashboards aligned to real work: KPIs, status, due dates, follow-ups, and weekly cadence so things don’t drift.",

        // SERVICES
        services_title2: "Services & deliverables",
        services_sub2: "Structure-first work. We define the data, the workflow, and the smallest useful version—then iterate.",
        svc0_t: "System audit → blueprint → build",
        svc0_d: "If your operation runs on scattered sheets, chats, and memory, we start by mapping reality and turning it into a simple system people can actually use.",
        svc0_a_t: "Phase 1: Audit",
        svc0_a_d: "Current tools, bottlenecks, data sources, ownership, and reporting needs.",
        svc0_b_t: "Phase 2: Blueprint",
        svc0_b_d: "Data structure + workflows + “definition of done” + minimal documentation.",
        svc0_c_t: "Phase 3: Build",
        svc0_c_d: "MVP system shipped fast, then improvements based on usage and feedback.",
        svc_inc: "Typical deliverables",

        svc1_t: "Internal tools & dashboards",
        svc1_d: "Databases + control panels to centralize information, reduce mistakes, and make KPIs visible.",
        svc1_b1: "Structured tables (clean data model)",
        svc1_b2: "Dashboard views (filters, status, KPIs)",
        svc1_b3: "Export-ready reports (weekly/monthly)",

        svc2_t: "Process digitization & traceability",
        svc2_d: "Convert paper/manual logs into reliable digital records for operations and quality control reporting.",
        svc2_b1: "Digital forms / capture flows",
        svc2_b2: "Standardized records + naming rules",
        svc2_b3: "Audit-ready exports & summaries",

        svc3_t: "Automation & integrations",
        svc3_d: "Reduce manual entry by connecting tools (email, Drive, forms, databases) via APIs and automation.",
        svc3_b1: "Automated reminders & follow-ups",
        svc3_b2: "Data sync between sources",
        svc3_b3: "Error-proofing (validation, logs)",

        svc4_t: "Ops documentation & operating rhythm",
        svc4_d: "SOPs, checklists, roles, and cadence so the system stays alive after delivery.",
        svc4_b1: "SOPs + checklists (1-page style)",
        svc4_b2: "Definition of done + ownership",
        svc4_b3: "Weekly review routine + backlog",

        svc5_t: "Trilingual writing & localization (ES–EN–IT)",
        svc5_d: "Natural business tone for landing pages, sales messaging, and documentation—consistent across markets.",
        svc5_b1: "ES/EN/IT versions + tone alignment",
        svc5_b2: "Mini glossary for key terms",
        svc5_b3: "Reusable templates (emails/docs)",

        svc6_t: "Canva Pro business visuals",
        svc6_d: "Clean one-pagers, decks, and templates to communicate systems, results, and processes.",
        svc6_b1: "Reusable templates (brand-consistent)",
        svc6_b2: "Process visuals / quick guides",
        svc6_b3: "Simple asset packs for teams",

        services_note2: "If you tell me your tools + timeline + biggest bottleneck, I’ll propose the smallest useful version to ship first.",

        // PRICING
        tiers_title2: "Engagement & pricing",
        tiers_sub2: "Simple hourly rates for execution. For larger builds/migrations, I can quote project-based.",
        per_hour: "/hour",

        tier1_title2: "One-off / Quick tasks",
        tier1_desc2: "Targeted help to unblock something quickly (cleanup, fixes, short builds).",
        tier1_b1_2: "Inbox/Drive cleanup + standards",
        tier1_b2_2: "Tracker/dashboard fixes",
        tier1_b3_2: "Short documentation or translations",

        tier2_title2: "Recurring support",
        tier2_desc2: "Ongoing operations + systems support for continuity and speed.",
        tier2_b1_2: "Process improvement & maintenance",
        tier2_b2_2: "Follow-ups, admin execution, data hygiene",
        tier2_b3_2: "Templates, SOPs, automation iterations",

        tier3_title2: "Long-term (custom)",
        tier3_price: "Custom",
        tier3_desc2: "Deeper system-building and continuous improvement with priority response.",
        tier3_b1_2: "Internal tools & migrations",
        tier3_b2_2: "Automation & integration roadmap",
        tier3_b3_2: "Ops documentation + training materials",

        tier_cta: "Contact me",
        tiers_note2: "Share scope + tools + timeline and I’ll propose the simplest starting point.",

        // PORTFOLIO
        portfolio_title: "Portfolio & use cases",
        portfolio_sub: "A compact overview plus practical scenarios: digitization, internal tooling, and trilingual localization.",
        portfolio_deck_title: "Service Deck (PDF)",
        portfolio_deck_desc: "Overview of services, workflows, deliverables, and example scenarios.",
        portfolio_btn: "Download PDF",

        case1_t: "Operations digitization & traceability",
        case1_d: "Turn manual logs into structured records that support fast reporting and operational control.",
        case1_b1: "Digital forms / tables + validation rules",
        case1_b2: "Standardized records + export-ready format",
        case1_b3: "Simple reporting pack (weekly / monthly)",

        case2_t: "Internal dashboard & KPI control",
        case2_d: "A single view of what matters: status, KPIs, owners, and next actions.",
        case2_b1: "KPI definitions + data structure",
        case2_b2: "Dashboard with filters (by area / date)",
        case2_b3: "Follow-up cadence + accountability",

        case3_t: "Trilingual launch & documentation (ES/EN/IT)",
        case3_d: "Localization for landing pages, sales messaging, and internal documentation—consistent business tone.",
        case3_b1: "ES/EN/IT versions + tone alignment",
        case3_b2: "Mini glossary (key terms consistency)",
        case3_b3: "Reusable templates for future updates",

        // PORTFOLIO: PDF UI SNAPSHOTS
        pf_asistencia_t: "School Attendance System (UI)",
        pf_asistencia_d: "UI snapshot: catalog + admin dashboard + reports + QR generator + scanner.",
        pf_controlinv_t: "ERP: ControlInventarios (UI)",
        pf_controlinv_d: "Multi-module ERP UI snapshot for inventory & operations control.",
        pf_erpcont_t: "Custom Accounting ERP (UI)",
        pf_erpcont_d: "Accounting workflows UI snapshot: invoices/CFDI, uploads, config, reporting.",

        pf_preview: "Preview",
        pf_view_pdf: "View PDF",
        pf_modal_title: "Preview",
        pf_close: "Close",
        pf_open_tab: "Open in new tab",

        // FAQ
        faq_title: "FAQ",
        faq_sub: "Quick answers. If you share your context, I’ll propose a minimal plan.",
        faq_q1: "What exactly do you build?",
        faq_a1: "Internal systems that make operations reliable: structured trackers, dashboards, digitized logs, lightweight automation, and clear documentation—plus trilingual localization when needed.",
        faq_q2: "How does onboarding work?",
        faq_a2: "Short brief (goal, tools, timeline), then a minimal plan: what we do first, what can wait, and what the deliverable looks like. We ship the smallest useful version, then iterate.",
        faq_q3: "Do you replace our tools?",
        faq_a3: "Not necessarily. If you already have a process, I optimize it without breaking it. If the toolset is the problem, I propose a migration path with clear tradeoffs.",
        faq_q4: "Languages and tone?",
        faq_a4: "ES / EN / IT. For launches and customer messaging, I localize tone (not literal translation) so the content sounds natural and aligned with your brand.",
        faq_q5: "Payments?",
        faq_a5: "PayPal, Skrill, or Crypto (USDT/USDC/DAI). For larger scopes, we can define milestones.",

        // PROCESS
        process_title: "How we work",
        p1_b: "Quick brief:",
        p1: "goal, context, tools and timeline.",
        p2_b: "Design the structure:",
        p2_2: "data model, workflow, and the smallest useful version to ship first.",
        p3_b: "Build, document, iterate:",
        p3_2: "deliverables ready to use, minimal docs, and a clear next-step backlog.",
        process_output_b: "Typical output",
        process_output_v: "Dashboard/tracker + SOP/checklist + naming rules + automation hooks (if needed).",

        // CONTACT
        contact_title: "Contact",
        contact_desc: "Tell me your goal + current tools + timeline. I’ll reply with a simple plan and the best starting option.",
        contact_direct: "Direct",
        contact_email_b: "Email:",
        contact_wa_b: "WhatsApp:",
        contact_loc_b: "Location:",
        contact_loc: "Mendoza, Argentina (GMT/UTC -03)",
        pay_b: "Payments:",
        pay_v: "PayPal · Skrill · Crypto (USDT, USDC, DAI)",
        langs_line: "Languages: Spanish (Native) · English (C2) · Italian (B2)",
        contact_fast: "Quick message",
        contact_fast_desc: "For now, WhatsApp or email.",
        response_time: "Response time: within 24 hours.",

        // CHAT
        chat_open: "Assistant",
        chat_title: "PMR Assistant",
        chat_sub: "Ask about services, pricing, languages, payments, or next steps.",
        chat_placeholder: "Type a question…",
        chat_send: "Send",

        // FOOTER
        footer: "PMR Studio · Business systems & digital operations",
        footer_privacy: "Privacy",
        footer_terms: "Terms"
      },

      es: {
        // NAV
        nav_services: "Servicios",
        nav_tiers: "Precios",
        nav_portfolio: "Portfolio",
        nav_faq: "FAQ",
        nav_process: "Proceso",
        nav_contact: "Contacto",

        // HERO
        hero_pill: "Sistemas de negocio & Operaciones digitales · Herramientas internas · ES/EN/IT",
        hero_h1: "Transformo el caos manual en sistemas escalables.",
        hero_lead: "Diseño herramientas internas, tableros y workflows para que tu operación corra con datos confiables—sin el caos de planillas/WhatsApp.",
        hero_micro: "Desarrollo web (PHP/JS/MySQL) + experiencia real en operaciones y control de calidad. Entregables claros, mínima fricción, control medible.",
        hero_stack: "Stack: PHP · MySQL · JavaScript · Google Workspace · APIs · n8n/Zapier · Automatización",

        // CTA
        cta_whatsapp: "Escribirme por WhatsApp",
        cta_email: "Email",
        cta_services: "Ver servicios",

        // HERO CARD
        hero_card_title2: "Qué te llevás",
        hero_card_b1: "Una única fuente de verdad: datos estructurados en los que podés confiar.",
        hero_card_b2: "Dashboards y trackers alineados a la operación real (no suposiciones).",
        hero_card_b3: "Registros digitalizados y listos para trazabilidad y reportes rápidos.",
        hero_card_b4: "Redacción y localización trilingüe (ES/EN/IT) con tono profesional.",
        hero_kpi1_v: "Operaciones + Sistemas",
        hero_kpi1_l: "Claridad de proceso, menos fricción, mejor control",
        hero_kpi2_v: "Herramientas internas",
        hero_kpi2_l: "Dashboards, bases de datos, automatización liviana",
        hero_kpi3_v: "ES / EN / IT",
        hero_kpi3_l: "Comunicación trilingüe para equipos globales",
        hero_small2: "Enfoque práctico: primero el sistema mínimo, después iteramos. Sin overengineering.",

        // OUTCOMES
        proof_title: "Resultados que podés esperar",
        proof_sub: "Sistemas que reducen trabajo manual, mejoran el control y aceleran el reporting.",
        proof1_t: "Fuente única de verdad (control interno)",
        proof1_d: "Un solo lugar para ver qué pasa: datos estructurados, responsabilidades claras y menos ruido de “¿cuál es la última versión?”.",
        proof2_t: "Registros digitalizados + exports listos para auditoría",
        proof2_d: "Reemplazo de planillas/logs manuales por registros simples (formularios/tablas) y exports que soportan trazabilidad y reportes operativos.",
        proof3_t: "Dashboards + ritmo operativo",
        proof3_d: "Trackers y tableros alineados al trabajo real: KPIs, estados, vencimientos, seguimiento y cadencia semanal para que nada se caiga.",

        // SERVICES
        services_title2: "Servicios y entregables",
        services_sub2: "Trabajo con foco en estructura. Definimos datos, workflow y la versión mínima útil—y luego iteramos.",
        svc0_t: "Diagnóstico → blueprint → implementación",
        svc0_d: "Si tu operación vive entre planillas sueltas, chats y memoria, empezamos mapeando la realidad y la convertimos en un sistema simple que la gente realmente usa.",
        svc0_a_t: "Fase 1: Diagnóstico",
        svc0_a_d: "Herramientas actuales, cuellos de botella, fuentes de datos, responsables y necesidades de reporting.",
        svc0_b_t: "Fase 2: Blueprint",
        svc0_b_d: "Estructura de datos + workflows + definición de terminado + documentación mínima.",
        svc0_c_t: "Fase 3: Implementación",
        svc0_c_d: "Entregamos un MVP rápido y mejoramos según uso y feedback.",
        svc_inc: "Entregables típicos",

        svc1_t: "Herramientas internas y dashboards",
        svc1_d: "Bases de datos + paneles de control para centralizar info, reducir errores y hacer visibles los KPIs.",
        svc1_b1: "Tablas estructuradas (modelo de datos limpio)",
        svc1_b2: "Vistas de dashboard (filtros, estados, KPIs)",
        svc1_b3: "Reportes/export listos (semanal/mensual)",

        svc2_t: "Digitalización de procesos y trazabilidad",
        svc2_d: "Pasar logs en papel/manuales a registros digitales confiables para operaciones y control de calidad.",
        svc2_b1: "Formularios / flujos de captura",
        svc2_b2: "Registros estandarizados + reglas de nombres",
        svc2_b3: "Resúmenes y exports listos para auditoría",

        svc3_t: "Automatización e integraciones",
        svc3_d: "Reducir carga manual conectando herramientas (email, Drive, forms, bases) vía APIs y automatización.",
        svc3_b1: "Recordatorios y follow-ups automáticos",
        svc3_b2: "Sincronización de datos entre fuentes",
        svc3_b3: "Antierrores (validación, logs)",

        svc4_t: "Documentación operativa y ritmo",
        svc4_d: "SOPs, checklists, roles y cadencia para que el sistema siga vivo después de entregar.",
        svc4_b1: "SOPs + checklists (formato 1 hoja)",
        svc4_b2: "Definición de terminado + responsables",
        svc4_b3: "Rutina semanal + backlog",

        svc5_t: "Redacción y localización trilingüe (ES–EN–IT)",
        svc5_d: "Tono profesional natural para landing, ventas y documentación—consistente entre mercados.",
        svc5_b1: "Versiones ES/EN/IT + alineación de tono",
        svc5_b2: "Mini glosario de términos clave",
        svc5_b3: "Plantillas reutilizables (emails/docs)",

        svc6_t: "Visuales business con Canva Pro",
        svc6_d: "One-pagers, decks y templates limpios para comunicar sistemas, resultados y procesos.",
        svc6_b1: "Plantillas reutilizables (consistentes con marca)",
        svc6_b2: "Visuales de proceso / guías rápidas",
        svc6_b3: "Packs simples para equipos",

        services_note2: "Si me contás herramientas + plazos + el mayor cuello de botella, te propongo la versión mínima útil para entregar primero.",

        // PRICING
        tiers_title2: "Modalidad y precios",
        tiers_sub2: "Tarifas por hora para ejecución. Para builds/migraciones grandes, se puede cotizar por proyecto.",
        per_hour: "/hora",

        tier1_title2: "Puntual / Tareas rápidas",
        tier1_desc2: "Ayuda puntual para destrabar algo rápido (orden, fixes, builds cortos).",
        tier1_b1_2: "Orden Inbox/Drive + estándares",
        tier1_b2_2: "Ajustes de trackers/dashboards",
        tier1_b3_2: "Documentación o traducciones cortas",

        tier2_title2: "Soporte recurrente",
        tier2_desc2: "Soporte continuo para mantener ritmo y consistencia.",
        tier2_b1_2: "Mejora y mantenimiento de procesos",
        tier2_b2_2: "Follow-ups, ejecución admin, higiene de datos",
        tier2_b3_2: "Plantillas, SOPs, iteraciones de automatización",

        tier3_title2: "Largo plazo (a medida)",
        tier3_price: "A medida",
        tier3_desc2: "Construcción de sistemas más profunda y mejora continua con respuesta prioritaria.",
        tier3_b1_2: "Herramientas internas y migraciones",
        tier3_b2_2: "Roadmap de automatización e integraciones",
        tier3_b3_2: "Documentación + materiales de entrenamiento",

        tier_cta: "Contactarme",
        tiers_note2: "Pasame alcance + herramientas + plazos y te propongo el punto de partida más simple.",

        // PORTFOLIO
        portfolio_title: "Portfolio y casos de uso",
        portfolio_sub: "Resumen compacto con escenarios prácticos: digitalización, herramientas internas y localización trilingüe.",
        portfolio_deck_title: "Service Deck (PDF)",
        portfolio_deck_desc: "Resumen de servicios, workflows, entregables y escenarios.",
        portfolio_btn: "Descargar PDF",

        case1_t: "Digitalización operativa y trazabilidad",
        case1_d: "Convertir logs manuales en registros estructurados para reportes rápidos y control operativo.",
        case1_b1: "Formularios/tablas + reglas de validación",
        case1_b2: "Registros estandarizados + formato exportable",
        case1_b3: "Pack de reporte simple (semanal/mensual)",

        case2_t: "Dashboard interno y control de KPIs",
        case2_d: "Una vista única de lo importante: estado, KPIs, responsables y próximos pasos.",
        case2_b1: "Definición de KPIs + estructura de datos",
        case2_b2: "Dashboard con filtros (área / fecha)",
        case2_b3: "Cadencia de seguimiento + accountability",

        case3_t: "Lanzamiento y documentación trilingüe (ES/EN/IT)",
        case3_d: "Localización para landing, ventas y documentación interna—tono profesional consistente.",
        case3_b1: "Versiones ES/EN/IT + alineación de tono",
        case3_b2: "Mini glosario (consistencia de términos)",
        case3_b3: "Plantillas reutilizables para futuras actualizaciones",

        // PORTFOLIO: PDF UI SNAPSHOTS
        pf_asistencia_t: "Sistema de Asistencia Escolar (UI)",
        pf_asistencia_d: "Captura de UI: catálogo + dashboard admin + reportes + generador QR + escáner.",
        pf_controlinv_t: "ERP: ControlInventarios (UI)",
        pf_controlinv_d: "Captura de UI de ERP multi-módulo para control de inventario y operaciones.",
        pf_erpcont_t: "ERP Contable a Medida (UI)",
        pf_erpcont_d: "Captura de flujos contables: facturas/CFDI, cargas, configuración y reporting.",

        pf_preview: "Vista previa",
        pf_view_pdf: "Ver PDF",
        pf_modal_title: "Previsualización",
        pf_close: "Cerrar",
        pf_open_tab: "Abrir en otra pestaña",

        // FAQ
        faq_title: "FAQ",
        faq_sub: "Respuestas rápidas. Si me contás tu contexto, te propongo un plan mínimo.",
        faq_q1: "¿Qué construís exactamente?",
        faq_a1: "Sistemas internos que vuelven confiables las operaciones: trackers, dashboards, registros digitalizados, automatización liviana y documentación clara—más localización trilingüe cuando hace falta.",
        faq_q2: "¿Cómo es el onboarding?",
        faq_a2: "Brief corto (objetivo, herramientas, plazos) y después un plan mínimo: qué va primero, qué puede esperar y cómo es el entregable. Entregamos una versión útil y luego iteramos.",
        faq_q3: "¿Reemplazás nuestras herramientas?",
        faq_a3: "No necesariamente. Si ya existe un proceso, lo optimizo sin romperlo. Si el problema es la herramienta, propongo una ruta de migración con tradeoffs claros.",
        faq_q4: "¿Idiomas y tono?",
        faq_a4: "ES / EN / IT. Para lanzamientos y mensajes a clientes, localizo el tono (no traducción literal) para que suene natural y alineado a tu marca.",
        faq_q5: "¿Pagos?",
        faq_a5: "PayPal, Skrill o Crypto (USDT/USDC/DAI). Para alcances grandes, se pueden definir hitos.",

        // PROCESS
        process_title: "Cómo trabajamos",
        p1_b: "Brief rápido:",
        p1: "objetivo, contexto, herramientas y plazos.",
        p2_b: "Diseñar la estructura:",
        p2_2: "modelo de datos, workflow y la versión mínima útil para entregar primero.",
        p3_b: "Construir, documentar, iterar:",
        p3_2: "entregables listos, docs mínimas y backlog claro.",
        process_output_b: "Entregable típico",
        process_output_v: "Dashboard/tracker + SOP/checklist + reglas de nombres + automatización (si aplica).",

        // CONTACT
        contact_title: "Contacto",
        contact_desc: "Contame tu objetivo + herramientas actuales + plazos. Te respondo con un plan simple y el mejor punto de partida.",
        contact_direct: "Directo",
        contact_email_b: "Email:",
        contact_wa_b: "WhatsApp:",
        contact_loc_b: "Ubicación:",
        contact_loc: "Mendoza, Argentina (GMT/UTC -03)",
        pay_b: "Pagos:",
        pay_v: "PayPal · Skrill · Crypto (USDT, USDC, DAI)",
        langs_line: "Idiomas: Español (Nativo) · Inglés (C2) · Italiano (B2)",
        contact_fast: "Mensaje rápido",
        contact_fast_desc: "Por ahora, WhatsApp o email.",
        response_time: "Tiempo de respuesta: dentro de 24 horas.",

        // CHAT
        chat_open: "Asistente",
        chat_title: "PMR Assistant",
        chat_sub: "Preguntá por servicios, precios, idiomas, pagos o próximos pasos.",
        chat_placeholder: "Escribí tu consulta…",
        chat_send: "Enviar",

        // FOOTER
        footer: "PMR Studio · Business systems & digital operations",
        footer_privacy: "Privacidad",
        footer_terms: "Términos"
      },

      it: {
        // NAV
        nav_services: "Servizi",
        nav_tiers: "Prezzi",
        nav_portfolio: "Portfolio",
        nav_faq: "FAQ",
        nav_process: "Processo",
        nav_contact: "Contatto",

        // HERO
        hero_pill: "Business Systems & Digital Operations · Internal Tools · ES/EN/IT",
        hero_h1: "Trasformare il caos manuale in sistemi scalabili.",
        hero_lead: "Progetto strumenti interni, dashboard e workflow affinché l’operazione giri su dati affidabili—senza caos da fogli/WhatsApp.",
        hero_micro: "Sviluppo web (PHP/JS/MySQL) + esperienza reale in operations e quality control. Deliverable puliti, frizione minima, chiarezza misurabile.",
        hero_stack: "Stack: PHP · MySQL · JavaScript · Google Workspace · API · n8n/Zapier · Automazione",

        // CTA
        cta_whatsapp: "Scrivimi su WhatsApp",
        cta_email: "Email",
        cta_services: "Vedi servizi",

        // HERO CARD
        hero_card_title2: "Cosa ottieni",
        hero_card_b1: "Un’unica fonte di verità: dati strutturati di cui ti puoi fidare.",
        hero_card_b2: "Dashboard e tracker allineati all’operatività reale (non supposizioni).",
        hero_card_b3: "Registri digitalizzati e pronti per tracciabilità e reporting veloce.",
        hero_card_b4: "Scrittura e localizzazione trilingue (ES/EN/IT) con tono business.",
        hero_kpi1_v: "Operations + Systems",
        hero_kpi1_l: "Chiarezza di processo, meno attrito, più controllo",
        hero_kpi2_v: "Strumenti interni",
        hero_kpi2_l: "Dashboard, database, automazione leggera",
        hero_kpi3_v: "ES / EN / IT",
        hero_kpi3_l: "Comunicazione trilingue per team globali",
        hero_small2: "Approccio pratico: prima il sistema minimo, poi iteriamo. Niente overengineering.",

        // OUTCOMES
        proof_title: "Risultati che puoi aspettarti",
        proof_sub: "Sistemi che riducono lavoro manuale, migliorano controllo e velocizzano il reporting.",
        proof1_t: "Unica fonte di verità (controllo interno)",
        proof1_d: "Un posto unico per vedere cosa succede: dati strutturati, ownership chiara e meno “qual è l’ultima versione?”.",
        proof2_t: "Registri digitali + export pronti per audit",
        proof2_d: "Sostituire log manuali con record digitali semplici (form/tabelle) ed export utili per tracciabilità e reporting operativo.",
        proof3_t: "Dashboard + ritmo operativo",
        proof3_d: "Tracker e dashboard sul lavoro reale: KPI, stati, scadenze, follow-up e cadenza settimanale.",

        // SERVICES
        services_title2: "Servizi e deliverable",
        services_sub2: "Lavoro orientato alla struttura. Definiamo dati, workflow e la versione minima utile—poi iteriamo.",
        svc0_t: "Audit → blueprint → build",
        svc0_d: "Se l’operazione vive tra fogli sparsi, chat e memoria, partiamo mappando la realtà e costruendo un sistema semplice che le persone usano davvero.",
        svc0_a_t: "Fase 1: Audit",
        svc0_a_d: "Strumenti attuali, colli di bottiglia, fonti dati, ownership e bisogni di reporting.",
        svc0_b_t: "Fase 2: Blueprint",
        svc0_b_d: "Struttura dati + workflow + definition of done + documentazione minima.",
        svc0_c_t: "Fase 3: Build",
        svc0_c_d: "MVP consegnato rapidamente, poi miglioramenti basati su uso e feedback.",
        svc_inc: "Deliverable tipici",

        svc1_t: "Strumenti interni & dashboard",
        svc1_d: "Database + pannelli di controllo per centralizzare info, ridurre errori e rendere visibili i KPI.",
        svc1_b1: "Tabelle strutturate (data model pulito)",
        svc1_b2: "Viste dashboard (filtri, stati, KPI)",
        svc1_b3: "Report/export pronti (settimanale/mensile)",

        svc2_t: "Digitalizzazione processi & tracciabilità",
        svc2_d: "Convertire log cartacei/manuali in record digitali affidabili per operations e quality reporting.",
        svc2_b1: "Form / flussi di raccolta",
        svc2_b2: "Record standardizzati + regole naming",
        svc2_b3: "Export e sintesi pronti per audit",

        svc3_t: "Automazione & integrazioni",
        svc3_d: "Ridurre input manuale collegando strumenti (email, Drive, form, database) con API e automazioni.",
        svc3_b1: "Reminder e follow-up automatici",
        svc3_b2: "Sync dati tra fonti",
        svc3_b3: "Riduzione errori (validazione, log)",

        svc4_t: "Documentazione ops & operating rhythm",
        svc4_d: "SOP, checklist, ruoli e cadenza per mantenere vivo il sistema dopo la consegna.",
        svc4_b1: "SOP + checklist (stile 1 pagina)",
        svc4_b2: "Definition of done + ownership",
        svc4_b3: "Routine settimanale + backlog",

        svc5_t: "Scrittura & localizzazione trilingue (ES–EN–IT)",
        svc5_d: "Tono business naturale per landing, vendite e documentazione—coerente tra mercati.",
        svc5_b1: "Versioni ES/EN/IT + allineamento tono",
        svc5_b2: "Mini glossario termini chiave",
        svc5_b3: "Template riutilizzabili (email/doc)",

        svc6_t: "Visual business con Canva Pro",
        svc6_d: "One-pager, deck e template puliti per comunicare sistemi, risultati e processi.",
        svc6_b1: "Template riutilizzabili (brand-consistent)",
        svc6_b2: "Visual di processo / quick guide",
        svc6_b3: "Asset pack semplice per team",

        services_note2: "Se mi dici strumenti + timeline + bottleneck principale, propongo la versione minima utile da consegnare per prima.",

        // PRICING
        tiers_title2: "Modalità e prezzi",
        tiers_sub2: "Tariffe orarie per esecuzione. Per build/migrazioni più grandi, posso quotare a progetto.",
        per_hour: "/ora",

        tier1_title2: "Task singoli / rapidi",
        tier1_desc2: "Aiuto mirato per sbloccare qualcosa rapidamente (ordine, fix, build brevi).",
        tier1_b1_2: "Ordine Inbox/Drive + standard",
        tier1_b2_2: "Fix tracker/dashboard",
        tier1_b3_2: "Documenti o traduzioni brevi",

        tier2_title2: "Supporto ricorrente",
        tier2_desc2: "Supporto continuo per ritmo e coerenza.",
        tier2_b1_2: "Miglioramento e manutenzione processi",
        tier2_b2_2: "Follow-up, esecuzione admin, igiene dati",
        tier2_b3_2: "Template, SOP, iterazioni automazione",

        tier3_title2: "Lungo termine (su misura)",
        tier3_price: "Su misura",
        tier3_desc2: "Costruzione sistemi più profonda e miglioramento continuo con risposta prioritaria.",
        tier3_b1_2: "Strumenti interni e migrazioni",
        tier3_b2_2: "Roadmap automazione e integrazioni",
        tier3_b3_2: "Documentazione + materiali training",

        tier_cta: "Contattami",
        tiers_note2: "Dimmi scope + strumenti + timeline e propongo il punto di partenza più semplice.",

        // PORTFOLIO
        portfolio_title: "Portfolio & casi d’uso",
        portfolio_sub: "Panoramica compatta con scenari pratici: digitalizzazione, strumenti interni e localizzazione trilingue.",
        portfolio_deck_title: "Service Deck (PDF)",
        portfolio_deck_desc: "Panoramica di servizi, workflow, deliverable e scenari.",
        portfolio_btn: "Scarica PDF",

        case1_t: "Digitalizzazione operativa & tracciabilità",
        case1_d: "Trasformare log manuali in record strutturati per reporting veloce e controllo operativo.",
        case1_b1: "Form/tabelle + regole di validazione",
        case1_b2: "Record standardizzati + formato export",
        case1_b3: "Reporting pack semplice (settimanale/mensile)",

        case2_t: "Dashboard interno & controllo KPI",
        case2_d: "Una vista unica su ciò che conta: stato, KPI, owner e prossime azioni.",
        case2_b1: "Definizione KPI + struttura dati",
        case2_b2: "Dashboard con filtri (area / data)",
        case2_b3: "Cadenza follow-up + accountability",

        case3_t: "Lancio & documentazione trilingue (ES/EN/IT)",
        case3_d: "Localizzazione per landing, vendite e documentazione interna—tono business coerente.",
        case3_b1: "Versioni ES/EN/IT + allineamento tono",
        case3_b2: "Mini glossario (coerenza termini)",
        case3_b3: "Template riutilizzabili per aggiornamenti futuri",

        // PORTFOLIO: PDF UI SNAPSHOTS
        pf_asistencia_t: "Sistema Presenze Scolastiche (UI)",
        pf_asistencia_d: "Snapshot UI: catalogo + dashboard admin + report + generatore QR + scanner.",
        pf_controlinv_t: "ERP: ControlInventarios (UI)",
        pf_controlinv_d: "Snapshot UI di ERP multi-modulo per controllo inventario e operations.",
        pf_erpcont_t: "ERP Contabile Personalizzato (UI)",
        pf_erpcont_d: "Snapshot flussi contabili: fatture/CFDI, upload, configurazione e reporting.",

        pf_preview: "Anteprima",
        pf_view_pdf: "Vedi PDF",
        pf_modal_title: "Anteprima",
        pf_close: "Chiudi",
        pf_open_tab: "Apri in una nuova scheda",

        // FAQ
        faq_title: "FAQ",
        faq_sub: "Risposte rapide. Se mi dai contesto, propongo un piano minimo.",
        faq_q1: "Cosa costruisci esattamente?",
        faq_a1: "Sistemi interni che rendono affidabili le operazioni: tracker, dashboard, registri digitali, automazione leggera e documentazione chiara—più localizzazione trilingue quando serve.",
        faq_q2: "Come funziona l’onboarding?",
        faq_a2: "Brief breve (obiettivo, strumenti, timeline), poi un piano minimo: cosa fare prima, cosa può aspettare e com’è l’output. Consegniamo una versione utile e poi iteriamo.",
        faq_q3: "Sostituisci i nostri strumenti?",
        faq_a3: "Non necessariamente. Se esiste già un processo, lo ottimizzo senza romperlo. Se lo strumento è il problema, propongo una migrazione con tradeoff chiari.",
        faq_q4: "Lingue e tono?",
        faq_a4: "ES / EN / IT. Per lanci e messaggi a clienti, localizzo il tono (non traduzione letterale) per suonare naturale e coerente con il brand.",
        faq_q5: "Pagamenti?",
        faq_a5: "PayPal, Skrill o Crypto (USDT/USDC/DAI). Per scope grandi, possiamo definire milestone.",

        // PROCESS
        process_title: "Come lavoriamo",
        p1_b: "Brief rapido:",
        p1: "obiettivo, contesto, strumenti e timeline.",
        p2_b: "Disegnare la struttura:",
        p2_2: "data model, workflow e la versione minima utile da consegnare per prima.",
        p3_b: "Build, doc, iterazione:",
        p3_2: "deliverable pronti, doc minima e backlog chiaro.",
        process_output_b: "Output tipico",
        process_output_v: "Dashboard/tracker + SOP/checklist + regole naming + automazione (se serve).",

        // CONTACT
        contact_title: "Contatto",
        contact_desc: "Dimmi obiettivo + strumenti attuali + timeline. Rispondo con un piano semplice e la migliore opzione per partire.",
        contact_direct: "Diretto",
        contact_email_b: "Email:",
        contact_wa_b: "WhatsApp:",
        contact_loc_b: "Località:",
        contact_loc: "Mendoza, Argentina (GMT/UTC -03)",
        pay_b: "Pagamenti:",
        pay_v: "PayPal · Skrill · Crypto (USDT, USDC, DAI)",
        langs_line: "Lingue: Spagnolo (Nativo) · Inglese (C2) · Italiano (B2)",
        contact_fast: "Messaggio rapido",
        contact_fast_desc: "Per ora, WhatsApp o email.",
        response_time: "Tempo di risposta: entro 24 ore.",

        // CHAT
        chat_open: "Assistente",
        chat_title: "PMR Assistant",
        chat_sub: "Chiedi su servizi, prezzi, lingue, pagamenti o prossimi step.",
        chat_placeholder: "Scrivi una domanda…",
        chat_send: "Invia",

        // FOOTER
        footer: "PMR Studio · Business systems & digital operations",
        footer_privacy: "Privacy",
        footer_terms: "Termini"
      }
    };

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
      const dict = I18N[lang] || I18N.en;

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
