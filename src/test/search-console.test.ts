import { describe, expect, it } from 'vitest';
import { parseCsv, parseNumber, detectDelimiter } from '@/lib/csv-import';
import { parseGscCsv, findOpportunities, buildRecommendations, type GscRow } from '@/lib/search-console';
import { buildAiPayload } from '@/lib/ai-summary';

const en = 'Top queries,Clicks,Impressions,CTR,Position\n"seo audit",12,1000,1.2%,6.4\nboty,50,400,12.5%,2.1\n';
const cs = '﻿Nejčastější dotazy;Kliknutí;Zobrazení;CTR;Pozice\nkrém na ruce;3;500;0,6 %;12,3\n';

describe('csv helpers', () => {
  it('detects delimiters and handles quotes', () => {
    expect(detectDelimiter(cs)).toBe(';');
    expect(parseCsv('a,b\n"x, y",2\n')).toEqual([['a', 'b'], ['x, y', '2']]);
  });
  it('parses Czech and English numbers', () => {
    expect(parseNumber('1 234,5')).toBe(1234.5);
    expect(parseNumber('1,234.5')).toBe(1234.5);
    expect(parseNumber('3,2 %')).toBe(3.2);
    expect(parseNumber('')).toBeNaN();
  });
});

describe('parseGscCsv', () => {
  it('reads the English export', () => {
    const r = parseGscCsv(en, 'q.csv');
    expect(r.ok && r.dataset.dimension).toBe('query');
    expect(r.ok && r.dataset.rows[0]).toMatchObject({ key: 'seo audit', clicks: 12, impressions: 1000, position: 6.4 });
    expect(r.ok && r.dataset.rows[0]!.ctr).toBeCloseTo(0.012);
  });
  it('reads the Czech export with BOM and semicolons', () => {
    const r = parseGscCsv(cs, 'q.csv');
    expect(r.ok && r.dataset.rows[0]).toMatchObject({ key: 'krém na ruce', position: 12.3 });
  });
  it('reports missing columns', () => {
    const r = parseGscCsv('Top queries,Clicks\na,1\n', 'x.csv');
    expect(r.ok).toBe(false);
    expect(!r.ok && r.errors.join(' ')).toContain('Zobrazení');
  });
  it('rejects mixed query and page exports', () => {
    const r = parseGscCsv('Top queries,Top pages,Clicks,Impressions,Position\na,b,1,2,3\n', 'x.csv');
    expect(r.ok).toBe(false);
  });
});

const row = (key: string, clicks: number, impressions: number, position: number): GscRow => ({ key, clicks, impressions, ctr: impressions ? clicks / impressions : 0, position });

describe('opportunities', () => {
  const current = [row('low', 5, 1000, 3), row('near', 20, 800, 11), row('ok', 300, 1000, 1), row('fell', 5, 500, 9)];
  const previous = [row('fell', 40, 500, 4), row('gone', 30, 300, 5), row('ok', 290, 1000, 1)];
  const opp = findOpportunities(current, previous);
  it('finds low CTR at good position', () => expect(opp.lowCtr.map(o => o.row.key)).toContain('low'));
  it('finds positions 8 to 20', () => expect(opp.nearPageOne.map(o => o.row.key)).toEqual(expect.arrayContaining(['near', 'fell'])));
  it('finds drops including vanished rows', () => expect(opp.drops.map(o => o.row.key).sort()).toEqual(['fell', 'gone']));
  it('does not flag healthy rows', () => expect([...opp.lowCtr, ...opp.drops].some(o => o.row.key === 'ok')).toBe(false));
  it('builds recommendations that all carry a confidence label', () => {
    const recs = buildRecommendations('query', opp, true);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.every(r => r.confidence)).toBe(true);
  });
  it('says drops cannot be judged without a previous period', () => {
    const recs = buildRecommendations('query', findOpportunities(current, null), false);
    expect(recs.some(r => r.id === 'no-previous')).toBe(true);
  });
});

describe('AI payload', () => {
  it('contains only aggregate numbers, never queries or URLs', () => {
    const json = JSON.stringify(buildAiPayload([row('tajný dotaz', 5, 1000, 3)], null));
    expect(json).not.toContain('tajný');
    expect(json).toContain('impressions');
  });
});
