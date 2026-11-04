#!/usr/bin/env bash
# AVQIX: jeden příkaz na spuštění. Nainstaluje, co chybí, a otevře aplikaci.
set -e
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Chybí Node.js. Nainstalujte ho z https://nodejs.org (verze LTS) a spusťte ./start.sh znovu."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Stahuji potřebné balíčky (jen poprvé, pár minut)…"
  npm install --no-audit --no-fund
fi

# Zapne tlačítko „Aktualizovat z Fachmana“ (funguje jen u lokálního spuštění).
export AVQIX_LOCAL=1
echo "Spouštím AVQIX na http://localhost:5173 (ukončíte klávesami Ctrl+C)"
( sleep 4; command -v open >/dev/null 2>&1 && open "http://localhost:5173/klienti" ) &
npm run dev -- --port 5173
