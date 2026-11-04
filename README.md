# AVQIX · Marketing Intelligence

**Živé demo: https://andrea-intelligence-studio.vercel.app**
*(ukázkový pracovní prostor, všechna čísla jsou vymyšlená demo data)*

![Přehled výkonu](docs/screenshot-prehled.png)

AVQIX je přehledový nástroj pro marketingové řízení: na jednom místě ukazuje, jak si vedou reklamy, web, organika a e-maily u jednotlivých klientů, a převádí čísla do srozumitelných doporučení. Vzniká jako osobní pracovní prototyp (Andrea Varmužová, performance marketing) a je postavený tak, aby šel postupně napojit na skutečné zdroje dat bez přepisování aplikace.

## Co už funguje (demo)

- **Čtyři demo klienti, čtyři obchodní modely:** e-commerce, služby (lead generation), hybrid a B2B. Každý model má vlastní sadu KPI, slovník a doporučení, takže stejná aplikace dává smysl pro e-shop i pro klinku.
- **Přehled:** tržby, náklady na reklamu, ROAS, PNO, MER, průměrná objednávka a podíl vracejících se zákazníků, vždy v porovnání s předchozím obdobím. ROAS se počítá z celkových tržeb a nákladů, nikdy průměrem procent.
- **Organika & automatizace, Výkon webu, Výkon kampaní, Reporty.**
- **Kampaně:** tabulky s vyhledáváním, řazením, filtry, stránkováním, výběrem sloupců a exportem do CSV, k tomu náhledy kreativ.
- **Doporučení** podle klienta (pravidlová analýza, ne generativní AI) s odůvodněním, prioritou a odhadovaným dopadem.
- **Reporty** pro interní použití i pro klienta, export do CSV.

## Co je jen ukázka

Žádný zdroj dat není připojený. Čísla se generují přímo v kódu (`src/lib/analytics-data.ts`) a v aplikaci jsou označená „Demo data". Nic se neukládá do databáze, není přihlášení ani uživatelé a aplikace nic neposílá ani nemění v žádných reklamních účtech.

## Kam to směřuje

1. **Datové zdroje** jako zásuvné moduly: Google Search Console, Meta Ads, Google Ads, GA4, YouTube, e-mailing.
2. **Import CSV** z těchto systémů s kontrolou sloupců, aby se nic tiše nepřečetlo špatně.
3. **Doporučení nad skutečnými daty** (např. dotazy s vysokým zobrazením a nízkým CTR ze Search Console).
4. **Volitelná AI vrstva** (Claude, GPT) s vlastním klíčem, vypnutá ve výchozím stavu. Posílala by se jen souhrnná čísla, ne surové řádky.
5. **Soukromí na prvním místě:** reálná data zůstávají lokálně a produkční adresa se zamyká ochranou přístupu.

## Technologie

TanStack Start (React, TypeScript), Tailwind CSS, Recharts, Vitest. Hostováno na Vercelu, každý push do větve `main` se nasadí automaticky (`vercel.json` přepíná build na Vercel).

## Spuštění lokálně

```sh
npm install
npm run dev      # vývojový server
npm test         # testy
npm run build    # produkční build
```

## Dokumentace

- [Roadmapa](roadmap.md)
- [Původní designový záměr](docs/design-brief.md)

Původně vytvořeno v [Lovable](https://lovable.dev), dál vyvíjeno v repozitáři.
