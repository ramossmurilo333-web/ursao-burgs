/**
 * Inicialização: monta as seções e liga as interações gerais
 * (cabeçalho ao rolar, menu mobile, revelação discreta na rolagem).
 */
(function () {
  "use strict";
  const SITE = window.SITE;
  if (!SITE || !SITE.config || !SITE.catalog) { console.error("Configuração ausente: confira js/config.js e js/catalog.js."); return; }

  function initHeader() {
    const header = document.querySelector(".site-header");
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Logo do topo: o cabeçalho é fixo, então a âncora #topo não rola sozinha.
    document.querySelector(".wordmark")?.addEventListener("click", (e) => {
      e.preventDefault();
      setOpen(false);
      window.scrollTo({ top: 0, behavior: SITE.utils.prefersReducedMotion() ? "auto" : "smooth" });
      history.replaceState(null, "", location.pathname + location.search);
    });

    const toggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("main-nav");
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      nav.classList.toggle("is-open", open);
      header.classList.toggle("menu-open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener("click", (e) => {
      if (nav.classList.contains("is-open") && !header.contains(e.target)) setOpen(false);
    });
    window.matchMedia("(min-width: 900px)").addEventListener("change", () => setOpen(false));
  }

  /** Revelação discreta: o conteúdo só fica oculto depois que o JS confirma que vai revelá-lo. */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || SITE.utils.prefersReducedMotion()) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    items.forEach((i) => {
      if (i.getBoundingClientRect().top < window.innerHeight) return; // já visível: não esconde
      i.classList.add("reveal-armed");
      io.observe(i);
    });
  }

  function reportPending() {
    const notes = [];
    if (!SITE.utils.isFilled(SITE.config.location?.address)) notes.push("Localização: endereço, horários e link do mapa não confirmados (seção oculta).");
    if (SITE.config.assetBase.startsWith("http")) notes.push("Imagens servidas pelo CDN do InstaDelivery. Rode scripts/baixar-imagens.sh para hospedar localmente.");
    if (notes.length) console.info(`[${SITE.config.brand.name}] Pendências:\n- ` + notes.join("\n- "));
  }

  function run(step, name) {
    try { step(); } catch (err) { console.error(`Falha em ${name}:`, err); }
  }

  run(SITE.sections.render, "seções");
  run(initHeader, "cabeçalho");
  run(SITE.productDialog.init, "janela de detalhes");
  run(SITE.menuTabs.init, "menu com abas");
  run(SITE.carousel.init, "carrossel");
  run(initReveal, "revelação");
  run(reportPending, "pendências");
})();
