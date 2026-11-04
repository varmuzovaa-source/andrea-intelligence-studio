/**
 * Client goals: a business goal, a marketing goal and KPI targets with a period.
 * Pure, browser-safe module. The Markdown block it writes/reads is meant to be pasted
 * into section "2. Cíle (KPI)" of the Fachman client file (ppc.md), so both tools share one wording.
 */
import { modelConfigs, type BusinessModel, type GoalMetric } from './business-models';

export type { GoalMetric } from './business-models';
export type GoalPeriod = 7 | 30 | 90;
export const goalPeriods: { days: GoalPeriod; label: string }[] = [
  { days: 7, label: 'týden (7 dní)' },
  { days: 30, label: 'měsíc (30 dní)' },
  { days: 90, label: 'čtvrtletí (90 dní)' },
];
export const periodLabel = (days: number) => goalPeriods.find(p => p.days === days)?.label ?? `${days} dní`;

export type GoalChannel = 'all' | 'Google Ads' | 'Meta Ads' | 'E-mail';
export const goalChannels: { id: GoalChannel; label: string }[] = [
  { id: 'all', label: 'Všechny kanály' },
  { id: 'Google Ads', label: 'Google Ads' },
  { id: 'Meta Ads', label: 'Meta Ads' },
  { id: 'E-mail', label: 'E-mailing' },
];

export type KpiGoal = { id: string; metric: GoalMetric; target: number; periodDays: GoalPeriod; channel: GoalChannel };
export type ClientGoals = { business: string; marketing: string; kpis: KpiGoal[]; updatedAt: string };
export const emptyGoals = (): ClientGoals => ({ business: '', marketing: '', kpis: [], updatedAt: '' });

export type MetricInfo = {
  /** Wording for beginners; `conversion` comes from the business model vocabulary. */
  label: (conversion: string) => string;
  unit: string;
  /** Is a higher or a lower value better? */
  better: 'up' | 'down';
  /** Short explanation shown next to the field. */
  help: (conversion: string) => string;
  /** Fachman wording for ppc.md. */
  code: string;
  decimals: number;
};

export const metricInfo: Record<GoalMetric, MetricInfo> = {
  roas: { label: () => 'Návratnost reklamy (ROAS)', unit: '×', better: 'up', decimals: 2, code: 'ROAS', help: () => 'Kolik korun tržeb přinese každá koruna utracená za reklamu. 5× znamená 5 Kč tržeb za 1 Kč reklamy.' },
  pno: { label: () => 'Podíl nákladů na tržbách (PNO)', unit: '%', better: 'down', decimals: 1, code: 'PNO', help: () => 'Kolik procent z tržeb se utratí za reklamu. Čím méně, tím lépe. 20 % odpovídá ROAS 5×.' },
  cpa: { label: c => `Cena za ${c} (CPA)`, unit: 'Kč', better: 'down', decimals: 0, code: 'CPA', help: c => `Kolik reklama stojí jedna ${c}. Čím méně, tím lépe.` },
  revenue: { label: () => 'Tržby z reklam', unit: 'Kč', better: 'up', decimals: 0, code: 'Tržby', help: () => 'Kolik korun tržeb reklamy přinesly za období.' },
  conversions: { label: c => `Počet: ${c}`, unit: 'ks', better: 'up', decimals: 0, code: 'Konverze', help: c => `Kolik jich reklamy přivedly za období (${c}).` },
  spend: { label: () => 'Rozpočet na reklamu (strop)', unit: 'Kč', better: 'down', decimals: 0, code: 'Rozpočet', help: () => 'Kolik nejvíc chcete za období utratit. Překročení stropu je signál ke kontrole.' },
  ctr: { label: () => 'Míra prokliku (CTR)', unit: '%', better: 'up', decimals: 2, code: 'CTR', help: () => 'Kolik procent lidí, kterým se reklama zobrazila, na ni klikne. Čím víc, tím zajímavější reklama.' },
  cpc: { label: () => 'Cena za proklik (CPC)', unit: 'Kč', better: 'down', decimals: 1, code: 'CPC', help: () => 'Kolik stojí jedno kliknutí na reklamu. Čím méně, tím lépe.' },
  organicClicks: { label: () => 'Kliknutí z Googlu zdarma', unit: 'ks', better: 'up', decimals: 0, code: 'Organická kliknutí', help: () => 'Kolikrát lidé klikli na váš web ve výsledcích vyhledávání. Bere se z importu ze Search Console.' },
};

