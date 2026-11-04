/**
 * Google Search Console CSV import, opportunity detection and rule-based recommendations.
 * Pure functions, no network, no storage: the caller decides what to keep in memory.
 */
import { checkColumns, parseCsv, parseNumber, type ColumnCheck, type ColumnSpec } from './csv-import';

export type GscDimension = 'query' | 'page';

export type GscRow = { key: string; clicks: number; impressions: number; ctr: number; position: number };

export type GscDataset = { dimension: GscDimension; fileName: string; rows: GscRow[]; skipped: number };

export const gscColumns: ColumnSpec[] = [
  { key: 'query', label: 'Dotaz (Top queries)', required: false, aliases: ['top queries', 'query', 'queries', 'dotaz', 'dotazy', 'nejcastejsi dotazy', 'vyhledavaci dotaz'] },
  { key: 'page', label: 'Stránka (Top pages)', required: false, aliases: ['top pages', 'page', 'pages', 'url', 'stranka', 'stranky', 'nejcastejsi stranky'] },
  { key: 'clicks', label: 'Kliknutí (Clicks)', required: true, aliases: ['clicks', 'kliknuti', 'pocet kliknuti'] },
  { key: 'impressions', label: 'Zobrazení (Impressions)', required: true, aliases: ['impressions', 'zobrazeni', 'pocet zobrazeni'] },
  { key: 'ctr', label: 'CTR', required: false, aliases: ['ctr', 'mira prokliku', 'prumerne ctr'] },
  { key: 'position', label: 'Pozice (Position)', required: true, aliases: ['position', 'average position', 'avg position', 'pozice', 'prumerna pozice'] },
];

export type GscParseResult =
  | { ok: true; dataset: GscDataset; check: ColumnCheck; warnings: string[] }
  | { ok: false; check: ColumnCheck | null; errors: string[] };

export function parseGscCsv(text: string, fileName: string): GscParseResult {
  const table = parseCsv(text);
  if (table.length < 2) return { ok: false, check: null, errors: ['Soubor je prázdný nebo obsahuje jen hlavičku.'] };
  const check = checkColumns(table[0]!, gscColumns);
  const errors: string[] = check.missing.map(c => `Chybí sloupec: ${c.label}.`);
  const hasQuery = 'query' in check.mapping;
  const hasPage = 'page' in check.mapping;
  if (!hasQuery && !hasPage) errors.push('Chybí sloupec s dotazem nebo stránkou (Top queries / Top pages).');
  if (hasQuery && hasPage) errors.push('Soubor obsahuje dotazy i stránky zároveň. Nahrajte je jako dva samostatné exporty.');
  if (errors.length) return { ok: false, check, errors };

  const dimension: GscDimension = hasQuery ? 'query' : 'page';
  const m = check.mapping;
  const rows: GscRow[] = [];
  let skipped = 0;
  for (const cells of table.slice(1)) {
    const key = (cells[m[dimension]!] ?? '').trim();
    const clicks = parseNumber(cells[m['clicks']!]);
    const impressions = parseNumber(cells[m['impressions']!]);
    const position = parseNumber(cells[m['position']!]);
    if (!key || [clicks, impressions, position].some(Number.isNaN)) { skipped++; continue; }
    const rawCtr = m['ctr'] != null ? parseNumber(cells[m['ctr']]) : NaN;
    // GSC writes CTR as a percentage ("3,2 %"); fall back to clicks / impressions.
    const ctr = Number.isNaN(rawCtr) ? (impressions > 0 ? clicks / impressions : 0) : rawCtr / 100;
    rows.push({ key, clicks, impressions, ctr, position });
  }
  const warnings: string[] = [];
  if (skipped) warnings.push(`${skipped} řádků bylo přeskočeno (prázdné nebo nečitelné hodnoty).`);
  if (check.ignored.length) warnings.push(`Nepoužité sloupce: ${check.ignored.join(', ')}.`);
  if (!rows.length) return { ok: false, check, errors: ['V souboru nezbyl žádný čitelný řádek.'] };
  return { ok: true, dataset: { dimension, fileName, rows, skipped }, check, warnings };
}

export const sumRows = (rows: GscRow[]) => {
  const clicks = rows.reduce((s, r) => s + r.clicks, 0);
  const impressions = rows.reduce((s, r) => s + r.impressions, 0);
  const position = impressions > 0 ? rows.reduce((s, r) => s + r.position * r.impressions, 0) / impressions : 0;
  return { clicks, impressions, ctr: impressions > 0 ? clicks / impressions : 0, position, count: rows.length };
};

