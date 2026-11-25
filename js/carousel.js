/**
 * Carrossel de destaques — sem biblioteca.
 * - Rolagem horizontal nativa: swipe no celular sem bloquear a rolagem vertical.
 * - Arrastar com mouse no desktop.
 * - Avanço automático lento em loop (cópias decorativas com aria-hidden/inert).
 * - Sem botões: rola sempre. Pausa só enquanto o mouse está em cima, o dedo está
 *   na tela, a pessoa arrasta ou navega pelo teclado; depois volta sozinho.
 * - config.carousel.respectReducedMotion decide se quem pediu menos movimento
 *   no sistema vê o carrossel parado.
 * - Para sozinho fora da tela ou com a aba do navegador oculta.
 * - Clique/toque em um item abre os detalhes do produto.
 */
(function () {
  "use strict";
  const SITE = window.SITE;
  const C = SITE.config;
  const { el, slot, setText, img, findProduct, prefersReducedMotion } = SITE.utils;

  const COPIES = 3; // [cópia][original][cópia]

  function init() {
    const section = slot("showcase");
    const scroller = slot("carousel");
    const track = slot("carousel-track");
    if (!section || !scroller) return;

    const products = (C.carousel?.items || []).map((id) => findProduct(id)?.product).filter(Boolean);
    if (products.length < 2) { section.remove(); return; }

    section.hidden = false;
    setText("showcase-title", C.carousel.label);
    setText("showcase-hint", C.carousel.hint);
    scroller.setAttribute("aria-label", C.carousel.label);

    const item = (p, clone) => el("li", { class: "carousel-item", "aria-hidden": clone ? "true" : null, inert: clone ? true : null },
      el("button", { type: "button", class: "carousel-card", "data-product-open": p.id, "aria-label": clone ? null : `${p.name}: ver detalhes` }, [
        el("span", { class: "carousel-img" }, img(p.image, clone ? "" : p.name, { width: 400, height: 400 })),
        el("span", { class: "carousel-name" }, p.name),
      ]));
    for (let c = 0; c < COPIES; c++) products.forEach((p) => track.append(item(p, c !== 1)));

    // Estado
    let setWidth = 0, pos = 0, last = 0, raf = 0;
    // Rola sempre. Só fica parado se config.carousel.autoplay for false, ou se
    // respectReducedMotion for true e a pessoa tiver pedido menos movimento no sistema.
    const disabled = C.carousel.autoplay === false || (C.carousel.respectReducedMotion === true && prefersReducedMotion());
    // Pausas temporárias: mouse em cima, dedo na tela, arrastando, foco pelo teclado.
    let hovering = false, touching = false, dragging = false, focused = false;
    let onScreen = true, pageVisible = !document.hidden;
    const speed = C.carousel.speed || 28;

    function measure() {
      const items = track.children;
      setWidth = items[products.length].offsetLeft - items[0].offsetLeft;
    }
    function normalize() {
      if (!setWidth) return 0;
      let shift = 0;
      if (scroller.scrollLeft < setWidth * 0.5) shift = setWidth;
      else if (scroller.scrollLeft > setWidth * 1.5) shift = -setWidth;
      if (shift) { scroller.scrollLeft += shift; pos = scroller.scrollLeft; }
      return shift;
    }
    const step = () => (track.children[1].offsetLeft - track.children[0].offsetLeft) || 240;

    const shouldPlay = () => !disabled && !hovering && !touching && !dragging && !focused && onScreen && pageVisible;
    function tick(t) {
      if (!shouldPlay()) { raf = 0; return; }
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      pos += speed * dt;
      scroller.scrollLeft = pos;
      normalize();
      raf = requestAnimationFrame(tick);
    }
    function sync() {
      if (shouldPlay() && !raf) { pos = scroller.scrollLeft; last = 0; raf = requestAnimationFrame(tick); }
      else if (!shouldPlay() && raf) { cancelAnimationFrame(raf); raf = 0; }
      section.classList.toggle("is-playing", shouldPlay());
    }

    // Mouse em cima (só mouse de verdade: no celular o toque também dispara eventos de mouse)
    scroller.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovering = true; sync(); } });
    scroller.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hovering = false; sync(); } });

    // Dedo na tela: para enquanto o dedo estiver em cima e volta logo depois de soltar
    // (pequena espera para o deslize do swipe terminar).
    let touchTimer = 0;
    scroller.addEventListener("touchstart", () => { clearTimeout(touchTimer); touching = true; sync(); }, { passive: true });
    const touchEnd = () => { clearTimeout(touchTimer); touchTimer = setTimeout(() => { touching = false; sync(); }, 700); };
    scroller.addEventListener("touchend", touchEnd, { passive: true });
    scroller.addEventListener("touchcancel", touchEnd, { passive: true });

    // Foco pelo teclado (Tab): para enquanto o foco estiver na esteira. Toque/clique não conta.
    scroller.addEventListener("focusin", (e) => { focused = e.target.matches(":focus-visible"); sync(); });
    scroller.addEventListener("focusout", (e) => { if (!scroller.contains(e.relatedTarget)) { focused = false; sync(); } });
    scroller.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      normalize();
      scroller.scrollBy({ left: (e.key === "ArrowRight" ? 1 : -1) * step(), behavior: prefersReducedMotion() ? "auto" : "smooth" });
    });
    scroller.addEventListener("scroll", () => { if (!raf) normalize(); }, { passive: true });

    // Arrastar com mouse: para durante o arraste e volta ao soltar
    let drag = null, suppressClick = false;
    scroller.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { x: e.clientX, start: scroller.scrollLeft, moved: false, id: e.pointerId };
    });
    scroller.addEventListener("pointermove", (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 5) {
        drag.moved = true;
        scroller.setPointerCapture(drag.id);
        scroller.classList.add("is-dragging");
        dragging = true; sync();
      }
      if (drag.moved) {
        scroller.scrollLeft = drag.start - dx;
        const shift = normalize();
        if (shift) drag.start += shift;
      }
    });
    const endDrag = () => {
      if (!drag) return;
      if (drag.moved) { suppressClick = true; setTimeout(() => (suppressClick = false), 0); }
      scroller.classList.remove("is-dragging");
      drag = null;
      dragging = false; sync();
    };
    scroller.addEventListener("pointerup", endDrag);
    scroller.addEventListener("pointercancel", endDrag);
    scroller.addEventListener("click", (e) => { if (suppressClick) { e.preventDefault(); e.stopPropagation(); } }, true);
    scroller.addEventListener("dragstart", (e) => e.preventDefault());

    // Fora da tela / aba oculta
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync(); }).observe(scroller);
    }
    document.addEventListener("visibilitychange", () => { pageVisible = !document.hidden; sync(); });

    // Posição inicial no conjunto do meio
    const start = () => { measure(); scroller.scrollLeft = setWidth; pos = setWidth; };
    start();
    window.addEventListener("resize", () => { const ratio = setWidth ? scroller.scrollLeft / setWidth : 1; measure(); scroller.scrollLeft = ratio * setWidth; pos = scroller.scrollLeft; }, { passive: true });
    sync();
  }

  SITE.carousel = { init };
})();
