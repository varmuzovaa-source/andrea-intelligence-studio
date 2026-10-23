import { describe, expect, it } from 'vitest';
import { getAnalytics } from '@/lib/analytics-data';
describe('Marketing sample data', () => {
 it('updates financial and campaign values for each client', () => {
  const first = getAnalytics(0, '30'); const second = getAnalytics(1, '30');
  expect(first.revenue).not.toBe(second.revenue);
  expect(first.rows[0]?.name).not.toBe(second.rows[0]?.name);
  expect(first.revenue/first.spend).not.toBe(second.revenue/second.spend);
 });
 it.each(['7', '30', '90'])('matches chart dates and totals to %s days', period => {
  const data = getAnalytics(0, period);
  expect(data.chart).toHaveLength(Number(period));
  expect(Math.abs(data.chart.reduce((sum, day) => sum + day.revenue, 0)-data.revenue)).toBeLessThan(50);
  expect(data.chart.at(-1)?.date).toContain('30. 9.');
 });
});
import { demoClients, getModelKpis, getRecommendations, modelConfigs, clientConfig } from '@/lib/analytics-data';
describe('Business models', () => {
 it('has four demo clients, each with a configured model', () => {
  expect(demoClients.map(c => [c.name, c.model, c.isDemo])).toEqual([['Greenly Store','ecommerce',true],['Klinika Aurea','hybrid',true],['Fasada Pro','b2b',true],['Studio Lumen','services',true]]);
  expect(Object.keys(modelConfigs).sort()).toEqual(['b2b','ecommerce','hybrid','services']);
  demoClients.forEach((_, i) => expect(clientConfig(i).kpis.length).toBeGreaterThanOrEqual(4));
 });
 it('shows KPI tiles in the order of the model config', () => {
  expect(getModelKpis(0,'30').slice(0,4).map(k=>k.label)).toEqual(['Celkové tržby','Náklady na reklamu','ROAS','PNO']);
  expect(getModelKpis(1,'30').slice(0,4).map(k=>k.label)).toEqual(['Leady','Objednané konzultace','Cena za objednávku','Tržby služeb']);
  expect(getModelKpis(2,'30').slice(0,4).map(k=>k.label)).toEqual(['Poptávky','Kvalifikované příležitosti','Hodnota pipeline','Uzavřené zakázky']);
  expect(getModelKpis(3,'30').map(k=>k.code)).toEqual(modelConfigs.services.kpis);
  demoClients.forEach((_, i) => expect(getModelKpis(i,'30').map(k=>k.code)).toEqual(clientConfig(i).kpis));
 });
 it('uses different recommendation scenarios for services and e-shops', () => {
  const shop = getRecommendations(0,'30').map(r=>r.title);
  const services = getRecommendations(3,'30').map(r=>r.title);
  expect(services).toContain('Nejdřív rychlost reakce, pak rozpočet');
  expect(shop).not.toContain('Nejdřív rychlost reakce, pak rozpočet');
  expect(shop).toContain('Hlídat MER, ne jen ROAS v reklamách');
  expect(getRecommendations(1,'30').map(r=>r.title)).toContain('Cross-sell kosmetiky klientům služeb');
  demoClients.forEach((_, i) => getRecommendations(i,'30').forEach(r => expect(r.confidence).toBeDefined()));
 });
});
