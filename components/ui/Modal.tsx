import React from 'react';
import { Dialog } from '@headlessui/react';
import { XIcon } from '../Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          as={motion.div}
          open={isOpen}
          onClose={onClose}
          className="relative z-50"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal content */}
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-lg rounded-2xl bg-oklch-card border border-white/10 p-6 shadow-2xl shadow-black/40"
            >
              <div className="flex items-start justify-between">
                <Dialog.Title className="text-xl font-semibold text-white">
                  {title}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-4">{children}</div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
