import React from 'react';
import { Session, User } from '@supabase/supabase-js';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  apiKey: string | null;
  setApiKey: (key: string) => void;
  isDeveloper: boolean;
  setDeveloperMode: (isDev: boolean) => void;
  isGuest: boolean;
  enterGuestMode: () => void;
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  loginWithPin: (pin: string) => Promise<boolean>;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);