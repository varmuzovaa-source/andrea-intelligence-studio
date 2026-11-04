import { beforeEach, describe, expect, it } from 'vitest';
import { tasksStore, type NewTask } from '@/lib/tasks-store';

const input = (key: string): NewTask => ({ sourceKey: key, title: 'T', action: 'A', source: 'S', recipient: 'R', impact: 'I', priority: 'Vysoká' });

describe('tasks store', () => {
  beforeEach(() => tasksStore.reset());
  it('adds a task once per recommendation', () => {
    expect(tasksStore.add(input('k1'))).toBe(true);
    expect(tasksStore.add(input('k1'))).toBe(false);
    expect(tasksStore.get()).toHaveLength(1);
    expect(tasksStore.get()[0]).toMatchObject({ status: 'todo', owner: '' });
  });
  it('updates owner and status, and removes', () => {
    tasksStore.add(input('k2'));
    const id = tasksStore.get()[0]!.id;
    tasksStore.update(id, { owner: 'Eva', status: 'doing' });
    expect(tasksStore.get()[0]).toMatchObject({ owner: 'Eva', status: 'doing' });
    tasksStore.remove(id);
    expect(tasksStore.get()).toHaveLength(0);
  });
  it('persists to localStorage', () => {
    tasksStore.add(input('k3'));
    expect(JSON.parse(localStorage.getItem('avqix-tasks-v1') ?? '[]')).toHaveLength(1);
  });
});
