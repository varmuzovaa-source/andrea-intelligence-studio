import { useState } from 'react';
import { Check, ClipboardCopy, Lightbulb, Plus, Send, Target, Trash2, Upload } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { PageHeader, SectionHeading } from './controls';
import { CsvPicker } from './csv-picker';
import { useWorkspace } from './workspace';
import { clientConfig, clients } from '@/lib/analytics-data';
import { getCampaignData, useBridge } from '@/lib/campaign-data';
import { defaultKpi, formatMetric, goalChannels, goalPeriods, goalsFromMarkdown, goalsToMarkdown, metricInfo, newGoalId, operatorOf, periodLabel, type ClientGoals, type GoalChannel, type GoalMetric, type GoalPeriod, type KpiGoal } from '@/lib/goals';
import { goalsStore, useGoals } from '@/lib/goals-store';
import { buildAdvice, computeProgress, verdictLabel, type GoalAdvice, type KpiProgress } from '@/lib/goal-advice';
import { gscRecommendations, useGscData } from '@/lib/gsc-store';
import { sumRows } from '@/lib/search-console';
import { tasksStore, useTasks } from '@/lib/tasks-store';

export function GoalsPage() {
  const { client } = useWorkspace();
  const name = clients[client] ?? clients[0];
  const model = clientConfig(client);
  const all = useGoals();
  const bridge = useBridge();
  const gsc = useGscData();
  const tasks = useTasks();
  const saved = all[name];
  const goals: ClientGoals = saved ?? { business: '', marketing: '', kpis: [], updatedAt: '' };
  const queryRows = gsc.current.query?.rows;
  const ctx = { dataFor: (days: number) => getCampaignData(client, days, bridge), organicClicks: queryRows ? sumRows(queryRows).clicks : null };
  const progress = computeProgress(goals, ctx);
  const advice = buildAdvice(progress, { ...ctx, client, organicRecommendations: gscRecommendations().length });
  const dataLabel = getCampaignData(client, 30, bridge).label;
  const sourceKey = (a: GoalAdvice) => `goal:${name}:${a.id}`;
  const sent = (a: GoalAdvice) => tasks.some(t => t.sourceKey === sourceKey(a));
  const [channelFilter, setChannelFilter] = useState('Všechny');
  const shown = advice.filter(a => channelFilter === 'Všechny' || a.channel === channelFilter);

  return <main className="page-content">
    <PageHeader title="Cíle a rady" description={`Co chce ${name} dosáhnout, jak daleko to je a co udělat u konkrétní kampaně.`} />
    <div className="info-banner"><Target size={18} /><span>{dataLabel === 'Ukázková data' ? 'Zatím počítám s ukázkovými daty, žádná čísla nejsou skutečná. Skutečná čísla z Fachmana nahrajete na stránce ' : `${dataLabel} nahrazují ukázková čísla pro klienta ${name}. Další zdroje najdete na stránce `}<Link to="/datove-zdroje" className="gsc-link">Datové zdroje</Link>.</span></div>

    <GoalForm key={name} name={name} goals={goals} model={model} />

    <section className="reco-section">
      <SectionHeading title="Jak daleko jsme" subtitle="Skutečnost proti cíli" />
      {progress.length === 0 ? <div className="info-banner"><Target size={18} /><span>Zatím tu není žádný cíl. Přidejte aspoň jedno číslo výše a uložte.</span></div>
        : <div className="goal-progress-grid">{progress.map(p => <ProgressCard key={p.goal.id} p={p} conversion={model.vocab.conversion} />)}</div>}
    </section>

    <section className="reco-section">
      <SectionHeading title="Co udělat" subtitle={`${advice.length} rad podle cílů · seřazeno podle důležitosti`} action={<label className="gsc-threshold">Kanál <select className="task-select" value={channelFilter} onChange={e => setChannelFilter(e.target.value)}>{['Všechny', ...Array.from(new Set(advice.map(a => a.channel)))].map(c => <option key={c}>{c}</option>)}</select></label>} />
      <p className="goal-why">Rady vznikají pravidly z čísel, ne odhadem. U každé je napsáno, jak moc si jsme jistí, a když je dat málo, říká to rovnou.</p>
      {progress.length > 0 && shown.length === 0 && <div className="info-banner"><Check size={18} /><span>Podle aktuálních dat není co řešit. Cíle jsou splněné nebo chybí data k doporučení.</span></div>}
      <div className="reco-grid">{shown.map(a => <article key={a.id} className="reco-card">
        <div className="reco-top"><span className={`reco-priority p-${a.priority === 'Vysoká' ? 'high' : a.priority === 'Střední' ? 'mid' : 'low'}`}>{a.priority}</span><small>{a.channel} · jistota {a.confidence.toLowerCase()}</small></div>
        <h3><Lightbulb size={15} />{a.title}</h3>
        <p><strong>Proč:</strong> {a.insight}</p>
        <p className="reco-action"><strong>Co udělat:</strong> {a.action}</p>
        <div className="reco-foot"><div><small>PŘEDAT</small><strong>{a.recipient}</strong><span className="reco-audience">{a.audience === 'Klient' ? 'Pro klienta' : 'Interní tým'} · {a.impact}</span></div>
          <Button size="sm" variant={sent(a) ? 'ghost' : 'outline'} disabled={sent(a)} onClick={() => tasksStore.add({ sourceKey: sourceKey(a), title: a.title, action: a.action, source: `${name} · cíl ${metricInfo[a.metric].code} · ${a.channel}`, recipient: a.recipient, impact: a.impact, priority: a.priority })}>{sent(a) ? <><Check />Předáno</> : <><Send />Předat</>}</Button></div>
      </article>)}</div>
    </section>
  </main>;
}

