import { useSyncExternalStore } from 'react';
import { demoClients, setCustomClients, type BusinessModel, type CustomClient } from './analytics-data';

/**
 * Clients added by the user. Kept only in this browser (localStorage).
 * Loaded after hydration (hydrate) so server and first client render agree.
 */
const KEY = 'avqix-clients-v1';
const listeners = new Set<() => void>();
let state: CustomClient[] = [];

/** Folder-style name, e.g. "Ordinace Dr. Nováková" -> "ordinace-dr-novakova". Matches the folder in AGENTURA/klienti. */
export const slugify = (name: string) =>
  name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function commit(next: CustomClient[], persist = true) {
  state = next;
  setCustomClients(next);
  if (persist) { try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode: memory only */ } }
  listeners.forEach(l => l());
}

export const clientsStore = {
  get: () => state,
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  hydrate() {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
      if (Array.isArray(parsed)) commit(parsed.filter((c): c is CustomClient => !!c && typeof c.name === 'string' && typeof c.model === 'string').map(c => ({ ...c, slug: c.slug || slugify(c.name) })), false);
    } catch { /* ignore broken storage */ }
  },
  /** Returns an error message in Czech, or null when the client was added. */
  add(name: string, model: BusinessModel, slug?: string): string | null {
    const clean = name.trim().replace(/\s+/g, ' ');
    if (clean.length < 2) return 'Napište název klienta (aspoň 2 znaky).';
    if (clean.length > 60) return 'Název je moc dlouhý (nejvýš 60 znaků).';
    const taken = [...demoClients.map(c => c.name), ...state.map(c => c.name)];
    if (taken.some(n => n.toLowerCase() === clean.toLowerCase())) return 'Klient se stejným názvem už existuje.';
    const finalSlug = slugify(slug || clean);
    if (!finalSlug) return 'Z názvu se nepodařilo vyrobit krátké jméno složky. Použijte písmena nebo čísla.';
    commit([...state, { name: clean, model, slug: finalSlug }]);
    return null;
  },
  update(name: string, patch: Partial<Pick<CustomClient, 'googleId' | 'metaId'>>) { commit(state.map(c => (c.name === name ? { ...c, ...patch } : c))); },
  remove(name: string) { commit(state.filter(c => c.name !== name)); },
  /** Test helper. */
  reset() { commit([], false); },
};

export const useCustomClients = () => useSyncExternalStore(clientsStore.subscribe, clientsStore.get, () => []);
