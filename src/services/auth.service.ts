import type { AuthTokensResponse, ProfileResponse } from '@bopacorp/shared/auth';
import { request } from './api.js';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  profile: ProfileResponse | null;
}

interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokensResponse;
}

export async function login(data: { email: string; password: string }) {
  return request<LoginResponse>({
    method: 'POST',
    url: '/auth/login',
    data,
  });
}

export async function refresh(refreshToken: string) {
  return request<AuthTokensResponse>({
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

export async function fetchMe() {
  return request<AuthUser>({
    method: 'GET',
    url: '/auth/me',
  });
}
