/**
 * Goal progress (reality vs target) and rule-based advice per channel and per campaign.
 * Pure functions over ChannelCampaign data. No invented facts: every sentence cites a number
 * from the data or says that the data is too thin. Advice follows Fachman's style: small, careful steps.
 */
import { clientConfig, money, number, type Recommendation } from './analytics-data';
import type { CampaignData, CampaignKind, Channel, ChannelCampaign } from './campaign-data';
import { emailTotals, type EmailCampaign } from './email-data';
import { formatMetric, metricInfo, type ClientGoals, type GoalMetric, type KpiGoal } from './goals';

export type Verdict = 'met' | 'near' | 'below' | 'nodata' | 'otherperiod';
export const verdictLabel: Record<Verdict, string> = { met: 'Splněno', near: 'Skoro', below: 'Pod cílem', nodata: 'Chybí data', otherperiod: 'Jiné období' };

const ABSOLUTE: GoalMetric[] = ['revenue', 'conversions', 'spend'];
const sum = (cs: ChannelCampaign[], f: (c: ChannelCampaign) => number) => cs.reduce((s, c) => s + f(c), 0);

/** Value of a metric over a set of campaigns; null when it cannot be computed (e.g. no spend). */
export function metricValue(metric: GoalMetric, cs: ChannelCampaign[]): number | null {
  const spend = sum(cs, c => c.spend), revenue = sum(cs, c => c.revenue), conv = sum(cs, c => c.conversions), clicks = sum(cs, c => c.clicks), impr = sum(cs, c => c.impressions);
  switch (metric) {
    case 'roas': return spend > 0 && revenue > 0 ? revenue / spend : null;
    case 'pno': return revenue > 0 ? spend / revenue * 100 : null;
    case 'cpa': return conv > 0 ? spend / conv : null;
    case 'revenue': return cs.length ? revenue : null;
    case 'conversions': return cs.length ? conv : null;
    case 'spend': return cs.length ? spend : null;
    case 'ctr': return impr > 0 ? clicks / impr * 100 : null;
    case 'cpc': return clicks > 0 ? spend / clicks : null;
    default: return null;
  }
}

/** >= 1 means the target is met, whichever direction is "better". */
export const ratioToTarget = (metric: GoalMetric, actual: number, target: number) =>
  metricInfo[metric].better === 'up' ? actual / target : actual > 0 ? target / actual : Infinity;
export const verdictOf = (ratio: number): Verdict => (ratio >= 1 ? 'met' : ratio >= 0.9 ? 'near' : 'below');

export type KpiProgress = {
  goal: KpiGoal;
  actual: number | null;
  ratio: number | null;
  verdict: Verdict;
  /** Share of the way to the target, 0–100, for the bar. */
  percent: number;
  note: string;
  perChannel: { channel: Channel; actual: number | null }[];
  dataLabel: string;
};

export type GoalContext = { dataFor: (days: number) => CampaignData; organicClicks: number | null; emails?: EmailCampaign[] };
const EMAIL_METRICS: GoalMetric[] = ['openRate', 'clickRate', 'unsubRate'];
const emailMetric = (metric: GoalMetric, cs: EmailCampaign[]) => { const t = emailTotals(cs); return t ? (metric === 'openRate' ? t.openRate : metric === 'clickRate' ? t.clickRate : t.unsubRate) : null; };

const inScope = (data: CampaignData, goal: KpiGoal) => data.campaigns.filter(c => goal.channel === 'all' || c.channel === goal.channel);

