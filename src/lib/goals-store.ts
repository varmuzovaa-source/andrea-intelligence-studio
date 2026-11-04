import { useSyncExternalStore } from 'react';
import { emptyGoals, type ClientGoals } from './goals';

/**
 * Client goals, kept only in this browser (localStorage), one entry per client name.
 * Not shared with colleagues; use "Zkopírovat pro Fachmana" to move them into ppc.md.
 */
const KEY = 'avqix-goals-v1';
const listeners = new Set<() => void>();
let state: Record<string, ClientGoals> = load();

function load(): Record<string, ClientGoals> {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, ClientGoals>) : {};
  } catch { return {}; }
}
function commit(next: Record<string, ClientGoals>) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode: keep in memory only */ }
  listeners.forEach(l => l());
}

export const goalsStore = {
  get: () => state,
  forClient: (name: string): ClientGoals => state[name] ?? emptyGoals(),
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  save(name: string, goals: ClientGoals) { commit({ ...state, [name]: { ...goals, updatedAt: new Date().toISOString() } }); },
  /** Test helper. */
  reset(next: Record<string, ClientGoals> = {}) { commit(next); },
};

export const useGoals = () => useSyncExternalStore(goalsStore.subscribe, goalsStore.get, () => ({}) as Record<string, ClientGoals>);
