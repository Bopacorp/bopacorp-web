import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import i18n from '@/i18n/index.js';
import * as authService from '@/services/auth.service.js';
import { type AuthUser, buildAuthUser, fetchMe } from '@/services/auth.service.js';
import {
  clearAll,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  saveTokens,
  saveUser,
} from '@/services/auth-storage.js';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  login: (
    data: { email: string; password: string },
    opts?: { validate?: (user: AuthUser) => boolean },
  ) => Promise<AuthUser>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

const PUBLIC_PATH_PREFIXES = ['/servicios', '/nosotros', '/empleos'];
const PUBLIC_PATHS = new Set(['/', '/login']);

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  return PUBLIC_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser<AuthUser>());
  const [isLoading, setIsLoading] = useState(
    () => Boolean(getAccessToken()) && !isPublicPath(location.pathname),
  );

  useEffect(() => {
    if (isPublicPath(location.pathname)) {
      setIsLoading(false);
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetchMe()
      .then((meData) => {
        const fullUser = buildAuthUser(meData);
        saveUser(fullUser);
        setUser(fullUser);
      })
      .catch(() => {
        clearAll();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [location.pathname]);

  useEffect(() => {
    const handleTokenRefresh = async () => {
      if (isPublicPath(location.pathname)) return;
      try {
        const meData = await fetchMe();
        const fullUser = buildAuthUser(meData);
        saveUser(fullUser);
        setUser(fullUser);
      } catch {
        clearAll();
        setUser(null);
      }
    };

    window.addEventListener('bopacorp:token-refreshed', handleTokenRefresh);
    return () => window.removeEventListener('bopacorp:token-refreshed', handleTokenRefresh);
  }, [location.pathname]);

  const login = useCallback(
    async (
      data: { email: string; password: string },
      opts?: { validate?: (user: AuthUser) => boolean },
    ) => {
      const response = await authService.login(data);
      if (opts?.validate && !opts.validate(response.user)) {
        throw new Error(i18n.t('auth.noAdminPermission'));
      }
      saveTokens(response.tokens);
      saveUser(response.user);
      setUser(response.user);
      return response.user;
    },
    [],
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch {
        // ignore
      }
    }
    clearAll();
    setUser(null);
  }, []);

  const hasPermission = useCallback(
    (permission: string) => user?.permissions.includes(permission) ?? false,
    [user],
  );

  const hasRole = useCallback((role: string) => user?.roles.includes(role) ?? false, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission, hasRole }}>
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
