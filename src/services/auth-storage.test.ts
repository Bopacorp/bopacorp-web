import { describe, expect, it } from 'vitest';
import {
  clearAll,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  getTokenExpiresAt,
  saveTokens,
  saveUser,
} from './auth-storage.js';

describe('auth storage', () => {
  it('stores tokens and calculates the expiration timestamp', () => {
    const start = Date.now();
    saveTokens({ accessToken: 'access', refreshToken: 'refresh', expiresIn: 3600 });
    const expiresAt = getTokenExpiresAt();

    expect(getAccessToken()).toBe('access');
    expect(getRefreshToken()).toBe('refresh');
    expect(expiresAt).toBeGreaterThanOrEqual(start + 3600 * 1000);
  });

  it('stores and reads a user object', () => {
    saveUser({ id: 'user-1', roles: ['admin'] });
    expect(getStoredUser()).toEqual({ id: 'user-1', roles: ['admin'] });
  });

  it('returns null for malformed stored user data', () => {
    localStorage.setItem('bopacorp_user', '{invalid');
    expect(getStoredUser()).toBeNull();
  });

  it('clears current and legacy authentication keys', () => {
    saveTokens({ accessToken: 'access', refreshToken: 'refresh', expiresIn: 3600 });
    saveUser({ id: 'user-1' });
    localStorage.setItem('bopacorp_auth', 'legacy');
    localStorage.setItem('accessToken', 'legacy-access');

    clearAll();

    expect(localStorage.length).toBe(0);
  });
});
