import type { AuthUser, StatsData, TodoItem, TodoPayload, TodoUpdatePayload, AdminUser } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : 'http://localhost:8787';
const STORAGE_KEY = 'todoapp_auth';

export const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { token: string; user: AuthUser };
  } catch {
    return null;
  }
};

export const setStoredAuth = (token: string, user: AuthUser) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const getHeaders = () => {
  const auth = getStoredAuth();
  return {
    'Content-Type': 'application/json',
    ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
  };
};

const handleJsonResponse = async <T>(response: Response): Promise<T> => {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      (body as { error?: string })?.error ||
      (response.status === 502 || response.status === 503
        ? 'Không kết nối được máy chủ. Hãy chạy backend (npm run dev trong thư mục backend).'
        : `Lỗi máy chủ (${response.status})`);
    throw new Error(message);
  }
  return body as T;
};

export const apiPost = async <T>(path: string, payload: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<T>(response);
};

export const apiGet = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleJsonResponse<T>(response);
};

export const apiPatch = async <T>(path: string, payload: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<T>(response);
};

export const apiDelete = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleJsonResponse<T>(response);
};

export const loginRequest = async (email: string, password: string) => {
  return apiPost<{ user: AuthUser; token: string }>('/auth/login', { email, password });
};

export const registerRequest = async (email: string, password: string) => {
  return apiPost<{ user: AuthUser; token: string }>('/auth/register', { email, password });
};

export const fetchTodos = async () => {
  return apiGet<{ todos: TodoItem[] }>('/todos');
};

export const createTodo = async (payload: TodoPayload) => {
  return apiPost<{ todo: TodoItem }>('/todos', payload);
};

export const updateTodo = async (id: number, payload: TodoUpdatePayload) => {
  return apiPatch<{ todo: TodoItem }>(`/todos/${id}`, payload);
};

export const deleteTodo = async (id: number) => {
  return apiDelete<{ success: boolean }>(`/todos/${id}`);
};

export const fetchStats = async () => {
  return apiGet<StatsData>('/admin/stats');
};

export const fetchUsers = async () => {
  return apiGet<{ users: AdminUser[] }>('/admin/users');
};

export const banUser = async (id: number) => {
  return apiPatch<{ user: AdminUser }>(`/admin/users/${id}/ban`, {});
};

export const unbanUser = async (id: number) => {
  return apiPatch<{ user: AdminUser }>(`/admin/users/${id}/unban`, {});
};
