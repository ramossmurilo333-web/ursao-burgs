# Landing page — Ursão Burg’s (v3)

Site estático em HTML, CSS e JavaScript puro, sem biblioteca e sem etapa de build.
A compra continua no InstaDelivery. O WhatsApp é o canal secundário.

## Ordem das seções

1. Cabeçalho (nome em texto + menu: Nossa História, Cardápio, Localização, FAQ)
2. Hero (logo oficial)
3. Carrossel automático "Burgers da casa" (sem botões; pausa só com o mouse ou o dedo em cima)
4. Nossa História
5. Nosso Cardápio (abas em cápsula + cards em slider; 6 burgers)
6. Peça Online (canais apenas informativos, sem links)
7. Localização (Google Maps incorporado)
8. Perguntas Frequentes (grade de 2 colunas)
9. CTA final e rodapé

Tipografia igual à do chicogrill.com.br, conferida no próprio site:
- **Bebas Neue:** títulos e nomes
- **Syne:** rótulos e botões
- **DM Sans:** textos

## Estrutura

```
index.html                 estrutura semântica, meta tags e textos essenciais
css/styles.css             estilos em 15 blocos numerados
js/config.js               ← marca, cores, links, textos de todas as seções, localização, FAQ
js/catalog.js              ← categorias (ordem e ícone das abas) e produtos
js/utils.js                helpers e ícones
js/sections.js             cabeçalho, hero, Nossa História, Peça Online, Localização, FAQ, CTA, rodapé
js/menu-tabs.js            abas + slider do cardápio (setas e paginação)
js/carousel.js             carrossel de destaques
js/product-dialog.js       janela de detalhes do produto
js/main.js                 inicialização (cada módulo isolado)
scripts/baixar-imagens.*   baixa a logo e as fotos para assets/cdn/
capturas/                  prévias com fotos reais (desktop e celular)
```

## Executar

Abra `index.html` no navegador ou rode `npx serve .` / `python -m http.server 8080` na pasta.

## Publicar

1. Baixe as imagens para o próprio site:
   - Windows: `powershell -ExecutionPolicy Bypass -File scripts\baixar-imagens.ps1`
   - macOS/Linux: `bash scripts/baixar-imagens.sh`

   Depois troque `assetBase` para `"assets/cdn/"` em `js/config.js`.
2. No `index.html`, preencha `og:url` e `og:image` e troque o favicon para o arquivo local.
3. Envie a pasta para qualquer hospedagem estática.

## Personalizar

- **Cabeçalho:** `brand.wordmark` define o nome; o trecho entre `[[ ]]` fica em laranja.
- **Carrossel:**
  - `carousel.items` recebe ids do catálogo; `speed` é a velocidade.
  - `autoplay: true` faz o carrossel começar a rolar ao carregar a página.
  - `respectReducedMotion: false` faz ele rolar mesmo para quem ativou "reduzir movimento" no sistema. Mude para `true` se quiser que essas pessoas vejam o carrossel parado.
- **Nossa História:** `story.photos` traz os 3 ids do mosaico (grande, pequena, pequena), e `story.badge` diz em qual foto fica o selo.
- **Peça Online:** `orderOnline.channels` lista os canais. São só informativos: nenhum vira link.
- **Localização:** `location` traz endereço, horários e telefone. `mapQuery` alimenta o mapa e o botão "Como chegar", nos formatos públicos do Google Maps, sem chave de API.
- **Produtos:** `orderUrl` só deve ser preenchido com link individual confirmado. Vazio, o botão vira "Ver no cardápio" e leva ao cardápio completo.
- **Ícone das abas:** campo `icon` de cada categoria no `catalog.js` (`burger`, `combo`, `hotdog`, `fries`, `dessert`).

## Origem dos dados

- **Produtos:** nomes, descrições e fotos vêm do cardápio público https://instadelivery.com.br/ursaoburgs.
  - O Triplo Cheddar foi incluído com a descrição e a foto de lá.
  - Nas descrições, só foram ajustados maiúsculas e erros de digitação.
- **Localização, horário e telefone:** fornecidos pelo cliente.
- **Textos novos:** os parágrafos de "Nossa História" e os 3 destaques (ingredientes frescos, preparo artesanal, qualidade garantida) seguem o briefing. **Confirme se correspondem à operação real** antes de publicar.

## Pendências reais

| Item | Situação |
|---|---|
| Hospedar as imagens no próprio site | Feito: estão em `assets/cdn/`. Todas as fotos de produtos usam versões `_hd.jpg` (1600 px), com a resolução melhorada por IA (Real-ESRGAN), sem alterar o conteúdo. |
| Conferir os textos de "Nossa História" | Escritos a partir do briefing, sem história ou data inventadas. |
| Canais iFood e loja do Instagram | Exibidos como pedido no briefing. Não conferi se a loja está ativa no iFood. |
| Links individuais dos produtos | Nenhum confirmado. Todos os botões levam ao cardápio completo. |
| Preços | Copiados do InstaDelivery em 24/11/2026 (campo `price` no `js/catalog.js`). Não atualizam sozinhos: quando o Ursão mudar um preço lá, mude aqui também. O Dog Nº 1 saiu do cardápio do InstaDelivery e está sem preço. |
| Avaliações reais | Seção oculta até haver texto, autor e fonte. |
| `og:url`, `og:image` e favicon local | Preencher com o domínio definitivo. |

## O que foi testado

**Testes automáticos** (Chrome headless, 1440, 768, 390 e 360 px):
- **Página:**
  - sem rolagem horizontal e sem erros de JavaScript;
  - seções na ordem pedida;
  - as seções antigas ("Conheça", "O que vai no seu Ursão?" e "Como pedir") não existem mais.
- **Cabeçalho:** sem imagem, só com o nome em texto; menu com Nossa História, Cardápio, Localização e FAQ.
- **Carrossel:**
  - começa a rolar sozinho, inclusive com "reduzir movimento" ativo;
  - para ao sair da tela.
- **Cardápio:**
  - aba Burgers com 6 itens, incluindo o Triplo Cheddar;
  - setas e paginação funcionam (2 páginas no desktop, 3 no tablet, 6 no celular);
  - Sobremesas, com 2 itens, esconde setas e paginação.
- **Detalhes do produto:** abrem pela foto e pelo "Ver detalhes"; Esc fecha e o foco volta ao botão de origem.
- **Peça Online:** 3 canais, nenhum link.
- **Localização:** mapa com o endereço informado.
- **FAQ:** 6 perguntas, 2 colunas a partir de 768 px e 1 no celular; abre e fecha por teclado.
- **Navegação:** as âncoras param abaixo do cabeçalho.

**Conferência visual com as fotos reais, as fontes e o mapa:** feita no navegador do app Claude, a 1440 e 390 px. As capturas estão em `capturas/`.

**Não testado:** o swipe com o dedo num aparelho real. Os toques simulados não funcionam no navegador de testes.
