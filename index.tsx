import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { logger } from './services/loggingService';
import './styles/globals.css';

// Manipulador global para exceções não capturadas
window.onerror = (message, source, lineno, colno, error) => {
  let errorDetails: any = error;
  if (error instanceof Error) {
    errorDetails = {
      message: error.message,
      stack: error.stack,
    };
  }

  logger.error('Exceção não capturada (window.onerror)', {
    message,
    source,
    lineno,
    colno,
    error: errorDetails,
  });
  // Retornar false para não suprimir o log de erro padrão do navegador
  return false;
};

// Manipulador global para promessas rejeitadas não tratadas
window.onunhandledrejection = (event: PromiseRejectionEvent) => {
  let reasonDetails: any = event.reason;
  if (event.reason instanceof Error) {
    reasonDetails = {
      message: event.reason.message,
      stack: event.reason.stack,
    };
  }

  logger.error('Rejeição de promessa não tratada (window.onunhandledrejection)', {
    reason: reasonDetails,
  });
};


const rootElement = document.getElementById('root');
if (!rootElement) {
  logger.error("Elemento root não encontrado no DOM.", {
      component: 'index.tsx',
      elementId: 'root',
  });
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
