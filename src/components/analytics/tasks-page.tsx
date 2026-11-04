import { useMemo, useState } from 'react';
import { Download, ListChecks, Trash2, Users } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { PageHeader, SectionHeading } from './controls';
import { downloadCsv } from '@/lib/analytics-data';
import { statusLabels, tasksStore, useTasks, type Task, type TaskStatus } from '@/lib/tasks-store';

const columns: TaskStatus[] = ['todo', 'doing', 'done'];

export function TasksPage() {
  const tasks = useTasks();
  const [owner, setOwner] = useState('Všichni');
  const owners = useMemo(() => ['Všichni', ...Array.from(new Set(tasks.map(t => t.owner.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'cs'))], [tasks]);
  const shown = tasks.filter(t => owner === 'Všichni' || t.owner.trim() === owner);
  const count = (s: TaskStatus) => tasks.filter(t => t.status === s).length;
  const exportTasks = () => downloadCsv('avqix-ukoly-tymu.csv', ['Úkol', 'Zdroj', 'Priorita', 'Předat', 'Řeší', 'Stav', 'Dopad', 'Co udělat'], tasks.map(t => [t.title, t.source, t.priority, t.recipient, t.owner || '—', statusLabels[t.status], t.impact, t.action]));

  return <main className="page-content">
    <PageHeader title="Úkoly týmu" description="Co je potřeba udělat, kdo to řeší a v jakém je to stavu." />
    <div className="info-banner"><Users size={18} /><span>Úkoly vznikají tlačítkem Předat u doporučení. Ukládají se jen v tomto prohlížeči, kolegové je zatím neuvidí. Pro sdílení v týmu použijte Export CSV.</span></div>

    <div className="metrics-grid">
      <article className="metric-card"><div className="metric-label">Všechny úkoly</div><div className="metric-value">{tasks.length}</div></article>
      {columns.map(s => <article key={s} className={`metric-card ${s === 'done' ? 'metric-accent' : ''}`}><div className="metric-label">{statusLabels[s]}</div><div className="metric-value">{count(s)}</div></article>)}
    </div>

    <SectionHeading title="Přehled úkolů" subtitle={`${shown.length} zobrazeno`} action={<div className="gsc-actions">
      <label className="gsc-threshold">Řeší <select className="task-select" value={owner} onChange={e => setOwner(e.target.value)}>{owners.map(o => <option key={o}>{o}</option>)}</select></label>
      {tasks.length > 0 && <Button variant="ghost" size="sm" onClick={exportTasks}><Download />Export CSV</Button>}
    </div>} />

    {tasks.length === 0 ? <div className="info-banner"><ListChecks size={18} /><span>Zatím tu nic není. Otevřete <Link to="/search-console" className="gsc-link">Search Console</Link> nebo <Link to="/" className="gsc-link">Přehled</Link> a u doporučení klikněte na Předat.</span></div>
      : <div className="task-board">{columns.map(s => <section key={s} className="task-column" aria-label={statusLabels[s]}>
        <h3>{statusLabels[s]} <span>{shown.filter(t => t.status === s).length}</span></h3>
        {shown.filter(t => t.status === s).map(t => <TaskCard key={t.id} task={t} />)}
      </section>)}</div>}
  </main>;
}

function TaskCard({ task }: { task: Task }) {
  return <article className="reco-card task-card">
    <div className="reco-top"><span className={`reco-priority p-${task.priority === 'Vysoká' ? 'high' : task.priority === 'Střední' ? 'mid' : 'low'}`}>{task.priority}</span><small>{task.source}</small></div>
    <h3>{task.title}</h3>
    <p className="reco-action"><strong>Co udělat:</strong> {task.action}</p>
    <p className="gsc-note">Předat: {task.recipient} · {task.impact}</p>
    <label className="task-owner">Řeší<input value={task.owner} placeholder="Jméno kolegy" onChange={e => tasksStore.update(task.id, { owner: e.target.value })} /></label>
    <div className="task-actions">
      <div className="task-status" role="group" aria-label="Stav úkolu">{columns.map(s => <Button key={s} size="sm" variant="outline" aria-pressed={task.status === s} className={task.status === s ? 'active' : ''} onClick={() => tasksStore.update(task.id, { status: s })}>{statusLabels[s]}</Button>)}</div>
      <Button size="sm" variant="ghost" aria-label="Smazat úkol" onClick={() => tasksStore.remove(task.id)}><Trash2 /></Button>
    </div>
  </article>;
}
