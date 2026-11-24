/* =====================================================
   PMR STUDIO — pdf-preview.js
   - no dependencies
   - works with CSP script-src 'self' (no inline scripts)
   ===================================================== */

(() => {
  "use strict";

  const dlg = document.getElementById("pdfPreview");
  const frame = document.getElementById("pdfPreviewFrame");
  const title = document.getElementById("pdfPreviewTitle");
  const open = document.getElementById("pdfPreviewOpen");

  if (!dlg || !frame || !title || !open) return;

  const closePreview = () => {
    try { dlg.close(); } catch (_) {}
    frame.removeAttribute("src");
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-pdf-preview]");

    // OPEN
    if (btn) {
      const url = btn.getAttribute("data-pdf");
      if (!url) return;

      // Title: prefer the card's h4 (already localized via i18n)
      const h = btn.closest("article")?.querySelector("h4");
      const fallback = btn.getAttribute("data-title") || "Preview";
      const t = (h && h.textContent && h.textContent.trim()) ? h.textContent.trim() : fallback;

      title.textContent = t;
      const pdfUrl = new URL(url, window.location.origin).href;

      open.href = pdfUrl;

// fuerza reload limpio (evita que quede “pegado” al home)
      frame.removeAttribute("src");
      frame.src = pdfUrl;


      try { dlg.showModal(); } catch (_) {}
      return;
    }

    // CLOSE
    if (e.target.closest("[data-close]")) closePreview();
  });

  dlg.addEventListener("close", () => {
    frame.removeAttribute("src");
  });

  // click outside closes
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) closePreview();
  });

  // Esc closes
  dlg.addEventListener("cancel", (e) => {
    e.preventDefault();
    closePreview();
  });
})();
