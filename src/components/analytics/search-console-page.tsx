import { useMemo, useState } from 'react';
import { ArrowDownUp, Check, Download, FlaskConical, Lightbulb, Send, ShieldCheck, Trash2, TriangleAlert } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { PageHeader, SectionHeading } from './controls';
import { CsvPicker } from './csv-picker';
import { ColumnReport } from './column-report';
import { downloadCsv, number } from '@/lib/analytics-data';
import { buildRecommendations, findOpportunities, gscColumns, gscRules, parseGscCsv, pct, pos, sumRows, type GscDimension, type GscRow, type Opportunity } from '@/lib/search-console';
import { tasksStore, useTasks } from '@/lib/tasks-store';
import { gscStore, useGscData, type GscPeriod } from '@/lib/gsc-store';
import { sampleQueriesCurrent, sampleQueriesPrevious, samplePagesCurrent } from '@/lib/gsc-sample';
import { buildAiPayload, aiProviders } from '@/lib/ai-summary';
import { useAiSettings } from '@/lib/ai-store';
import type { ColumnCheck } from '@/lib/csv-import';

type ImportLog = { id: number; period: GscPeriod; fileName: string; ok: boolean; messages: string[]; check: ColumnCheck | null };
const rowsWord = (n: number) => (n === 1 ? 'řádek' : n >= 2 && n <= 4 ? 'řádky' : 'řádků');
const dimensionName: Record<GscDimension, string> = { query: 'Dotazy', page: 'Stránky' };

export function SearchConsolePage() {
  const data = useGscData();
  const [log, setLog] = useState<ImportLog[]>([]);
  const [dimension, setDimension] = useState<GscDimension>('query');
  const [minImpressions, setMinImpressions] = useState(100);

  const addFile = (period: GscPeriod, text: string, fileName: string) => {
    const result = parseGscCsv(text, fileName);
    if (result.ok) gscStore.set(period, result.dataset);
    setLog(l => [{ id: Date.now() + Math.random(), period, fileName, ok: result.ok, check: result.check, messages: result.ok ? [`Načteno ${result.dataset.rows.length} ${rowsWord(result.dataset.rows.length)} (${dimensionName[result.dataset.dimension]}).`, ...result.warnings] : result.errors }, ...l].slice(0, 6));
    if (result.ok) setDimension(result.dataset.dimension);
  };
  const loadSample = () => {
    gscStore.clear();
    setLog([]);
    addFile('current', sampleQueriesCurrent, 'ukazka-dotazy-aktualni.csv');
    addFile('previous', sampleQueriesPrevious, 'ukazka-dotazy-predchozi.csv');
    addFile('current', samplePagesCurrent, 'ukazka-stranky-aktualni.csv');
    setDimension('query');
  };
  const reset = () => { gscStore.clear(); setLog([]); };

  const available = (Object.keys(data.current) as GscDimension[]);
  const active: GscDimension | undefined = data.current[dimension] ? dimension : available[0];
  const current = active ? data.current[active] : undefined;
  const previous = active ? data.previous[active] : undefined;

  return <main className="page-content">
    <PageHeader title="Search Console" description="Import exportu, příležitosti v organice a doporučení podle pravidel." />
    <div className="info-banner"><ShieldCheck size={18} /><span>Soubory se čtou jen ve vašem prohlížeči a nikam se neodesílají. Data zůstanou v paměti, po obnovení stránky zmizí. Import nezávisí na vybraném ukázkovém klientovi.</span></div>

    <SectionHeading title="Import CSV" subtitle="Exporty z Search Console (Výkon, Export, CSV). Dotazy a stránky nahrajte zvlášť, rozpozná se to samo." action={
      <div className="gsc-actions">
        <Button variant="ghost" size="sm" onClick={loadSample}><FlaskConical />Vyzkoušet na vymyšlených datech</Button>
        {(available.length > 0) && <Button variant="ghost" size="sm" onClick={reset}><Trash2 />Smazat data</Button>}
      </div>} />
    <div className="gsc-import">
      <article className="gsc-slot"><strong>Aktuální období</strong><p>Povinné. Můžete vybrat víc souborů najednou.</p>
        <CsvPicker label="Vybrat CSV" multiple onText={(t, n) => addFile('current', t, n)} />
        <small>{(['query', 'page'] as const).filter(d => data.current[d]).map(d => `${dimensionName[d]}: ${data.current[d]!.rows.length}`).join(' · ') || 'Zatím nic nenahráno'}</small></article>
      <article className="gsc-slot"><strong>Předchozí období</strong><p>Volitelné, stejně dlouhé. Bez něj nelze hledat poklesy.</p>
        <CsvPicker label="Vybrat CSV" multiple onText={(t, n) => addFile('previous', t, n)} />
        <small>{(['query', 'page'] as const).filter(d => data.previous[d]).map(d => `${dimensionName[d]}: ${data.previous[d]!.rows.length}`).join(' · ') || 'Zatím nic nenahráno'}</small></article>
    </div>
    {log.length > 0 && <div className="import-log" aria-live="polite">{log.map(entry => <div key={entry.id} className={`import-entry ${entry.ok ? 'ok' : 'error'}`}>
      <strong>{entry.ok ? '✓' : '✕'} {entry.fileName}</strong><small>{entry.period === 'current' ? 'aktuální období' : 'předchozí období'}</small>
      {entry.messages.map(m => <p key={m}>{m}</p>)}
      {!entry.ok && entry.check && <ColumnReport spec={gscColumns} check={entry.check} />}
    </div>)}</div>}

    {!current ? <>
      <div className="info-banner"><TriangleAlert size={18} /><span>Zatím nejsou nahraná žádná data. Nahrajte export, nebo si zkuste vymyšlená data výše.</span></div>
      <section className="reco-section"><SectionHeading title="Co vám aplikace poradí" subtitle="Po nahrání dat uvidíte konkrétní příklady, komu je předat a jaký mají dopad" />
        <div className="reco-grid">{gscRules.map(r => <article key={r.title} className="reco-card"><h3><Lightbulb size={15} />{r.title}</h3><p>{r.what}</p><p className="reco-action"><strong>Co udělat:</strong> {r.todo}</p></article>)}</div></section></>
      : <Analysis rows={current.rows} previousRows={previous?.rows ?? null} dimension={active!} available={available} setDimension={setDimension} minImpressions={minImpressions} setMinImpressions={setMinImpressions} />}
  </main>;
}

