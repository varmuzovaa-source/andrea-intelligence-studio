#!/usr/bin/env python3
"""Lokální datový most: Fachman (jen čtení) -> složka data-most -> AVQIX.

Použití (ze složky AVIX):
  python3 scripts/most_fachman.py <klient> --google 123-456-7890 [--meta act_123456] [--dny 30]

Jen standardní knihovna Pythonu. Fachmana nijak nemění: spustí jeho skripty
scripts/google_ads/fetch.py a scripts/meta/fetch.py (čtou data) a výstup uloží k nám.
Tajné soubory (.env) nečte. Jede sériově, ať neblokujeme API.
"""
import argparse, datetime, os, re, subprocess, sys
from pathlib import Path

PPC = Path(os.environ.get("FACHMAN_DIR", Path.home() / "AGENTURA" / "PPC"))
OUT = Path(__file__).resolve().parent.parent / "data-most"


def spust(prikaz: list[str]) -> str:
    vysledek = subprocess.run(prikaz, cwd=PPC, capture_output=True, text=True)
    if vysledek.returncode != 0:
        sys.exit("Fachman skončil chybou (nic se neuložilo):\n" + vysledek.stderr.strip()[-800:])
    return vysledek.stdout


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("klient", help="krátký název klienta (složka v AGENTURA/klienti)")
    p.add_argument("--google", help="Google Ads customer ID, např. 123-456-7890")
    p.add_argument("--meta", help="Meta ad účet, např. act_123456")
    p.add_argument("--dny", type=int, default=30, choices=[7, 30, 90], help="délka období (7, 30 nebo 90)")
    a = p.parse_args()
    if not (a.google or a.meta):
        p.error("Zadej aspoň --google nebo --meta.")
    if not re.fullmatch(r"[a-z0-9-]+", a.klient):
        p.error("Název klienta smí obsahovat jen malá písmena, čísla a pomlčky.")
    py = PPC / ".venv" / "bin" / "python"
    if not py.exists():
        sys.exit(f"Nenašla jsem {py}. Nejdřív jednorázově nastav Fachmana (viz README-STUDENTI.md / README.md).")
    OUT.mkdir(exist_ok=True)
    dnes = datetime.date.today().isoformat()
    ulozeno = []
    if a.google:
        text = spust([str(py), "scripts/google_ads/fetch.py", a.google, "campaigns", "--days", str(a.dny)])
        f = OUT / f"{a.klient}-google-ads-{a.dny}d-{dnes}.json"
        f.write_text(text, encoding="utf-8"); ulozeno.append(f)
    if a.meta:
        text = spust([str(py), "scripts/meta/fetch.py", "insights", a.meta, "--level", "campaign", "--days", str(a.dny)])
        f = OUT / f"{a.klient}-meta-ads-{a.dny}d-{dnes}.json"
        f.write_text(text, encoding="utf-8"); ulozeno.append(f)
    print("Hotovo. Uloženo:")
    for f in ulozeno:
        print("  ", f)
    print("Teď v AVQIX: Datové zdroje -> Fachman -> Vybrat soubory z data-most.")


if __name__ == "__main__":
    main()