function ProgressCard({ p, conversion }: { p: KpiProgress; conversion: string }) {
  const { goal } = p;
  const cls = p.verdict === 'met' ? 'met' : p.verdict === 'below' ? 'below' : '';
  return <article className={`goal-card ${cls}`}>
    <h3>{metricInfo[goal.metric].label(conversion)} · {goal.channel === 'all' ? 'všechny kanály' : goal.channel} · {periodLabel(goal.periodDays)}</h3>
    <div className="goal-values"><div>Skutečnost<br /><strong className="tabular-nums">{p.actual === null ? '—' : formatMetric(goal.metric, p.actual)}</strong></div><div style={{ textAlign: 'right' }}>Cíl ({operatorOf(goal.metric)})<br /><strong className="tabular-nums">{formatMetric(goal.metric, goal.target)}</strong></div></div>
    <div className="goal-bar" role="progressbar" aria-label="Splnění cíle" aria-valuemin={0} aria-valuemax={100} aria-valuenow={p.percent}><i style={{ width: `${p.percent}%` }} /></div>
    <span className="goal-verdict">{verdictLabel[p.verdict]}{p.ratio !== null && p.verdict !== 'met' ? ` · ${Math.round(p.percent)} % cíle` : ''}</span>
    {p.perChannel.length > 1 && <div className="goal-channels">{p.perChannel.map(c => <span key={c.channel}>{c.channel}: <strong>{formatMetric(goal.metric, c.actual!)}</strong></span>)}</div>}
    {p.note && <p className="goal-help">{p.note}</p>}
  </article>;
}