export function computeProgress(goals: ClientGoals, ctx: GoalContext): KpiProgress[] {
  return goals.kpis.filter(k => k.target > 0).map(goal => {
    const data = ctx.dataFor(goal.periodDays);
    const scope = inScope(data, goal);
    const base = { goal, dataLabel: data.label, perChannel: [] as KpiProgress['perChannel'] };
    const finish = (actual: number | null, note = ''): KpiProgress => {
      if (actual === null) return { ...base, actual: null, ratio: null, verdict: 'nodata', percent: 0, note: note || 'Pro tento cíl zatím nejsou data.' };
      const ratio = ratioToTarget(goal.metric, actual, goal.target);
      const percent = metricInfo[goal.metric].better === 'up' ? Math.min(100, Math.max(0, actual / goal.target * 100)) : Math.min(100, Math.max(0, ratio * 100));
      return { ...base, actual, ratio, verdict: verdictOf(ratio), percent: Math.round(percent), note };
    };
    if (EMAIL_METRICS.includes(goal.metric)) {
      const v = emailMetric(goal.metric, ctx.emails ?? []);
      return finish(v, v === null ? 'Nahrajte export e-mailových kampaní na stránce Datové zdroje → E-mailing.' : 'Z nahraného exportu e-mailových kampaní.');
    }
    if (goal.metric === 'organicClicks') {
      return finish(ctx.organicClicks, ctx.organicClicks === null ? 'Nahrajte export Dotazy ze Search Console na stránce Search Console.' : 'Součet kliknutí z nahraného exportu. Za jaké období je export, hlídejte si sami.');
    }
    if (ABSOLUTE.includes(goal.metric) && data.days !== goal.periodDays) {
      return { ...base, actual: null, ratio: null, verdict: 'otherperiod', percent: 0, note: data.days === null ? 'U nahraných dat není známá délka období, proto objem nevyhodnotím.' : `Nahraná data jsou za ${data.days} dní, cíl je za ${goal.periodDays}. Stáhněte data za stejně dlouhé období.` };
    }
    const channels = (goal.channel === 'all' ? ['Google Ads', 'Meta Ads', 'E-mail'] : [goal.channel]) as Channel[];
    base.perChannel = channels.map(channel => ({ channel, actual: metricValue(goal.metric, scope.filter(c => c.channel === channel)) })).filter(p => p.actual !== null);
    return finish(metricValue(goal.metric, scope));
  });
}

/* ---------------------------- advice ---------------------------- */

export type GoalAdvice = Pick<Recommendation, 'priority' | 'title' | 'insight' | 'action' | 'recipient' | 'audience' | 'impact'> & {
  id: string;
  confidence: 'Vysoká' | 'Střední' | 'Nízká';
  metric: GoalMetric;
  channel: Channel | 'Organika';
  campaign: string | null;
  /** Short "why": which KPI is how far from its target. */
  gap: string;
};

const kindAction: Record<CampaignKind, string> = {
  brand: 'Brandová kampaň má mít nejlepší výsledky. Zkontrolujte, jestli nehlídá i slova, která nejsou značka, a jestli zbytečně nepřeplácíte první pozici.',
  remarketing: 'Zkontrolujte velikost publika a kolikrát se reklama stejným lidem zobrazuje, a vyloučte ty, kdo už nakoupili.',
  pmax: 'Vyloučit slabé produkty z feedu, doplnit nové obrázky a texty a zkontrolovat, kam kampaň posílá peníze.',
  search: 'Projít vyhledávací dotazy, vyloučit nerelevantní (negativní slova) a zkontrolovat cenu za proklik.',
  prospecting: 'Obnovit kreativy (3 nové varianty) a zúžit publikum na lidi s nejlepším výkonem.',
  email: 'Zkontrolovat předmět, čas odeslání a segment příjemců.',
  other: 'Projít cílení, texty reklam a stránku, na kterou reklama vede.',
};
const specialist = (c: ChannelCampaign) => (c.channel === 'Meta Ads' ? 'Performance specialista' : 'PPC specialista');
const dec1 = (v: number) => v.toFixed(1).replace('.', ',');
const confidenceByConversions = (c: ChannelCampaign): GoalAdvice['confidence'] => (c.conversions >= 50 ? 'Vysoká' : c.conversions >= 15 ? 'Střední' : 'Nízká');
const confidenceByImpressions = (c: ChannelCampaign): GoalAdvice['confidence'] => (c.impressions >= 20000 ? 'Vysoká' : c.impressions >= 3000 ? 'Střední' : 'Nízká');
const priorityRank = { Vysoká: 0, Střední: 1, Nízká: 2 } as const;
const shortLabel = (metric: GoalMetric, conversion: string) => metricInfo[metric].label(conversion).replace(/ \(.*\)/, '');

