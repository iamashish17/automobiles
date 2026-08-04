import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth as useClerkAuth } from '@clerk/react';
import { AuthContext } from './auth-context';
import { apiRequest } from '../lib/api';

const AUTH_STORAGE_KEY = 'automobile.auth.session';

function readStoredSession() {
  if (typeof window === 'undefined') {
    return { token: null, user: null, authMethod: null };
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: null, user: null, authMethod: null };
  } catch {
    return { token: null, user: null, authMethod: null };
  }
}

function persistSession(session) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!session?.token) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function AuthProvider({ children }) {
  const { getToken, isLoaded: isClerkLoaded, isSignedIn, signOut } = useClerkAuth();
  const [session, setSession] = useState(() => readStoredSession());
  const [clerkSyncing, setClerkSyncing] = useState(false);

  useEffect(() => {
    persistSession(session);
  }, [session]);

  const refreshUser = useCallback(async () => {
    if (!session.token) return null;
    try {
      const currentUser = await apiRequest('/api/auth/me', { token: session.token });
      setSession((currentSession) => ({ ...currentSession, user: currentUser }));
      return currentUser;
    } catch (error) {
      setSession({ token: null, user: null, authMethod: null });
      throw error;
    }
  }, [session.token]);

  useEffect(() => {
    let active = true;

    const syncClerkSession = async () => {
      if (!isClerkLoaded || !isSignedIn) {
        if (isClerkLoaded && session.authMethod === 'clerk') {
          setSession({ token: null, user: null, authMethod: null });
        }
        return;
      }

      try {
        setClerkSyncing(true);
        const clerkToken = await getToken();
        if (!clerkToken) return;
        const appSession = await apiRequest('/api/auth/clerk/session', {
          method: 'POST',
          token: clerkToken,
        });
        if (!active) return;
        setSession({ token: appSession.token, user: appSession.user, authMethod: 'clerk' });
      } catch {
        if (active) setSession({ token: null, user: null, authMethod: null });
      } finally {
        if (active) setClerkSyncing(false);
      }
    };

    syncClerkSession();

    return () => {
      active = false;
    };
  }, [getToken, isClerkLoaded, isSignedIn, session.authMethod]);

  const value = useMemo(
    () => ({
      token: session.token,
      user: session.user,
      isAuthenticated: Boolean(session.token),
      isAuthLoading: !isClerkLoaded || clerkSyncing,
      authMethod: session.authMethod,
      setSession: (nextSession) => {
        setSession({
          token: nextSession?.token || null,
          user: nextSession?.user || null,
          authMethod: nextSession?.authMethod || 'local',
        });
      },
      refreshUser,
      logout: async () => {
        const wasClerkSession = session.authMethod === 'clerk';
        setSession({ token: null, user: null, authMethod: null });
        if (wasClerkSession) {
          await signOut();
        }
      },
    }),
    [clerkSyncing, isClerkLoaded, refreshUser, session, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
