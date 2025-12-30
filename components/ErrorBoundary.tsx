import React, { Component, ErrorInfo, ReactNode } from 'react';
import { telemetry, EventSeverity } from '../services/telemetryService';
import { analyzeError } from '../services/deepErrorAnalyzer';
import { logger } from '../services/loggingService';
import { Button } from './ui/Button';
import { Zap, Copy, RefreshCw, AlertTriangle, Trash2 } from './Icons';
import { useToast } from '../hooks/useToast';

interface ErrorBoundaryAuthProps {
  children: ReactNode;
  showToast: (message: string, options?: { type?: 'success' | 'error' | 'info' }) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundaryInner extends Component<ErrorBoundaryAuthProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  private deepReportRef: any = null; // Armazena deep report

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 🔍 DEEP ANALYSIS - Captura TODOS os detalhes possíveis
    const deepReport = analyzeError(error, 'ErrorBoundary', {
        componentStack: errorInfo.componentStack,
        errorInfo: {
            ...errorInfo,
            digest: (errorInfo as any).digest, // React 18+
        },
        react: {
            errorBoundary: true,
            componentStack: errorInfo.componentStack,
        },
    });
    
    // Armazena para copiar depois
    this.deepReportRef = deepReport;
    
    // Também registra no telemetry básico (para compatibilidade)
    telemetry.trackError(
      error,
      'ErrorBoundary',
      {
        errorId: deepReport.errorId,
        deepAnalysisAvailable: true,
        summary: `Erro em ${deepReport.context.file}:${deepReport.context.line}`,
      },
      EventSeverity.CRITICAL
    );

    // You could also send this to an external error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    this.setState({ errorInfo });
    logger.error('Erro de renderização capturado pelo ErrorBoundary', {
      error: {
        message: error.message,
        stack: error.stack,
      },
      errorInfo,
      deepReportId: deepReport.errorId,
    });
  }

  private handleCopyError = () => {
    const { error, errorInfo } = this.state;
    const errorDetails = `
Error: ${error?.name}: ${error?.message}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Stack Trace:
${error?.stack}
Component Stack:
${errorInfo?.componentStack}
    `.trim();

    navigator.clipboard.writeText(errorDetails).then(() => {
        this.props.showToast('Detalhes do erro copiados', { type: 'success' });
    }).catch(() => {
        this.props.showToast('Falha ao copiar detalhes', { type: 'error' });
    });
  };

  private handleCopyForAI = () => {
    if (!this.deepReportRef) {
        this.props.showToast('Report não disponível', { type: 'error' });
        return;
    }

    // Usa o LLMErrorReporter para gerar relatório completo
    const { LLMErrorReporter } = require('../services/llmErrorReporter');
    const fullReport = LLMErrorReporter.generateLLMReport(this.deepReportRef);

    navigator.clipboard.writeText(fullReport).then(() => {
        this.props.showToast('📋 Relatório completo copiado! Cole no Antigravity/ChatGPT', { type: 'success' });
    }).catch(() => {
        this.props.showToast('Falha ao copiar relatório', { type: 'error' });
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 p-4 font-sans text-zinc-100">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-red-500/20 bg-zinc-900/50 shadow-2xl backdrop-blur-xl">
                {/* Header */}
                <div className="border-b border-red-500/20 bg-red-500/10 p-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 shadow-lg shadow-red-500/10">
                        <AlertTriangle className="h-8 w-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Ops! Algo deu errado</h1>
                    <p className="mt-2 text-zinc-400">
                        Não se preocupe, nosso time já foi notificado. Enquanto isso, tente atualizar a página.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 p-6">
                    <div className="grid grid-cols-2 gap-3">
                        <Button 
                            onClick={() => window.location.reload()} 
                            className="flex items-center justify-center gap-2 bg-white text-zinc-900 hover:bg-zinc-200"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Atualizar Página
                        </Button>
                        <Button 
                            onClick={() => {
                                localStorage.clear();
                                sessionStorage.clear();
                                window.location.reload();
                            }} 
                            className="flex items-center justify-center gap-2 bg-zinc-800 text-red-300 hover:bg-zinc-700 hover:text-red-200 border border-red-900/30"
                        >
                            <Trash2 className="h-4 w-4" />
                            Limpar Cache
                        </Button>
                    </div>
                    
                    <div className="h-px bg-white10 my-2" />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <Button 
                            onClick={this.handleCopyError}
                            className="flex items-center justify-center gap-2 border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        >
                            <Copy className="h-4 w-4" />
                            Copiar Stack Trace
                        </Button>
                        <Button 
                            onClick={this.handleCopyForAI}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 border-0"
                        >
                            <Copy className="h-4 w-4" />
                            📋 Copiar para IA
                        </Button>
                    </div>
                    
                    <p className="text-xs text-center text-zinc-500 mt-2">
                        💡 O botão "Copiar para IA" gera um relatório completo que você pode colar no Antigravity/ChatGPT para resolver automaticamente
                    </p>
                </div>

                {/* Technical Details */}
                <div className="border-t border-zinc-800 bg-zinc-950/50 p-6">
                    <details className="group">
                        <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300">
                            <Zap className="h-4 w-4" />
                            Ver detalhes técnicos
                            <span className="ml-auto text-xs opacity-0 transition-opacity group-hover:opacity-100">Clique para expandir</span>
                        </summary>
                        
                        <div className="mt-4 space-y-4">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-red-400">Erro</h3>
                                <div className="mt-1 rounded-lg border border-red-500/20 bg-red-500/5 p-3 font-mono text-sm text-red-200">
                                    {this.state.error?.toString()}
                                </div>
                            </div>
                            
                            {this.state.error?.stack && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Stack Trace</h3>
                                    <pre className="mt-1 max-h-48 overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-3 font-mono text-xs text-zinc-400 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700">
                                        {this.state.error.stack}
                                    </pre>
                                </div>
                            )}

                            {this.state.errorInfo?.componentStack && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Component Stack</h3>
                                    <pre className="mt-1 max-h-48 overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-3 font-mono text-xs text-zinc-400 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </details>
                </div>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper funcional para usar hook de toast
export const ErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { showToast } = useToast();
    return (
        <ErrorBoundaryInner showToast={showToast}>
            {children}
        </ErrorBoundaryInner>
    );
};
