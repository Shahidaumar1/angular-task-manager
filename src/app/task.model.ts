export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'high';   // <-- nayi line
}

export type Filter = 'all' | 'active' | 'done';