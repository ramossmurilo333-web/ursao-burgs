/**
 * CATEGORIAS E PRODUTOS DA VITRINE
 * ---------------------------------------------------------------
 * Seleção editorial (não é ranking de vendas). Nomes, descrições e
 * fotos conferidos no cardápio oficial https://instadelivery.com.br/ursaoburgs
 * em 24/11/2026 — texto transcrito com ajuste de maiúsculas e
 * erros de digitação evidentes (ex.: "Americam" → "American").
 *
 * Campos do produto:
 *   id          identificador único (usado pelo carrossel)
 *   name        nome exibido
 *   description descrição confirmada (não deduzir pelo nome)
 *   image       caminho relativo a config.assetBase
 *   (categoria) icon: burger | combo | hotdog | fries | dessert
 *   price       preço em reais (número). Conferido no InstaDelivery em 24/11/2026.
 *               Sem price → o card não mostra preço.
 *   priceFrom   true = exibe "A partir de" (itens com tamanhos/opções).
 *   orderUrl    OPCIONAL. Só preencha com link individual confirmado.
 *               Vazio → botão "Ver no cardápio" (cardápio completo).
 *
 * A ordem das categorias aqui é a ordem das abas.
 */
window.SITE = window.SITE || {};

window.SITE.catalog = [
  {
    id: "burgers",
    icon: "burger",
    label: "Burgers",
    products: [
      { id: "ze-colmeia", name: "Zé Colmeia", description: "Pão brioche, molho especial, blend de 130 g, queijo cheddar, cebola caramelizada, bacon crocante e salada.", image: "itens/169161691864d40696e5cfa_hd.jpg", price: 22, orderUrl: "" },
      { id: "big-ursao", name: "Big Ursão", description: "Pão brioche, molho especial, 2 blends de 130 g, 2x mais American cheese, 2x mais bacon e maionese da casa.", image: "itens/169161703364d40709b77ea_hd.jpg", price: 29, orderUrl: "" },
      { id: "ursao-monster", name: "Ursão Monster", description: "Pão brioche, molho especial, blend de 180 g, American cheese, queijo coalho enrolado no bacon e geleia agridoce levemente apimentada.", image: "itens/169161719864d407ae60c89_hd.jpg", price: 33, orderUrl: "" },
      { id: "explosao-de-queijo", name: "Explosão de Queijo", description: "Pão brioche, molho especial, blend de 180 g, American cheese, bacon crocante, super empanado de queijo mussarela e maionese da casa.", image: "itens/169161713264d4076ca53c6_hd.jpg", price: 33, orderUrl: "" },
      { id: "big-ursao-2", name: "Big Ursão 2.0", description: "Pão brioche, molho especial, 2 blends de 180 g, 2x American cheese, 2x bacon crocante e maionese da casa.", image: "itens/169161707864d40736da64c_hd.jpg", price: 34, orderUrl: "" },
      { id: "triplo-cheddar", name: "Triplo Cheddar", description: "Pão brioche, molho Ursão americano, 3 carnes artesanais de 80 g, 3x cheddar e molho de cheddar por cima.", image: "itens/169161729864d40812bae31_hd.jpg", price: 27, orderUrl: "" },
    ],
  },
  {
    id: "combos",
    icon: "combo",
    label: "Combos",
    products: [
      { id: "combo-casal", name: "Combo Casal", description: "2 hambúrgueres, 1 batata G e refrigerante de 1 litro.", image: "itens/17190063086675f46414331_hd.jpg", price: 65, orderUrl: "" },
      { id: "combo-familia", name: "Combo Família", description: "3 hambúrgueres, 2 batatas M e refrigerante de 2 litros.", image: "itens/167786438364022dbf531b7_hd.jpg", price: 100, orderUrl: "" },
      { id: "combo-super-familia", name: "Combo Super Família", description: "4 hambúrgueres, 2 batatas G e refrigerante de 2 litros.", image: "itens/1677863414640229f67553b_hd.jpg", price: 116, orderUrl: "" },
      { id: "trio-big-ursao", name: "Trio Big Ursão", description: "1 Big Ursão, batata M e refrigerante lata.", image: "itens/169161824064d40bc079504_hd.jpg", price: 48, orderUrl: "" },
      { id: "trio-ze-colmeia", name: "Trio Zé Colmeia", description: "1 Zé Colmeia, batata M e refrigerante lata.", image: "itens/169161785564d40a3f25a0f_hd.jpg", price: 42, orderUrl: "" },
    ],
  },
  {
    id: "hot-dogs",
    icon: "hotdog",
    label: "Hot dogs",
    products: [
      { id: "dog-1", name: "Dog Nº 1", description: "Pão brioche, molho americano, molho de tomate, vinagrete, salsicha ou linguiça, milho, ervilha, queijo ralado, batata palha, azeitona e ovo de codorna.", image: "itens/1769809153697d2501745cd_hd.jpg", orderUrl: "" },
      { id: "dog-2", name: "Dog Nº 2", description: "Pão parmesão, maionese de bacon, salsicha ou linguiça Perdigão, creme de queijo e pulled pork.", image: "itens/1769808875697d23ebf1c46_hd.jpg", price: 22, orderUrl: "" },
      { id: "dog-3", name: "Dog Nº 3", description: "Pão provolone, molho grill, salsicha ou linguiça Perdigão, muito cheddar cremoso e farofa de bacon.", image: "itens/1769808968697d244820e69_hd.jpg", price: 19, orderUrl: "" },
      { id: "dog-4", name: "Dog Nº 4", description: "Pão brioche, molho americano, salsicha ou linguiça Perdigão, linguiça picada, vinagrete e parmesão maçaricado.", image: "itens/1769809076697d24b476b93_hd.jpg", price: 18, orderUrl: "" },
    ],
  },
  {
    id: "porcoes",
    icon: "fries",
    label: "Porções",
    products: [
      { id: "batata-turbinada", name: "Batata Turbinada", description: "Batatas crinkle, muito cheddar cremoso e farofa de bacon.", image: "itens/169163205064d441b2bfd9b_hd.jpg", price: 28, orderUrl: "" },
      { id: "batata-crinkle", name: "Batata Crinkle", description: "Deliciosas batatinhas fritas.", image: "itens/169163209564d441df1c338_hd.jpg", price: 16, priceFrom: true, orderUrl: "" },
      { id: "batata-maluca", name: "Batata Maluca", description: "550 g de batata crinkle, linguiça calabresa, bacon e queijo parmesão ralado.", image: "itens/1696629197652081cd0e3f4_hd.jpg", price: 34, orderUrl: "" },
      { id: "aneis-de-cebola", name: "Anéis de Cebola", description: "Deliciosos anéis de cebola.", image: "itens/169163212464d441fc56c25_hd.jpg", price: 17, priceFrom: true, orderUrl: "" },
      { id: "crispy-gouda", name: "Crispy de Queijo Gouda", description: "Deliciosos crispys de queijo gouda.", image: "itens/169163218564d442394b7d0_hd.jpg", price: 23, priceFrom: true, orderUrl: "" },
    ],
  },
  {
    id: "sobremesas",
    icon: "dessert",
    label: "Sobremesas",
    products: [
      { id: "mini-nutella", name: "Mini hambúrguer de Nutella", description: "Pão mini brioche, Nutella e brownie.", image: "itens/1720817615669197cf2e426_hd.jpg", price: 15, orderUrl: "" },
      { id: "mini-doce-de-leite-pistache", name: "Mini hambúrguer de doce de leite com creme de pistache", description: "Pão mini brioche, doce de leite, brownie e creme de pistache.", image: "itens/17208175666691979eb556f_hd.jpg", price: 15, orderUrl: "" },
    ],
  },
];
