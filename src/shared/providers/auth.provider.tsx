import React from 'react';
import { useLocation } from 'wouter';

import { checkTokenExpired, refreshToken } from '@/features/auth/api/auth.api';
import { clearAccessToken, getAccessToken } from '@/shared/api';

type AuthContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refreshSession: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [isReady, setIsReady] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const initialLocationRef = React.useRef(location);

  const bootstrapAuth = React.useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      clearAccessToken();
      setIsAuthenticated(false);
      setIsReady(true);

      if (initialLocationRef.current !== '/login') {
        setLocation('/login');
      }

      return;
    }

    try {
      const isExpired = await checkTokenExpired({ token });

      if (isExpired) {
        await refreshToken();
      }

      setIsAuthenticated(true);
      setIsReady(true);

      if (initialLocationRef.current === '/login') {
        setLocation('/dashboard');
      }
    } catch {
      clearAccessToken();
      setIsAuthenticated(false);
      setIsReady(true);

      if (initialLocationRef.current !== '/login') {
        setLocation('/login');
      }
    }
  }, [setLocation]);

  React.useEffect(() => {
    void bootstrapAuth();
  }, [bootstrapAuth]);

  const logout = React.useCallback(() => {
    clearAccessToken();
    setIsAuthenticated(false);
    setLocation('/login');
  }, [setLocation]);

  const refreshSession = React.useCallback(async () => {
    await refreshToken();
    setIsAuthenticated(true);
  }, [setIsAuthenticated]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      isReady,
      isAuthenticated,
      logout,
      refreshSession,
    }),
    [isAuthenticated, isReady, logout, refreshSession],
  );

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-full border bg-white px-4 py-2 text-sm text-muted-foreground shadow-sm">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
          Đang kiểm tra phiên đăng nhập...
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
