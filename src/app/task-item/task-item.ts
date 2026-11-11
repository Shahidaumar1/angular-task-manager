import { Component, input, output } from '@angular/core';
import { Task } from '../task.model';

// Child component: @Input / @Output ka naya (signal) tareeqa
@Component({
  selector: 'app-task-item',
  template: `
    <li [class.done]="task().completed">
      <input type="checkbox" [checked]="task().completed" (change)="toggle.emit(task().id)" />
      <span>{{ task().title }}</span>
      <button (click)="remove.emit(task().id)" aria-label="Delete task">✕</button>
    </li>
  `,
  styles: `
    li { display: flex; align-items: center; gap: 10px; padding: 10px 12px;
         border-bottom: 1px solid #e5e7eb; list-style: none; }
    span { flex: 1; text-transform: capitalize; }
    .done span { text-decoration: line-through; color: #9ca3af; }
    button { border: none; background: transparent; color: #dc2626; cursor: pointer; font-size: 16px; }
  `,
})
export class TaskItem {
  task = input.required<Task>();   // parent se data aata hai (@Input)
  toggle = output<number>();       // parent ko event jata hai (@Output)
  remove = output<number>();
}
