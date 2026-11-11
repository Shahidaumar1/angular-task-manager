import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from './task.service';
import { TaskItem } from './task-item/task-item';
import { Filter } from './task.model';

@Component({
  selector: 'app-root',
  imports: [FormsModule, TaskItem],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  service = inject(TaskService);

  newTitle = signal('');
  search = signal('');
  filter = signal<Filter>('all');

  // computed: jab tasks/search/filter badlein to khud dobara hisaab karta hai
  visibleTasks = computed(() =>
    this.service
      .tasks()
      .filter((t) => t.title.toLowerCase().includes(this.search().toLowerCase()))
      .filter((t) =>
        this.filter() === 'all' ? true : this.filter() === 'done' ? t.completed : !t.completed
      )
  );

  doneCount = computed(() => this.service.tasks().filter((t) => t.completed).length);
  totalCount = computed(() => this.service.tasks().length);

  ngOnInit() {
    this.service.load();
  }

  addTask() {
    const title = this.newTitle().trim();
    if (!title) return;
    this.service.add(title);
    this.newTitle.set('');
  }
}
