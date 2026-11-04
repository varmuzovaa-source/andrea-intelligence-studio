import { bridgeStore } from './campaign-data';
import { parseFachmanJson } from './fachman-bridge';

/** Talks to the local-only /api/most endpoint. Returns false on the public web, where it does not exist. */
export async function liveAvailable(): Promise<boolean> {
  try { return (await fetch('/api/most')).ok; } catch { return false; }
}

export type LiveResult = { ok: true; loaded: string[]; notes: string[] } | { ok: false; error: string };

export async function refreshFromFachman(clientName: string, req: { slug: string; google?: string; meta?: string; days: number }): Promise<LiveResult> {
  try {
    const res = await fetch('/api/most', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(req) });
    const data = (await res.json()) as { files?: { name: string; text: string }[]; error?: string };
    if (!res.ok || !data.files) return { ok: false, error: data.error ?? 'Stažení selhalo.' };
    const loaded: string[] = [], notes: string[] = [];
    for (const f of data.files) {
      const r = parseFachmanJson(f.text, f.name);
      if (!r.ok) return { ok: false, error: `${f.name}: ${r.errors.join(' ')}` };
      bridgeStore.set(clientName, { ...r.dataset, fetchedAt: new Date().toISOString() });
      loaded.push(f.name); notes.push(...r.dataset.notes);
    }
    return { ok: true, loaded, notes };
  } catch { return { ok: false, error: 'Nepodařilo se spojit s aplikací. Je spuštěná přes Spustit-AVQIX?' }; }
}
