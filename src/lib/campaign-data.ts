/**
 * One shape for campaign numbers, whatever their origin: deterministic demo data or a file
 * saved by the Fachman bridge. Goal comparison and advice only ever read this shape.
 */
import { useSyncExternalStore } from 'react';
import { clients, getAnalytics, isCustomClient } from './analytics-data';

export type Channel = 'Google Ads' | 'Meta Ads' | 'E-mail';
export type CampaignKind = 'brand' | 'remarketing' | 'pmax' | 'search' | 'prospecting' | 'email' | 'other';

export type ChannelCampaign = {
  id: string;
  name: string;
  channel: Channel;
  kind: CampaignKind;
  active: boolean;
  spend: number;
  revenue: number;
  conversions: number;
  clicks: number;
  impressions: number;
  /** Google Ads only, 0–1: share of impressions lost to a too small budget. */
  lostBudgetShare?: number;
};

export function kindOf(name: string, channelType?: string): CampaignKind {
  const n = name.toLowerCase();
  if (n.includes('brand')) return 'brand';
  if (n.includes('remarketing') || n.includes('rmkt') || n.includes('retarget')) return 'remarketing';
  if (channelType === 'PERFORMANCE_MAX' || channelType === 'SHOPPING' || n.includes('pmax') || n.includes('performance max') || n.includes('shopping')) return 'pmax';
  if (n.includes('newsletter') || n.includes('e-mail') || n.includes('email')) return 'email';
  if (channelType === 'SEARCH' || n.includes('vyhled') || n.includes('search')) return 'search';
  if (n.includes('prospect') || n.includes('video') || n.includes('advantage') || n.includes('sales')) return 'prospecting';
  return 'other';
}

export type BridgeSource = 'google_ads' | 'meta_ads';
export const bridgeSourceLabel: Record<BridgeSource, string> = { google_ads: 'Google Ads', meta_ads: 'Meta Ads' };
export type BridgeDataset = { source: BridgeSource; fileName: string; days: number | null; campaigns: ChannelCampaign[]; notes: string[]; fetchedAt?: string };

/* ---------- in-memory store of imported Fachman files (never persisted, like Search Console) ---------- */
let bridge: Record<string, BridgeDataset[]> = {};
const listeners = new Set<() => void>();
export const bridgeStore = {
  get: () => bridge,
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  /** Replaces the dataset of the same source for this client. */
  set(clientName: string, dataset: BridgeDataset) {
    bridge = { ...bridge, [clientName]: [...(bridge[clientName] ?? []).filter(d => d.source !== dataset.source), dataset] };
    listeners.forEach(l => l());
  },
  clear(clientName?: string) {
    if (clientName) { const { [clientName]: _drop, ...rest } = bridge; bridge = rest; } else bridge = {};
    listeners.forEach(l => l());
  },
};
export const useBridge = () => useSyncExternalStore(bridgeStore.subscribe, bridgeStore.get, bridgeStore.get);

export type CampaignData = {
  origin: 'demo' | 'fachman' | 'none';
  /** Human wording for banners, e.g. "Ukázková data" or "Data z Fachmana (Google Ads, Meta Ads)". */
  label: string;
  /** Length of the period the numbers cover; null when unknown or mixed. */
  days: number | null;
  campaigns: ChannelCampaign[];
  notes: string[];
};

function demoCampaigns(client: number, days: number): ChannelCampaign[] {
  return getAnalytics(client, String(days)).rows.map(r => {
    const clicks = r.cpc > 0 ? r.spend / r.cpc : 0;
    const channel: Channel = r.source === 'E-mail' ? 'E-mail' : r.source === 'Google Ads' ? 'Google Ads' : 'Meta Ads';
    return { id: `demo-${r.id}`, name: r.name, channel, kind: kindOf(r.name), active: r.status === 'Aktivní', spend: r.spend, revenue: r.revenue, conversions: r.conversions, clicks, impressions: r.ctr > 0 ? clicks / (r.ctr / 100) : 0 };
  });
}

/** Imported Fachman files for the client win over the demo data. */
export function getCampaignData(client: number, days: number, imported: Record<string, BridgeDataset[]> = bridge): CampaignData {
  const sets = imported[clients[client] ?? ''] ?? [];
  if (sets.length === 0 && isCustomClient(client)) return { origin: 'none', label: 'Zatím žádná data', days, campaigns: [], notes: [] };
  if (sets.length === 0) return { origin: 'demo', label: 'Ukázková data', days, campaigns: demoCampaigns(client, days), notes: [] };
  const periods = new Set(sets.map(s => s.days));
  return {
    origin: 'fachman',
    label: `Data z Fachmana (${sets.map(s => bridgeSourceLabel[s.source]).join(', ')})`,
    days: periods.size === 1 ? (sets[0]!.days ?? null) : null,
    campaigns: sets.flatMap(s => s.campaigns),
    notes: sets.flatMap(s => s.notes),
  };
}
