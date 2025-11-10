import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../services/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  // FIX: Adicionando apiKey e setApiKey ao contexto de autenticação
  apiKey: string | null;
  setApiKey: (key: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // FIX: Lógica para gerenciar a chave de API do Gemini no localStorage
  const [apiKey, setApiKeyState] = useState<string | null>(() => {
    try {
      return localStorage.getItem('gemini-api-key');
    } catch (e) {
      console.error("Não foi possível ler a chave de API do localStorage", e);
      return null;
    }
  });

  const setApiKey = (key: string) => {
    try {
      localStorage.setItem('gemini-api-key', key);
      setApiKeyState(key);
    } catch (e) {
      console.error("Não foi possível salvar a chave de API no localStorage", e);
    }
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


  const value = {
    session,
    user,
    loading,
    // FIX: Expondo apiKey e setApiKey no provedor de contexto
    apiKey,
    setApiKey,
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