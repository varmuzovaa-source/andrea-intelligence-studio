/**
 * Read-only report for a client: ONE self-contained HTML file (inline CSS, no scripts, no links back).
 * The client can only look at it. It is a snapshot from the moment it was created.
 */
import { formatMetric, metricInfo, operatorOf, periodLabel } from './goals';
import { verdictLabel, type GoalAdvice, type KpiProgress } from './goal-advice';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export type ReportInput = {
  clientName: string; business: string; marketing: string; progress: KpiProgress[]; advice: GoalAdvice[];
  conversion: string; dataLabel: string; totals?: { label: string; value: string }[]; createdAt?: Date;
};

export function buildClientReportHtml(r: ReportInput): string {
  const when = (r.createdAt ?? new Date()).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });
  const color = (v: KpiProgress['verdict']) => (v === 'met' ? '#5aa800' : v === 'near' ? '#c98a00' : v === 'below' ? '#d6403a' : '#999');
  const goals = r.progress.map(p => `<div class="goal"><div class="gt">${esc(metricInfo[p.goal.metric].label(r.conversion))}<small> · ${p.goal.channel === 'all' ? 'všechny kanály' : esc(p.goal.channel)} · ${esc(periodLabel(p.goal.periodDays))}</small></div>
<div class="gv"><span>Skutečnost <b>${p.actual === null ? '—' : esc(formatMetric(p.goal.metric, p.actual))}</b></span><span>Cíl (${operatorOf(p.goal.metric)}) <b>${esc(formatMetric(p.goal.metric, p.goal.target))}</b></span></div>
<div class="bar"><i style="width:${p.percent}%;background:${color(p.verdict)}"></i></div><div class="st" style="color:${color(p.verdict)}">${verdictLabel[p.verdict]}${p.verdict === 'below' || p.verdict === 'near' ? ` · ${p.percent} % cíle` : ''}</div></div>`).join('');
  const next = r.advice.filter(a => a.priority !== 'Nízká').slice(0, 6);
  const nextHtml = next.length ? `<ul>${next.map(a => `<li><b>${esc(a.audience === 'Klient' ? 'Potřebujeme od vás: ' : '')}${esc(a.title)}</b><br>${esc(a.action)}<br><small>Očekávaný přínos: ${esc(a.impact)}</small></li>`).join('')}</ul>` : '<p>Podle aktuálních čísel není potřeba zasahovat. Cíle jsou splněné nebo na ně čekáme data.</p>';
  const totals = r.totals?.length ? `<div class="tiles">${r.totals.map(t => `<div class="tile"><small>${esc(t.label)}</small><b>${esc(t.value)}</b></div>`).join('')}</div>` : '';
  return `<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Report pro ${esc(r.clientName)}</title>
<style>body{font-family:-apple-system,"Helvetica Neue",Arial,sans-serif;color:#1c1c1c;background:#f6f6f1;margin:0;line-height:1.5}main{max-width:820px;margin:0 auto;padding:28px 18px}
h1{font-size:26px;margin:0}h2{font-size:16px;margin:26px 0 10px;padding-bottom:6px;border-bottom:2px solid #b6f23a}.sub{color:#666;font-size:13px;margin:4px 0 18px}
.goal{background:#fff;border:1px solid #e3e3dd;border-radius:10px;padding:14px 16px;margin-bottom:10px}.gt{font-weight:700}.gt small{font-weight:400;color:#777}
.gv{display:flex;justify-content:space-between;font-size:13px;color:#555;margin:8px 0}.gv b{font-size:18px;color:#1c1c1c;margin-left:4px}
.bar{height:9px;background:#ecece6;border-radius:9px;overflow:hidden}.bar i{display:block;height:100%}.st{font-size:12px;font-weight:700;margin-top:6px}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}.tile{background:#fff;border:1px solid #e3e3dd;border-radius:10px;padding:12px}.tile small{color:#777;display:block}.tile b{font-size:19px}
li{margin-bottom:12px}p.t{background:#fff;border-left:3px solid #b6f23a;padding:10px 14px;border-radius:6px}footer{color:#888;font-size:12px;margin-top:28px}</style></head><body><main>
<h1>${esc(r.clientName)}</h1><div class="sub">Přehled marketingu proti cílům · stav k ${when}</div>
${r.business ? `<p class="t"><b>Obchodní cíl:</b> ${esc(r.business)}${r.marketing ? `<br><b>Marketingový cíl:</b> ${esc(r.marketing)}` : ''}</p>` : ''}
${totals ? `<h2>Hlavní čísla</h2>${totals}` : ''}
<h2>Jak jsme na tom proti cílům</h2>${goals || '<p>Cíle zatím nejsou zadané.</p>'}
<h2>Co děláme dál</h2>${nextHtml}
<footer>Čísla jsou z okamžiku vytvoření reportu (${esc(r.dataLabel)}). Vytvořeno v AVQIX Intelligence Studio. Tento soubor je jen k nahlédnutí.</footer></main></body></html>`;
}

export function downloadHtml(filename: string, html: string) {
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}
