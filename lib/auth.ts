import { clearAuthToken, setAuthToken } from './api';
import type { User, LoginCredentials, LoginResponse } from '@/types';
import api from './api';

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', credentials);
  setAuthToken(data.access_token);
  return data;
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    clearAuthToken();
  }
}

export async function fetchProfile(): Promise<User> {
  const { data } = await api.get<User>('/auth/profile');
  return data;
}

export async function refreshToken(refresh_token: string): Promise<string> {
  const { data } = await api.post<{ access_token: string }>('/auth/refresh', { refresh_token });
  setAuthToken(data.access_token);
  return data.access_token;
}

export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.permissions.includes(permission);
}

export function canAccess(user: User | null, roles: string[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}
