import skincare from '@/assets/creative-skincare.jpg';
import interior from '@/assets/creative-interior.jpg';
import sneaker from '@/assets/creative-sneaker.jpg';

export const clients = ['Greenly Store', 'Forma Studio', 'Step & Co.'] as const;
export const creativeImages = [skincare, interior, sneaker];
export const money = (value: number) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(value) + ' Kč';
export const number = (value: number) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(value);
export function getAnalytics(client: number, period: string) {
  const factor = [1, 0.72, 1.28][client] ?? 1;
  const days = period === '7' ? 7 : period === '90' ? 90 : 30;
  const multiplier = factor * days / 30;
  const spend = Math.round(124680 * multiplier);
  const revenue = Math.round(605945 * multiplier * (1 + client * .07));
  const conversions = Math.round(1284 * multiplier);
  const chart = Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.UTC(2026, 8, 30 - days + i + 1)).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', timeZone: 'UTC' }),
    revenue: Math.round((15000 + Math.sin(i * 0.65) * 5500 + (i % 7) * 1250 + i * 210) * factor),
    spend: Math.round((3300 + Math.cos(i * 0.4) * 900 + i * 45) * factor),
    previous: Math.round((13500 + Math.sin(i * 0.6) * 3600 + i * 160) * factor),
  }));
  const rawRevenue = chart.reduce((total, day) => total + day.revenue, 0);
  const rawSpend = chart.reduce((total, day) => total + day.spend, 0);
  chart.forEach(day => {
    day.revenue = Math.round(day.revenue / rawRevenue * revenue);
    day.spend = Math.round(day.spend / rawSpend * spend);
    day.previous = Math.round(day.previous / rawRevenue * revenue / 1.186);
  });
  const names = client === 0 ? ['Podzimní kolekce · Sales', 'Bestsellery · Advantage+', 'Remarketing · 30 dní', 'Brand · Vyhledávání', 'Nová kolekce · PMax', 'Newsletter · Září', 'Prospecting · Video', 'Brand · Shopping'] : client === 1 ? ['Nová kolekce · Interiéry', 'Designové křeslo · Sales', 'Remarketing · Studio', 'Brand · Vyhledávání', 'Podzim · PMax', 'Newsletter · Design', 'Inspirace · Video', 'Brand · Shopping'] : ['Nová sezóna · Sales', 'Everyday sneakers · Sales', 'Remarketing · 30 dní', 'Brand · Vyhledávání', 'Performance · PMax', 'Newsletter · Novinky', 'Movement · Video', 'Brand · Shopping'];
  const rows = names.map((name, i) => {
    const rowSpend = Math.round(([32450, 28120, 18760, 12350, 16480, 2800, 8500, 5200][i] ?? 0) * multiplier);
    const roas = ([5.82, 5.24, 6.18, 7.42, 3.86, 8.24, 2.65, 4.12][i] ?? 0) + client * 0.12;
    return { id: i, name, source: i === 5 ? 'E-mail' : [3, 4, 7].includes(i) ? 'Google Ads' : 'Meta Ads', status: i === 6 ? 'Pozastavená' : 'Aktivní', spend: rowSpend, revenue: Math.round(rowSpend * roas), roas, ctr: ([2.84, 3.12, 4.28, 6.12, 1.85, 5.42, 1.24, 2.62][i] ?? 0) + client * .15, cpc: 8.4 + i * 1.2, cpl: 85 + i * 12, conversions: Math.round(rowSpend * roas / 472), image: creativeImages[(i + client) % 3] ?? skincare };
  });
  return { spend, revenue, conversions, visits: Math.round(48260 * multiplier), chart, rows, factor, multiplier };
}
export type Campaign = ReturnType<typeof getAnalytics>['rows'][number];
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const csv = '\uFEFF' + [headers, ...rows].map(row => row.map(v => '"' + String(v).replaceAll('"', '""') + '"').join(';')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}
export function pageHead(title: string, description: string) {
  return { meta: [{ title: `${title} — ANDREA AI OS` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} — ANDREA AI OS` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] };
}

export type RecoArea = 'keywords' | 'google' | 'meta';
export const recoAreas: { id: RecoArea; name: string }[] = [
  { id: 'keywords', name: 'Klíčová slova' },
  { id: 'google', name: 'Google Ads' },
  { id: 'meta', name: 'Meta Ads' },
];
export type Recommendation = { id: string; area: RecoArea; priority: 'Vysoká' | 'Střední' | 'Nízká'; title: string; insight: string; action: string; recipient: string; audience: 'Interní' | 'Klient'; impact: string };
export function getKeywords(client: number, period: string) {
  const { multiplier } = getAnalytics(client, period);
  const brand = (clients[client] ?? clients[0]).toLowerCase();
  return [
    { word: brand, intent: 'Navigační', difficulty: 12 },
    { word: 'přírodní produkty', intent: 'Informační', difficulty: 48 },
    { word: 'nová kolekce', intent: 'Komerční', difficulty: 36 },
    { word: 'udržitelný design', intent: 'Informační', difficulty: 54 },
    { word: 'dárky online', intent: 'Transakční', difficulty: 67 },
  ].map((k, i) => {
    const clicks = Math.round((1850 - i * 280) * multiplier);
    const impressions = Math.round((14850 - i * 1800) * multiplier);
    const position = 2.4 + i * 3.8;
    const ctr = clicks / impressions * 100;
    const opportunity = Math.round(Math.min(100, impressions / 150 / multiplier * (position > 4 ? 1.4 : .6) * (100 - k.difficulty) / 60));
    return { ...k, clicks, impressions, position, ctr, change: i + 2, opportunity };
  });
}
export function getRecommendations(client: number, period: string): Recommendation[] {
  const data = getAnalytics(client, period);
  const kw = getKeywords(client, period);
  const name = clients[client] ?? clients[0];
  const r = data.rows;
  const best = [...r].sort((a, b) => b.roas - a.roas)[0]!;
  const worst = [...r].filter(x => x.source === 'Meta Ads').sort((a, b) => a.roas - b.roas)[0]!;
  const pmax = r[4]!;
  return [
    { id: 'k1', area: 'keywords', priority: 'Vysoká', title: `Posunout „${kw[2]!.word}“ do TOP 3`, insight: `Pozice ${kw[2]!.position.toFixed(1).replace('.', ',')} při ${number(kw[2]!.impressions)} zobrazeních – CTR jen ${kw[2]!.ctr.toFixed(1).replace('.', ',')} %.`, action: 'Rozšířit kategorii o 600+ slov, FAQ a interní odkazy z blogu.', recipient: 'SEO specialista', audience: 'Interní', impact: `+${number(kw[2]!.clicks * .6)} kliknutí` },
    { id: 'k2', area: 'keywords', priority: 'Střední', title: `Nový článek na „${kw[3]!.word}“`, insight: `Informační dotaz s obtížností ${kw[3]!.difficulty}/100, zatím bez cílené stránky.`, action: 'Připravit průvodce s odkazy na produkty a meta popisem.', recipient: 'Copywriter', audience: 'Interní', impact: 'Nová organická návštěvnost' },
    { id: 'k3', area: 'keywords', priority: 'Střední', title: `Doplnit „${kw[4]!.word}“ do PPC`, insight: `Transakční slovo na pozici ${kw[4]!.position.toFixed(1).replace('.', ',')} – organicky těžko dosažitelné.`, action: 'Pokrýt slovo ve vyhledávací kampani, organiku řešit dlouhodobě.', recipient: 'PPC specialista', audience: 'Interní', impact: 'Rychlejší obsazení poptávky' },
    { id: 'k4', area: 'keywords', priority: 'Nízká', title: 'Schválit obsahový plán na další měsíc', insight: `${name} roste v ${kw.length} sledovaných slovech.`, action: 'Potvrdit témata článků a dodat fotografie produktů.', recipient: 'Klient', audience: 'Klient', impact: 'Plynulé pokračování růstu' },
    { id: 'g1', area: 'google', priority: 'Vysoká', title: 'Navýšit rozpočet Brand · Vyhledávání', insight: `ROAS ${r[3]!.roas.toFixed(2).replace('.', ',')}× – kampaň je omezená rozpočtem.`, action: 'Zvýšit denní rozpočet o 20 % a hlídat podíl zobrazení.', recipient: 'PPC specialista', audience: 'Interní', impact: `+${money(r[3]!.revenue * .18)} tržeb` },
    { id: 'g2', area: 'google', priority: 'Vysoká', title: `Optimalizovat ${pmax.name}`, insight: `Nejnižší ROAS v Google Ads (${pmax.roas.toFixed(2).replace('.', ',')}×).`, action: 'Vyloučit slabé produkty z feedu a doplnit nové assety.', recipient: 'PPC specialista', audience: 'Interní', impact: 'Úspora až 15 % nákladů' },
    { id: 'g3', area: 'google', priority: 'Střední', title: 'Upravit produktový feed', insight: 'Názvy produktů neobsahují hledané výrazy.', action: 'Doplnit do názvů materiál, barvu a klíčová slova.', recipient: 'E-commerce manažer klienta', audience: 'Klient', impact: 'Vyšší CTR v Shoppingu' },
    { id: 'm1', area: 'meta', priority: 'Vysoká', title: `Přesunout rozpočet do ${best.source === 'Meta Ads' ? best.name : r[2]!.name}`, insight: `Remarketing dosahuje ROAS ${r[2]!.roas.toFixed(2).replace('.', ',')}× oproti ${worst.roas.toFixed(2).replace('.', ',')}× u ${worst.name}.`, action: `Převést 20 % rozpočtu z kampaně ${worst.name}.`, recipient: 'Performance specialista', audience: 'Interní', impact: `+${money(worst.spend * .2 * (r[2]!.roas - worst.roas))} tržeb` },
    { id: 'm2', area: 'meta', priority: 'Střední', title: 'Obnovit kreativy v prospectingu', insight: `CTR ${worst.ctr.toFixed(2).replace('.', ',')} % – kreativy jsou unavené.`, action: 'Připravit 3 nová videa 9:16 s produktem v prvních 3 s.', recipient: 'Grafik / video tvůrce', audience: 'Interní', impact: 'Nižší CPC' },
    { id: 'm3', area: 'meta', priority: 'Nízká', title: 'Dodat nové produktové fotky', insight: 'Nejlepší výkon mají reálné fotky z prostředí.', action: 'Nafotit 10 lifestyle fotografií nové kolekce.', recipient: 'Klient', audience: 'Klient', impact: 'Lepší výkon kreativ' },
  ];
}
