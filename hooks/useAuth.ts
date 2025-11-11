import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
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

  useEffect(() => {
    // Tenta pegar a sessão ativa quando o app carrega
    const getInitialData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialData();

    // Ouve mudanças na autenticação (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
            setDeveloperMode(false); // Garante que o modo dev é desativado no logout
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);


  const value: AuthContextType = useMemo(() => ({
    session,
    user,
    loading,
    apiKey,
    setApiKey,
    isDeveloper,
    setDeveloperMode,
  }), [session, user, loading, apiKey, isDeveloper]);

  return React.createElement(AuthContext.Provider, { value: value }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};