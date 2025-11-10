// contexts/ToastContext.tsx
import React, { createContext, useState, useCallback, ReactNode } from 'react';

export interface ToastMessage {
  id: number;
  message: string;
  description?: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, options?: { description?: string; type?: 'success' | 'error' | 'info' }) => void;
  removeToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const showToast = useCallback((message: string, options: { description?: string; type?: 'success' | 'error' | 'info' } = {}) => {
    const { description, type = 'info' } = options;
    const newToast: ToastMessage = {
      id: Date.now(),
      message,
      description,
      type,
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};