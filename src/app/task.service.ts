import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);

  tasks = signal<Task[]>([]);
  loading = signal(false);
  error = signal('');

  // REST API se tasks lana (GET, JSON)
  load() {
    this.loading.set(true);
    this.http
      .get<Task[]>('https://jsonplaceholder.typicode.com/todos?_limit=8')
      .subscribe({
       next: (data) => {
  this.tasks.set(data.map((t) => ({ ...t, priority: 'low' as const })));
  this.loading.set(false);
},
        error: () => {
          this.error.set('Could not load tasks. Please check your internet connection.');
          this.loading.set(false);
        },
      });
  }

 add(title: string) {
  const nextId = Math.max(0, ...this.tasks().map((t) => t.id)) + 1;
  this.tasks.update((list) => [
    { id: nextId, title, completed: false, priority: 'low' },
    ...list,
  ]);
}

  toggle(id: number) {
    this.tasks.update((list) =>
      list.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  remove(id: number) {
    this.tasks.update((list) => list.filter((t) => t.id !== id));
  }
}
