import { useSyncExternalStore } from 'react';
import { defaultAiSettings, type AiSettings } from './ai-summary';

/** In-memory AI settings. Off by default, reset on reload, never persisted. */
let state: AiSettings = defaultAiSettings;
const listeners = new Set<() => void>();

export const aiStore = {
  get: () => state,
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  update(patch: Partial<AiSettings>) { state = { ...state, ...patch }; listeners.forEach(l => l()); },
};

export const useAiSettings = () => useSyncExternalStore(aiStore.subscribe, aiStore.get, aiStore.get);