function gapText(goal: KpiGoal, actual: number, conversion: string) {
  return `${shortLabel(goal.metric, conversion)} je ${formatMetric(goal.metric, actual)}, cíl je ${metricInfo[goal.metric].better === 'up' ? 'aspoň' : 'nejvýš'} ${formatMetric(goal.metric, goal.target)}`;
}

export function buildAdvice(progress: KpiProgress[], ctx: GoalContext & { client: number; organicRecommendations: number }): GoalAdvice[] {
  const vocab = clientConfig(ctx.client).vocab;
  const out: GoalAdvice[] = [];
  for (const p of progress) {
    const { goal } = p;
    if (p.verdict === 'nodata' || p.verdict === 'otherperiod' || p.actual === null) continue;
    const bad = p.verdict === 'below';
    const data = ctx.dataFor(goal.periodDays);
    const scope = inScope(data, goal).filter(c => c.active && c.channel !== 'E-mail');
    const totalSpend = sum(scope, c => c.spend);
    const mine: GoalAdvice[] = [];
    const add = (a: Omit<GoalAdvice, 'id' | 'metric' | 'gap'> & { key: string }) => {
      const { key, ...rest } = a;
      mine.push({ ...rest, id: `${goal.id}:${key}`, metric: goal.metric, gap: gapText(goal, p.actual!, vocab.conversion) });
    };
    const metric = goal.metric;

    if (EMAIL_METRICS.includes(metric)) {
      if (bad) {
        const rows = (ctx.emails ?? []).filter(c => c.sent >= 200).map(c => ({ c, v: emailMetric(metric, [c]) })).filter((x): x is { c: EmailCampaign; v: number } => x.v !== null);
        const worst = rows.sort((a, b) => (metricInfo[metric].better === 'up' ? a.v - b.v : b.v - a.v)).slice(0, 3);
        const tip = metric === 'openRate' ? 'Vyzkoušet jiný předmět (A/B test), čas odeslání a očistit seznam od neaktivních příjemců.' : metric === 'clickRate' ? 'Zkrátit text, dát jedno výrazné tlačítko nahoru a jasně říct, co se stane po kliknutí.' : 'Snížit frekvenci odesílání a nabídnout výběr, jaké e-maily příjemce chce.';
        worst.forEach(({ c, v }, i) => add({ key: `email:${c.name}`, channel: 'E-mail', campaign: c.name, priority: i === 0 && p.ratio! < 0.7 ? 'Vysoká' : 'Střední', confidence: c.sent >= 2000 ? 'Vysoká' : c.sent >= 500 ? 'Střední' : 'Nízká', title: `U e-mailu „${c.name}“ zlepšit ${shortLabel(metric, '').toLowerCase()}`, insight: `U tohoto e-mailu: ${shortLabel(metric, '')} je ${formatMetric(metric, v)}, cíl je ${formatMetric(metric, goal.target)} (odesláno ${number(c.sent)}).`, action: tip, recipient: 'E-mailing specialista', audience: 'Interní', impact: 'Lepší výsledky e-mailů bez nákladů na reklamu' }));
        if (worst.length === 0) add({ key: 'email-nodata', channel: 'E-mail', campaign: null, priority: 'Nízká', confidence: 'Nízká', title: 'E-mailový cíl je pod plánem, ale chybí dost dat', insight: 'Žádná kampaň nemá aspoň 200 odeslaných e-mailů.', action: 'Počkat na větší odeslání a pak data nahrát znovu.', recipient: 'E-mailing specialista', audience: 'Interní', impact: 'Rozhodnutí na základě dat' });
      }
    } else if (metric === 'organicClicks') {
      if (bad) add({ key: 'organic', channel: 'Organika', campaign: null, priority: 'Střední', confidence: 'Střední', title: 'Kliknutí z Googlu zdarma jsou pod cílem', insight: `Chybí ${number(goal.target - p.actual)} kliknutí do cíle.`, action: ctx.organicRecommendations > 0 ? `Ve Search Console čeká ${ctx.organicRecommendations} doporučení. Projděte je a předejte nejdůležitější.` : 'Nahrajte export Dotazy a Stránky ze Search Console, aplikace pak ukáže, které dotazy mají největší potenciál.', recipient: 'SEO specialista', audience: 'Interní', impact: 'Více návštěvníků bez nákladů na reklamu' });
    } else if (metric === 'roas' || metric === 'pno' || metric === 'cpa') {
      for (const c of [...scope].sort((a, b) => b.spend - a.spend)) {
        const value = metricValue(metric, [c]);
        if (value === null) continue;
        const ratio = ratioToTarget(metric, value, goal.target);
        const share = totalSpend > 0 ? c.spend / totalSpend : 0;
        const conf = confidenceByConversions(c);
        if (ratio < 0.9) {
          const severe = ratio < 0.6 && share >= 0.1 && conf !== 'Nízká';
          const impact = metric === 'roas' ? `Při cílovém ROAS orientačně +${money(c.spend * (goal.target - value))} tržeb`
            : metric === 'pno' ? `Při cílovém PNO orientačně ušetřit ${money(Math.max(0, c.spend - c.revenue * goal.target / 100))} reklamy`
              : `Při cílové ceně by stejné náklady přinesly orientačně +${number(Math.max(0, c.spend / goal.target - c.conversions))} (${vocab.conversions})`;
          add({ key: `${c.id}:low`, channel: c.channel, campaign: c.name, priority: conf === 'Nízká' ? 'Nízká' : severe ? 'Vysoká' : 'Střední', confidence: conf,
            title: `U kampaně „${c.name}“ ${severe ? 'snížit rozpočet a prověřit ji' : 'zlepšit výkon'}`,
            insight: `U této kampaně: ${gapText(goal, value, vocab.conversion)}, tedy ${(ratio * 100).toFixed(0)} % cíle. Kampaň tvoří ${(share * 100).toFixed(0)} % nákladů.`,
            action: (severe ? 'Snížit denní rozpočet o 20 % a prověřit: ' : 'Prověřit: ') + kindAction[c.kind] + (severe ? ' Pokud se do 14 dní nezlepší, kampaň pozastavit.' : '') + (conf === 'Nízká' ? ' Dat je zatím málo, dělejte jen malé změny.' : ''),
            recipient: specialist(c), audience: 'Interní', impact });
        } else if (ratio >= 1.2 && conf !== 'Nízká' && c.channel === 'Google Ads' && (c.lostBudgetShare ?? 0) >= 0.1) {
          add({ key: `${c.id}:grow`, channel: c.channel, campaign: c.name, priority: 'Střední', confidence: conf, title: `U kampaně „${c.name}“ přidat rozpočet`,
            insight: `Kampaň má ${shortLabel(metric, vocab.conversion)} ${formatMetric(metric, value)} (lepší než cíl) a přichází o ${(c.lostBudgetShare! * 100).toFixed(0)} % zobrazení kvůli malému rozpočtu.`,
            action: 'Zvýšit denní rozpočet o 10–20 % a po týdnu zkontrolovat, že výkon drží.', recipient: specialist(c), audience: 'Interní', impact: 'Víc zobrazení u kampaně, která cíl plní' });
        }
      }
    } else if (metric === 'revenue' || metric === 'conversions') {
      if (bad) {
        const gap = goal.target - p.actual;
        const eff = (c: ChannelCampaign) => (metric === 'revenue' ? metricValue('roas', [c]) : metricValue('cpa', [c]));
        const ranked = scope.filter(c => c.conversions >= 15 && eff(c) !== null).sort((a, b) => (metric === 'revenue' ? eff(b)! - eff(a)! : eff(a)! - eff(b)!)).slice(0, 2);
        ranked.forEach((c, i) => add({ key: `${c.id}:volume`, channel: c.channel, campaign: c.name, priority: i === 0 && p.ratio! < 0.7 ? 'Vysoká' : 'Střední', confidence: confidenceByConversions(c),
          title: `U kampaně „${c.name}“ přidat rozpočet`,
          insight: `Do cíle chybí ${metric === 'revenue' ? money(gap) : `${number(gap)} (${vocab.conversions})`}. Tato kampaň je ${i === 0 ? 'nejefektivnější' : 'druhá nejefektivnější'} (${metric === 'revenue' ? `ROAS ${dec1(eff(c)!)}×` : `cena ${money(eff(c)!)} za jeden výsledek (${vocab.conversion})`}), takže tam přidaná koruna pracuje nejlépe.`,
          action: 'Zvýšit denní rozpočet o 20 % (nejvýš po krocích 10–20 %) a po týdnu zkontrolovat, že efektivita neklesla.', recipient: specialist(c), audience: 'Interní', impact: 'Přiblížení k objemovému cíli' }));
        if (ranked.length === 0) add({ key: 'volume-nodata', channel: scope[0]?.channel ?? 'Google Ads', campaign: null, priority: 'Nízká', confidence: 'Nízká', title: 'Objem je pod cílem, ale chybí dost dat na doporučení', insight: 'Žádná kampaň nemá aspoň 15 konverzí, takže nelze poznat, kde přidat rozpočet.', action: 'Počkat, až kampaně nasbírají víc dat, a zatím nic zásadního neměnit.', recipient: 'PPC specialista', audience: 'Interní', impact: 'Rozhodnutí na základě dat' });
      }
    } else if (metric === 'spend') {
      if (bad) {
        const worst = [...scope].filter(c => c.spend > 0).sort((a, b) => (metricValue('roas', [a]) ?? 0) - (metricValue('roas', [b]) ?? 0))[0];
        const over = p.actual - goal.target;
        if (worst) add({ key: `${worst.id}:cap`, channel: worst.channel, campaign: worst.name, priority: 'Vysoká', confidence: confidenceByConversions(worst), title: `Strop rozpočtu je překročen, začněte u kampaně „${worst.name}“`,
          insight: `Utraceno je o ${money(over)} víc, než je strop. Tato kampaň má z aktivních nejnižší ROAS (${dec1(metricValue('roas', [worst]) ?? 0)}×).`, action: `Snížit její denní rozpočet tak, aby se celkové výdaje vrátily pod strop (${money(over)} za období). Měnit po krocích do 20 %.`, recipient: specialist(worst), audience: 'Interní', impact: `Úspora až ${money(Math.min(over, worst.spend))}` });
      }
    } else if (metric === 'ctr' || metric === 'cpc') {
      for (const c of [...scope].sort((a, b) => b.spend - a.spend)) {
        const value = metricValue(metric, [c]);
        if (value === null) continue;
        const ratio = ratioToTarget(metric, value, goal.target);
        const conf = confidenceByImpressions(c);
        if (ratio >= 0.9) continue;
        add({ key: `${c.id}:${metric}`, channel: c.channel, campaign: c.name, priority: conf === 'Nízká' ? 'Nízká' : ratio < 0.6 ? 'Vysoká' : 'Střední', confidence: conf, title: `U kampaně „${c.name}“ ${metric === 'ctr' ? 'vylepšit texty a kreativy' : 'snížit cenu za proklik'}`,
          insight: `U této kampaně: ${gapText(goal, value, vocab.conversion)}.`,
          action: metric === 'ctr' ? 'Vyměnit nejslabší texty a obrázky za 3 nové varianty a zkontrolovat, že cílení odpovídá nabídce.' : 'Zkontrolovat relevanci klíčových slov a publik, vyloučit drahé a nekonvertující dotazy.',
          recipient: metric === 'ctr' ? 'Copywriter / grafik' : specialist(c), audience: 'Interní', impact: metric === 'ctr' ? 'Víc kliknutí za stejné peníze' : 'Levnější návštěvníci' });
      }
    }
    out.push(...mine.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]).slice(0, 5));
  }
  return out.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
}
