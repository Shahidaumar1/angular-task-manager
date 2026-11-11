// TypeScript types: app ka data ka "shape"
export type Priority = 'low' | 'medium' | 'high';
export type Filter = 'all' | 'active' | 'done';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
}
