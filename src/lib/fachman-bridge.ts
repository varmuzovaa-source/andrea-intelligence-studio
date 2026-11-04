/**
 * Reads files saved by the local Fachman bridge (scripts/most-fachman.sh):
 *  - Google Ads: output of `scripts/google_ads/fetch.py <id> campaigns --days N`
 *  - Meta Ads:   output of `scripts/meta/fetch.py insights <act_id> --level campaign --days N`
 * Everything happens in the browser. Nothing is uploaded.
 */
import { kindOf, type BridgeDataset, type BridgeSource, type ChannelCampaign, type DailyPoint } from './campaign-data';

export type BridgeParse = { ok: true; dataset: BridgeDataset } | { ok: false; errors: string[] };

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
/** Google's JSON sends 64-bit numbers as strings and leaves out zero values. */
const num = (v: unknown) => { const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : 0; return Number.isFinite(n) ? n : 0; };
const get = (o: unknown, ...path: string[]): unknown => path.reduce<unknown>((acc, k) => (isObj(acc) ? acc[k] : undefined), o);

/** "-30d-" in the file name (written by the bridge script) tells which period the file covers. */
export const daysFromFileName = (fileName: string) => { const m = /-(\d{1,3})d(?:-|\.)/.exec(fileName); return m ? Number(m[1]) : null; };

type Parsed = { campaigns: ChannelCampaign[]; skipped: number; daily: DailyPoint[] };
const addDaily = (map: Map<string, DailyPoint>, date: unknown, spend: number, revenue: number, conversions: number) => {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
  const d = map.get(date) ?? { date, spend: 0, revenue: 0, conversions: 0 };
  map.set(date, { date, spend: d.spend + spend, revenue: d.revenue + revenue, conversions: d.conversions + conversions });
};
const sortedDaily = (map: Map<string, DailyPoint>) => [...map.values()].sort((x, y) => x.date.localeCompare(y.date));

/** Works for both the totals report and the daily report: rows of the same campaign are added up. */
function googleCampaigns(rows: Obj[]): Parsed {
  let skipped = 0;
  const byId = new Map<string, ChannelCampaign & { lostSum: number; lostN: number }>();
  const daily = new Map<string, DailyPoint>();
  for (const r of rows) {
    const name = get(r, 'campaign', 'name');
    if (typeof name !== 'string') { skipped++; continue; }
    const id = String(get(r, 'campaign', 'id') ?? name);
    const spend = num(get(r, 'metrics', 'costMicros')) / 1e6, revenue = num(get(r, 'metrics', 'conversionsValue')), conv = num(get(r, 'metrics', 'conversions'));
    const lost = get(r, 'metrics', 'searchBudgetLostImpressionShare');
    const prev = byId.get(id);
    byId.set(id, {
      id, name, channel: 'Google Ads', kind: kindOf(name, String(get(r, 'campaign', 'advertisingChannelType') ?? '')), active: get(r, 'campaign', 'status') === 'ENABLED',
      spend: (prev?.spend ?? 0) + spend, revenue: (prev?.revenue ?? 0) + revenue, conversions: (prev?.conversions ?? 0) + conv,
      clicks: (prev?.clicks ?? 0) + num(get(r, 'metrics', 'clicks')), impressions: (prev?.impressions ?? 0) + num(get(r, 'metrics', 'impressions')),
      lostSum: (prev?.lostSum ?? 0) + (lost !== undefined ? num(lost) : 0), lostN: (prev?.lostN ?? 0) + (lost !== undefined ? 1 : 0),
    });
    addDaily(daily, get(r, 'segments', 'date'), spend, revenue, conv);
  }
  const campaigns = [...byId.values()].map(({ lostSum, lostN, ...c }) => (lostN > 0 ? { ...c, lostBudgetShare: Math.min(1, Math.max(0, lostSum / lostN)) } : c));
  return { campaigns, skipped, daily: sortedDaily(daily) };
}

