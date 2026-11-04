import { beforeEach, describe, expect, it } from 'vitest';
import { goalsFromMarkdown, goalsToMarkdown, newGoalId, type ClientGoals } from '@/lib/goals';
import { buildAdvice, computeProgress, metricValue, ratioToTarget } from '@/lib/goal-advice';
import { getCampaignData, type BridgeDataset, type ChannelCampaign } from '@/lib/campaign-data';
import { daysFromFileName, parseFachmanJson } from '@/lib/fachman-bridge';
import { tasksStore } from '@/lib/tasks-store';

const goals = (kpis: ClientGoals['kpis']): ClientGoals => ({ business: 'Tržby', marketing: 'Nové zákazníky', kpis, updatedAt: '' });
const kpi = (metric: ClientGoals['kpis'][number]['metric'], target: number, channel: ClientGoals['kpis'][number]['channel'] = 'all', periodDays: 7 | 30 | 90 = 30) => ({ id: newGoalId(), metric, target, periodDays, channel });
const camp = (o: Partial<ChannelCampaign>): ChannelCampaign => ({ id: o.name ?? 'c', name: 'K', channel: 'Meta Ads', kind: 'other', active: true, spend: 1000, revenue: 4000, conversions: 40, clicks: 500, impressions: 20000, ...o });
const ctxFor = (campaigns: ChannelCampaign[], days = 30, organicClicks: number | null = null) => ({ dataFor: () => ({ origin: 'fachman' as const, label: 'Test', days, campaigns, notes: [] }), organicClicks });

describe('goals markdown for ppc.md', () => {
  it('round-trips goals', () => {
    const g = goals([kpi('roas', 5), kpi('cpa', 250, 'Google Ads', 90)]);
    const back = goalsFromMarkdown(goalsToMarkdown('Test', g)).goals;
    expect(back.business).toBe('Tržby');
    expect(back.kpis.map(k => [k.metric, k.target, k.periodDays, k.channel])).toEqual([['roas', 5, 30, 'all'], ['cpa', 250, 90, 'Google Ads']]);
  });
  it('skips lines it cannot read', () => {
    const r = goalsFromMarkdown('- KPI: Něco ≥ 5 × · 30 dní · vše\n- KPI: ROAS ≥ 5 × · 12 dní · vše');
    expect(r.goals.kpis).toHaveLength(0);
    expect(r.skipped).toHaveLength(2);
  });
});

describe('progress', () => {
  it('computes ratios in both directions', () => {
    expect(ratioToTarget('roas', 4, 5)).toBeCloseTo(0.8);
    expect(ratioToTarget('cpa', 300, 250)).toBeCloseTo(250 / 300);
    expect(metricValue('roas', [camp({})])).toBe(4);
    expect(metricValue('cpa', [camp({ conversions: 0 })])).toBeNull();
  });
  it('marks below / met and refuses volume goals for another period', () => {
    const cs = [camp({ name: 'A' })];
    const [below, met, other] = computeProgress(goals([kpi('roas', 5), kpi('roas', 3), kpi('revenue', 1000)]), ctxFor(cs, 7));
    expect(below!.verdict).toBe('below');
    expect(met!.verdict).toBe('met');
    expect(other!.verdict).toBe('otherperiod');
  });
  it('reports missing Search Console data instead of guessing', () => {
    const [p] = computeProgress(goals([kpi('organicClicks', 1000)]), ctxFor([]));
    expect(p!.verdict).toBe('nodata');
  });
});

describe('advice', () => {
  const run = (cs: ChannelCampaign[], kpis: ClientGoals['kpis']) => { const ctx = ctxFor(cs); return buildAdvice(computeProgress(goals(kpis), ctx), { ...ctx, client: 0, organicRecommendations: 0 }); };
  it('names the weak campaign and escalates a big, clearly bad one', () => {
    const advice = run([camp({ name: 'Slabá', revenue: 1500, spend: 5000 }), camp({ name: 'Dobrá', revenue: 9000, spend: 1000 })], [kpi('roas', 5)]);
    const weak = advice.find(a => a.campaign === 'Slabá')!;
    expect(weak.priority).toBe('Vysoká');
    expect(weak.title).toContain('Slabá');
    expect(advice.some(a => a.campaign === 'Dobrá')).toBe(false);
  });
  it('is cautious when there is little data', () => {
    const advice = run([camp({ name: 'Malá', revenue: 100, spend: 5000, conversions: 3 })], [kpi('roas', 5)]);
    expect(advice[0]!.confidence).toBe('Nízká');
    expect(advice[0]!.priority).toBe('Nízká');
  });
  it('points a missed volume goal at the most efficient campaign', () => {
    const advice = run([camp({ name: 'Špička', revenue: 8000, spend: 1000, conversions: 40 }), camp({ name: 'Průměr', revenue: 3000, spend: 1000, conversions: 30 })], [kpi('revenue', 50000)]);
    expect(advice[0]!.campaign).toBe('Špička');
  });
  it('gives no advice when goals are met', () => {
    expect(run([camp({})], [kpi('roas', 2)])).toHaveLength(0);
  });
  it('Předat creates a task once', () => {
    tasksStore.reset();
    const [a] = run([camp({ name: 'Slabá', revenue: 1500, spend: 5000 })], [kpi('roas', 5)]);
    const add = () => tasksStore.add({ sourceKey: `goal:T:${a!.id}`, title: a!.title, action: a!.action, source: 's', recipient: a!.recipient, impact: a!.impact, priority: a!.priority });
    expect(add()).toBe(true);
    expect(add()).toBe(false);
  });
});

