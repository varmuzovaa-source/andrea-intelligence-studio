import { Lightbulb, Send, Check, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspace } from './workspace';
import { SectionHeading } from './controls';
import { tasksStore, useTasks } from '@/lib/tasks-store';
import { clients, getRecommendations, recoAreas, type RecoArea } from '@/lib/analytics-data';

export function RecoToggles() {
  const { reco, toggleReco } = useWorkspace();
  return <div className="reco-toggles" role="group" aria-label="Kde zobrazit doporučení"><span>Zobrazit doporučení:</span>{recoAreas.map(a => <Button key={a.id} size="sm" variant="outline" aria-pressed={reco[a.id]} className={reco[a.id] ? 'active' : ''} onClick={() => toggleReco(a.id)}>{reco[a.id] && <Check />}{a.name}</Button>)}</div>;
}

export function Recommendations({ areas, title = 'Doporučení' }: { areas: RecoArea[]; title?: string }) {
  const { client, period, reco, toggleReco } = useWorkspace();
  const tasks = useTasks();
  const keyOf = (id: string) => `demo:${clients[client]}:${id}`;
  const isSent = (id: string) => tasks.some(t => t.sourceKey === keyOf(id));
  const visible = areas.filter(a => reco[a]);
  const items = getRecommendations(client, period).filter(r => visible.includes(r.area));
  return <section className="reco-section">
    <SectionHeading title={title} subtitle="Automatická analýza ukázkových dat · komu co předat" action={<RecoToggles />} />
    {items.length === 0 ? <div className="info-banner"><EyeOff size={18} /><span>Doporučení jsou pro tuto sekci skrytá. Zapněte je tlačítky výše.</span></div> :
      <div className="reco-grid">{items.map(r => <article key={r.id} className="reco-card">
        <div className="reco-top"><span className={`reco-priority p-${r.priority === 'Vysoká' ? 'high' : r.priority === 'Střední' ? 'mid' : 'low'}`}>{r.priority}</span><small>{recoAreas.find(a => a.id === r.area)?.name}{r.confidence ? ` · jistota ${r.confidence.toLowerCase()}` : ''}</small></div>
        <h3><Lightbulb size={15} />{r.title}</h3>
        <p>{r.insight}</p>
        <p className="reco-action"><strong>Co udělat:</strong> {r.action}</p>
        <div className="reco-foot"><div><small>PŘEDAT</small><strong>{r.recipient}</strong><span className="reco-audience">{r.audience === 'Klient' ? 'Pro klienta' : 'Interní tým'} · {r.impact}</span></div>
          <Button size="sm" variant={isSent(r.id) ? 'ghost' : 'outline'} disabled={isSent(r.id)} onClick={() => tasksStore.add({ sourceKey: keyOf(r.id), title: r.title, action: r.action, source: `${clients[client]} · ${recoAreas.find(a => a.id === r.area)?.name}`, recipient: r.recipient, impact: r.impact, priority: r.priority })}>{isSent(r.id) ? <><Check />Předáno</> : <><Send />Předat</>}</Button></div>
      </article>)}</div>}
    {areas.length === 1 && reco[areas[0]!] && <Button variant="ghost" size="sm" className="reco-hide" onClick={() => toggleReco(areas[0]!)}><EyeOff />Skrýt zde</Button>}
  </section>;
}
