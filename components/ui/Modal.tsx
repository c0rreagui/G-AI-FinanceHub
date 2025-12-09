import React, { useEffect } from 'react';
import { XIcon } from '../Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Adiciona um listener para a tecla 'Escape' para fechar o modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="relative z-[140]"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...({ 
              onClick: onClose,
              className: "fixed inset-0 bg-black/70 backdrop-blur-sm",
              "aria-hidden": "true"
            } as any)}
          />

          {/* Container do conteúdo do modal */}
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              {...({ 
                className: "w-full max-w-lg rounded-2xl bg-[oklch(var(--card-oklch))] border border-[oklch(var(--border-oklch))] p-6 shadow-2xl shadow-black/40",
                onClick: (e: any) => e.stopPropagation()
              } as any)}
            >
              <div className="flex items-start justify-between">
                <h2 id="modal-title" className="text-xl font-semibold text-white">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Fechar modal"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-4">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};