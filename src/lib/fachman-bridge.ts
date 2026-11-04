/**
 * Reads files saved by the local Fachman bridge (scripts/most-fachman.sh):
 *  - Google Ads: output of `scripts/google_ads/fetch.py <id> campaigns --days N`
 *  - Meta Ads:   output of `scripts/meta/fetch.py insights <act_id> --level campaign --days N`
 * Everything happens in the browser. Nothing is uploaded.
 */
import { kindOf, type BridgeDataset, type BridgeSource, type ChannelCampaign } from './campaign-data';

export type BridgeParse = { ok: true; dataset: BridgeDataset } | { ok: false; errors: string[] };

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
/** Google's JSON sends 64-bit numbers as strings and leaves out zero values. */
const num = (v: unknown) => { const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : 0; return Number.isFinite(n) ? n : 0; };
const get = (o: unknown, ...path: string[]): unknown => path.reduce<unknown>((acc, k) => (isObj(acc) ? acc[k] : undefined), o);

/** "-30d-" in the file name (written by the bridge script) tells which period the file covers. */
export const daysFromFileName = (fileName: string) => { const m = /-(\d{1,3})d(?:-|\.)/.exec(fileName); return m ? Number(m[1]) : null; };

function googleCampaigns(rows: Obj[]): { campaigns: ChannelCampaign[]; skipped: number } {
  let skipped = 0;
  const campaigns: ChannelCampaign[] = [];
  for (const r of rows) {
    const name = get(r, 'campaign', 'name');
    if (typeof name !== 'string') { skipped++; continue; }
    const lost = get(r, 'metrics', 'searchBudgetLostImpressionShare');
    campaigns.push({
      id: String(get(r, 'campaign', 'id') ?? name), name, channel: 'Google Ads',
      kind: kindOf(name, String(get(r, 'campaign', 'advertisingChannelType') ?? '')),
      active: get(r, 'campaign', 'status') === 'ENABLED',
      spend: num(get(r, 'metrics', 'costMicros')) / 1e6, revenue: num(get(r, 'metrics', 'conversionsValue')),
      conversions: num(get(r, 'metrics', 'conversions')), clicks: num(get(r, 'metrics', 'clicks')), impressions: num(get(r, 'metrics', 'impressions')),
      ...(lost !== undefined ? { lostBudgetShare: Math.min(1, Math.max(0, num(lost))) } : {}),
    });
  }
  return { campaigns, skipped };
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

function metaCampaigns(rows: Obj[]): { campaigns: ChannelCampaign[]; skipped: number } {
  let skipped = 0;
  const byName = new Map<string, ChannelCampaign>();
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
  }
  return { campaigns: [...byName.values()], skipped };
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
  const { campaigns, skipped } = source === 'google_ads' ? googleCampaigns(objects) : metaCampaigns(objects);
  if (campaigns.length === 0) return { ok: false, errors: ['Žádný řádek se nepodařilo přečíst.'] };
  const days = daysFromFileName(fileName);
  const notes = [
    'Částky jsou v měně účtu, AVQIX je zobrazuje jako Kč.',
    ...(source === 'meta_ads' ? ['Meta: konverze a hodnota se berou z nákupů, jinak z leadů. Stav kampaní z insights nepoznám, všechny se berou jako aktivní.'] : []),
    ...(days === null ? ['V názvu souboru chybí délka období (např. „-30d-“). Cíle za objem (tržby, počet konverzí, rozpočet) se proto nevyhodnotí.'] : []),
    ...(skipped ? [`${skipped} řádků bylo přeskočeno.`] : []),
  ];
  return { ok: true, dataset: { source, fileName, days, campaigns, notes } };
}
