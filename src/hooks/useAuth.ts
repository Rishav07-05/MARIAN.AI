import { useState, useEffect, useCallback } from 'react';
import { AuthSession } from '@/types/user';
import { getCurrentSession, loginWithGoogle, logoutUser } from '@/lib/auth';

export function useAuth() {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    status: 'loading',
  });

  const refreshSession = useCallback(async () => {
    setSession((prev) => ({ ...prev, status: 'loading' }));
    const current = await getCurrentSession();
    setSession(current);
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async () => {
    setSession((prev) => ({ ...prev, status: 'loading' }));
    try {
      const newSession = await loginWithGoogle();
      setSession(newSession);
    } catch (err: unknown) {
      setSession({
        user: null,
        status: 'error',
        error: err instanceof Error ? err.message : 'Authentication failed',
      });
    }
  };

  const logout = async () => {
    await logoutUser();
    setSession({ user: null, status: 'unauthenticated' });
  };

  return {
    user: session.user,
    status: session.status,
    isAuthenticated: session.status === 'authenticated',
    isLoading: session.status === 'loading',
    error: session.error,
    login,
    logout,
    refreshSession,
  };
}