function Analysis({ rows, previousRows, dimension, available, setDimension, minImpressions, setMinImpressions }: { rows: GscRow[]; previousRows: GscRow[] | null; dimension: GscDimension; available: GscDimension[]; setDimension: (d: GscDimension) => void; minImpressions: number; setMinImpressions: (n: number) => void }) {
  const tasks = useTasks();
  const isSent = (id: string) => tasks.some(t => t.sourceKey === `gsc:${dimension}:${id}`);
  const total = useMemo(() => sumRows(rows), [rows]);
  const before = useMemo(() => (previousRows ? sumRows(previousRows) : null), [previousRows]);
  const opp = useMemo(() => findOpportunities(rows, previousRows, { minImpressions }), [rows, previousRows, minImpressions]);
  const recs = useMemo(() => buildRecommendations(dimension, opp, previousRows !== null), [dimension, opp, previousRows]);
  const delta = (now: number, prev?: number, invert = false) => prev ? <small className={(now - prev > 0) !== invert ? 'gsc-up' : 'gsc-down'}>{now - prev > 0 ? '+' : '−'}{Math.abs(((now - prev) / prev) * 100).toFixed(1).replace('.', ',')} % vs. předchozí</small> : null;

  return <>
    {available.length > 1 && <div className="page-tabs" role="tablist" aria-label="Dimenze">{available.map(d => <Button key={d} role="tab" aria-selected={d === dimension} variant="ghost" className={d === dimension ? 'active' : ''} onClick={() => setDimension(d)}>{dimensionName[d]}</Button>)}</div>}
    <div className="metrics-grid" style={{ marginTop: available.length > 1 ? 0 : 24 }}>
      <article className="metric-card"><div className="metric-label">Kliknutí</div><div className="metric-value">{number(total.clicks)}</div>{delta(total.clicks, before?.clicks)}</article>
      <article className="metric-card"><div className="metric-label">Zobrazení</div><div className="metric-value">{number(total.impressions)}</div>{delta(total.impressions, before?.impressions)}</article>
      <article className="metric-card"><div className="metric-label">CTR</div><div className="metric-value">{pct(total.ctr)}</div>{delta(total.ctr, before?.ctr)}</article>
      <article className="metric-card"><div className="metric-label">Průměrná pozice</div><div className="metric-value">{pos(total.position)}</div>{delta(total.position, before?.position, true)}</article>
    </div>

    <section className="reco-section">
      <SectionHeading title="Doporučení" subtitle="Pravidlová analýza nahraných dat · každé s jistotou a příklady" action={<label className="gsc-threshold">Min. zobrazení <input type="number" min={0} step={10} value={minImpressions} onChange={e => setMinImpressions(Math.max(0, Number(e.target.value) || 0))} /></label>} />
      <div className="reco-grid">{recs.map(r => <article key={r.id} className="reco-card">
        <div className="reco-top"><span className={`reco-priority p-${r.priority === 'Vysoká' ? 'high' : r.priority === 'Střední' ? 'mid' : 'low'}`}>{r.priority}</span><small>jistota {r.confidence.toLowerCase()}</small></div>
        <h3><Lightbulb size={15} />{r.title}</h3>
        <p>{r.insight}</p>
        <p className="reco-action"><strong>Co udělat:</strong> {r.action}</p>
        {r.examples.length > 0 && <p className="gsc-examples"><small>PŘÍKLADY</small>{r.examples.map(e => <code key={e}>{e}</code>)}</p>}
        <div className="reco-foot"><div><small>PŘEDAT</small><strong>{r.recipient}</strong><span className="reco-audience">{r.audience === 'Klient' ? 'Pro klienta' : 'Interní tým'} · {r.impact}</span></div>
          <Button size="sm" variant={isSent(r.id) ? 'ghost' : 'outline'} disabled={isSent(r.id)} onClick={() => tasksStore.add({ sourceKey: `gsc:${dimension}:${r.id}`, title: r.title, action: r.action, source: `Search Console · ${dimensionName[dimension]}`, recipient: r.recipient, impact: r.impact, priority: r.priority })}>{isSent(r.id) ? <><Check />Předáno</> : <><Send />Předat</>}</Button></div>
      </article>)}</div>
    </section>

    <OpportunityTable title="Hodně zobrazení, nízké CTR" subtitle="V top 10, ale lidé neklikají" list={opp.lowCtr} file="search-console-nizke-ctr.csv" />
    <OpportunityTable title="Pozice 8 až 20" subtitle="Blízko první stránky, stojí za posílení" list={opp.nearPageOne} file="search-console-pozice-8-20.csv" />
    <OpportunityTable title="Poklesy" subtitle={previousRows ? 'Proti předchozímu období' : 'Vyžaduje export předchozího období'} list={opp.drops} file="search-console-poklesy.csv" />
    <AllRows rows={rows} dimension={dimension} />
    <AiPanel rows={rows} previousRows={previousRows} />
  </>;
}

