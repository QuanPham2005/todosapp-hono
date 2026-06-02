import type { AuthUser } from '../types';
import { getStoredAuth as getStoredAuthData, setStoredAuth as persistAuth, clearStoredAuth as removeAuth } from './api';

export const STORAGE_KEY = 'todoapp_auth';

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
