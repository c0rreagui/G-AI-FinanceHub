// components/ui/Toast.tsx
import React, { useEffect } from 'react';
import { ToastMessage } from '../../contexts/ToastContext';
import { XIcon } from '../Icons';
import { motion } from 'framer-motion';

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: number) => void;
}

const toastVariants = {
    initial: { opacity: 0, y: 50, scale: 0.3 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
};

const typeClasses = {
    success: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-300' },
    error: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-300' },
    info: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-300' },
};

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 5000); // O toast some após 5 segundos

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onRemove]);

  const classes = typeClasses[toast.type];

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      {...({ className: `relative w-full max-w-sm p-4 overflow-hidden rounded-xl shadow-lg border ${classes.bg} ${classes.border} backdrop-blur-lg` } as any)}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{toast.message}</p>
          {toast.description && (
            <p className={`mt-1 text-sm ${classes.text}`}>{toast.description}</p>
          )}
          {toast.action && (
              <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      toast.action?.onClick();
                      onRemove(toast.id);
                  }}
                  className="mt-2 text-xs font-bold underline hover:no-underline"
              >
                  {toast.action.label}
              </button>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-4 flex-shrink-0 p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};