function OpportunityTable({ title, subtitle, list, file }: { title: string; subtitle: string; list: Opportunity[]; file: string }) {
  const exportRows = () => downloadCsv(file, ['Položka', 'Kliknutí', 'Zobrazení', 'CTR', 'Pozice', 'Odhad kliknutí navíc', 'Poznámka'], list.map(o => [o.row.key, o.row.clicks, o.row.impressions, pct(o.row.ctr), pos(o.row.position), o.potentialClicks, o.note]));
  return <section className="table-section"><SectionHeading title={title} subtitle={`${subtitle} · ${list.length} nalezeno`} action={list.length > 0 ? <Button variant="ghost" size="sm" onClick={exportRows}><Download />Export CSV</Button> : undefined} />
    {list.length === 0 ? <div className="info-banner"><span>Nic nenalezeno při aktuálním nastavení.</span></div> :
      <div className="table-scroll"><table><thead><tr><th>Položka</th><th className="numeric">Kliknutí</th><th className="numeric">Zobrazení</th><th className="numeric">CTR</th><th className="numeric">Pozice</th><th className="numeric">Odhad navíc</th><th>Poznámka</th></tr></thead>
        <tbody>{list.slice(0, 10).map(o => <tr key={o.row.key}><td className="gsc-key" title={o.row.key}>{o.row.key}</td><td className="numeric">{number(o.row.clicks)}</td><td className="numeric">{number(o.row.impressions)}</td><td className="numeric">{o.row.impressions ? pct(o.row.ctr) : '–'}</td><td className="numeric">{o.row.impressions ? pos(o.row.position) : '–'}</td><td className="numeric">{o.potentialClicks > 0 ? `+${number(o.potentialClicks)}` : '–'}</td><td>{o.note}</td></tr>)}</tbody></table></div>}
  </section>;
}

