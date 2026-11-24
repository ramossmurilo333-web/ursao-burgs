/**
 * Nosso Cardápio: abas em cápsula + cards em slider.
 * - Abas: role="tablist"/"tab"/"tabpanel", setas ←/→, Home e End, ícone por categoria.
 * - Troca de categoria com transição curta (opacidade + deslocamento), sem saltar a página.
 * - Cards em faixa horizontal com scroll-snap: setas laterais e indicadores de página.
 *   Swipe nativo no celular; 3 cards visíveis no desktop, 2 no tablet, 1 no celular.
 * - Clique na foto ou em "Ver detalhes" abre o <dialog> (product-dialog.js).
 */
(function () {
  "use strict";
  const SITE = window.SITE;
  const C = SITE.config;
  const { el, slot, fill, setText, extLink, orderAction, img, prefersReducedMotion, highlighted, ICONS, priceText } = SITE.utils;

  let tabs = [], panel, tablist, wrap, current = null, swapping = null;
  let slider = null; // estado do slider da categoria atual

  /* ---------- Card do produto ---------- */
  function productCard(p) {
    const action = orderAction(p);
    const isFallback = action.label === C.menu.fallbackLabel;
    return el("li", { class: "slide" }, el("article", { class: "product-card" }, [
      el("button", { type: "button", class: "product-media", "data-product-open": p.id, tabindex: "-1", "aria-hidden": "true" },
        el("span", { class: "product-img" }, img(p.image, p.name, { width: 600, height: 600 }))),
      el("div", { class: "product-info" }, [
        el("h3", null, p.name),
        el("p", null, p.description),
        priceText(p) ? el("strong", { class: "product-price" }, priceText(p)) : null,
        el("div", { class: "card-foot" }, [
          extLink(action.href, action.label, "pill", isFallback ? { "aria-label": `${action.label}: ${p.name}` } : null),
          el("button", { type: "button", class: "text-btn", "data-product-open": p.id, "aria-label": `${C.menu.detailsLabel}: ${p.name}` }, C.menu.detailsLabel),
        ]),
      ]),
    ]));
  }

  /* ---------- Slider (setas + paginação) ---------- */
  function buildSlider(category) {
    const track = el("ul", { class: "slider-track", "aria-label": `Produtos: ${category.label}` }, category.products.map(productCard));
    const prev = el("button", { type: "button", class: "slider-arrow prev", "aria-label": "Produtos anteriores", html: ICONS.prev });
    const next = el("button", { type: "button", class: "slider-arrow next", "aria-label": "Próximos produtos", html: ICONS.next });
    const dots = el("div", { class: "slider-dots", role: "group", "aria-label": "Páginas do cardápio" });
    const root = el("div", { class: "slider" }, [el("div", { class: "slider-viewport" }, [prev, track, next]), dots]);

    const state = { track, prev, next, dots, root, perPage: 1, pages: 1, raf: 0 };

    const step = () => {
      const items = track.children;
      return items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth;
    };
    const maxScroll = () => track.scrollWidth - track.clientWidth;

    function layout() {
      const s = step();
      state.perPage = Math.max(1, Math.round(track.clientWidth / s));
      state.pages = Math.max(1, Math.ceil(track.children.length / state.perPage));
      const hasOverflow = maxScroll() > 4;
      root.classList.toggle("is-static", !hasOverflow);
      dots.replaceChildren(...(state.pages > 1 && hasOverflow ? Array.from({ length: state.pages }, (_, i) =>
        el("button", { type: "button", class: "dot", "aria-label": `Página ${i + 1} de ${state.pages}`, "data-page": i })) : []));
      update();
    }
    function currentPage() {
      if (track.scrollLeft >= maxScroll() - 4) return state.pages - 1;
      return Math.round(track.scrollLeft / (step() * state.perPage));
    }
    function update() {
      const max = maxScroll();
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= max - 4;
      const page = currentPage();
      [...dots.children].forEach((d, i) => d.setAttribute("aria-current", i === page ? "true" : "false"));
    }
    function goTo(page) {
      const left = Math.min(page * state.perPage * step(), maxScroll());
      track.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
    prev.addEventListener("click", () => goTo(Math.max(0, currentPage() - 1)));
    next.addEventListener("click", () => goTo(Math.min(state.pages - 1, currentPage() + 1)));
    dots.addEventListener("click", (e) => { const d = e.target.closest(".dot"); if (d) goTo(Number(d.dataset.page)); });
    track.addEventListener("scroll", () => { cancelAnimationFrame(state.raf); state.raf = requestAnimationFrame(update); }, { passive: true });

    state.layout = layout;
    return state;
  }

  function renderPanel(category) {
    panel.setAttribute("aria-labelledby", `tab-${category.id}`);
    panel.id = `panel-${category.id}`;
    slider = buildSlider(category);
    panel.replaceChildren(slider.root);
    slider.layout();
  }

  /* ---------- Abas ---------- */
  function activate(id, { focus = false } = {}) {
    const category = SITE.catalog.find((c) => c.id === id);
    if (!category || current === id) { if (focus) tabFor(id)?.focus(); return; }
    const first = current === null;
    current = id;

    tabs.forEach((t) => {
      const on = t.dataset.cat === id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    const tab = tabFor(id);
    if (focus) tab.focus({ preventScroll: true });
    revealTab(tab);

    if (first || prefersReducedMotion() || !panel.animate) { renderPanel(category); return; }

    if (swapping) swapping.cancel();
    panel.style.minHeight = panel.offsetHeight + "px";
    swapping = panel.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(6px)" }], { duration: 110, easing: "ease-in", fill: "forwards" });
    swapping.onfinish = () => {
      renderPanel(category);
      swapping = panel.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 220, easing: "cubic-bezier(.2,.7,.2,1)" });
      swapping.onfinish = () => { panel.style.minHeight = ""; swapping = null; };
    };
  }

  const tabFor = (id) => tabs.find((t) => t.dataset.cat === id);

  /** Mantém a aba ativa visível na cápsula rolável, sem mexer na rolagem vertical. */
  function revealTab(tab) {
    const pad = 16;
    const left = tab.offsetLeft - pad, right = tab.offsetLeft + tab.offsetWidth + pad;
    let target = null;
    if (left < tablist.scrollLeft) target = left;
    else if (right > tablist.scrollLeft + tablist.clientWidth) target = right - tablist.clientWidth;
    if (target !== null) tablist.scrollTo({ left: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  function updateOverflowHints() {
    const max = tablist.scrollWidth - tablist.clientWidth;
    wrap.classList.toggle("can-left", tablist.scrollLeft > 4);
    wrap.classList.toggle("can-right", tablist.scrollLeft < max - 4);
  }

  function onKeydown(e) {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let next = null;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    activate(tabs[next].dataset.cat, { focus: true });
  }

  function init() {
    panel = slot("panel");
    tablist = slot("tabs");
    wrap = slot("tabs-wrap");
    if (!panel || !tablist) return;

    const m = C.menu;
    setText("menu-eyebrow", m.eyebrow);
    fill("menu-title", highlighted(m.title));
    setText("menu-text", m.text);
    const cta = slot("menu-cta");
    cta.href = C.links.menu;
    cta.textContent = m.allCta;
    setText("menu-note", m.externalNote);

    tabs = SITE.catalog.map((cat) => el("button", {
      type: "button", role: "tab", class: "tab", id: `tab-${cat.id}`,
      "aria-controls": `panel-${cat.id}`, "aria-selected": "false", tabindex: "-1", "data-cat": cat.id,
    }, [cat.icon && ICONS[cat.icon] ? el("span", { class: "icon tab-icon", html: ICONS[cat.icon] }) : null, el("span", null, cat.label)]));
    fill("tabs", tabs);

    tablist.addEventListener("click", (e) => { const t = e.target.closest('[role="tab"]'); if (t) activate(t.dataset.cat); });
    tablist.addEventListener("keydown", onKeydown);
    tablist.addEventListener("scroll", updateOverflowHints, { passive: true });

    let resizeRaf = 0;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => { updateOverflowHints(); slider?.layout(); });
    }, { passive: true });

    activate(SITE.catalog[0].id);
    updateOverflowHints();
    // Fontes e imagens podem mudar medidas depois do carregamento
    window.addEventListener("load", () => { updateOverflowHints(); slider?.layout(); });
  }

  SITE.menuTabs = { init, activate };
})();
