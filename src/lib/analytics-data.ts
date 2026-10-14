import skincare from '@/assets/creative-skincare.jpg';
import interior from '@/assets/creative-interior.jpg';
import sneaker from '@/assets/creative-sneaker.jpg';

export const clients = ['Greenly Store', 'Forma Studio', 'Step & Co.'];
export const creativeImages = [skincare, interior, sneaker];
export const money = (value: number) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(value) + ' Kč';
export const number = (value: number) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(value);
export function getAnalytics(client: number, period: string) {
  const factor = [1, 0.72, 1.28][client] ?? 1;
  const days = period === '7' ? 7 : period === '90' ? 90 : 30;
  const multiplier = factor * days / 30;
  const spend = Math.round(124680 * multiplier);
  const revenue = Math.round(605945 * multiplier);
  const conversions = Math.round(1284 * multiplier);
  const chart = Array.from({ length: days }, (_, i) => ({
    date: `${i + 1}. ${days === 90 ? '7–9' : '9'}.`,
    revenue: Math.round((15000 + Math.sin(i * 0.65) * 5500 + (i % 7) * 1250 + i * 210) * factor),
    spend: Math.round((3300 + Math.cos(i * 0.4) * 900 + i * 45) * factor),
    previous: Math.round((13500 + Math.sin(i * 0.6) * 3600 + i * 160) * factor),
  }));
  const names = client === 0 ? ['Podzimní kolekce · Sales', 'Bestsellery · Advantage+', 'Remarketing · 30 dní', 'Brand · Vyhledávání', 'Nová kolekce · PMax', 'Newsletter · Září', 'Prospecting · Video', 'Brand · Shopping'] : client === 1 ? ['Nová kolekce · Interiéry', 'Designové křeslo · Sales', 'Remarketing · Studio', 'Brand · Vyhledávání', 'Podzim · PMax', 'Newsletter · Design', 'Inspirace · Video', 'Brand · Shopping'] : ['Nová sezóna · Sales', 'Everyday sneakers · Sales', 'Remarketing · 30 dní', 'Brand · Vyhledávání', 'Performance · PMax', 'Newsletter · Novinky', 'Movement · Video', 'Brand · Shopping'];
  const rows = names.map((name, i) => {
    const rowSpend = Math.round([32450, 28120, 18760, 12350, 16480, 2800, 8500, 5200][i] * multiplier);
    const roas = [5.82, 5.24, 6.18, 7.42, 3.86, 8.24, 2.65, 4.12][i] + client * 0.12;
    return { id: i, name, source: i === 5 ? 'E-mail' : [3, 4, 7].includes(i) ? 'Google Ads' : 'Meta Ads', status: i === 6 ? 'Pozastavená' : 'Aktivní', spend: rowSpend, revenue: Math.round(rowSpend * roas), roas, ctr: [2.84, 3.12, 4.28, 6.12, 1.85, 5.42, 1.24, 2.62][i], cpc: 8.4 + i * 1.2, cpl: 85 + i * 12, conversions: Math.round(rowSpend * roas / 472), image: creativeImages[(i + client) % 3] };
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