/** Rough organic CTR by position, used only as an orientation benchmark. */
export function expectedCtr(position: number): number {
  const curve = [0.28, 0.15, 0.1, 0.07, 0.05, 0.04, 0.03, 0.025, 0.02, 0.018];
  const p = Math.max(1, Math.round(position));
  return p <= 10 ? curve[p - 1]! : p <= 20 ? 0.008 : 0.003;
}

export type Confidence = 'Vysoká' | 'Střední' | 'Nízká';

export type Opportunity = {
  kind: 'lowCtr' | 'nearPageOne' | 'drop';
  row: GscRow;
  /** Estimated extra clicks per period if the issue is fixed (orientation only). */
  potentialClicks: number;
  note: string;
  previous?: GscRow;
};

export type OpportunityOptions = { minImpressions: number };

export const defaultOptions: OpportunityOptions = { minImpressions: 100 };

export function findOpportunities(current: GscRow[], previous: GscRow[] | null, options: OpportunityOptions = defaultOptions) {
  const lowCtr: Opportunity[] = [];
  const nearPageOne: Opportunity[] = [];
  const drops: Opportunity[] = [];
  const prevMap = new Map((previous ?? []).map(r => [r.key, r]));

  for (const row of current) {
    if (row.impressions >= options.minImpressions && row.position <= 10) {
      const expected = expectedCtr(row.position);
      if (row.ctr < expected * 0.6) {
        lowCtr.push({ kind: 'lowCtr', row, potentialClicks: Math.round(row.impressions * (expected * 0.8 - row.ctr)), note: `CTR ${pct(row.ctr)} při pozici ${pos(row.position)}, běžně kolem ${pct(expected)}.` });
      }
    }
    if (row.position >= 8 && row.position <= 20 && row.impressions >= options.minImpressions) {
      const gain = Math.max(0, Math.round(row.impressions * expectedCtr(5) - row.clicks));
      nearPageOne.push({ kind: 'nearPageOne', row, potentialClicks: gain, note: `Pozice ${pos(row.position)} a ${Math.round(row.impressions)} zobrazení.` });
    }
    const before = prevMap.get(row.key);
    if (before) {
      const lost = before.clicks - row.clicks;
      const posWorse = row.position - before.position;
      if ((before.clicks >= 10 && lost / before.clicks >= 0.3) || (before.impressions >= options.minImpressions && posWorse >= 3)) {
        drops.push({ kind: 'drop', row, previous: before, potentialClicks: Math.max(0, Math.round(lost)), note: `Kliknutí ${Math.round(before.clicks)} → ${Math.round(row.clicks)}, pozice ${pos(before.position)} → ${pos(row.position)}.` });
      }
    }
  }
  // Queries that vanished entirely from the current export count as drops too.
  if (previous) {
    const currentKeys = new Set(current.map(r => r.key));
    for (const before of previous) {
      if (!currentKeys.has(before.key) && before.clicks >= 10) {
        drops.push({ kind: 'drop', row: { ...before, clicks: 0, impressions: 0, ctr: 0 }, previous: before, potentialClicks: Math.round(before.clicks), note: `Kliknutí ${Math.round(before.clicks)} → 0, v aktuálním exportu chybí.` });
      }
    }
  }
  const byGain = (a: Opportunity, b: Opportunity) => b.potentialClicks - a.potentialClicks;
  return { lowCtr: lowCtr.sort(byGain), nearPageOne: nearPageOne.sort(byGain), drops: drops.sort(byGain) };
}

export const pct = (v: number) => (v * 100).toFixed(1).replace('.', ',') + ' %';
export const pos = (v: number) => v.toFixed(1).replace('.', ',');

export type GscRecommendation = {
  id: string;
  priority: 'Vysoká' | 'Střední' | 'Nízká';
  confidence: Confidence;
  title: string;
  insight: string;
  action: string;
  /** Who should take this on, and whether it is for the client or the internal team. */
  recipient: string;
  audience: 'Klient' | 'Interní tým';
  impact: string;
  examples: string[];
};

