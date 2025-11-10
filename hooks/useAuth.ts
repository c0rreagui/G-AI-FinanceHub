import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKeyState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gemini_api_key');
    }
    return null;
  });

  const setApiKey = (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', key);
    }
    setApiKeyState(key);
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
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);


  const value: AuthContextType = {
    session,
    user,
    loading,
    apiKey,
    setApiKey,
  };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
