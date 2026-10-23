import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useWorkspace } from './workspace';
import { getAnalytics, getModelKpis, money, number, type Kpi } from '@/lib/analytics-data';
export function Metrics({ mode = 'overview' }: { mode?: string }) {
 const { client, period } = useWorkspace(); const data = getAnalytics(client, period);
 const items = mode === 'organic' ? [
  {label: 'Organická návštěvnost',value: number(data.visits * .38),change: '+18,6 %',note: 'Google Search Console'}, {label: 'Pozice klíčových slov',value: '12,4',change: '−3,2',note: 'Průměrná pozice',down: true}, {label: 'Tržby z automatizací',value: money(data.revenue * .12),change: '+24,8 %',note: 'E-mailové automatizace',accent: true}, {label: 'Míra otevření',value: '42,8 %',change: '+6,2 %',note: 'E-mail marketing'}
 ] : mode === 'web' ? [
  {label:'Návštěvy webu',value:number(data.visits),change:'+16,8 %',note:'Google Analytics 4'}, {label:'Konverzní poměr',value:'2,66 %',change:'+0,32 %',note:'Nákupy / návštěvy',accent:true}, {label:'Celkové konverze',value:number(data.conversions),change:'+18,6 %',note:'Google Analytics 4'}, {label:'Průměrná objednávka',value:money(data.revenue/data.conversions),change:'+5,2 %',note:'Hodnota objednávky'}
 ] : [
  {label:'Celkové tržby',value:money(data.revenue),change:'+18,6 %',note:'vs. předchozí období'}, {label:'Náklady na reklamu',value:money(data.spend),change:'+5,5 %',note:'vs. předchozí období',neutral:true}, {label:'ROAS',value:(data.revenue/data.spend).toFixed(2).replace('.', ',')+'×',change:'+12,4 %',note:'vs. předchozí období',accent:true}, {label:'PNO',value:(data.spend/data.revenue*100).toFixed(2).replace('.', ',')+' %',change:'−2,28 %',note:'vs. předchozí období',down:true}
 ];
 return <div className="metrics-grid">{items.map((item, i) => <article className={`metric-card ${item.accent ? 'metric-accent' : ''}`} key={item.label}><div className="metric-label">{item.label}<span title={item.label === 'ROAS' ? 'Tržby dělené náklady na reklamu' : item.label === 'PNO' ? 'Podíl nákladů na obratu' : item.note}><Info size={14}/></span></div><div className="metric-value">{item.value}</div><div className="metric-bottom"><div><span className={`metric-change ${'neutral' in item && item.neutral ? 'neutral' : ''}`}>{item.down ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>} {item.change}</span><small>{item.note}</small></div><div className="sparkline"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.chart.slice(-12)}><Line isAnimationActive={false} type="monotone" dataKey={i===1?'spend':'revenue'} stroke={item.accent ? 'var(--foreground)' : 'var(--spark)'} strokeWidth={1.8} dot={false}/></LineChart></ResponsiveContainer></div></div></article>)}</div>;
}
