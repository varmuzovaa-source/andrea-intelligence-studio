/**
 * Optional AI summary. Off by default, and in this prototype nothing is ever sent.
 * The payload contains only aggregate numbers: no queries, no URLs, no client names.
 */
import { findOpportunities, sumRows, type GscRow } from './search-console';

export type AiProvider = 'claude' | 'gpt';
export const aiProviders: { id: AiProvider; name: string }[] = [
  { id: 'claude', name: 'Claude (Anthropic)' },
  { id: 'gpt', name: 'GPT (OpenAI)' },
];

export type AiSummaryPayload = {
  period: { rows: number; clicks: number; impressions: number; ctr: number; avgPosition: number };
  opportunities: { lowCtr: number; nearPageOne: number; drops: number; potentialClicks: number };
};

export function buildAiPayload(current: GscRow[], previous: GscRow[] | null): AiSummaryPayload {
  const total = sumRows(current);
  const opp = findOpportunities(current, previous);
  const all = [...opp.lowCtr, ...opp.nearPageOne, ...opp.drops];
  const round = (v: number, d = 3) => Number(v.toFixed(d));
  return {
    period: { rows: total.count, clicks: Math.round(total.clicks), impressions: Math.round(total.impressions), ctr: round(total.ctr), avgPosition: round(total.position, 1) },
    opportunities: { lowCtr: opp.lowCtr.length, nearPageOne: opp.nearPageOne.length, drops: opp.drops.length, potentialClicks: all.reduce((s, o) => s + o.potentialClicks, 0) },
  };
}

/** In-memory settings, off by default. No key is accepted or stored here. */
export type AiSettings = { enabled: boolean; provider: AiProvider };
export const defaultAiSettings: AiSettings = { enabled: false, provider: 'claude' };
