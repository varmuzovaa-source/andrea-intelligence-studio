# AVQIX Intelligence Studio

**Z cílů klienta udělá konkrétní rady: u které kampaně co změnit, v jakém kanálu a komu to předat.**

![Přehled výkonu](docs/screenshot-prehled.png)

📄 **[Postup pro začátečníky (PDF ke stažení)](docs/AVQIX-postup.pdf)** · 🌐 [Živé demo](https://avqix-intelligence-studio.vercel.app) (ukázková data)

## K čemu to je

Marketingový manažer nebo freelancer se často topí v číslech z Google Ads, Mety a dalších nástrojů a neví, co s nimi. AVQIX dělá tři věci:

1. **Ukládá cíle klienta:** obchodní cíl, marketingový cíl a čísla (KPI) s cílovou hodnotou, obdobím a kanálem.
2. **Porovná skutečnost s cílem** po kanálech (Google Ads, Meta Ads, e-mail) a po kampaních, včetně „jak daleko jsme“.
3. **Poradí, co udělat:** „U kampaně X snížit rozpočet o 20 %, protože ROAS je 3,9× a cíl je 7×“, s prioritou, jistotou rady a komu úkol předat. Tlačítko **Předat** vytvoří úkol na stránce Úkoly týmu.

Rady vznikají pravidly z čísel, ne generativní AI. U každé je vidět, z jakého čísla vychází, a když je dat málo, říká to rovnou a doporučuje jen malé kroky.

## Pro koho

Pro agentury a freelancery, kteří vedou víc klientů, a pro začátečníky v performance marketingu. Čísla jsou vysvětlená lidsky (ROAS, PNO, CPA…) a každý klient má podle typu podnikání (e-shop, služby, hybrid, B2B) vlastní slovník a sadu čísel.

## Co umí

- **Cíle a rady** (`/cile`): zadání cílů, porovnání skutečnost × cíl, rady po kampaních, Předat.
- **Vlastní klienti** (`/klienti`): přidání klienta, který začíná prázdný a neukazuje žádná vymyšlená čísla.
- **Skutečná čísla z Google Ads a Meta Ads zdarma a lokálně** přes [Fachmana](#propojení-s-fachmanem) (jen čtení účtů), stahují se tlačítkem **Aktualizovat z Fachmana**.
- **Úkoly týmu** (`/ukoly`): kdo úkol řeší, stav, export CSV.
- **Search Console** (`/search-console`): nahrání CSV exportu, hledání příležitostí (hodně zobrazení s nízkým CTR, pozice 8 až 20, poklesy) a pravidlová doporučení.
- **Datové zdroje** (`/datove-zdroje`): nahrání souborů z Fachmana, kontrola CSV z dalších zdrojů, volitelný (výchozí vypnutý) náhled AI souhrnu.
- **Ukázkoví klienti** se čtyřmi obchodními modely a přehledy, organika, web, kampaně a reporty s exportem do CSV. Všechna jejich čísla jsou vymyšlená.

## Co zatím neumí

- Přehledy, grafy a reporty pro vlastní klienty (jen Cíle a rady, Úkoly, Search Console, Datové zdroje).
- Skutečná data pro e-mailing.
- Sdílení mezi lidmi nebo počítači: cíle, klienti a úkoly se ukládají jen v prohlížeči, ve kterém je zadáte. Čísla z kampaní se po obnovení stránky smažou.
- Žádné změny v reklamních účtech. Rady jen navrhují, co udělat.
- Čísla nejsou živá, jsou z okamžiku posledního stažení.

## Rychlý start (na počítači, zdarma)

Potřebujete jen [Node.js](https://nodejs.org). Dvojklik na **`Spustit-AVQIX.command`** (Mac), nebo v Terminálu:

```sh
./start.sh
```

Appka se otevře v prohlížeči na `http://localhost:5173`. Podrobný postup krok za krokem je v **[PDF](docs/AVQIX-postup.pdf)**.

Chcete si to nejdřív vyzkoušet? Přidejte zkušebního klienta a na stránce Datové zdroje → Fachman nahrajte oba soubory ze složky [`ukazka/`](ukazka/) (vymyšlená data).

## Propojení s Fachmanem

Fachman je můj PPC asistent (Claude Code skill) s read-only skripty pro Google Ads a Meta. AVQIX ho volá přes malý lokální most:

- Na stránce Cíle a rady vyplníte u klienta Google Ads ID a/nebo Meta ID a kliknete na **Aktualizovat z Fachmana**. Appka spustí `scripts/most_fachman.py`, který Fachmanovy čtecí skripty zavolá a výsledek uloží do složky `data-most/` (v `.gitignore`, do gitu se nedostane).
- Funguje jen při lokálním spuštění přes `./start.sh` (proměnná `AVQIX_LOCAL=1`) a jen z localhostu. Na veřejném webu je tato funkce vypnutá.
- Přístupy do účtů zůstávají jen ve Fachmanovi (`.env`), AVQIX je nečte. Bez nastaveného Fachmana tlačítko nepůjde, ostatní části appky ano.
- Cíle jdou přenášet do `ppc.md` klienta tlačítky **Zkopírovat pro Fachmana** a **Načíst z ppc.md**.

Ruční varianta: `python3 scripts/most_fachman.py <klient> --google 123-456-7890 --meta act_123456 --dny 30` a soubory nahrát na stránce Datové zdroje.

## Soukromí

Soubory se čtou jen v prohlížeči. Nic se neposílá na žádný server ani do žádné AI. Veřejné demo na Vercelu obsahuje jen vymyšlená data.

## Technologie

TanStack Start (React, TypeScript), Tailwind CSS, Recharts, Vitest. Vercel nasazuje demo z větve `main`.

```sh
npm run dev      # vývojový server
npm test         # testy
npm run build    # produkční build
```

## Dokumentace

- [Postup pro začátečníky (PDF)](docs/AVQIX-postup.pdf)
- [Roadmapa](roadmap.md)
- [Původní designový záměr](docs/design-brief.md)

Původně vytvořeno v [Lovable](https://lovable.dev), dál vyvíjeno v repozitáři.
