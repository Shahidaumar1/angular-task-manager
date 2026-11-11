import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Priority, Task } from './task.model';

const STORAGE_KEY = 'task-manager-tasks';

// Sample data: API fail ho to ye dikhta hai
const SAMPLE_TASKS: Task[] = [
  { id: 1, title: 'Learn TypeScript basics', completed: true, priority: 'high' },
  { id: 2, title: 'Build the Angular task manager', completed: true, priority: 'high' },
  { id: 3, title: 'Practice Git branching and merge conflicts', completed: false, priority: 'medium' },
  { id: 4, title: 'Revise MySQL joins and indexes', completed: false, priority: 'medium' },
  { id: 5, title: 'Prepare answers for the interview', completed: false, priority: 'low' },
];

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);

  tasks = signal<Task[]>(this.readSaved());
  loading = signal(false);
  error = signal('');

  constructor() {
    // Jab bhi tasks badlein, browser mein save ho jayein (refresh par bhi rahein)
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks()));
      } catch {
        /* storage band ho to ignore */
      }
    });
  }

  private readSaved(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Task[]) : [];
    } catch {
      return [];
    }
  }

  // Pehli baar: REST API se tasks lao (GET, JSON). Dobara: saved tasks use karo.
  load() {
    if (this.tasks().length > 0) return;
    this.fetchFromApi();
  }

  fetchFromApi() {
    this.loading.set(true);
    this.error.set('');
    const levels: Priority[] = ['low', 'medium', 'high'];
    this.http
      .get<{ id: number; title: string; completed: boolean }[]>(
        'https://jsonplaceholder.typicode.com/todos?_limit=8'
      )
      .subscribe({
        next: (data) => {
          this.tasks.set(data.map((t) => ({ ...t, priority: levels[t.id % 3] })));
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.tasks.set(SAMPLE_TASKS);
          this.error.set('Could not reach the API, showing sample tasks instead.');
          this.loading.set(false);
        },
      });
  }

  add(title: string, priority: Priority) {
    const nextId = Math.max(0, ...this.tasks().map((t) => t.id)) + 1;
    this.tasks.update((list) => [{ id: nextId, title, completed: false, priority }, ...list]);
  }

  toggle(id: number) {
    this.tasks.update((list) =>
      list.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  remove(id: number) {
    this.tasks.update((list) => list.filter((t) => t.id !== id));
  }

  clearCompleted() {
    this.tasks.update((list) => list.filter((t) => !t.completed));
  }
}
