import { waitFor } from '@testing-library/react';
import axios, { type InternalAxiosRequestConfig } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTokens } from '@/test/fixtures/auth-fixtures.js';
import {
  createAxiosError,
  createAxiosResponse,
  createDeferred,
} from '@/test/fixtures/axios-fixtures.js';
import api, { ApiError, request, requestPaginated } from './api.js';
import { getAccessToken, getRefreshToken, saveTokens } from './auth-storage.js';

const originalAdapter = api.defaults.adapter;
const navigationMocks = vi.hoisted(() => ({ redirectToLogin: vi.fn() }));

vi.mock('./navigation.js', () => navigationMocks);

function successEnvelope<T>(data: T) {
  return { success: true, data };
}

function errorEnvelope(details: unknown = undefined) {
  return {
    success: false,
    error: { code: 'VALIDATION_ERROR', message: 'Invalid request', details },
  };
}

function unauthorizedError(config: InternalAxiosRequestConfig) {
  return createAxiosError(
    config,
    { error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
    401,
  );
}

afterEach(() => {
  api.defaults.adapter = originalAdapter;
  navigationMocks.redirectToLogin.mockReset();
  vi.restoreAllMocks();
});

describe('request', () => {
  it('unwraps a successful response envelope', async () => {
    api.defaults.adapter = async (config) =>
      createAxiosResponse(config, successEnvelope({ id: 'item-1' }));

    await expect(request<{ id: string }>({ method: 'GET', url: '/items' })).resolves.toEqual({
      id: 'item-1',
    });
  });

  it('normalizes API errors with valid details', async () => {
    api.defaults.adapter = async (config) =>
      createAxiosResponse(
        config,
        errorEnvelope([
          { field: 'email', message: 'Invalid email' },
          { field: 'ignored', message: 42 },
        ]),
      );

    await expect(request({ method: 'POST', url: '/items' })).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
      details: [{ field: 'email', message: 'Invalid email' }],
    });
  });

  it('ignores malformed error details', async () => {
    api.defaults.adapter = async (config) => createAxiosResponse(config, errorEnvelope('invalid'));

    await expect(request({ method: 'POST', url: '/items' })).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
      details: undefined,
    });
  });

  it('preserves data and metadata for paginated responses', async () => {
    api.defaults.adapter = async (config) =>
      createAxiosResponse(config, {
        success: true,
        data: [{ id: 'item-1' }],
        meta: { page: 1, total: 1 },
      });

    await expect(
      requestPaginated<{ id: string }, { page: number; total: number }>({
        method: 'GET',
        url: '/items',
      }),
    ).resolves.toEqual({ data: [{ id: 'item-1' }], meta: { page: 1, total: 1 } });
  });

  it('sends no bearer token for public requests', async () => {
    saveTokens(createTokens({ accessToken: 'public-token' }));
    const headers: unknown[] = [];
    api.defaults.adapter = async (config) => {
      headers.push(config.headers.Authorization);
      return createAxiosResponse(config, successEnvelope({ ok: true }));
    };

    await request({ method: 'POST', url: '/auth/login' });

    expect(headers).toEqual([undefined]);
  });

  it('does not refresh a public request after a 401', async () => {
    saveTokens(createTokens());
    const refreshMock = vi.spyOn(axios, 'post');
    api.defaults.adapter = async (config) => Promise.reject(unauthorizedError(config));

    await expect(request({ method: 'GET', url: '/auth/login' })).rejects.toBeInstanceOf(ApiError);
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it('adds a bearer token to protected requests', async () => {
    saveTokens(createTokens({ accessToken: 'protected-token' }));
    const headers: unknown[] = [];
    api.defaults.adapter = async (config) => {
      headers.push(config.headers.Authorization);
      return createAxiosResponse(config, successEnvelope({ ok: true }));
    };

    await request({ method: 'GET', url: '/admin/items' });

    expect(headers).toEqual(['Bearer protected-token']);
  });

  it('refreshes a protected 401 and retries once', async () => {
    saveTokens(createTokens({ accessToken: 'old-token', refreshToken: 'old-refresh' }));
    const refreshed = createTokens({ accessToken: 'new-token', refreshToken: 'new-refresh' });
    const refreshMock = vi.spyOn(axios, 'post').mockResolvedValue({
      data: { data: refreshed },
    } as never);
    const headers: unknown[] = [];
    let attempts = 0;
    api.defaults.adapter = async (config) => {
      attempts += 1;
      headers.push(config.headers.Authorization);
      if (attempts === 1) return Promise.reject(unauthorizedError(config));
      return createAxiosResponse(config, successEnvelope('retried'));
    };

    await expect(request<string>({ method: 'GET', url: '/admin/items' })).resolves.toBe('retried');

    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(attempts).toBe(2);
    expect(headers).toEqual(['Bearer old-token', 'Bearer new-token']);
  });

  it('shares one refresh between concurrent protected requests', async () => {
    saveTokens(createTokens({ accessToken: 'old-token', refreshToken: 'old-refresh' }));
    const refreshed = createTokens({ accessToken: 'new-token', refreshToken: 'new-refresh' });
    const refresh = createDeferred<{ data: { data: typeof refreshed } }>();
    const refreshMock = vi.spyOn(axios, 'post').mockReturnValue(refresh.promise as never);
    let attempts = 0;
    api.defaults.adapter = async (config) => {
      attempts += 1;
      if (attempts <= 2) return Promise.reject(unauthorizedError(config));
      return createAxiosResponse(config, successEnvelope(config.url));
    };

    const requests = Promise.all([
      request<string>({ method: 'GET', url: '/admin/one' }),
      request<string>({ method: 'GET', url: '/admin/two' }),
    ]);
    await waitFor(() => expect(refreshMock).toHaveBeenCalledTimes(1));
    refresh.resolve({ data: { data: refreshed } });

    await expect(requests).resolves.toEqual(['/admin/one', '/admin/two']);
    expect(attempts).toBe(4);
  });

  it('clears authentication and redirects when refresh fails', async () => {
    saveTokens(createTokens());
    vi.spyOn(axios, 'post').mockRejectedValue(new Error('refresh failed'));
    api.defaults.adapter = async (config) => Promise.reject(unauthorizedError(config));

    await expect(request({ method: 'GET', url: '/admin/items' })).rejects.toThrow('refresh failed');

    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(navigationMocks.redirectToLogin).toHaveBeenCalledTimes(1);
  });

  it('refreshes a token that is close to expiration before the request', async () => {
    saveTokens(
      createTokens({ accessToken: 'old-token', refreshToken: 'old-refresh', expiresIn: 1 }),
    );
    const refreshed = createTokens({ accessToken: 'new-token', refreshToken: 'new-refresh' });
    const refreshMock = vi.spyOn(axios, 'post').mockResolvedValue({
      data: { data: refreshed },
    } as never);
    const events = vi.fn();
    window.addEventListener('bopacorp:token-refreshed', events);
    const headers: unknown[] = [];
    api.defaults.adapter = async (config) => {
      headers.push(config.headers.Authorization);
      return createAxiosResponse(config, successEnvelope('proactive'));
    };

    await expect(request<string>({ method: 'GET', url: '/admin/items' })).resolves.toBe(
      'proactive',
    );
    window.removeEventListener('bopacorp:token-refreshed', events);

    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(headers).toEqual(['Bearer new-token']);
    expect(events).toHaveBeenCalledTimes(1);
  });
});
