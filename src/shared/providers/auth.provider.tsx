import React from 'react';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';

import { checkTokenExpired, refreshToken } from '@/features/auth/api/auth.api';
import {
  clearAccessToken,
  clearAllClientStorage,
  clearCurrentStaff,
  getAccessToken,
  getCurrentRole,
  type UserRole,
} from '@/shared/api';

type AuthContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  role: UserRole;
  isAdminRole: boolean;
  isStaffRole: boolean;
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
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [role, setRole] = React.useState<UserRole>(getCurrentRole());
  const initialLocationRef = React.useRef(location);

  const bootstrapAuth = React.useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      clearAccessToken();
      clearCurrentStaff();
      setIsAuthenticated(false);
      setRole(getCurrentRole());
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
      setRole(getCurrentRole());
      setIsReady(true);

      if (initialLocationRef.current === '/login') {
        setLocation('/dashboard');
      }
    } catch {
      clearAccessToken();
      clearCurrentStaff();
      setIsAuthenticated(false);
      setRole(getCurrentRole());
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
    clearAllClientStorage();
    queryClient.clear();
    setIsAuthenticated(false);
    setRole(getCurrentRole());
    setLocation('/login');
  }, [queryClient, setLocation]);

  const refreshSession = React.useCallback(async () => {
    await refreshToken();
    setIsAuthenticated(true);
    setRole(getCurrentRole());
  }, [setIsAuthenticated]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      isReady,
      isAuthenticated,
      role,
      isAdminRole: role === 'ROLE_ADMIN' || role === 'ROLE_SUPERADMIN',
      isStaffRole: role === 'ROLE_STAFF',
      logout,
      refreshSession,
    }),
    [isAuthenticated, isReady, logout, refreshSession, role],
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
