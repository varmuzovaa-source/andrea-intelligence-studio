import { useSyncExternalStore } from 'react';

/**
 * Team tasks created from recommendations ("Předat").
 * Kept only in this browser (localStorage). Not shared with colleagues yet.
 * Stores the recommendation text, never imported CSV rows.
 */
export type TaskStatus = 'todo' | 'doing' | 'done';
export const statusLabels: Record<TaskStatus, string> = { todo: 'K řešení', doing: 'Rozděláno', done: 'Hotovo' };

export type Task = {
  id: string;
  /** Stable key of the recommendation it came from, used to avoid duplicates. */
  sourceKey: string;
  title: string;
  action: string;
  source: string;
  recipient: string;
  impact: string;
  priority: 'Vysoká' | 'Střední' | 'Nízká';
  owner: string;
  status: TaskStatus;
  createdAt: string;
};

export type NewTask = Pick<Task, 'sourceKey' | 'title' | 'action' | 'source' | 'recipient' | 'impact' | 'priority'>;

const KEY = 'avqix-tasks-v1';
const listeners = new Set<() => void>();
let state: Task[] = load();

function load(): Task[] {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Task[]) : [];
  } catch { return []; }
}
function commit(next: Task[]) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode: keep in memory only */ }
  listeners.forEach(l => l());
}

export const tasksStore = {
  get: () => state,
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  has: (sourceKey: string) => state.some(t => t.sourceKey === sourceKey),
  /** Adds a task unless one for the same recommendation already exists. Returns true if added. */
  add(input: NewTask): boolean {
    if (state.some(t => t.sourceKey === input.sourceKey)) return false;
    commit([{ ...input, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, owner: '', status: 'todo', createdAt: new Date().toISOString() }, ...state]);
    return true;
  },
  update(id: string, patch: Partial<Pick<Task, 'owner' | 'status'>>) { commit(state.map(t => (t.id === id ? { ...t, ...patch } : t))); },
  remove(id: string) { commit(state.filter(t => t.id !== id)); },
  /** Test helper. */
  reset(next: Task[] = []) { commit(next); },
};

export const useTasks = () => useSyncExternalStore(tasksStore.subscribe, tasksStore.get, () => []);
