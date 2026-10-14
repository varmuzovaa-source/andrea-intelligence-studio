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
