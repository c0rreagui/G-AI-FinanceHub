import React, { createContext, useContext, useState } from 'react';

type Locale = 'pt-BR' | 'en-US';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  'pt-BR': {
    'welcome': 'Bem-vindo',
    'dashboard': 'Dashboard',
    'settings': 'Configurações',
  },
  'en-US': {
    'welcome': 'Welcome',
    'dashboard': 'Dashboard',
    'settings': 'Settings',
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('pt-BR');

  const t = (key: string) => {
    return translations[locale][key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
