/**
 * Utilitários compartilhados pelos componentes.
 */
(function () {
  "use strict";
  const SITE = window.SITE;
  const C = SITE.config;

  /** Cria elemento com atributos e filhos. Texto é sempre inserido como texto. */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === undefined || v === null || v === false) continue;
        if (k === "class") node.className = v;
        else if (k === "html") node.innerHTML = v; // apenas ícones internos
        else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? "" : v);
      }
    }
    [].concat(children ?? []).flat().forEach((c) => {
      if (c === undefined || c === null || c === false) return;
      node.append(c instanceof Node ? c : document.createTextNode(String(c)));
    });
    return node;
  }

  const slot = (name, root) => (root || document).querySelector(`[data-slot="${name}"]`);
  const fill = (name, ...nodes) => { const s = slot(name); if (s) s.replaceChildren(...nodes.flat().filter(Boolean)); return s; };
  const setText = (name, value) => { const s = slot(name); if (s) s.textContent = value ?? ""; return s; };
  const isFilled = (v) => typeof v === "string" && v.trim() !== "";

  /** URL absoluta de um asset (aceita caminho relativo ao assetBase ou URL completa). */
  const asset = (path) => (!isFilled(path) ? "" : /^(https?:)?\/\//.test(path) || path.startsWith("data:") ? path : (C.assetBase || "") + path);

  const whatsappUrl = (() => {
    const w = C.links.whatsapp;
    return `https://wa.me/${String(w.number).replace(/\D/g, "")}` + (w.message ? `?text=${encodeURIComponent(w.message)}` : "");
  })();

  /** Link externo em nova aba. */
  const extLink = (href, children, cls, extra) =>
    el("a", Object.assign({ href, class: cls, target: "_blank", rel: "noopener" }, extra || {}), children);

  /** Destino e rótulo do botão de pedido de um produto (regra do orderUrl). */
  function orderAction(product) {
    const hasLink = isFilled(product.orderUrl);
    return {
      href: hasLink ? product.orderUrl : C.links.menu,
      label: hasLink ? `${C.menu.orderPrefix} ${product.name}` : C.menu.fallbackLabel,
    };
  }

  /** Título com trecho [[destacado]]. */
  function highlighted(str) {
    const frag = document.createDocumentFragment();
    String(str).split(/(\[\[.+?\]\])/).forEach((part) => {
      const m = part.match(/^\[\[(.+)\]\]$/);
      frag.append(m ? el("span", { class: "hl" }, m[1]) : document.createTextNode(part));
    });
    return frag;
  }

  /** <img> com lazy loading por padrão; sinaliza erro de carregamento sem quebrar o layout. */
  function img(path, alt, opts) {
    opts = opts || {};
    const node = el("img", {
      src: asset(path), alt: alt || "",
      width: opts.width, height: opts.height,
      loading: opts.eager ? "eager" : "lazy",
      fetchpriority: opts.eager ? "high" : undefined,
      decoding: "async", draggable: "false",
    });
    node.addEventListener("error", () => node.classList.add("img-error"), { once: true });
    return node;
  }

  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const ICONS = {
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="3.6" height="14" rx="1"/><rect x="13.9" y="5" width="3.6" height="14" rx="1"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>',
    expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.17-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.07.9.9-2.98-.2-.31a8.2 8.2 0 1 1 6.87 3.72Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.96-.14.17-.29.19-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.43l-.76-1.82c-.2-.48-.4-.41-.56-.42h-.47a.9.9 0 0 0-.65.3 2.7 2.7 0 0 0-.85 2.02 4.7 4.7 0 0 0 .99 2.5c.12.16 1.7 2.6 4.13 3.65 1.53.66 2.13.72 2.9.6.46-.07 1.46-.6 1.66-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2" stroke-linecap="round"/></svg>',
  };
  // Ícones de traço (stroke) para seções e abas
  const S = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  Object.assign(ICONS, {
    leaf: S('<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z"/><path d="M5 19 13 11"/>'),
    flame: S('<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.2 1.2-3.6 2.4-4.6.3 1.8 1.1 2.9 2.1 3.4C11 9 11 6 12 3Z"/>'),
    badge: S('<circle cx="12" cy="9" r="5.5"/><path d="m9.5 13.8-1.3 6.7L12 18.6l3.8 1.9-1.3-6.7"/><path d="m10 9 1.4 1.4L14.2 7.6"/>'),
    bike: S('<circle cx="6" cy="16.5" r="3"/><circle cx="18" cy="16.5" r="3"/><path d="M6 16.5h6l3-6h3"/><path d="M9 9h4l2 4.5"/><path d="M15 6.5h2.5"/>'),
    menu: S('<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>'),
    burger: S('<path d="M4.5 10.5C4.5 6.9 7.9 4.5 12 4.5s7.5 2.4 7.5 6Z"/><path d="M3.5 13.5h17"/><path d="M5 16.5h14a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3Z"/>'),
    combo: S('<path d="M3.5 11h10.5l-1 9H4.5Z"/><path d="M6 11V8.5a2.7 2.7 0 0 1 5.5 0V11"/><path d="M16.5 8.5h4l-.8 11.5h-2.4Z"/><path d="M18.5 8.5 19.5 4"/>'),
    hotdog: S('<path d="M5 15.5c-1.8-1.8-1.6-4.3.2-5.6l7.6-5.5c1.9-1.4 4.6-.8 5.7 1.3s.5 4.2-1.3 5.4l-7.6 5.5c-1.8 1.3-3.6.9-4.6-1.1Z"/><path d="M8.5 12.2c1.3-.4 1.8-1.8 3.1-2.1s1.9-1.7 3.2-2"/><path d="M5.5 18.5h13"/>'),
    fries: S('<path d="M5 11h14l-1.6 9.2a1 1 0 0 1-1 .8H7.6a1 1 0 0 1-1-.8L5 11Z"/><path d="M8 11V4.5M11 11V3M14 11V4M17 11V5.5"/>'),
    dessert: S('<path d="M5 12.5a7 7 0 0 1 14 0Z"/><path d="M5.5 12.5 7.5 20h9l2-7.5"/><path d="M12 5.5V3.5"/>'),
    pin: S('<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.4"/>'),
    clock: S('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    phone: S('<path d="M6.5 3.5h3l1.5 4-2 1.3a10 10 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"/>'),
    store: S('<path d="M4 9.5 5.5 4h13L20 9.5"/><path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/><path d="M5.5 11.5V20h13v-8.5"/>'),
    chevron: S('<path d="m6 9 6 6 6-6"/>'),
  });

  const icon = (name, cls) => el("span", { class: "icon" + (cls ? " " + cls : ""), html: ICONS[name] || "" });

  /** Busca produto pelo id em todas as categorias. */
  function findProduct(id) {
    for (const cat of SITE.catalog) {
      const p = cat.products.find((x) => x.id === id);
      if (p) return { product: p, category: cat };
    }
    return null;
  }

  /** Preço formatado: "R$ 22,00" ou, com priceFrom, "A partir de R$ 16,00". Vazio se não houver preço. */
  function priceText(product) {
    if (typeof product.price !== "number") return "";
    const v = product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace(/ /g, " ");
    return product.priceFrom ? `A partir de ${v}` : v;
  }

  SITE.utils = { el, slot, fill, setText, isFilled, asset, whatsappUrl, extLink, orderAction, highlighted, img, icon, ICONS, prefersReducedMotion, finePointer, findProduct, priceText };
})();
