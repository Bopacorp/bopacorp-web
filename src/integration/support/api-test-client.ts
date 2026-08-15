import type { AuthUser } from '@/services/auth.service.js';
import { login } from '@/services/auth.service.js';
import { clearAll, getAccessToken, saveTokens } from '@/services/auth-storage.js';

export type TestAccount = 'cms' | 'limited';

export interface HttpResult<T = unknown> {
  status: number;
  headers: Headers;
  body: T;
}

export interface ErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

const env = import.meta.env as Record<string, string | undefined>;

export function getTestCredentials(account: TestAccount) {
  const prefix = account === 'cms' ? 'VITE_WEB_TEST_CMS' : 'VITE_WEB_TEST_LIMITED';
  const email = env[`${prefix}_EMAIL`];
  const password = env[`${prefix}_PASSWORD`];
  if (!email || !password) {
    throw new Error(`${prefix}_EMAIL and ${prefix}_PASSWORD are required`);
  }
  return { email, password };
}

export async function authenticate(account: TestAccount): Promise<AuthUser> {
  clearAll();
  const response = await login(getTestCredentials(account));
  saveTokens(response.tokens);
  return response.user;
}

export function authorizationHeaders(): HeadersInit {
  const token = getAccessToken();
  if (!token) throw new Error('Authenticate before creating an authorized request');
  return { Authorization: `Bearer ${token}` };
}

export function jsonHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json' };
}

export async function httpRequest<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<HttpResult<T>> {
  const response = await fetch(buildUrl(path), init);
  return { status: response.status, headers: response.headers, body: await readBody<T>(response) };
}

function buildUrl(path: string) {
  const baseUrl = env.VITE_API_URL;
  if (!baseUrl) throw new Error('VITE_API_URL is required to build an API request');
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

async function readBody<T>(response: Response): Promise<T> {
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export function isErrorEnvelope(body: unknown): body is ErrorEnvelope {
  return Boolean(body && typeof body === 'object' && 'error' in body);
}
