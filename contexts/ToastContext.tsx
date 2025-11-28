// contexts/ToastContext.tsx
import React, { createContext, useState, useCallback, ReactNode } from 'react';

export interface ToastMessage {
  id: number;
  message: string;
  description?: string;
  type: 'success' | 'error' | 'info';
  action?: {
      label: string;
      onClick: () => void;
  };
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, options?: { description?: string; type?: 'success' | 'error' | 'info'; action?: { label: string; onClick: () => void } }) => void;
  removeToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const showToast = useCallback((message: string, options: { description?: string; type?: 'success' | 'error' | 'info'; action?: { label: string; onClick: () => void } } = {}) => {
    const { description, type = 'info', action } = options;
    const newToast: ToastMessage = {
      id: Date.now(),
      message,
      description,
      type,
      action,
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};