/** Rule-based recommendations. Every one names its evidence and a confidence label. */
export function buildRecommendations(dimension: GscDimension, opp: ReturnType<typeof findOpportunities>, hasPrevious: boolean): GscRecommendation[] {
  const noun = dimension === 'query' ? 'dotazů' : 'stránek';
  const out: GscRecommendation[] = [];
  const top = (list: Opportunity[]) => list.slice(0, 3).map(o => o.row.key);
  const sum = (list: Opportunity[]) => list.reduce((s, o) => s + o.potentialClicks, 0);

  if (opp.lowCtr.length) {
    out.push({
      id: 'low-ctr', priority: 'Vysoká', confidence: 'Střední',
      title: `Zvýšit CTR u ${opp.lowCtr.length} ${noun} s dobrou pozicí`,
      insight: `V top 10 mají hodně zobrazení, ale lidé na výsledek neklikají. Odhad: až ${sum(opp.lowCtr)} kliknutí navíc za období (orientační benchmark CTR podle pozice).`,
      action: dimension === 'query'
        ? 'Přepište title a meta description tak, aby odpovídaly záměru dotazu a nesly konkrétní přínos nebo číslo. Zkontrolujte, zda se na dotaz nezobrazuje silnější výsledek nad vámi (reklamy, výpis).'
        : 'U těchto stránek přepište title a meta description, ověřte strukturovaná data a zda se zobrazuje správný snippet.',
      recipient: 'SEO copywriter', audience: 'Interní tým', impact: `až +${sum(opp.lowCtr)} kliknutí za období`,
      examples: top(opp.lowCtr),
    });
  }
  if (opp.nearPageOne.length) {
    out.push({
      id: 'near-page-one', priority: 'Vysoká', confidence: 'Střední',
      title: `${opp.nearPageOne.length} ${noun} na pozicích 8–20 stojí za posílení`,
      insight: `Jsou těsně pod nebo na hraně první stránky a mají poptávku. Posun kolem 5. místa by mohl přinést až ${sum(opp.nearPageOne)} kliknutí navíc (odhad, ne příslib).`,
      action: 'Doplňte obsah o chybějící podtémata, přidejte interní odkazy z silných stránek s přesným anchor textem a zkontrolujte, zda stránka odpovídá záměru hledání.',
      recipient: 'SEO specialista', audience: 'Interní tým', impact: `až +${sum(opp.nearPageOne)} kliknutí za období`,
      examples: top(opp.nearPageOne),
    });
  }
  if (opp.drops.length) {
    out.push({
      id: 'drops', priority: 'Vysoká', confidence: 'Vysoká',
      title: `Pokles u ${opp.drops.length} ${noun} proti předchozímu období`,
      insight: `Přišli jste přibližně o ${sum(opp.drops)} kliknutí. Pokles se týká ${noun}, které předtím fungovaly.`,
      action: 'Ověřte změny na webu v daném období (přesměrování, přepis obsahu, technická chyba, indexace) a sezónnost. Teprve pak rozhodněte o zásahu.',
      recipient: 'Správce webu (potvrdit změny)', audience: 'Klient', impact: `zastavit ztrátu až ${sum(opp.drops)} kliknutí`,
      examples: top(opp.drops),
    });
  } else if (!hasPrevious) {
    out.push({
      id: 'no-previous', priority: 'Nízká', confidence: 'Nízká',
      title: 'Poklesy nelze vyhodnotit bez předchozího období',
      insight: 'Nahráli jste jen jedno období, takže chybí srovnání.',
      action: 'Nahrajte druhý export za předchozí srovnatelné období (stejná délka).',
      recipient: 'Andrea', audience: 'Interní tým', impact: 'umožní vyhodnotit poklesy',
      examples: [],
    });
  }
  if (!out.some(r => r.priority !== 'Nízká')) {
    out.push({
      id: 'nothing', priority: 'Nízká', confidence: 'Střední',
      title: 'Při aktuálním nastavení prahů nic zásadního nevychází',
      insight: 'Žádný řádek nesplnil podmínky pro nízké CTR, pozice 8–20 ani pokles.',
      action: 'Zkuste snížit minimální počet zobrazení, nebo nahrajte větší export.',
      recipient: 'Andrea', audience: 'Interní tým', impact: 'žádný zásah není potřeba',
      examples: [],
    });
  }
  return out;
}

/** Rows for the Reporty CSV export, in the same column layout as the demo recommendations. */
export function gscReportRows(recs: GscRecommendation[], audience: 'firma' | 'klient'): (string | number)[][] {
  return recs.filter(r => r.id !== 'nothing').map(r => audience === 'firma'
    ? ['Search Console', r.priority, r.title, r.insight, r.action, r.recipient, r.audience, r.impact]
    : ['Search Console', r.title, r.audience === 'Klient' ? `Prosíme: ${r.action}` : r.action, r.impact]);
}

/** What the analysis looks for, shown before any data is imported. */
export const gscRules = [
  { title: 'Nízké CTR při dobré pozici', what: 'Dotazy v top 10 s hodně zobrazeními, na které málokdo klikne.', todo: 'Přepsat title a meta description, aby slibovaly konkrétní přínos.' },
  { title: 'Pozice 8 až 20', what: 'Dotazy a stránky těsně pod první stránkou nebo na její hraně.', todo: 'Doplnit obsah, přidat interní odkazy, ověřit záměr hledání.' },
  { title: 'Poklesy proti minulému období', what: 'Co ztratilo kliknutí nebo pozici (vyžaduje druhý export).', todo: 'Zkontrolovat změny na webu, indexaci a sezónnost, než se cokoli upraví.' },
];
