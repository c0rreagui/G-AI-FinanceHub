import React, { Fragment } from 'react';
import { XIcon } from '../Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
    >
        <div 
            className="relative w-full max-w-lg p-6 bg-white/10 border border-white/20 rounded-2xl shadow-2xl shadow-black/40 text-white"
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
        </div>
    </div>
  );
};