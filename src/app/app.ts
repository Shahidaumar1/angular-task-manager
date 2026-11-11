import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from './task.service';
import { TaskItem } from './task-item/task-item';
import { Filter, Priority } from './task.model';

@Component({
  selector: 'app-root',
  imports: [FormsModule, TaskItem],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  service = inject(TaskService);

  filters: Filter[] = ['all', 'active', 'done'];
  priorities: Priority[] = ['low', 'medium', 'high'];

  newTitle = signal('');
  newPriority = signal<Priority>('medium');
  search = signal('');
  filter = signal<Filter>('all');
  dark = signal(this.readTheme());

  // computed: signals badlein to ye khud dobara hisaab karta hai
  visibleTasks = computed(() =>
    this.service
      .tasks()
      .filter((t) => t.title.toLowerCase().includes(this.search().toLowerCase()))
      .filter((t) =>
        this.filter() === 'all' ? true : this.filter() === 'done' ? t.completed : !t.completed
      )
  );

  totalCount = computed(() => this.service.tasks().length);
  doneCount = computed(() => this.service.tasks().filter((t) => t.completed).length);
  activeCount = computed(() => this.totalCount() - this.doneCount());
  progress = computed(() =>
    this.totalCount() === 0 ? 0 : Math.round((this.doneCount() / this.totalCount()) * 100)
  );

  constructor() {
    effect(() => {
      try {
        localStorage.setItem('task-manager-theme', this.dark() ? 'dark' : 'light');
      } catch {
        /* ignore */
      }
    });
  }

  ngOnInit() {
    this.service.load();
  }

  private readTheme(): boolean {
    try {
      return localStorage.getItem('task-manager-theme') === 'dark';
    } catch {
      return false;
    }
  }

  countFor(f: Filter): number {
    return f === 'all' ? this.totalCount() : f === 'done' ? this.doneCount() : this.activeCount();
  }

  addTask() {
    const title = this.newTitle().trim();
    if (!title) return;
    this.service.add(title, this.newPriority());
    this.newTitle.set('');
  }

  toggleTheme() {
    this.dark.update((v) => !v);
  }
}
