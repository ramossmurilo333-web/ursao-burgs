/**
 * Janela de detalhes do produto (apenas apresentação — sem pedido/checkout).
 * Usa <dialog> nativo: foco contido, Esc fecha. Devolve o foco ao elemento
 * de origem e trava a rolagem da página enquanto está aberta.
 */
(function () {
  "use strict";
  const SITE = window.SITE;
  const C = SITE.config;
  const { slot, setText, fill, extLink, orderAction, img, findProduct, ICONS, isFilled, priceText } = SITE.utils;

  let dialog, returnFocus = null;

  function open(productId, trigger) {
    const found = findProduct(productId);
    if (!found || !dialog) return;
    const { product, category } = found;
    returnFocus = trigger || document.activeElement;

    setText("dialog-category", category.label);
    setText("dialog-title", product.name);
    setText("dialog-desc", product.description);
    setText("dialog-price", priceText(product));
    fill("dialog-media", img(product.image, product.name, { eager: true }));
    const action = orderAction(product);
    fill("dialog-cta", extLink(action.href, action.label, "btn btn-primary btn-block"));
    setText("dialog-note", isFilled(product.orderUrl) ? "" : C.menu.externalNote);

    document.documentElement.classList.add("dialog-open");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    dialog.querySelector(".dialog-inner").scrollTop = 0;
    dialog.querySelector("[data-dialog-close]").focus();
  }

  function close() {
    if (!dialog || !dialog.open) return;
    if (typeof dialog.close === "function") dialog.close(); else { dialog.removeAttribute("open"); onClosed(); }
  }

  function onClosed() {
    document.documentElement.classList.remove("dialog-open");
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  }

  function init() {
    dialog = slot("dialog");
    if (!dialog) return;
    dialog.querySelector("[data-dialog-close]").innerHTML = ICONS.close;
    dialog.addEventListener("close", onClosed);
    dialog.addEventListener("cancel", () => { /* Esc: o próprio dialog fecha */ });
    // Mantém o Tab circulando dentro da janela (o modal nativo deixaria sair para o navegador).
    dialog.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const items = [...dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((n) => n.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    dialog.addEventListener("click", (e) => {
      if (e.target.closest("[data-dialog-close]")) return close();
      if (e.target === dialog) close(); // clique no fundo escurecido
    });

    // Qualquer elemento com data-product-open="id" abre os detalhes.
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-product-open]");
      if (!t || t.dataset.dragged === "1") return;
      e.preventDefault();
      open(t.dataset.productOpen, t);
    });
  }

  SITE.productDialog = { init, open, close };
})();
