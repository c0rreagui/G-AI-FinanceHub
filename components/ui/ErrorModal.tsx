
import React from 'react';
import { XIcon, Zap } from '../Icons';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: string | null;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, error }) => {
  const isFetchError = error?.includes('TypeError: Failed to fetch');
  const isApiKeyError = error?.includes('API key not valid');

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants: Variants = {
    hidden: { y: "50px", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { type: "spring", damping: 25, stiffness: 200 } },
    exit: { y: "50px", opacity: 0, transition: { duration: 0.2 } },
  };

  const getTitle = () => {
    if(isApiKeyError) return "Chave de API Inválida";
    return "Ocorreu um Erro";
  }

  const getDescription = () => {
    if(isApiKeyError) return "A chave de API do Gemini que você inseriu parece estar incorreta ou expirou. Por favor, verifique e insira uma chave válida na tela de Ajustes.";
    if (isFetchError) return "Houve um problema de conexão com a API. Isso pode ser um problema de CORS ou sua rede pode estar offline. Verifique o console para mais detalhes.";
    return "Uma operação falhou. Verifique sua conexão com a internet ou veja os detalhes técnicos abaixo.";
  }

  return (
    <AnimatePresence>
      {isOpen && error && (
        <motion.div
          {...({ 
            className: "fixed inset-0 z-[200] flex items-center justify-center bg-black/70",
            "aria-labelledby": "error-modal-title",
            role: "alertdialog",
            "aria-modal": "true",
            initial: "hidden",
            animate: "visible",
            exit: "hidden",
            variants: backdropVariants
          } as any)}
        >
          <motion.div
            {...({ 
              className: "relative w-full max-w-lg p-6 bg-[oklch(var(--danger-oklch)_/_0.2)] backdrop-blur-2xl border border-[oklch(var(--danger-oklch)_/_0.3)] rounded-2xl shadow-2xl shadow-black/40 text-red-200",
              role: "document",
              variants: modalVariants,
              initial: "hidden",
              animate: "visible",
              exit: "exit"
            } as any)}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-black/20">
                <Zap className="h-6 w-6 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-4 flex-1">
                <h2 id="error-modal-title" className="text-xl font-bold text-white">{getTitle()}</h2>
                <p className="mt-2 text-sm text-red-100">{getDescription()}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-red-200 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            {!isApiKeyError && (
              <div className="mt-4">
                <pre className="bg-black/30 p-4 rounded-md text-xs whitespace-pre-wrap font-mono text-red-100/80">
                  <code>{error}</code>
                </pre>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button onClick={onClose} variant="secondary">
                Entendi
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};