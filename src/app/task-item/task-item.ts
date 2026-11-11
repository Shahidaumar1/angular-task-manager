import { Component, input, output } from '@angular/core';
import { Task } from '../task.model';

// Child component: parent se data leta hai (input) aur events bhejta hai (output)
@Component({
  selector: 'app-task-item',
  template: `
    <li class="item" [class.done]="task().completed">
      <label class="check">
        <input type="checkbox" [checked]="task().completed" (change)="toggle.emit(task().id)" />
        <span class="box"></span>
      </label>
      <span class="title">{{ task().title }}</span>
      <span class="badge" [class]="task().priority">{{ task().priority }}</span>
      <button class="del" (click)="remove.emit(task().id)" aria-label="Delete task">✕</button>
    </li>
  `,
  styles: `
    .item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; margin-bottom: 8px;
            list-style: none; background: var(--surface-2); border: 1px solid var(--border);
            border-radius: 12px; animation: pop .25s ease; transition: transform .15s, box-shadow .15s; }
    .item:hover { transform: translateY(-1px); box-shadow: 0 4px 14px var(--shadow); }
    @keyframes pop { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

    .check { position: relative; display: inline-flex; cursor: pointer; }
    .check input { position: absolute; opacity: 0; width: 0; height: 0; }
    .box { width: 20px; height: 20px; border-radius: 6px; border: 2px solid var(--muted);
           display: inline-flex; align-items: center; justify-content: center; transition: all .15s; }
    .check input:checked + .box { background: var(--accent); border-color: var(--accent); }
    .check input:checked + .box::after { content: '✓'; color: #fff; font-size: 13px; font-weight: 700; }
    .check input:focus-visible + .box { outline: 2px solid var(--accent); outline-offset: 2px; }

    .title { flex: 1; text-transform: capitalize; color: var(--text); }
    .done .title { text-decoration: line-through; color: var(--muted); }

    .badge { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .4px;
             padding: 3px 9px; border-radius: 999px; }
    .badge.high { background: #fee2e2; color: #b91c1c; }
    .badge.medium { background: #fef3c7; color: #b45309; }
    .badge.low { background: #dcfce7; color: #15803d; }

    .del { border: none; background: transparent; color: var(--muted); cursor: pointer; font-size: 15px;
           width: 28px; height: 28px; border-radius: 8px; transition: all .15s; }
    .del:hover { background: #fee2e2; color: #dc2626; }
  `,
})
export class TaskItem {
  task = input.required<Task>();
  toggle = output<number>();
  remove = output<number>();
}
