import { useSyncExternalStore } from 'react';
import type { GscDataset, GscDimension } from './search-console';

/**
 * In-memory store for imported Search Console exports.
 * Deliberately not persisted (no localStorage, no network): a page reload clears it.
 */
export type GscPeriod = 'current' | 'previous';
export type GscState = Record<GscPeriod, Partial<Record<GscDimension, GscDataset>>>;

let state: GscState = { current: {}, previous: {} };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

export const gscStore = {
  get: () => state,
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  set(period: GscPeriod, dataset: GscDataset) {
    state = { ...state, [period]: { ...state[period], [dataset.dimension]: dataset } };
    emit();
  },
  clear() { state = { current: {}, previous: {} }; emit(); },
};

export const useGscData = () => useSyncExternalStore(gscStore.subscribe, gscStore.get, gscStore.get);
