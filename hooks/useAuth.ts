import React, { useState, useEffect, useContext, useMemo } from 'react';
import { supabase } from '../services/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKeyState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('gemini_api_key');
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [isDeveloper, setIsDeveloper] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('developer_mode') === 'true';
    }
    return false;
  });
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('guest_mode') === 'true';
    }
    return false;
  });


  const setApiKey = (key: string) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('gemini_api_key', key);
      } catch (e) {
        console.error("Failed to set API key in localStorage", e);
      }
    }
    setApiKeyState(key);
  };

  const setDeveloperMode = (isDev: boolean) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('developer_mode', String(isDev));
    }
    setIsDeveloper(isDev);
  };

  const enterGuestMode = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('guest_mode', 'true');
    }
    setIsGuest(true);
  };

  const logout = async () => {
    if (isGuest) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('financehub_guest_data');
        sessionStorage.removeItem('guest_mode');
      }
      setIsGuest(false);
    } else {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Error logging out:', error);
    }
    setDeveloperMode(false); // Always reset dev mode on any logout
    // The onAuthStateChange listener will handle setting user/session to null for supabase users
    // For guests, we manually cleared state.
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Cleanup stale flags
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('guest_mode');
      sessionStorage.removeItem('developer_mode');
    }
    setIsGuest(false);
    setIsDeveloper(false);
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // Cleanup stale flags
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('guest_mode');
      sessionStorage.removeItem('developer_mode');
    }
    setIsGuest(false);
    setIsDeveloper(false);
  };

  const loginWithPin = async (pin: string): Promise<boolean> => {
    // Check if PIN is '2609' for dev mode access
    if (pin === '2609') {
      try {
        // Real authentication for Master User
        const { error } = await supabase.auth.signInWithPassword({
          email: 'dev@financehub.com',
          password: pin // Using PIN as password as requested
        });

        if (error) {
          console.error("Developer login failed:", error);
          return false;
        }

        setDeveloperMode(true);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('guest_mode');
        }
        setIsGuest(false);
        return true;
      } catch (e) {
        console.error("Unexpected error during developer login:", e);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    // Se for um visitante, não precisamos verificar a sessão do Supabase.
    if (isGuest) {
      setLoading(false);
      return;
    }

    const getInitialData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Removed blocking check to allow auth state updates even if guest flag was present
        // if (sessionStorage.getItem('guest_mode') === 'true') return;

        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          setDeveloperMode(false);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [isGuest]); // Re-executa se o status de visitante mudar


  const value: AuthContextType = useMemo(() => ({
    session,
    user,
    loading,
    apiKey,
    setApiKey,
    isDeveloper,
    setDeveloperMode,
    isGuest,
    enterGuestMode,
    logout,
    signIn,
    signUp,
    loginWithPin,
  }), [session, user, loading, apiKey, isDeveloper, isGuest]);

  return React.createElement(AuthContext.Provider, { value: value }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};