function GoalForm({ name, goals, model }: { name: string; goals: ClientGoals; model: ReturnType<typeof clientConfig> }) {
  const [draft, setDraft] = useState<ClientGoals>(goals);
  const [msg, setMsg] = useState('');
  const modelKey = (Object.keys(clientConfigKeys) as (keyof typeof clientConfigKeys)[]).find(k => clientConfigKeys[k] === model) ?? 'ecommerce';
  const setKpi = (id: string, patch: Partial<KpiGoal>) => setDraft(d => ({ ...d, kpis: d.kpis.map(k => (k.id === id ? { ...k, ...patch } : k)) }));
  const info = (m: GoalMetric) => metricInfo[m];
  const save = () => { goalsStore.save(name, { ...draft, kpis: draft.kpis.filter(k => k.target > 0) }); setMsg('Uloženo v tomto prohlížeči.'); };
  const copy = async () => {
    const text = goalsToMarkdown(name, draft);
    try { await navigator.clipboard.writeText(text); setMsg('Zkopírováno. Vložte to do části „2. Cíle (KPI)“ souboru ppc.md klienta.'); } catch { setMsg('Kopírování se nepovedlo, zkuste to znovu.'); }
  };
  const load = (text: string) => {
    const { goals: g, skipped } = goalsFromMarkdown(text);
    setDraft(d => ({ ...d, business: g.business || d.business, marketing: g.marketing || d.marketing, kpis: g.kpis.length ? g.kpis : d.kpis }));
    setMsg(g.kpis.length ? `Načteno ${g.kpis.length} KPI. Zkontrolujte a uložte.${skipped.length ? ` ${skipped.length} řádků jsem nepoznala.` : ''}` : 'V souboru jsem nenašla žádný řádek „- KPI: …“. Nejdřív cíle zkopírujte tlačítkem výše.');
  };
  return <section className="reco-section">
    <SectionHeading title="Cíle klienta" subtitle="Obchodní cíl, marketingový cíl a čísla, podle kterých to poznáme" />
    <div className="goal-form">
      <div className="goal-text-grid">
        <label>Obchodní cíl (co chce firma)<input value={draft.business} placeholder={model.goals.businessExample} onChange={e => setDraft({ ...draft, business: e.target.value })} /></label>
        <label>Marketingový cíl (co k tomu má dělat marketing)<input value={draft.marketing} placeholder={model.goals.marketingExample} onChange={e => setDraft({ ...draft, marketing: e.target.value })} /></label>
      </div>
      {draft.kpis.map(k => <div key={k.id} className="goal-kpi-row">
        <label>Číslo (KPI)<select value={k.metric} onChange={e => setKpi(k.id, { metric: e.target.value as GoalMetric })}>{model.goals.metrics.map(m => <option key={m} value={m}>{info(m).label(model.vocab.conversion)}</option>)}</select><p className="goal-help">{info(k.metric).help(model.vocab.conversion)}</p></label>
        <label>Cílová hodnota ({operatorOf(k.metric)} {info(k.metric).unit})<input type="number" min="0" step="any" value={k.target || ''} onChange={e => setKpi(k.id, { target: Number(e.target.value) })} /></label>
        <label>Za jaké období<select value={k.periodDays} onChange={e => setKpi(k.id, { periodDays: Number(e.target.value) as GoalPeriod })}>{goalPeriods.map(p => <option key={p.days} value={p.days}>{p.label}</option>)}</select></label>
        <label>Kanál<select value={k.channel} onChange={e => setKpi(k.id, { channel: e.target.value as GoalChannel })} disabled={k.metric === 'organicClicks'}>{goalChannels.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
        <Button variant="ghost" size="icon" aria-label="Odebrat KPI" onClick={() => setDraft(d => ({ ...d, kpis: d.kpis.filter(x => x.id !== k.id) }))}><Trash2 /></Button>
      </div>)}
      <div className="gsc-actions">
        <Button variant="outline" size="sm" onClick={() => setDraft(d => ({ ...d, kpis: [...d.kpis, { ...defaultKpi(modelKey), id: newGoalId() }] }))}><Plus />Přidat číslo (KPI)</Button>
        <Button size="sm" onClick={save}><Check />Uložit cíle</Button>
        <Button variant="ghost" size="sm" onClick={() => void copy()}><ClipboardCopy />Zkopírovat pro Fachmana</Button>
        <CsvPicker label="Načíst z ppc.md" accept=".md,.txt,text/markdown,text/plain" onText={t => load(t)} icon={<Upload />} />
      </div>
      {msg && <p className="goal-help" role="status">{msg}</p>}
      <p className="goal-help">Cíle se ukládají jen v tomto prohlížeči. Aby je znal i Fachman, zkopírujte je a vložte do souboru ppc.md klienta.</p>
    </div>
  </section>;
}

import { modelConfigs } from '@/lib/business-models';
const clientConfigKeys = modelConfigs;
