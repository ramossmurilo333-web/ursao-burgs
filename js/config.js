/**
 * CONFIGURAÇÃO DA MARCA, LINKS E TEXTOS
 * ---------------------------------------------------------------
 * Para reutilizar a base em outra hamburgueria, troque este arquivo
 * e o js/catalog.js. Os componentes leem tudo daqui.
 * Em títulos, o trecho entre [[ ]] fica em laranja.
 */
window.SITE = window.SITE || {};

window.SITE.config = {
  // Base das imagens: cópias locais em assets/cdn/ (baixadas com scripts/baixar-imagens.*).
  // As fotos *_hd.jpg foram melhoradas com IA (Real-ESRGAN).
  assetBase: "assets/cdn/",

  brand: {
    name: "Ursão Burg’s",
    wordmark: "Ursão [[Burg’s]]", // texto do cabeçalho
    logo: { src: "stores/logo/1712865544661841081c224.png", alt: "Ursão Burg’s", width: 500, height: 500 },
  },

  colors: {
    bg: "#101010",
    surface: "#1C1C1C",
    primary: "#FF7A1A",
    primaryHover: "#FF9440",
    onPrimary: "#101010",
    burnt: "#A84414",
    accent: "#B92B26",
    text: "#FFF3E6",
    muted: "#BDB5AD",
  },

  links: {
    menu: "https://instadelivery.com.br/ursaoburgs",
    instagram: "https://www.instagram.com/ursaoartesanaloficial/",
    whatsapp: {
      number: "5521964528360",
      message: "Oi, pessoal do Ursão! Vim pelo site e tenho uma dúvida sobre o pedido.",
    },
  },

  header: {
    nav: [
      { label: "Nossa História", target: "historia" },
      { label: "Cardápio", target: "cardapio" },
      { label: "Localização", target: "localizacao" }, // some sozinho sem dados de localização
      { label: "FAQ", target: "faq" },
    ],
    cta: "Fazer pedido",
  },

  hero: {
    title: "Qual vai ser o seu [[Ursão]] de hoje?",
    text: "Explore os burgers e combos da casa. Escolha o seu e peça pelo cardápio online.",
    primary: { label: "Escolher meu Ursão", target: "cardapio" },
    secondary: { label: "Ver cardápio completo" },
  },

  carousel: {
    label: "Burgers da casa",
    hint: "Arraste para explorar · toque para ver detalhes",
    items: ["ze-colmeia", "big-ursao", "ursao-monster", "explosao-de-queijo", "big-ursao-2", "triplo-cheddar"],
    speed: 28,              // px por segundo
    autoplay: true,         // começa rolando ao carregar a página
    respectReducedMotion: false, // true = começa parado para quem ativou "reduzir movimento" no sistema
  },

  story: {
    eyebrow: "Nossa história",
    title: "Mais que uma hamburgueria, uma [[paixão]]",
    paragraphs: [
      "No Ursão Burg’s, cada burger é pensado para ter personalidade: pão brioche, blends suculentos, queijo derretido e combinações que vão dos clássicos às receitas com queijo coalho, camarão ou cupim.",
      "Além dos burgers, tem hot dogs, porções, sobremesas e combos para dividir. Seja para o lanche da noite ou para reunir a galera, escolha como vai ser seu momento Ursão.",
    ],
    // Mosaico: 1 foto grande + 2 menores (ids do catalog.js)
    photos: ["big-ursao-2", "ze-colmeia", "ursao-monster"],
    badge: { photo: 2, label: "Artesanal" }, // selo em uma das fotos menores (1 ou 2)
    highlights: [
      { icon: "leaf", title: "Ingredientes Frescos", text: "Carnes e ingredientes selecionados todo dia" },
      { icon: "flame", title: "Preparo Artesanal", text: "Feito na hora, com cuidado" },
      { icon: "badge", title: "Qualidade Garantida", text: "Sabor inconfundível em cada pedido" },
    ],
  },

  menu: {
    eyebrow: "Sabores únicos",
    title: "Nosso [[cardápio]]",
    text: "Burgers artesanais, combos, hot dogs, porções e sobremesas. Escolha a categoria e encontre seu próximo favorito.",
    detailsLabel: "Ver detalhes",
    orderPrefix: "Pedir",            // "Pedir Zé Colmeia" quando houver orderUrl confirmado
    fallbackLabel: "Ver no cardápio",
    allCta: "Ver cardápio completo",
    externalNote: "Pedidos, adicionais e valores no cardápio online.",
  },

  // Canais apenas informativos (sem links), como pedido.
  orderOnline: {
    eyebrow: "Peça online",
    title: "Receba seu [[Ursão\u00a0Burg’s]] onde estiver",
    text: "Faça seu pedido pelos canais oficiais e receba em casa com todo o sabor do Ursão.",
    channels: [
      { icon: "bike", label: "Peça pelo", name: "iFood" },
      { icon: "instagram", label: "Peça pela", name: "Loja do Instagram", detail: "@ursaoartesanaloficial" },
      { icon: "menu", label: "Peça pelo", name: "Cardápio Online", detail: "instadelivery.com.br/ursaoburgs" },
    ],
    image: { src: "itens/167786438364022dbf531b7_hd.jpg", alt: "Combo Família do Ursão Burg’s com hambúrgueres, batatas e refrigerante", width: 1080, height: 1080 },
    badge: "Delivery",
  },

  // A seção aparece quando address, hours e mapQuery estão preenchidos.
  location: {
    eyebrow: "Localização",
    title: "Encontre o [[Ursão]]",
    place: "Green Palace Festivals & Events",
    address: "Av. Tiradentes, 370 - Rodoviário, Queimados - RJ, 26323-260",
    phone: { display: "(21) 96452-8360", tel: "+5521964528360" },
    hours: [
      { days: "Quinta a domingo", time: "18h50 às 00h00" },
      { days: "Segunda, terça e quarta", time: "Fechado" },
    ],
    // Texto buscado no Google Maps (mapa incorporado e botão "Como chegar").
    mapQuery: "Av. Tiradentes, 370 - Rodoviário, Queimados - RJ, 26323-260",
    cta: "Como chegar",
  },

  // Exibido só com itens reais: text, author e source preenchidos.
  testimonials: {
    title: "Quem já pediu",
    items: [],
  },

  faq: {
    eyebrow: "Dúvidas frequentes",
    title: "Perguntas [[frequentes]]",
    items: [
      { q: "Qual o horário de funcionamento?", a: "De quinta a domingo, das 18h50 à meia-noite. Segunda, terça e quarta estamos fechados." },
      { q: "Como faço meu pedido?", a: "Pelo cardápio online, pelo iFood ou pela loja do Instagram. Escolha o canal que preferir." },
      { q: "Quais formas de pagamento são aceitas?", a: "As opções disponíveis aparecem na finalização do pedido." },
      { q: "Tem combos para compartilhar?", a: "Sim: Combo Casal, Combo Família e Combo Super Família, além dos trios com batata e refrigerante." },
      { q: "Posso acrescentar ingredientes?", a: "Sim, em vários itens. Os adicionais e valores aparecem na página de cada produto." },
      { q: "Vocês entregam no meu endereço?", a: "Informe seu endereço no pedido para ver a área atendida, a taxa e o prazo estimado." },
    ],
  },

  finalCta: {
    title: "Hoje combina com [[Ursão]].",
    text: "Escolha seu burger, complete com seus acompanhamentos favoritos e finalize o pedido no nosso cardápio online.",
    primary: "Quero meu Ursão",
    secondary: "Falar com o Ursão no WhatsApp",
    background: "itens/169161713264d4076ca53c6_hd.jpg", // fundo: foto de burger (de preferência quadrada), "logo", "logo-marca" ou vazio
  },

  whatsappFloat: { label: "Fale com o Ursão" },
  mobileBar: { primary: "Ver cardápio", whatsapp: "WhatsApp" },
};
