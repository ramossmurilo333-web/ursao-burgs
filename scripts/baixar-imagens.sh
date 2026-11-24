#!/usr/bin/env bash
# Baixa a logo e as fotos oficiais usadas no site para assets/cdn/
# (mesma estrutura de pastas do CDN do InstaDelivery).
# Uso, na pasta do projeto:  bash scripts/baixar-imagens.sh
# Depois, em js/config.js, troque assetBase para "assets/cdn/".
set -euo pipefail
BASE="https://instadelivery-public.nyc3.cdn.digitaloceanspaces.com/"
cd "$(dirname "$0")/.."
grep -ohE '"(itens|stores)/[^"]+"' js/config.js js/catalog.js | tr -d '"' | sort -u | while read -r p; do
  # Já existe (ex.: fotos *_hd.jpg melhoradas com IA, que não estão no CDN): mantém.
  if [ -f "assets/cdn/$p" ]; then echo "Já existe: $p"; continue; fi
  mkdir -p "assets/cdn/$(dirname "$p")"
  echo "Baixando $p"
  curl -fsSL "$BASE$p" -o "assets/cdn/$p"
done
echo "Pronto. Arquivos em assets/cdn/"
