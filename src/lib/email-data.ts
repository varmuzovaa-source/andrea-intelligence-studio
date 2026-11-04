/**
 * E-mailing numbers imported from a CSV export of the e-mail tool (ActiveCampaign, Klaviyo, Ecomail, ...).
 * In memory only, like the other imports. One list per client name.
 */
import { useSyncExternalStore } from 'react';
import { checkColumns, parseCsv, parseNumber, type ColumnSpec } from './csv-import';

export type EmailCampaign = { name: string; sent: number; opens: number; clicks: number; unsubs: number };

const col = (key: string, label: string, required: boolean, ...aliases: string[]): ColumnSpec => ({ key, label, required, aliases });
export const emailColumns: ColumnSpec[] = [
  col('campaign', 'Kampaň', true, 'campaign', 'campaign name', 'kampan', 'nazev kampane', 'nazev'),
  col('sent', 'Odesláno', true, 'sent', 'delivered', 'odeslano', 'doruceno', 'pocet odeslanych'),
  col('opens', 'Otevření', false, 'opens', 'unique opens', 'otevreni', 'unikatni otevreni'),
  col('clicks', 'Kliknutí', false, 'clicks', 'unique clicks', 'kliknuti', 'unikatni kliknuti'),
  col('unsub', 'Odhlášení', false, 'unsubscribes', 'unsubscribed', 'odhlaseni'),
];

export type EmailParse = { ok: true; campaigns: EmailCampaign[]; warnings: string[] } | { ok: false; errors: string[] };

export function parseEmailCsv(text: string): EmailParse {
  const table = parseCsv(text);
  if (table.length < 2) return { ok: false, errors: ['Soubor je prázdný nebo obsahuje jen hlavičku.'] };
  const check = checkColumns(table[0]!, emailColumns);
  if (!check.ok) return { ok: false, errors: check.missing.map(c => `Chybí povinný sloupec: ${c.label}.`) };
  const m = check.mapping;
  const n = (row: string[], key: string) => { const i = m[key]; const v = i === undefined ? 0 : parseNumber(row[i]); return Number.isFinite(v) ? v : 0; };
  const campaigns: EmailCampaign[] = [];
  let skipped = 0;
  for (const row of table.slice(1)) {
    const name = (row[m['campaign']!] ?? '').trim();
    const sent = n(row, 'sent');
    if (!name || sent <= 0) { skipped++; continue; }
    campaigns.push({ name, sent, opens: n(row, 'opens'), clicks: n(row, 'clicks'), unsubs: n(row, 'unsub') });
  }
  if (!campaigns.length) return { ok: false, errors: ['Nenašla jsem žádnou kampaň s počtem odeslaných větším než nula.'] };
  const warnings = [...(skipped ? [`${skipped} řádků bylo přeskočeno (bez názvu nebo bez odeslaných).`] : []), ...(m['opens'] === undefined ? ['Chybí sloupec Otevření, otevřenost se nedá spočítat.'] : []), ...(m['clicks'] === undefined ? ['Chybí sloupec Kliknutí, prokliky se nedají spočítat.'] : [])];
  return { ok: true, campaigns, warnings };
}

export type EmailTotals = { sent: number; openRate: number | null; clickRate: number | null; unsubRate: number | null };
export function emailTotals(cs: EmailCampaign[]): EmailTotals | null {
  const sent = cs.reduce((s, c) => s + c.sent, 0);
  if (!sent) return null;
  const sum = (f: (c: EmailCampaign) => number) => cs.reduce((s, c) => s + f(c), 0);
  return { sent, openRate: sum(c => c.opens) / sent * 100, clickRate: sum(c => c.clicks) / sent * 100, unsubRate: sum(c => c.unsubs) / sent * 100 };
}

let store: Record<string, EmailCampaign[]> = {};
const listeners = new Set<() => void>();
export const emailStore = {
  get: () => store,
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
  set(client: string, campaigns: EmailCampaign[]) { store = { ...store, [client]: campaigns }; listeners.forEach(l => l()); },
  clear(client: string) { const { [client]: _d, ...rest } = store; store = rest; listeners.forEach(l => l()); },
};
export const useEmailData = () => useSyncExternalStore(emailStore.subscribe, emailStore.get, emailStore.get);