const actionValue = (list: unknown, types: string[]) => {
  if (!Array.isArray(list)) return 0;
  for (const type of types) {
    const hit = list.find(a => isObj(a) && a['action_type'] === type);
    if (hit && isObj(hit)) return num(hit['value']);
  }
  return 0;
};
const purchaseTypes = ['purchase', 'omni_purchase', 'offsite_conversion.fb_pixel_purchase'];
const leadTypes = ['lead', 'offsite_conversion.fb_pixel_lead', 'onsite_conversion.lead_grouped'];

function metaCampaigns(rows: Obj[]): Parsed {
  let skipped = 0;
  const byName = new Map<string, ChannelCampaign>();
  const daily = new Map<string, DailyPoint>();
  for (const r of rows) {
    const name = r['campaign_name'];
    if (typeof name !== 'string') { skipped++; continue; }
    const spend = num(r['spend']);
    const purchases = actionValue(r['actions'], purchaseTypes);
    const conversions = purchases > 0 ? purchases : actionValue(r['actions'], leadTypes);
    const roas = actionValue(r['purchase_roas'], purchaseTypes);
    const value = actionValue(r['action_values'], purchaseTypes) || roas * spend;
    const prev = byName.get(name);
    byName.set(name, {
      id: String(r['campaign_id'] ?? name), name, channel: 'Meta Ads', kind: kindOf(name), active: true,
      spend: (prev?.spend ?? 0) + spend, revenue: (prev?.revenue ?? 0) + value, conversions: (prev?.conversions ?? 0) + conversions,
      clicks: (prev?.clicks ?? 0) + num(r['clicks']), impressions: (prev?.impressions ?? 0) + num(r['impressions']),
    });
    addDaily(daily, r['date_start'], spend, value, conversions);
  }
  return { campaigns: [...byName.values()], skipped, daily: sortedDaily(daily) };
}

export function parseFachmanJson(text: string, fileName: string): BridgeParse {
  let data: unknown;
  try { data = JSON.parse(text.replace(/^\uFEFF/, '')); } catch { return { ok: false, errors: ['Soubor není platný JSON. Vytvořte ho skriptem scripts/most-fachman.sh.'] }; }
  const rows = Array.isArray(data) ? data : isObj(data) && Array.isArray(data['data']) ? data['data'] : null;
  if (!rows) return { ok: false, errors: ['Soubor nemá očekávaný tvar (seznam kampaní). Zkontrolujte, že obsahuje výstup z Fachmana, ne chybovou hlášku.'] };
  const objects = rows.filter(isObj);
  if (objects.length === 0) return { ok: false, errors: ['V souboru nejsou žádné kampaně. Možná za zvolené období nebyla žádná aktivita.'] };
  const sample = objects[0]!;
  const source: BridgeSource | null = isObj(sample['campaign']) ? 'google_ads' : typeof sample['campaign_name'] === 'string' ? 'meta_ads' : null;
  if (!source) return { ok: false, errors: ['Nepoznávám formát. Podporuji kampaně z Google Ads (report „campaigns“) a Meta Ads (insights na úrovni kampaní).'] };
  const { campaigns, skipped, daily } = source === 'google_ads' ? googleCampaigns(objects) : metaCampaigns(objects);
  if (campaigns.length === 0) return { ok: false, errors: ['Žádný řádek se nepodařilo přečíst.'] };
  const days = daysFromFileName(fileName);
  const notes = [
    'Částky jsou v měně účtu, AVQIX je zobrazuje jako Kč.',
    ...(source === 'meta_ads' ? ['Meta: konverze a hodnota se berou z nákupů, jinak z leadů. Stav kampaní z insights nepoznám, všechny se berou jako aktivní.'] : []),
    ...(days === null ? ['V názvu souboru chybí délka období (např. „-30d-“). Cíle za objem (tržby, počet konverzí, rozpočet) se proto nevyhodnotí.'] : []),
    ...(skipped ? [`${skipped} řádků bylo přeskočeno.`] : []),
  ];
  return { ok: true, dataset: { source, fileName, days, campaigns, notes, ...(daily.length > 1 ? { daily } : {}) } };
}
