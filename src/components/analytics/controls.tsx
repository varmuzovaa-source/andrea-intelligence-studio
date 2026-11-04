import { CalendarDays, Download, RefreshCw, ChevronDown, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWorkspace } from './workspace';
import { clients, downloadCsv, getAnalytics } from '@/lib/analytics-data';
export function PageHeader({ title, description }: { title: string; description: string }) {
 const { client, period, setPeriod } = useWorkspace();
 const [syncing, setSyncing] = useState(false);
 const [syncTime, setSyncTime] = useState('09:12');
 const exportAll = () => { const data = getAnalytics(client, period); downloadCsv('avqix-marketing-prehled.csv', ['Klient', 'Období (dní)', 'Tržby (Kč)', 'Náklady (Kč)', 'Konverze', 'ROAS'], [[clients[client] ?? clients[0] ?? "", period, data.revenue, data.spend, data.conversions, (data.revenue/data.spend).toFixed(2)]]); };
 return <><div className="page-heading"><div><div className="eyebrow">AVQIX INTELLIGENCE STUDIO <span className="demo-label">Demo data</span></div><h1>{title}<span className="heading-dot">.</span></h1><p>{description}</p></div><div className="page-actions"><div className="period-select"><CalendarDays size={16}/><select aria-label="Období" value={period} onChange={e => setPeriod(e.target.value)}><option value="7">24.–30. září 2026</option><option value="30">1.–30. září 2026</option><option value="90">1. července–30. září 2026</option></select><ChevronDown size={14}/></div><Button variant="outline" onClick={exportAll}><Download /> Exportovat</Button></div></div><div className="context-line"><div><span className="status-dot" />{clients[client]}<span className="context-divider"/>Srovnání s předchozím obdobím</div><Button variant="ghost" size="sm" disabled={syncing} onClick={() => {setSyncing(true); setTimeout(() => {setSyncing(false); setSyncTime(new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }));}, 700);}}><RefreshCw className={syncing ? 'animate-spin' : ''} />{syncing ? 'Obnovuji ukázku…' : `Ukázka obnovena v ${syncTime}`}</Button></div></>;
}
export function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
 return <div className="section-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div>;
}
export function ViewLink({ children }: { children: React.ReactNode }) { return <>{children}<ArrowUpRight size={15}/></>; }
