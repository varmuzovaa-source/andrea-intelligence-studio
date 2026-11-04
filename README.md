# AVQIX Intelligence Studio

**Z cílů klienta udělá konkrétní rady: u které kampaně co změnit, v jakém kanálu a komu to předat. Funguje s Fachmanem (PPC asistent) a zdarma na tvém počítači.**

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
- **Vlastní klienti** (`/klienti`): přidání klienta, nebo načtení všech klientů ze složky `AGENTURA/klienti` (včetně ID účtů a cílů z jejich `ppc/ppc.md`). Klient začíná prázdný, bez vymyšlených čísel.
- **Přehled a kampaně pro vlastní klienty:** náklady, tržby, ROAS, výsledky, graf vývoje v čase po dnech, rozpad po kanálech, tabulka kampaní, export CSV.
- **E-mailing:** import CSV z e-mailového nástroje, cíle pro otevřenost, prokliky a odhlášení a rady k nejslabším e-mailům.
- **Report pro klienta:** jeden soubor HTML jen k nahlédnutí (cíle, jak jsme na tom, co děláme dál). Klient ho jen otevře a přečte, nic v něm nemění. Pošleš ho e-mailem, nebo nahraješ na vlastní hosting a pošleš odkaz.
- **Skutečná čísla z Google Ads a Meta Ads zdarma a lokálně** přes [Fachmana](#propojení-s-fachmanem) (jen čtení účtů), stahují se tlačítkem **Aktualizovat z Fachmana**.
- **Úkoly týmu** (`/ukoly`): kdo úkol řeší, stav, export CSV.
- **Search Console** (`/search-console`): nahrání CSV exportu, hledání příležitostí (hodně zobrazení s nízkým CTR, pozice 8 až 20, poklesy) a pravidlová doporučení.
- **Datové zdroje** (`/datove-zdroje`): nahrání souborů z Fachmana, kontrola CSV z dalších zdrojů, volitelný (výchozí vypnutý) náhled AI souhrnu.
- **Ukázkoví klienti** se čtyřmi obchodními modely a přehledy, organika, web, kampaně a reporty s exportem do CSV. Všechna jejich čísla jsou vymyšlená.

## Co zatím neumí

- Organika a Výkon webu pro vlastní klienty (zatím jen Search Console přes CSV) a CRM (leady, zakázky).
- Přímé připojení e-mailových nástrojů (zatím jen CSV export).
- Živý klikací odkaz pro klienta. Report je soubor, odkaz vznikne až když ho někam nahraješ.
- Sdílení mezi lidmi nebo počítači: cíle, klienti a úkoly se ukládají jen v prohlížeči, ve kterém je zadáte. Čísla z kampaní se po obnovení stránky smažou. Společná databáze s přihlášením je další velký krok.
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

- Klienty i jejich ID účtů a cíle umí appka načíst ze složky `AGENTURA/klienti` (tlačítko na stránce Klienti).
- Čísla se stahují **po dnech** (`campaigns_daily` pro Google Ads a `time_increment=1` pro Meta), proto jde v Přehledu vidět vývoj v čase.
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

- [Průvodce: k čemu appka je, co umí a neumí, kdy použít ji a kdy Fachmana (PDF)](docs/AVQIX-pruvodce.pdf)
- [Postup pro začátečníky (PDF)](docs/AVQIX-postup.pdf)
- [Roadmapa](roadmap.md)
- [Původní designový záměr](docs/design-brief.md)

Původně vytvořeno v [Lovable](https://lovable.dev), dál vyvíjeno v repozitáři.
