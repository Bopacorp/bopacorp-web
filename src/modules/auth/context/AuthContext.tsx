import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { LoginRequest, LoginResponse } from '@bopacorp/shared/auth';
import { apiClient } from '@/lib/api.js';

interface AuthUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = 'bopacorp_auth';

function getStoredAuth(): { user: AuthUser | null; accessToken: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, accessToken: null };
    const parsed = JSON.parse(raw) as { user: AuthUser; accessToken: string };
    return { user: parsed.user, accessToken: parsed.accessToken };
  } catch {
    return { user: null, accessToken: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredAuth();
    setUser(stored.user);
    setAccessToken(stored.accessToken);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const authData = {
      user: response.user,
      accessToken: response.tokens.accessToken,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    localStorage.setItem('accessToken', response.tokens.accessToken);
    localStorage.setItem('refreshToken', response.tokens.refreshToken);

    setUser(response.user);
    setAccessToken(response.tokens.accessToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setAccessToken(null);
  }, []);

  const hasPermission = useCallback(
    (permission: string) => {
      return user?.permissions.includes(permission) ?? false;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isLoading, login, logout, hasPermission }}
    >
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
