import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronDown, Lightbulb, Link2, Plug, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PageHeader, SectionHeading } from './controls';
import { CsvPicker } from './csv-picker';
import { ColumnReport } from './column-report';
import { connectors, type Connector } from '@/lib/data-sources';
import { checkColumns, parseCsv, type ColumnCheck } from '@/lib/csv-import';
import { parseGscCsv } from '@/lib/search-console';
import { emailStore, parseEmailCsv } from '@/lib/email-data';
import { gscStore } from '@/lib/gsc-store';
import { aiProviders, type AiProvider } from '@/lib/ai-summary';
import { aiStore, useAiSettings } from '@/lib/ai-store';
import { bridgeSourceLabel, bridgeStore, useBridge } from '@/lib/campaign-data';
import { parseFachmanJson } from '@/lib/fachman-bridge';
import { clients } from '@/lib/analytics-data';
import { useWorkspace } from './workspace';

const nextSteps = [
  { title: '1. Začněte Search Console', text: 'Je to jediný zdroj, který aplikace už umí vyhodnotit. Stáhněte export Dotazy a Stránky a nahrajte ho na stránce Search Console.' },
  { title: '2. Přidejte předchozí období', text: 'Druhý export za stejně dlouhé minulé období odemkne hledání poklesů.' },
  { title: '3. Ostatní zdroje zatím jen zkontrolujte', text: 'Meta Ads, Google Ads, GA4, YouTube a e-mailing zatím jen ověří sloupce. Vyplatí se zjistit, jestli váš export vychází, než se postaví napojení.' },
];
type Check = { fileName: string; check: ColumnCheck; preview: string[][]; rowCount: number; stored: boolean; errors: string[] };

export function DataSourcesPage() {
  return <main className="page-content">
    <PageHeader title="Datové zdroje" description="Konektory jako zásuvné moduly. Zatím je žádný není připojený." />
    <div className="info-banner"><ShieldCheck size={18} /><span>Prototyp běží lokálně. Nic se nepřipojuje k externím účtům a žádná data se neodesílají. CSV soubory se čtou jen v prohlížeči.</span></div>
    <SectionHeading title="Konektory" subtitle={`${connectors.length} modulů · ${connectors.filter(c => c.status === 'connected').length} připojeno`} />
    <section className="reco-section"><SectionHeading title="Co udělat dál" subtitle="Doporučený postup pro napojení dat" />
      <div className="reco-grid">{nextSteps.map(r => <article key={r.title} className="reco-card"><h3><Lightbulb size={15} />{r.title}</h3><p>{r.text}</p></article>)}</div></section>
    <div className="connector-grid"><FachmanCard />{connectors.map(c => c.id === 'ai' ? <AiCard key={c.id} connector={c} /> : <ConnectorCard key={c.id} connector={c} />)}</div>
  </main>;
}

function StatusPill() {
  return <span className="integration-state"><Link2 size={14} />Nepřipojeno</span>;
}

