/**
 * Componentes de apresentação: cabeçalho, hero, Nossa História, Peça Online,
 * Localização, depoimentos, Perguntas Frequentes, CTA final, rodapé e WhatsApp.
 * (O cardápio fica em menu-tabs.js e o carrossel em carousel.js.)
 */
(function () {
  "use strict";
  const SITE = window.SITE;
  const C = SITE.config;
  const { el, slot, fill, setText, isFilled, whatsappUrl, extLink, highlighted, img, icon, findProduct } = SITE.utils;

  const menuLink = (label, cls) => extLink(C.links.menu, label, cls || "btn btn-primary");

  // Seções opcionais: só aparecem com dados reais
  const testimonials = (C.testimonials?.items || []).filter((t) => isFilled(t.text) && isFilled(t.author) && isFilled(t.source));
  const loc = C.location || {};
  const locationReady = isFilled(loc.address) && Array.isArray(loc.hours) && loc.hours.length > 0 && isFilled(loc.mapQuery);
  const available = { localizacao: locationReady, depoimentos: testimonials.length > 0 };

  function applyTheme() {
    const map = { bg: "--bg", surface: "--surface", primary: "--primary", primaryHover: "--primary-hover", onPrimary: "--on-primary", burnt: "--burnt", accent: "--accent", text: "--text", muted: "--muted" };
    for (const [k, v] of Object.entries(C.colors || {})) if (map[k] && v) document.documentElement.style.setProperty(map[k], v);
  }

  /* ---------- Cabeçalho: nome em texto (a logo fica só no hero) ---------- */
  function renderHeader() {
    const mark = slot("wordmark");
    mark.replaceChildren(highlighted(C.brand.wordmark || C.brand.name));
    mark.setAttribute("aria-label", `${C.brand.name} — início`);

    fill("nav", C.header.nav
      .filter((n) => available[n.target] !== false && document.getElementById(n.target))
      .map((n) => el("li", null, el("a", { href: `#${n.target}` }, n.label))));

    const cta = slot("header-cta");
    cta.href = C.links.menu;
    cta.textContent = C.header.cta;
  }

  /* ---------- Hero ---------- */
  function renderHero() {
    const h = C.hero, logo = C.brand.logo;
    fill("hero-title", highlighted(h.title));
    setText("hero-text", h.text);
    fill("hero-ctas",
      el("a", { href: `#${h.primary.target}`, class: "btn btn-primary" }, h.primary.label),
      menuLink(h.secondary.label, "btn btn-ghost"));
    fill("hero-logo", img(logo.src, logo.alt, { eager: true, width: logo.width, height: logo.height }));
  }

  /* ---------- Nossa História ---------- */
  function renderStory() {
    const s = C.story;
    if (!s) { document.getElementById("historia")?.remove(); return; }
    setText("story-eyebrow", s.eyebrow);
    fill("story-title", highlighted(s.title));
    fill("story-body", s.paragraphs.map((p) => el("p", null, p)));

    const photos = (s.photos || []).map((id) => findProduct(id)?.product).filter(Boolean).slice(0, 3);
    fill("story-mosaic", photos.map((p, i) =>
      el("figure", { class: `mosaic-item mosaic-${i === 0 ? "main" : "small"}` }, [
        img(p.image, p.name, { width: 800, height: 800 }),
        s.badge && s.badge.photo === i ? el("span", { class: "photo-badge" }, s.badge.label) : null,
      ])));

    fill("story-highlights", (s.highlights || []).map((h) =>
      el("li", { class: "highlight" }, [
        el("span", { class: "highlight-icon", html: SITE.utils.ICONS[h.icon] || "" }),
        el("div", null, [el("h3", null, h.title), el("p", null, h.text)]),
      ])));
  }

  /* ---------- Peça Online (cards apenas informativos, sem links) ---------- */
  function renderOrderOnline() {
    const o = C.orderOnline;
    if (!o) { document.getElementById("peca-online")?.remove(); return; }
    setText("online-eyebrow", o.eyebrow);
    fill("online-title", highlighted(o.title));
    setText("online-text", o.text);
    fill("online-channels", o.channels.map((ch) =>
      el("li", { class: "channel" }, [
        el("span", { class: "channel-icon", html: SITE.utils.ICONS[ch.icon] || "" }),
        el("div", { class: "channel-text" }, [
          el("span", { class: "channel-label" }, ch.label),
          el("strong", null, ch.name),
          isFilled(ch.detail) ? el("span", { class: "channel-detail" }, ch.detail) : null,
        ]),
      ])));
    const media = slot("online-media");
    if (isFilled(o.image?.src)) {
      media.replaceChildren(
        img(o.image.src, o.image.alt, { width: o.image.width, height: o.image.height }),
        isFilled(o.badge) ? el("figcaption", { class: "photo-badge photo-badge-lg" }, [icon("bike"), o.badge]) : null);
    } else media.remove();
  }

  /* ---------- Localização com Google Maps ---------- */
  function renderLocation() {
    const section = document.getElementById("localizacao");
    if (!locationReady) { section.remove(); return; }
    section.hidden = false;
    setText("location-eyebrow", loc.eyebrow);
    fill("location-title", highlighted(loc.title));

    const q = encodeURIComponent(loc.mapQuery);
    const directions = `https://www.google.com/maps/search/?api=1&query=${q}`;
    const row = (ic, term, desc) => el("div", { class: "info-row" }, [
      el("span", { class: "info-icon", html: SITE.utils.ICONS[ic] }),
      el("div", null, [el("dt", null, term), el("dd", null, desc)]),
    ]);
    fill("location-info",
      row("pin", "Endereço", [isFilled(loc.place) ? el("strong", null, loc.place) : null, isFilled(loc.place) ? el("br") : null, loc.address]),
      row("clock", "Horário de funcionamento", el("ul", { class: "hours" }, loc.hours.map((h) =>
        el("li", { class: /fechado/i.test(h.time) ? "is-closed" : null }, [el("span", null, h.days), el("span", null, h.time)])))),
      loc.phone ? row("phone", "Telefone / WhatsApp", el("a", { href: `tel:${loc.phone.tel}`, class: "text-link" }, loc.phone.display)) : null);

    fill("location-ctas",
      extLink(directions, [icon("pin"), loc.cta], "btn btn-primary"),
      extLink(whatsappUrl, [icon("whatsapp"), "WhatsApp"], "btn btn-ghost"));

    fill("location-map", el("iframe", {
      src: `https://www.google.com/maps?q=${q}&output=embed`,
      title: `Mapa: ${loc.place || C.brand.name}, ${loc.address}`,
      loading: "lazy", referrerpolicy: "no-referrer-when-downgrade", allowfullscreen: true,
    }));
  }

  function renderTestimonials() {
    const section = document.getElementById("depoimentos");
    if (!testimonials.length) { section.remove(); return; }
    section.hidden = false;
    setText("testimonials-title", C.testimonials.title);
    fill("testimonials", testimonials.map((t) =>
      el("li", null, el("figure", { class: "testimonial" }, [
        el("blockquote", null, el("p", null, `“${t.text}”`)),
        el("figcaption", null, [el("strong", null, t.author), " · ", isFilled(t.sourceUrl) ? extLink(t.sourceUrl, t.source) : t.source]),
      ]))));
  }

  /* ---------- Perguntas Frequentes: grade de cards com accordion ---------- */
  function renderFaq() {
    const f = C.faq;
    setText("faq-eyebrow", f.eyebrow);
    fill("faq-title", highlighted(f.title));
    fill("faq", f.items.map((item, i) => {
      const answer = el("div", { class: "faq-answer" }, el("p", null, item.a));
      const details = el("details", { class: "faq-item" }, [
        el("summary", { id: `faq-q-${i}` }, [el("span", null, item.q), icon("chevron", "faq-icon")]),
        answer,
      ]);
      animateDetails(details, answer);
      return details;
    }));
  }

  function animateDetails(details, content) {
    const summary = details.querySelector("summary");
    let anim = null;
    summary.addEventListener("click", (e) => {
      if (SITE.utils.prefersReducedMotion() || !content.animate) return; // comportamento nativo
      e.preventDefault();
      if (anim) anim.cancel();
      const opening = !details.open;
      const start = content.offsetHeight;
      if (opening) details.open = true;
      const end = opening ? content.scrollHeight : 0;
      content.style.overflow = "hidden";
      anim = content.animate(
        [{ height: `${opening ? 0 : start}px`, opacity: opening ? 0 : 1 }, { height: `${end}px`, opacity: opening ? 1 : 0 }],
        { duration: 220, easing: "cubic-bezier(.2,.7,.2,1)" });
      anim.onfinish = () => { if (!opening) details.open = false; content.style.overflow = ""; anim = null; };
    });
  }

  function renderFinal() {
    const f = C.finalCta;
    fill("final-title", highlighted(f.title));
    setText("final-text", f.text);
    fill("final-ctas", menuLink(f.primary), extLink(whatsappUrl, [icon("whatsapp"), f.secondary], "text-link wa-link"));
    // Fundo da seção (config.finalCta.background):
    //   "logo"            → logo da marca desfocada
    //   "logo-marca"      → logo nítida e bem apagada (marca d'água)
    //   "itens/....jpg"   → foto desfocada e escurecida
    const section = slot("final-title")?.closest(".final-cta");
    const bg = f.background;
    if (section && isFilled(bg)) {
      const isLogo = bg === "logo" || bg === "logo-marca";
      const src = isLogo ? C.brand.logo.src : bg;
      const mode = bg === "logo" ? "is-logo" : bg === "logo-marca" ? "is-logo is-watermark" : "is-photo";
      section.prepend(el("div", { class: `final-bg ${mode}`, "aria-hidden": "true" }, img(src, "")));
      section.classList.add("has-bg");
    }
  }

  function renderFooter() {
    const item = (href, ic, label) => el("li", null, extLink(href, [icon(ic), label]));
    fill("footer",
      el("div", { class: "footer-brand" }, [
        img(C.brand.logo.src, "", { width: 52, height: 52 }),
        el("p", { class: "footer-name" }, highlighted(C.brand.wordmark || C.brand.name)),
      ]),
      el("ul", { class: "footer-links" }, [
        item(C.links.menu, "bag", "Cardápio online"),
        item(C.links.instagram, "instagram", "Instagram"),
        item(whatsappUrl, "whatsapp", "WhatsApp"),
      ]),
      el("div", { class: "footer-meta" }, [
        locationReady ? el("p", null, [isFilled(loc.place) ? `${loc.place} · ` : "", loc.address]) : null,
        locationReady ? el("p", null, loc.hours.map((h) => `${h.days}: ${h.time}`).join(" · ")) : null,
        el("p", null, `© ${new Date().getFullYear()} ${C.brand.name}.`),
      ]));
  }

  function renderWhatsapp() {
    const wa = slot("wa-float");
    wa.href = whatsappUrl;
    wa.setAttribute("aria-label", C.whatsappFloat.label);
    wa.title = C.whatsappFloat.label;
    wa.innerHTML = SITE.utils.ICONS.whatsapp;

    const bar = slot("mobile-bar");
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Ações rápidas");
    fill("mobile-bar",
      menuLink(C.mobileBar.primary),
      extLink(whatsappUrl, [icon("whatsapp"), el("span", null, C.mobileBar.whatsapp)], "btn btn-ghost btn-wa"));
  }

  SITE.sections = {
    render() {
      applyTheme();
      renderHeader();
      renderHero();
      renderStory();
      renderOrderOnline();
      renderLocation();
      renderTestimonials();
      renderFaq();
      renderFinal();
      renderFooter();
      renderWhatsapp();
    },
  };
})();
