import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import * as authService from '@/services/auth.service.js';
import { type AuthUser, fetchMe } from '@/services/auth.service.js';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = 'bopacorp_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleTokenRefresh = async () => {
      try {
        const userData = await fetchMe();
        const tokens = getStoredTokens();
        if (tokens) {
          saveAuth(userData, tokens);
        }
        setUser(userData);
      } catch {
        clearAuthStorage();
        setUser(null);
      }
    };

    window.addEventListener('bopacorp:token-refreshed', handleTokenRefresh);
    return () => window.removeEventListener('bopacorp:token-refreshed', handleTokenRefresh);
  }, []);

  const login = useCallback(async (data: { email: string; password: string }) => {
    const response = await authService.login(data);
    saveAuth(response.user, response.tokens);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    await callLogout();
    clearAuthStorage();
    setUser(null);
  }, []);

  const hasPermission = useCallback(
    (permission: string) => user?.permissions.includes(permission) ?? false,
    [user],
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { user: AuthUser };
    return parsed.user;
  } catch {
    return null;
  }
}

function getStoredTokens(): {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
} | null {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    if (!accessToken || !refreshToken || !expiresAt) return null;
    const expiresIn = Math.max(0, Math.floor((Number(expiresAt) - Date.now()) / 1000));
    return { accessToken, refreshToken, expiresIn };
  } catch {
    return null;
  }
}

function saveAuth(
  user: AuthUser,
  tokens: { accessToken: string; refreshToken: string; expiresIn: number },
) {
  const authData = { user, accessToken: tokens.accessToken };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
  localStorage.setItem('tokenExpiresAt', String(Date.now() + tokens.expiresIn * 1000));
}

async function callLogout() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return;
  try {
    await authService.logout(refreshToken);
  } catch {
    // ignore
  }
}

function clearAuthStorage() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiresAt');
}
