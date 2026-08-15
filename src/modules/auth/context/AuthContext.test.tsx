import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/i18n/index.js';
import { getAccessToken, getStoredUser, saveTokens, saveUser } from '@/services/auth-storage.js';
import { createAuthUser, createMeResponse, createTokens } from '@/test/fixtures/auth-fixtures.js';
import { AuthProvider, useAuth } from './AuthContext.js';

const authMocks = vi.hoisted(() => ({
  login: vi.fn(),
  logout: vi.fn(),
  fetchMe: vi.fn(),
}));

vi.mock('@/services/auth.service.js', async () => {
  const actual = await vi.importActual<typeof import('@/services/auth.service.js')>(
    '@/services/auth.service.js',
  );
  return {
    ...actual,
    login: authMocks.login,
    logout: authMocks.logout,
    fetchMe: authMocks.fetchMe,
  };
});

function createWrapper(route: string) {
  return function AuthWrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>{children}</AuthProvider>
        </I18nextProvider>
      </MemoryRouter>
    );
  };
}

function renderAuthHook(route = '/admin') {
  return renderHook(() => useAuth(), { wrapper: createWrapper(route) });
}

beforeEach(() => {
  authMocks.login.mockReset();
  authMocks.logout.mockReset();
  authMocks.fetchMe.mockReset();
});

describe('AuthContext', () => {
  it('stores the user and tokens after a successful login', async () => {
    const user = createAuthUser();
    const tokens = createTokens();
    authMocks.login.mockResolvedValue({ user, tokens });
    const { result } = renderAuthHook('/');

    await act(async () => {
      await result.current.login({ email: user.email, password: 'Password1!' });
    });

    expect(result.current.user).toEqual(user);
    expect(getAccessToken()).toBe(tokens.accessToken);
    expect(getStoredUser()).toEqual(user);
  });

  it('rejects a user when the validation callback fails', async () => {
    const user = createAuthUser({ roles: ['editor'] });
    authMocks.login.mockResolvedValue({ user, tokens: createTokens() });
    const { result } = renderAuthHook('/');

    await act(async () => {
      await expect(
        result.current.login(
          { email: user.email, password: 'Password1!' },
          { validate: (candidate) => candidate.roles.includes('admin') },
        ),
      ).rejects.toThrow('No tienes permisos');
    });

    expect(getAccessToken()).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it('restores a stored session through the current-user request', async () => {
    const tokens = createTokens();
    saveTokens(tokens);
    saveUser(createAuthUser({ email: 'old@bopacorp.com' }));
    authMocks.fetchMe.mockResolvedValue(createMeResponse({ email: 'fresh@bopacorp.com' }));
    const { result } = renderAuthHook('/admin');

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(authMocks.fetchMe).toHaveBeenCalledTimes(1);
    expect(result.current.user?.email).toBe('fresh@bopacorp.com');
  });

  it('clears the session when the current-user request fails', async () => {
    saveTokens(createTokens());
    saveUser(createAuthUser());
    authMocks.fetchMe.mockRejectedValue(new Error('session expired'));
    const { result } = renderAuthHook('/admin');

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(getAccessToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
  });

  it.each([
    '/',
    '/login',
    '/servicios',
    '/nosotros',
    '/empleos',
    '/empleos/job-1',
  ])('does not verify a session on public route %s', (route) => {
    saveTokens(createTokens());
    renderAuthHook(route);
    expect(authMocks.fetchMe).not.toHaveBeenCalled();
  });

  it('refreshes the user when the token-refreshed event is dispatched', async () => {
    saveTokens(createTokens());
    authMocks.fetchMe
      .mockResolvedValueOnce(createMeResponse({ email: 'first@bopacorp.com' }))
      .mockResolvedValueOnce(createMeResponse({ email: 'second@bopacorp.com' }));
    const { result } = renderAuthHook('/admin');
    await waitFor(() => expect(result.current.user?.email).toBe('first@bopacorp.com'));

    await act(async () => {
      window.dispatchEvent(new Event('bopacorp:token-refreshed'));
    });
    await waitFor(() => expect(result.current.user?.email).toBe('second@bopacorp.com'));
  });

  it('clears the session when remote logout fails', async () => {
    saveTokens(createTokens());
    saveUser(createAuthUser());
    authMocks.fetchMe.mockResolvedValue(createMeResponse());
    authMocks.logout.mockRejectedValue(new Error('logout unavailable'));
    const { result } = renderAuthHook('/admin');
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(getAccessToken()).toBeNull();
  });

  it('checks roles and permissions from the current user', () => {
    saveUser(createAuthUser({ roles: ['web-admin'], permissions: ['content_blocks.read'] }));
    const { result } = renderAuthHook('/');

    expect(result.current.hasRole('web-admin')).toBe(true);
    expect(result.current.hasRole('admin')).toBe(false);
    expect(result.current.hasPermission('content_blocks.read')).toBe(true);
    expect(result.current.hasPermission('content_blocks.update')).toBe(false);
  });
});