export const formatMetric = (metric: GoalMetric, value: number) => {
  const { unit, decimals } = metricInfo[metric];
  const n = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: decimals, minimumFractionDigits: decimals }).format(value);
  return unit === '×' ? `${n}×` : unit === '%' ? `${n} %` : `${n} ${unit}`;
};

export const operatorOf = (metric: GoalMetric) => (metricInfo[metric].better === 'up' ? '≥' : '≤');

export const newGoalId = () => `g${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export function defaultKpi(model: BusinessModel): KpiGoal {
  return { id: newGoalId(), metric: modelConfigs[model].goals.metrics[0]!, target: 0, periodDays: 30, channel: 'all' };
}

/* ---------- Markdown block shared with Fachman (ppc.md, section 2) ---------- */

const channelCode = (c: GoalChannel) => (c === 'all' ? 'vše' : c);

/**
 * One line per KPI, e.g. `- KPI: ROAS ≥ 5 × · měsíc · vše`.
 * Machine-readable by AVQIX and ordinary text for Fachman.
 */
export function goalsToMarkdown(clientName: string, goals: ClientGoals): string {
  const lines = [
    `<!-- AVQIX cíle: ${clientName} -->`,
    `- **Obchodní cíl:** ${goals.business.trim() || '—'}`,
    `- **Marketingový cíl:** ${goals.marketing.trim() || '—'}`,
    ...goals.kpis.filter(k => k.target > 0).map(k => `- KPI: ${metricInfo[k.metric].code} ${operatorOf(k.metric)} ${k.target} ${metricInfo[k.metric].unit} · ${k.periodDays} dní · ${channelCode(k.channel)}`),
  ];
  return lines.join('\n') + '\n';
}

const codeToMetric = (code: string): GoalMetric | null =>
  (Object.keys(metricInfo) as GoalMetric[]).find(m => metricInfo[m].code.toLowerCase() === code.trim().toLowerCase()) ?? null;

/** Reads the lines written by goalsToMarkdown (extra text around them is ignored). */
export function goalsFromMarkdown(text: string): { goals: ClientGoals; skipped: string[] } {
  const goals = emptyGoals();
  const skipped: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const business = /^[-*]\s*\*{0,2}Obchodní cíl:?\*{0,2}:?\s*(.*)$/i.exec(line);
    const marketing = /^[-*]\s*\*{0,2}Marketingový cíl:?\*{0,2}:?\s*(.*)$/i.exec(line);
    if (business) { goals.business = business[1] === '—' ? '' : business[1]!.trim(); continue; }
    if (marketing) { goals.marketing = marketing[1] === '—' ? '' : marketing[1]!.trim(); continue; }
    if (!/^[-*]\s*KPI:/i.test(line)) continue;
    const m = /^[-*]\s*KPI:\s*(.+?)\s*(?:≥|≤|>=|<=)\s*([\d\s.,]+)\s*(?:×|%|Kč|ks)?\s*·\s*(\d+)\s*dn[ií]\s*·\s*(.+)$/i.exec(line);
    const metric = m ? codeToMetric(m[1]!) : null;
    const target = m ? Number(m[2]!.replace(/\s/g, '').replace(',', '.')) : NaN;
    const days = m ? Number(m[3]) : NaN;
    const channel = goalChannels.find(c => c.label.toLowerCase() === m?.[4]?.trim().toLowerCase() || (c.id === 'all' && m?.[4]?.trim().toLowerCase() === 'vše'));
    if (!m || !metric || !Number.isFinite(target) || target <= 0 || ![7, 30, 90].includes(days) || !channel) { skipped.push(line); continue; }
    goals.kpis.push({ id: newGoalId(), metric, target, periodDays: days as GoalPeriod, channel: channel.id });
  }
  return { goals, skipped };
}
