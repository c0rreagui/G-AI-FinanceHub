// components/ui/ToastContainer.tsx
import React from 'react';
import { useToast } from '../../hooks/useToast';
import { Toast } from './Toast';
import { AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 z-[9999] flex flex-col items-end justify-start p-4 space-y-2 pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};