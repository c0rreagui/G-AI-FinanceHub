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
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);