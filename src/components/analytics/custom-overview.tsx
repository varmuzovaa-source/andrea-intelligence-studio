import { Link } from '@tanstack/react-router';
import { Download, Target } from 'lucide-react';
import { Area, Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { PageHeader, SectionHeading } from './controls';
import { useWorkspace } from './workspace';
import { clientConfig, clients, downloadCsv, money, number } from '@/lib/analytics-data';
import { getCampaignData, useBridge, type Channel } from '@/lib/campaign-data';
import { emailTotals, useEmailData } from '@/lib/email-data';

const dec = (v: number, d = 2) => v.toFixed(d).replace('.', ',');
const channels: Channel[] = ['Google Ads', 'Meta Ads', 'E-mail'];

/** Overview built only from numbers the user imported. Shown instead of the demo pages for own clients. */
export function CustomOverview({ campaignsOnly = false }: { campaignsOnly?: boolean }) {
  const { client } = useWorkspace();
  const name = clients[client] ?? '';
  const vocab = clientConfig(client).vocab;
  const bridge = useBridge();
  const emails = useEmailData()[name] ?? [];
  const data = getCampaignData(client, 30, bridge);
  const sets = bridge[name] ?? [];
  const cs = data.campaigns;
  const spend = cs.reduce((s, c) => s + c.spend, 0), revenue = cs.reduce((s, c) => s + c.revenue, 0), conv = cs.reduce((s, c) => s + c.conversions, 0);
  const clicks = cs.reduce((s, c) => s + c.clicks, 0), impr = cs.reduce((s, c) => s + c.impressions, 0);
  const byChannel = channels.map(channel => { const x = cs.filter(c => c.channel === channel); return { channel, spend: Math.round(x.reduce((s, c) => s + c.spend, 0)), revenue: Math.round(x.reduce((s, c) => s + c.revenue, 0)) }; }).filter(c => c.spend > 0 || c.revenue > 0);
  const daily = Object.values(sets.flatMap(s => s.daily ?? []).reduce<Record<string, { date: string; spend: number; revenue: number }>>((acc, d) => { const a = acc[d.date] ?? { date: d.date, spend: 0, revenue: 0 }; acc[d.date] = { date: d.date, spend: a.spend + d.spend, revenue: a.revenue + d.revenue }; return acc; }, {})).sort((a, b) => a.date.localeCompare(b.date)).map(d => ({ ...d, label: new Date(d.date).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' }), spend: Math.round(d.spend), revenue: Math.round(d.revenue) }));
  const et = emailTotals(emails);
  const rows = [...cs].sort((a, b) => b.spend - a.spend);
  const tiles = [
    { label: 'Náklady na reklamu', value: money(spend) },
    ...(revenue > 0 ? [{ label: 'Tržby z reklam', value: money(revenue) }, { label: 'ROAS', value: dec(revenue / Math.max(spend, 1)) + '×', accent: true }] : []),
    { label: vocab.conversions.charAt(0).toUpperCase() + vocab.conversions.slice(1), value: number(conv) },
    ...(conv > 0 ? [{ label: 'Cena za jeden výsledek', value: money(spend / conv) }] : []),
    ...(impr > 0 ? [{ label: 'CTR', value: dec(clicks / impr * 100) + ' %' }] : []),
  ];
  const exportCsv = () => downloadCsv(`kampane-${name}.csv`, ['Kampaň', 'Kanál', 'Náklady', 'Tržby', 'ROAS', 'Konverze', 'CTR (%)'], rows.map(c => [c.name, c.channel, Math.round(c.spend), Math.round(c.revenue), c.spend > 0 && c.revenue > 0 ? Number((c.revenue / c.spend).toFixed(2)) : '', Math.round(c.conversions), c.impressions > 0 ? Number((c.clicks / c.impressions * 100).toFixed(2)) : '']));

  if (cs.length === 0 && emails.length === 0) return <main className="page-content"><PageHeader title={campaignsOnly ? 'Výkon kampaní' : 'Přehled výkonu'} description={`${name}: zatím bez čísel.`} /><div className="info-banner"><Target size={18} /><span>Pro tohoto klienta zatím nejsou nahraná žádná čísla. Na stránce Cíle a rady je tlačítko Aktualizovat z Fachmana, nebo čísla nahrajte na stránce Datové zdroje.</span><Button asChild variant="outline" size="sm"><Link to="/cile">Cíle a rady</Link></Button></div></main>;

  return <main className="page-content">
    <PageHeader title={campaignsOnly ? 'Výkon kampaní' : 'Přehled výkonu'} description={`${name} · ${data.label}${data.days ? ` · posledních ${data.days} dní` : ''}`} />
    {cs.length > 0 && <div className="metrics-grid">{tiles.slice(0, 4).map(t => <article key={t.label} className={`metric-card ${'accent' in t && t.accent ? 'metric-accent' : ''}`}><div className="metric-label">{t.label}</div><div className="metric-value tabular-nums">{t.value}</div></article>)}</div>}
    {tiles.length > 4 && <div className="metrics-grid" style={{ marginTop: 16 }}>{tiles.slice(4).map(t => <article key={t.label} className="metric-card"><div className="metric-label">{t.label}</div><div className="metric-value tabular-nums">{t.value}</div></article>)}</div>}
    {(daily.length > 1 || byChannel.length > 0) && <div className="charts-grid">
      {daily.length > 1 && <article className="chart-panel"><SectionHeading title="Vývoj v čase" subtitle="Denní náklady a tržby z reklam" />
        <div style={{ height: 260 }}><ResponsiveContainer width="100%" height="100%"><ComposedChart data={daily}><CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="label" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} width={48} /><Tooltip formatter={(v) => money(Number(v))} /><Area dataKey="revenue" name="Tržby" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.18} /><Line dataKey="spend" name="Náklady" stroke="var(--foreground)" dot={false} /></ComposedChart></ResponsiveContainer></div></article>}
      {byChannel.length > 0 && <article className="chart-panel"><SectionHeading title="Podle kanálu" subtitle="Náklady a tržby" />
        <div style={{ height: 260 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={byChannel}><CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="channel" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} width={48} /><Tooltip formatter={(v) => money(Number(v))} /><Bar dataKey="spend" name="Náklady" fill="var(--foreground)" radius={[3, 3, 0, 0]} /><Bar dataKey="revenue" name="Tržby" fill="var(--primary)" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div></article>}
    </div>}
    {daily.length <= 1 && cs.length > 0 && <div className="info-banner"><Target size={18} /><span>Graf vývoje v čase se zobrazí, když čísla stáhnete tlačítkem Aktualizovat z Fachmana (stahují se po dnech). Ručně nahraný starší soubor má jen součty.</span></div>}
    {rows.length > 0 && <section className="table-section"><SectionHeading title="Kampaně" subtitle={`${rows.length} kampaní · seřazeno podle nákladů`} action={<Button variant="ghost" size="sm" onClick={exportCsv}><Download />Export CSV</Button>} />
      <div className="table-scroll"><table><thead><tr><th>Kampaň</th><th>Kanál</th><th className="numeric">Náklady</th><th className="numeric">Tržby</th><th className="numeric">ROAS</th><th className="numeric">{vocab.conversions.charAt(0).toUpperCase() + vocab.conversions.slice(1)}</th><th className="numeric">CTR</th></tr></thead>
        <tbody>{rows.map(c => <tr key={`${c.channel}-${c.id}`}><td>{c.name}{c.active ? '' : ' (pozastavená)'}</td><td>{c.channel}</td><td className="numeric tabular-nums">{money(c.spend)}</td><td className="numeric tabular-nums">{c.revenue > 0 ? money(c.revenue) : '—'}</td><td className="numeric tabular-nums">{c.spend > 0 && c.revenue > 0 ? dec(c.revenue / c.spend) + '×' : '—'}</td><td className="numeric tabular-nums">{number(c.conversions)}</td><td className="numeric tabular-nums">{c.impressions > 0 ? dec(c.clicks / c.impressions * 100) + ' %' : '—'}</td></tr>)}</tbody></table></div></section>}
    {et && <section className="table-section"><SectionHeading title="E-mailing" subtitle={`${emails.length} kampaní · odesláno ${number(et.sent)}`} />
      <div className="metrics-grid">{[['Otevřenost', et.openRate], ['Prokliky', et.clickRate], ['Odhlášení', et.unsubRate]].map(([l, v]) => <article key={String(l)} className="metric-card"><div className="metric-label">{l}</div><div className="metric-value tabular-nums">{v === null ? '—' : dec(Number(v), 1) + ' %'}</div></article>)}</div></section>}
    <div className="info-banner"><Target size={18} /><span>Co s tím? Cíle klienta, rady po kampaních a report ke stažení jsou na stránce Cíle a rady.</span><Button asChild variant="outline" size="sm"><Link to="/cile">Otevřít</Link></Button></div>
  </main>;
}
