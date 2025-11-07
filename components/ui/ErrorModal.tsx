import React from 'react';
import { XIcon } from '../Icons';
import { Button } from './Button';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: string | null;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, error }) => {
  if (!isOpen || !error) return null;

  return (
    <div 
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        aria-labelledby="error-modal-title"
        role="alertdialog"
        aria-modal="true"
    >
        <div 
            className="relative w-full max-w-2xl p-6 bg-red-900/50 border border-red-500/30 rounded-2xl shadow-2xl shadow-black/40 text-red-200"
            role="document"
        >
            <div className="flex items-start justify-between">
                <h2 id="error-modal-title" className="text-xl font-bold text-white">Erro de Conexão</h2>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full text-red-200 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label="Fechar"
                >
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="mt-4">
                 <p className="mb-4 text-red-100">Não foi possível carregar os dados. Verifique sua conexão com a internet ou as credenciais do Supabase.</p>
                <pre className="bg-black/30 p-4 rounded-md text-xs whitespace-pre-wrap font-mono text-red-100">
                    <code>{error}</code>
                </pre>
            </div>
             <div className="mt-6 flex justify-end">
                <Button onClick={onClose} variant="secondary">
                    Fechar
                </Button>
            </div>
        </div>
    </div>
  );
};