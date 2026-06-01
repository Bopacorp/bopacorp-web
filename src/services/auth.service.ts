import { request } from './api.js';

interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
    permissions: string[];
    profile: unknown | null;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function login(data: { email: string; password: string }) {
  return request<LoginResponse>({
    method: 'POST',
    url: '/auth/login',
    data,
  });
}

export async function refresh(refreshToken: string) {
  return request<RefreshResponse>({
    method: 'POST',
    url: '/auth/refresh',
    data: { refreshToken },
  });
}

export async function logout(refreshToken: string) {
  return request<void>({
    method: 'POST',
    url: '/auth/logout',
    data: { refreshToken },
  });
}
