# Baixa a logo e as fotos oficiais usadas no site para assets/cdn/
# (mesma estrutura de pastas do CDN do InstaDelivery).
# Uso, na pasta do projeto:  powershell -ExecutionPolicy Bypass -File scripts\baixar-imagens.ps1
# Depois, em js/config.js, troque assetBase para "assets/cdn/".

$ErrorActionPreference = "Stop"
$base = "https://instadelivery-public.nyc3.cdn.digitaloceanspaces.com/"
$root = Split-Path -Parent $PSScriptRoot
$texto = (Get-Content "$root\js\config.js", "$root\js\catalog.js" -Raw) -join "`n"
$caminhos = [regex]::Matches($texto, '"((?:itens|stores)/[^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

foreach ($c in $caminhos) {
  $destino = Join-Path $root ("assets\cdn\" + ($c -replace "/", "\"))
  # Já existe (ex.: fotos *_hd.jpg melhoradas com IA, que não estão no CDN): mantém.
  if (Test-Path $destino) { Write-Host "Já existe: $c"; continue }
  New-Item -ItemType Directory -Force -Path (Split-Path $destino) | Out-Null
  Write-Host "Baixando $c"
  Invoke-WebRequest -Uri ($base + $c) -OutFile $destino
}
Write-Host "Pronto: $($caminhos.Count) arquivos em assets\cdn\"
