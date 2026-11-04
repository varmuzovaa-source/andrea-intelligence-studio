/**
 * Reads what AVQIX needs from a Fachman client file (ppc.md): account IDs, business type and KPI lines.
 * Pure text parsing; the file itself is read by the local-only endpoint.
 */
import type { BusinessModel } from './business-models';
import { goalsFromMarkdown, type ClientGoals } from './goals';

export type PpcClientInfo = { googleId?: string; metaId?: string; model?: BusinessModel; goals?: ClientGoals };

export function parsePpcMd(text: string): PpcClientInfo {
  const out: PpcClientInfo = {};
  const google = /Google Ads customer ID:?\*{0,2}:?\s*`?(\d{3}-?\d{3}-?\d{4})/i.exec(text);
  const meta = /Meta ad account ID:?\*{0,2}:?\s*`?(act_\d{5,})/i.exec(text);
  if (google) out.googleId = google[1]!;
  if (meta) out.metaId = meta[1]!;
  const type = /Typ podnikání:?\*{0,2}:?\s*(.+)/i.exec(text)?.[1]?.toLowerCase() ?? '';
  const model: BusinessModel | null = !type ? null : /hybrid/.test(type) ? 'hybrid' : /b2b/.test(type) ? 'b2b' : /e-?shop|ecommerce|e-commerce/.test(type) ? 'ecommerce' : /lead|služb|sluzb|lokáln|lokaln|brand/.test(type) ? 'services' : null;
  if (model) out.model = model;
  const { goals } = goalsFromMarkdown(text);
  if (goals.kpis.length || goals.business || goals.marketing) out.goals = goals;
  return out;
}

export const nameFromSlug = (slug: string) => slug.split('-').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
