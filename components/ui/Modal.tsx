import React from 'react';
import { XIcon } from '../Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { y: "50px", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { type: "spring", damping: 25, stiffness: 200 } },
    exit: { y: "50px", opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-lg p-6 bg-black/30 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl shadow-black/40 text-white"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 id="modal-title" className="text-xl font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
