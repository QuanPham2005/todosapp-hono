export type UserRole = 'USER' | 'ADMIN';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface TodoPayload {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'Low' | 'Medium' | 'High';
  completed?: boolean;
  tags?: string[];
}

export type TodoUpdatePayload = Partial<TodoPayload>;

export interface TodoItem {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface StatsData {
  users: number;
  todos: number;
}

export interface AdminUser {
  id: number;
  email: string;
  role: UserRole;
  isBanned: boolean;
  createdAt: string;
}