describe('Fachman bridge', () => {
  const google = JSON.stringify([{ campaign: { id: '1', name: 'Brand · Vyhledávání', status: 'ENABLED', advertisingChannelType: 'SEARCH' }, metrics: { costMicros: '2500000000', clicks: '900', impressions: '12000', conversions: 30.5, conversionsValue: 20000, searchBudgetLostImpressionShare: 0.18 } }, { campaign: { id: '2', name: 'PMax', status: 'PAUSED', advertisingChannelType: 'PERFORMANCE_MAX' }, metrics: {} }]);
  const meta = JSON.stringify([{ campaign_name: 'Remarketing · 30 dní', spend: '1200.50', clicks: '300', impressions: '9000', actions: [{ action_type: 'purchase', value: '12' }], action_values: [{ action_type: 'purchase', value: '9000' }] }]);
  it('reads Google Ads numbers (micros, string numbers, missing zeros)', () => {
    const r = parseFachmanJson(google, 'x-google-ads-30d-2026-10-30.json');
    if (!r.ok) throw new Error('should parse');
    const [a, b] = r.dataset.campaigns;
    expect(r.dataset.days).toBe(30);
    expect(a).toMatchObject({ spend: 2500, conversions: 30.5, revenue: 20000, kind: 'brand', active: true, lostBudgetShare: 0.18 });
    expect(b).toMatchObject({ spend: 0, active: false, kind: 'pmax' });
  });
  it('reads Meta insights', () => {
    const r = parseFachmanJson(meta, 'x-meta-ads-7d-2026-10-30.json');
    if (!r.ok) throw new Error('should parse');
    expect(r.dataset.campaigns[0]).toMatchObject({ channel: 'Meta Ads', spend: 1200.5, conversions: 12, revenue: 9000, kind: 'remarketing' });
  });
  it('explains broken files', () => {
    expect(parseFachmanJson('nope', 'a.json').ok).toBe(false);
    expect(parseFachmanJson('{"error":1}', 'a.json').ok).toBe(false);
    expect(parseFachmanJson('[{"a":1}]', 'a.json').ok).toBe(false);
  });
  it('reads days from the file name and lets imported data replace the demo', () => {
    expect(daysFromFileName('v-google-ads-90d-2026-10-30.json')).toBe(90);
    expect(daysFromFileName('export.json')).toBeNull();
    const r = parseFachmanJson(google, 'v-google-ads-30d-2026-10-30.json');
    if (!r.ok) throw new Error();
    const set: BridgeDataset = r.dataset;
    expect(getCampaignData(0, 30, { 'Greenly Store': [set] }).origin).toBe('fachman');
    expect(getCampaignData(0, 30, {}).origin).toBe('demo');
  });
});

import { clientModel, clients, isCustomClient } from '@/lib/analytics-data';
import { clientsStore, slugify } from '@/lib/clients-store';

describe('own clients', () => {
  beforeEach(() => clientsStore.reset());
  it('adds a client after the demo ones and starts empty, not with demo numbers', () => {
    expect(clientsStore.add('Ordinace Dr. Nováková', 'services')).toBeNull();
    const i = clients.indexOf('Ordinace Dr. Nováková');
    expect(i).toBe(4);
    expect(isCustomClient(i)).toBe(true);
    expect(clientModel(i)).toBe('services');
    expect(getCampaignData(i, 30, {}).origin).toBe('none');
    expect(getCampaignData(i, 30, {}).campaigns).toHaveLength(0);
  });
  it('rejects empty and duplicate names and builds a folder name', () => {
    expect(clientsStore.add(' ', 'b2b')).not.toBeNull();
    expect(clientsStore.add('Greenly Store', 'ecommerce')).not.toBeNull();
    expect(slugify('Ordinace Dr. Nováková')).toBe('ordinace-dr-novakova');
  });
  it('removing a client shrinks the list again', () => {
    clientsStore.add('Test', 'hybrid');
    clientsStore.remove('Test');
    expect(clients).toHaveLength(4);
  });
});
