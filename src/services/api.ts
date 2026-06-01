import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL as string;

if (!baseURL) {
  throw new Error('VITE_API_URL is required');
}

const api = axios.create({ baseURL });

api.interceptors.request.use(injectAuthHeader);

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  (error) => handleResponseError(error as AxiosError),
);

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await api(config);
  if (!response.data.success) {
    throw new ApiError(response.data.error.code, response.data.error.message);
  }
  return response.data.data as T;
}

export default api;

function injectAuthHeader(config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

function handleResponseError(error: AxiosError) {
  const originalRequest = error.config as RetryConfig;
  if (!shouldRefresh(error, originalRequest)) {
    return Promise.reject(error);
  }
  return isRefreshing ? queueForRefresh(originalRequest) : refreshWithRetry(originalRequest);
}

function shouldRefresh(error: AxiosError, request: RetryConfig) {
  return error.response?.status === 401 && !request._retry;
}

function queueForRefresh(request: RetryConfig) {
  return new Promise((resolve) => {
    refreshSubscribers.push((token) => {
      request.headers.Authorization = `Bearer ${token}`;
      resolve(api(request));
    });
  });
}

async function refreshWithRetry(request: RetryConfig) {
  request._retry = true;
  isRefreshing = true;

  try {
    const token = getRefreshToken();
    if (!token) throw new Error('No refresh token');

    const res = await axios.post(`${baseURL}/auth/refresh`, { refreshToken: token });
    const { accessToken, refreshToken: newRefreshToken } = res.data.data;

    saveTokens(accessToken, newRefreshToken);
    notifySubscribers(accessToken);

    return api(request);
  } catch (err) {
    return handleRefreshError(err as AxiosError);
  } finally {
    isRefreshing = false;
  }
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

function notifySubscribers(token: string) {
  for (const cb of refreshSubscribers) {
    cb(token);
  }
  refreshSubscribers = [];
}

function handleRefreshError(error: AxiosError) {
  clearAuth();
  redirectToLogin();
  return Promise.reject(error);
}

function clearAuth() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('bopacorp_auth');
  localStorage.removeItem('tokenExpiresAt');
}

function redirectToLogin() {
  window.location.href = '/login';
}
