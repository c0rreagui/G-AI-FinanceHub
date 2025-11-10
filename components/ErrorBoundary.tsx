// components/ErrorBoundary.tsx
import React from 'react';
import { logger } from '../services/loggingService';
import { Button } from './ui/Button';
import { Zap } from './Icons';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  // FIX: The original code used a property initializer for state, which might cause issues with `this` context in some environments. Reverting to a classic constructor ensures `this.props` and `this.state` are correctly initialized and accessible, resolving the render error.
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Erro de renderização capturado pelo ErrorBoundary', {
      error: {
        message: error.message,
        stack: error.stack,
      },
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-oklch-background p-4 text-center">
            <div className="bg-black/30 border border-red-500/30 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40 p-8 max-w-lg">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-red-500/20 mx-auto">
                    <Zap className="h-6 w-6 text-red-400" aria-hidden="true" />
                </div>
                <h1 className="mt-4 text-2xl font-bold text-white">Ops! Algo deu errado.</h1>
                <p className="mt-2 text-red-200">
                    Nossa equipe foi notificada. Por favor, atualize a página e tente novamente.
                </p>
                <details className="mt-4 text-left bg-black/20 p-2 rounded-md">
                    <summary className="cursor-pointer text-sm text-gray-400">Detalhes do Erro</summary>
                    <pre className="mt-2 text-xs text-red-300 whitespace-pre-wrap font-mono">
                        {this.state.error?.toString()}
                        {this.state.error?.stack}
                    </pre>
                </details>
                <Button onClick={() => window.location.reload()} className="mt-6">
                    Atualizar Página
                </Button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}