import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../services/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

const API_KEY_STORAGE_KEY = 'financehub-gemini-api-key';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tenta pegar a sessão ativa e a chave de API quando o app carrega
    const getInitialData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      setApiKeyState(storedApiKey);

      setLoading(false);
    };

    getInitialData();

    // Ouve mudanças na autenticação (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        // Limpa a chave de API no logout
        if (_event === 'SIGNED_OUT') {
            setApiKey(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const setApiKey = (key: string | null) => {
    if (key) {
        localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } else {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
    setApiKeyState(key);
  };


  const value = {
    session,
    user,
    apiKey,
    setApiKey,
    loading,
  };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};