function ConnectorCard({ connector }: { connector: Connector }) {
  const { client } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<Check | null>(null);
  const spec = connector.csv!.columns;

  const handle = (text: string, fileName: string) => {
    if (connector.id === 'search-console') {
      const parsed = parseGscCsv(text, fileName);
      const table = parseCsv(text);
      const check = parsed.check ?? checkColumns(table[0] ?? [], spec);
      if (parsed.ok) gscStore.set('current', parsed.dataset);
      setResult({ fileName, check, preview: table.slice(1, 6), rowCount: Math.max(0, table.length - 1), stored: parsed.ok, errors: parsed.ok ? parsed.warnings : parsed.errors });
      return;
    }
    if (connector.id === 'email') {
      const parsed = parseEmailCsv(text);
      const table = parseCsv(text);
      if (parsed.ok) emailStore.set(clients[client] ?? '', parsed.campaigns);
      setResult({ fileName, check: checkColumns(table[0] ?? [], spec), preview: table.slice(1, 6), rowCount: Math.max(0, table.length - 1), stored: parsed.ok, errors: parsed.ok ? parsed.warnings : parsed.errors });
      return;
    }
    const table = parseCsv(text);
    if (table.length < 2) { setResult({ fileName, check: checkColumns(table[0] ?? [], spec), preview: [], rowCount: 0, stored: false, errors: ['Soubor je prázdný nebo obsahuje jen hlavičku.'] }); return; }
    const check = checkColumns(table[0]!, spec);
    setResult({ fileName, check, preview: table.slice(1, 6), rowCount: table.length - 1, stored: false, errors: check.missing.map(c => `Chybí povinný sloupec: ${c.label}.`) });
  };

  return <article className="connector-card">
    <div className="connector-head"><span className="integration-symbol">{connector.symbol}</span><div><strong>{connector.name}</strong><p>{connector.description}</p></div><StatusPill /></div>
    <p className="connector-note"><Plug size={13} />{connector.connectionNote}</p>
    <div className="connector-actions">
      <Button size="sm" disabled title="Připojení účtů zatím není součástí prototypu">Připojit účet</Button>
      <Button size="sm" variant="outline" aria-expanded={open} onClick={() => setOpen(!open)}>Import CSV<ChevronDown className={open ? 'rotated' : ''} /></Button>
    </div>
    {open && <div className="connector-csv">
      <p>{connector.csv!.hint}</p>
      <CsvPicker label="Vybrat CSV ke kontrole" onText={handle} />
      {!result && <ColumnReport spec={spec} check={null} />}
      {result && <>
        <p className={`import-status ${result.errors.length && !result.stored && !result.check.ok ? 'error' : 'ok'}`}><strong>{result.fileName}</strong> · {result.rowCount} {result.rowCount === 1 ? 'řádek' : result.rowCount >= 2 && result.rowCount <= 4 ? 'řádky' : 'řádků'} · {result.check.ok && result.errors.every(e => !e.startsWith('Chyb')) ? 'sloupce v pořádku' : 'sloupce nesedí'}</p>
        <ColumnReport spec={spec} check={result.check} />
        {result.errors.map(e => <p key={e} className="gsc-note">{e}</p>)}
        {result.preview.length > 0 && <div className="table-scroll"><table><tbody>{result.preview.map((r, i) => <tr key={i}>{r.slice(0, 6).map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
        {result.stored ? <p className="gsc-note">Načteno do paměti{connector.id === 'email' ? ` pro klienta ${clients[client] ?? ''}` : ''}. {connector.id === 'email' ? <Link to="/cile" className="gsc-link">Otevřít Cíle a rady</Link> : <Link to="/search-console" className="gsc-link">Otevřít analýzu Search Console</Link>}</p>
          : <p className="gsc-note">{connector.csv!.feedsApp ? 'Data nebyla načtena, opravte soubor.' : 'Zatím jen kontrola sloupců a náhled. Data se neukládají a žádná část aplikace je nepoužívá.'}</p>}
      </>}
    </div>}
  </article>;
}

function AiCard({ connector }: { connector: Connector }) {
  const ai = useAiSettings();
  return <article className="connector-card">
    <div className="connector-head"><span className="integration-symbol">{connector.symbol}</span><div><strong>{connector.name}</strong><p>{connector.description}</p></div><span className="integration-state"><Sparkles size={14} />{ai.enabled ? 'Zapnuto' : 'Vypnuto'}</span></div>
    <p className="connector-note"><Plug size={13} />{connector.connectionNote}</p>
    <label className="ai-toggle"><Switch checked={ai.enabled} onCheckedChange={enabled => aiStore.update({ enabled })} aria-label="Povolit AI souhrny" /><span>Povolit AI souhrny</span></label>
    <label className="ai-provider">Poskytovatel
      <select value={ai.provider} disabled={!ai.enabled} onChange={e => aiStore.update({ provider: e.target.value as AiProvider })}>{aiProviders.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
    <p className="gsc-note">Pokud AI zapnete, bude se posílat jen souhrnná čísla (součty kliknutí, zobrazení, CTR, počty příležitostí). Žádné dotazy, adresy ani názvy klientů. V prototypu se nic neodesílá, uvidíte jen náhled na stránce Search Console.</p>
  </article>;
}

function FachmanCard() {
  const { client } = useWorkspace();
  const bridge = useBridge();
  const [target, setTarget] = useState<number | null>(null);
  const [msgs, setMsgs] = useState<{ ok: boolean; text: string }[]>([]);
  const name = clients[target ?? client] ?? clients[0] ?? "";
  const loaded = bridge[name] ?? [];
  const handle = (text: string, fileName: string) => {
    const r = parseFachmanJson(text, fileName);
    if (!r.ok) { setMsgs(m => [...m, ...r.errors.map(e => ({ ok: false, text: `${fileName}: ${e}` }))]); return; }
    bridgeStore.set(name, r.dataset);
    setMsgs(m => [...m, { ok: true, text: `${fileName}: načteno ${r.dataset.campaigns.length} kampaní (${bridgeSourceLabel[r.dataset.source]}${r.dataset.days ? `, ${r.dataset.days} dní` : ''}).` }, ...r.dataset.notes.map(n => ({ ok: true, text: n }))]);
  };
  return <article className="connector-card">
    <div className="connector-head"><span className="integration-symbol">F</span><div><strong>Fachman (PPC) · lokální most</strong><p>Skutečné kampaně z Google Ads a Meta Ads, zdarma, bez serveru a bez cloudu.</p></div><span className="integration-state"><Link2 size={14} />{loaded.length ? 'Načteno' : 'Nenačteno'}</span></div>
    <p className="connector-note"><Plug size={13} />Fachman data jen přečte a uloží do složky data-most. Tady je z ní vyberete. Nic se neodesílá a po obnovení stránky se data z paměti smažou.</p>
    <label className="ai-provider">Pro klienta
      <select value={target ?? client} onChange={e => setTarget(Number(e.target.value))}>{clients.map((c, i) => <option key={c} value={i}>{c}</option>)}</select></label>
    <div className="connector-actions">
      <CsvPicker label="Vybrat soubory z data-most" multiple accept=".json,application/json" onText={handle} />
      {loaded.length > 0 && <Button size="sm" variant="ghost" onClick={() => { bridgeStore.clear(name); setMsgs([]); }}>Zapomenout data</Button>}
    </div>
    {loaded.map(d => <p key={d.source} className="gsc-note">{bridgeSourceLabel[d.source]}: {d.campaigns.length} kampaní · {d.fileName}</p>)}
    {msgs.map((m, i) => <p key={i} className={`gsc-note ${m.ok ? '' : 'import-status error'}`}>{m.text}</p>)}
    {loaded.length > 0 && <p className="gsc-note">Hotovo. <Link to="/cile" className="gsc-link">Otevřít Cíle a rady</Link></p>}
  </article>;
}