type SortKey = 'key' | 'clicks' | 'impressions' | 'ctr' | 'position';
function AllRows({ rows, dimension }: { rows: GscRow[]; dimension: GscDimension }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('clicks');
  const [asc, setAsc] = useState(false);
  const [limit, setLimit] = useState(25);
  const filtered = useMemo(() => rows.filter(r => r.key.toLowerCase().includes(query.toLowerCase())).sort((a, b) => {
    const d = sort === 'key' ? a.key.localeCompare(b.key, 'cs') : a[sort] - b[sort];
    return asc ? d : -d;
  }), [rows, query, sort, asc]);
  const head = (key: SortKey, label: string, numeric = true) => <th className={numeric ? 'numeric' : ''}><Button variant="ghost" size="sm" onClick={() => { if (sort === key) setAsc(!asc); else { setSort(key); setAsc(key === 'key'); } }}>{label}<ArrowDownUp size={11} /></Button></th>;
  return <section className="table-section"><SectionHeading title={`Všechny ${dimension === 'query' ? 'dotazy' : 'stránky'}`} subtitle={`${filtered.length} z ${rows.length} ${rowsWord(rows.length)}`} action={<Button variant="ghost" size="sm" onClick={() => downloadCsv('search-console-vse.csv', [dimensionName[dimension], 'Kliknutí', 'Zobrazení', 'CTR', 'Pozice'], filtered.map(r => [r.key, r.clicks, r.impressions, pct(r.ctr), pos(r.position)]))}><Download />Export CSV</Button>} />
    <div className="table-toolbar"><input className="gsc-search" type="search" placeholder="Hledat…" aria-label="Hledat v tabulce" value={query} onChange={e => { setQuery(e.target.value); setLimit(25); }} /></div>
    <div className="table-scroll"><table><thead><tr>{head('key', dimension === 'query' ? 'Dotaz' : 'Stránka', false)}{head('clicks', 'Kliknutí')}{head('impressions', 'Zobrazení')}{head('ctr', 'CTR')}{head('position', 'Pozice')}</tr></thead>
      <tbody>{filtered.slice(0, limit).map(r => <tr key={r.key}><td className="gsc-key" title={r.key}>{r.key}</td><td className="numeric">{number(r.clicks)}</td><td className="numeric">{number(r.impressions)}</td><td className="numeric">{pct(r.ctr)}</td><td className="numeric">{pos(r.position)}</td></tr>)}</tbody></table></div>
    {filtered.length > limit && <Button variant="ghost" size="sm" className="gsc-more" onClick={() => setLimit(limit + 50)}>Zobrazit dalších 50</Button>}
  </section>;
}

function AiPanel({ rows, previousRows }: { rows: GscRow[]; previousRows: GscRow[] | null }) {
  const ai = useAiSettings();
  const payload = useMemo(() => buildAiPayload(rows, previousRows), [rows, previousRows]);
  if (!ai.enabled) return <section className="settings-section"><SectionHeading title="AI souhrn" subtitle="Vypnuto" /><div className="info-banner"><span>AI je ve výchozím stavu vypnutá. Zapnout ji můžete na stránce <Link to="/datove-zdroje" className="gsc-link">Datové zdroje</Link>.</span></div></section>;
  return <section className="settings-section"><SectionHeading title="AI souhrn" subtitle={`${aiProviders.find(p => p.id === ai.provider)?.name} · náhled toho, co by se odeslalo`} />
    <p className="gsc-note">Odešly by se jen tato souhrnná čísla. Dotazy, adresy a názvy klientů v nich nejsou. V prototypu se nic neodesílá, odesílání není zapojené.</p>
    <pre className="ai-payload">{JSON.stringify(payload, null, 2)}</pre>
    <Button variant="outline" size="sm" disabled title="V prototypu není zapojeno">Vygenerovat souhrn (není zapojeno)</Button>
  </section>;
}
