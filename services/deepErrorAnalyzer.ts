/**
 * Deep Error Analysis System
 * Captura TODOS os detalhes possíveis sobre erros para análise forense completa
 */

import { telemetry, EventCategory, EventSeverity } from './telemetryService';

interface ErrorContext {
    // Timeline: últimos eventos antes do erro
    recentEvents: any[];
    
    // Estado do browser
    browserState: {
        memory?: {
            jsHeapSizeLimit: number;
            totalJSHeapSize: number;
            usedJSHeapSize: number;
        };
        connection: {
            effectiveType?: string;
            downlink?: number;
            rtt?: number;
            saveData?: boolean;
        };
        viewport: {
            width: number;
            height: number;
            devicePixelRatio: number;
        };
        performance: {
            timeOrigin: number;
            now: number;
            navigation?: any;
        };
    };
    
    // Estado da aplicação
    appState: {
        currentRoute: string;
        previousRoute?: string;
        sessionDuration: number;
        userInteractions: number;
    };
    
    // Recursos carregados
    loadedResources: {
        scripts: number;
        stylesheets: number;
        images: number;
        fonts: number;
    };
    
    // Console logs recentes
    recentConsoleActivity: {
        errors: string[];
        warnings: string[];
        logs: string[];
    };
}

interface DeepErrorReport {
    // Identificação do erro
    errorId: string;
    timestamp: number;
    
    // Erro original
    error: {
        name: string;
        message: string;
        stack?: string;
        cause?: any;
    };
    
    // Contexto onde ocorreu
    context: {
        component?: string;
        function?: string;
        file?: string;
        line?: number;
        column?: number;
    };
    
    // Timeline: o que aconteceu ANTES
    timeline: {
        last10Events: any[];
        last10StateChanges: any[];
        last10UserActions: any[];
        lastApiCalls: any[];
    };
    
    // Estado atual vs anterior
    stateSnapshot: {
        before?: any;
        after?: any;
        diff?: any;
    };
    
    // Trigger: por que foi acionado
    trigger: {
        directCause: string;
        userAction?: string;
        apiFailure?: string;
        stateChange?: string;
        eventSequence: string[];
    };
    
    // Contexto completo
    fullContext: ErrorContext;
    
    // Informações adicionais
    metadata: {
        sessionId: string;
        userId?: string;
        userAgent: string;
        platform: string;
        language: string;
        timeZone: string;
        onlineStatus: boolean;
    };
}

class DeepErrorAnalyzer {
    private consoleHistory: {
        errors: string[];
        warnings: string[];
        logs: string[];
    } = {
        errors: [],
        warnings: [],
        logs: [],
    };
    
    private originalConsole = {
        error: console.error,
        warn: console.warn,
        log: console.log,
    };
    
    private maxHistoryLength = 50;
    
    constructor() {
        this.interceptConsole();
        this.monitorResources();
    }
    
    /**
     * Intercepta console para capturar histórico
     */
    private interceptConsole(): void {
        const self = this;
        
        console.error = function(...args: any[]) {
            self.consoleHistory.errors.push(args.map(a => String(a)).join(' '));
            if (self.consoleHistory.errors.length > self.maxHistoryLength) {
                self.consoleHistory.errors.shift();
            }
            self.originalConsole.error.apply(console, args);
        };
        
        console.warn = function(...args: any[]) {
            self.consoleHistory.warnings.push(args.map(a => String(a)).join(' '));
            if (self.consoleHistory.warnings.length > self.maxHistoryLength) {
                self.consoleHistory.warnings.shift();
            }
            self.originalConsole.warn.apply(console, args);
        };
        
        console.log = function(...args: any[]) {
            self.consoleHistory.logs.push(args.map(a => String(a)).join(' '));
            if (self.consoleHistory.logs.length > self.maxHistoryLength) {
                self.consoleHistory.logs.shift();
            }
            self.originalConsole.log.apply(console, args);
        };
    }
    
    /**
     * Monitora recursos carregados
     */
    private monitorResources(): void {
        // Performance Observer para rastrear recursos
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    // Podemos rastrear recursos em tempo real aqui
                });
                observer.observe({ entryTypes: ['resource', 'navigation'] });
            } catch (e) {
                // Alguns browsers não suportam
            }
        }
    }
    
    /**
     * Captura estado completo do browser
     */
    private captureBrowserState(): ErrorContext['browserState'] {
        const state: any = {
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio || 1,
            },
            performance: {
                timeOrigin: performance.timeOrigin,
                now: performance.now(),
            },
            connection: {},
        };
        
        // Memory (Chrome only)
        if ('memory' in performance) {
            state.memory = {
                jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
                totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
                usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            };
        }
        
        // Network information
        if ('connection' in navigator) {
            const conn = (navigator as any).connection;
            state.connection = {
                effectiveType: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData,
            };
        }
        
        // Navigation timing
        if (performance.getEntriesByType) {
            const navTiming = performance.getEntriesByType('navigation')[0];
            if (navTiming) {
                state.performance.navigation = navTiming.toJSON();
            }
        }
        
        return state;
    }
    
    /**
     * Conta recursos carregados
     */
    private countLoadedResources(): ErrorContext['loadedResources'] {
        const resources = performance.getEntriesByType('resource');
        
        return {
            scripts: resources.filter(r => r.name.endsWith('.js')).length,
            stylesheets: resources.filter(r => r.name.endsWith('.css')).length,
            images: resources.filter(r => 
                r.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
            ).length,
            fonts: resources.filter(r => 
                r.name.match(/\.(woff|woff2|ttf|otf)$/i)
            ).length,
        };
    }
    
    /**
     * Extrai informações do stack trace
     */
    private parseStackTrace(stack?: string): any {
        if (!stack) return null;
        
        const lines = stack.split('\n');
        const parsed = lines.slice(1).map(line => {
            // Parse typical stack trace line
            const match = line.match(/at (.+?) \((.+?):(\d+):(\d+)\)/) ||
                         line.match(/(.+?)@(.+?):(\d+):(\d+)/);
            
            if (match) {
                return {
                    function: match[1].trim(),
                    file: match[2],
                    line: parseInt(match[3]),
                    column: parseInt(match[4]),
                };
            }
            return { raw: line.trim() };
        });
        
        return {
            origin: parsed[0],
            callChain: parsed,
        };
    }
    
    /**
     * Identifica o trigger/gatilho do erro
     */
    private identifyTrigger(recentEvents: any[]): DeepErrorReport['trigger'] {
        const lastUserAction = recentEvents
            .filter(e => e.category === EventCategory.USER_ACTION)
            .slice(-1)[0];
        
        const lastApiCall = recentEvents
            .filter(e => e.category === EventCategory.API_CALL)
            .slice(-1)[0];
        
        const lastStateChange = recentEvents
            .filter(e => e.category === EventCategory.STATE_CHANGE)
            .slice(-1)[0];
        
        // Constrói sequência de eventos que levaram ao erro
        const eventSequence = recentEvents
            .slice(-5)
            .map(e => `${e.category}: ${e.name}`);
        
        return {
            directCause: recentEvents[recentEvents.length - 1]?.name || 'Unknown',
            userAction: lastUserAction?.name,
            apiFailure: lastApiCall?.metadata?.status >= 400 ? lastApiCall.name : undefined,
            stateChange: lastStateChange?.name,
            eventSequence,
        };
    }
    
    /**
     * Analisa erro profundamente e gera relatório completo
     */
    public analyzeError(
        error: Error,
        context: string,
        additionalMetadata?: Record<string, any>
    ): DeepErrorReport {
        // Captura todos os eventos recentes
        const allRecentEvents = telemetry.getEvents({
            since: Date.now() - 60000, // Último minuto
        });
        
        const last10Events = allRecentEvents.slice(-10);
        const last10UserActions = telemetry.getEvents({
            category: EventCategory.USER_ACTION,
        }).slice(-10);
        const last10StateChanges = telemetry.getEvents({
            category: EventCategory.STATE_CHANGE,
        }).slice(-10);
        const lastApiCalls = telemetry.getEvents({
            category: EventCategory.API_CALL,
        }).slice(-5);
        
        // Parse stack trace
        const stackInfo = this.parseStackTrace(error.stack);
        
        // Monta relatório completo
        const report: DeepErrorReport = {
            errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
                cause: (error as any).cause,
            },
            
            context: {
                component: context,
                function: stackInfo?.origin?.function,
                file: stackInfo?.origin?.file,
                line: stackInfo?.origin?.line,
                column: stackInfo?.origin?.column,
            },
            
            timeline: {
                last10Events,
                last10StateChanges,
                last10UserActions,
                lastApiCalls,
            },
            
            stateSnapshot: {
                // Poderia capturar estado redux/zustand aqui
                before: null,
                after: null,
                diff: null,
            },
            
            trigger: this.identifyTrigger(allRecentEvents),
            
            fullContext: {
                recentEvents: allRecentEvents,
                browserState: this.captureBrowserState(),
                appState: {
                    currentRoute: window.location.pathname,
                    previousRoute: document.referrer,
                    sessionDuration: performance.now(),
                    userInteractions: last10UserActions.length,
                },
                loadedResources: this.countLoadedResources(),
                recentConsoleActivity: {
                    errors: [...this.consoleHistory.errors].slice(-10),
                    warnings: [...this.consoleHistory.warnings].slice(-10),
                    logs: [...this.consoleHistory.logs].slice(-10),
                },
            },
            
            metadata: {
                sessionId: telemetry['sessionId'], // Access private field
                userId: telemetry['userId'],
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                onlineStatus: navigator.onLine,
                ...additionalMetadata,
            },
        };
        
        // Log detalhado no console
        this.logDetailedReport(report);
        
        // Registra no telemetry com relatório completo
        telemetry.track(
            EventCategory.ERROR,
            `DEEP_ERROR_${error.name}`,
            {
                errorId: report.errorId,
                report: report,
                summary: this.generateSummary(report),
            },
            ['deep-error', 'forensic', context.toLowerCase()],
            EventSeverity.CRITICAL
        );
        
        return report;
    }
    
    /**
     * Gera resumo legível do erro
     */
    private generateSummary(report: DeepErrorReport): string {
        return `
ERRO CRÍTICO DETECTADO
======================

🔴 Erro: ${report.error.name}
📝 Mensagem: ${report.error.message}
📍 Contexto: ${report.context.component}
⏰ Timestamp: ${new Date(report.timestamp).toISOString()}

🎯 TRIGGER (O QUE CAUSOU):
- Causa Direta: ${report.trigger.directCause}
${report.trigger.userAction ? `- Ação do Usuário: ${report.trigger.userAction}` : ''}
${report.trigger.apiFailure ? `- Falha de API: ${report.trigger.apiFailure}` : ''}
${report.trigger.stateChange ? `- Mudança de Estado: ${report.trigger.stateChange}` : ''}

📜 SEQUÊNCIA DE EVENTOS:
${report.trigger.eventSequence.map((e, i) => `  ${i + 1}. ${e}`).join('\n')}

💾 ESTADO DO BROWSER:
- Memória Usada: ${report.fullContext.browserState.memory?.usedJSHeapSize 
    ? (report.fullContext.browserState.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB' 
    : 'N/A'}
- Conexão: ${report.fullContext.browserState.connection.effectiveType || 'N/A'}
- Viewport: ${report.fullContext.browserState.viewport.width}x${report.fullContext.browserState.viewport.height}

🎬 ÚLTIMAS AÇÕES DO USUÁRIO:
${report.timeline.last10UserActions.slice(-3).map(a => `  - ${a.name}`).join('\n') || '  (nenhuma)'}

📞 ÚLTIMAS CHAMADAS DE API:
${report.timeline.lastApiCalls.map(a => `  - ${a.name} [${a.metadata?.status || '?'}]`).join('\n') || '  (nenhuma)'}

📊 ATIVIDADE RECENTE DO CONSOLE:
- Erros: ${report.fullContext.recentConsoleActivity.errors.length}
- Warnings: ${report.fullContext.recentConsoleActivity.warnings.length}

🔗 Error ID: ${report.errorId}
`.trim();
    }
    
    /**
     * Log detalhado formatado no console
     */
    private logDetailedReport(report: DeepErrorReport): void {
        console.groupCollapsed(
            `%c🚨 DEEP ERROR ANALYSIS: ${report.error.name}`,
            'color: #ff0000; font-weight: bold; font-size: 14px;'
        );
        
        console.log('%c📋 Relatório Completo:', 'font-weight: bold;');
        console.table({
            'Error ID': report.errorId,
            'Tipo': report.error.name,
            'Mensagem': report.error.message,
            'Componente': report.context.component,
            'Arquivo': report.context.file,
            'Linha': report.context.line,
        });
        
        console.log('%c🎯 Trigger Analysis:', 'font-weight: bold; color: #ff9800;');
        console.log(report.trigger);
        
        console.log('%c📜 Event Timeline:', 'font-weight: bold; color: #2196f3;');
        console.table(report.timeline.last10Events.map(e => ({
            Category: e.category,
            Name: e.name,
            Time: new Date(e.timestamp).toLocaleTimeString(),
        })));
        
        console.log('%c💾 Browser State:', 'font-weight: bold; color: #4caf50;');
        console.log(report.fullContext.browserState);
        
        console.log('%c📊 Console History:', 'font-weight: bold; color: #9c27b0;');
        console.log('Errors:', report.fullContext.recentConsoleActivity.errors);
        console.log('Warnings:', report.fullContext.recentConsoleActivity.warnings);
        
        console.log('%c🔗 Full Report:', 'font-weight: bold;');
        console.log(report);
        
        // 🤖 LLM-READY REPORT
        console.log(
            '%c📋 COPY FOR AI ASSISTANT:%c\n' + this.generateLLMReport(report),
            'font-weight: bold; font-size: 16px; color: #00ff00; background: #000; padding: 4px;',
            'font-family: monospace; white-space: pre-wrap;'
        );
        
        console.groupEnd();
    }
    
    /**
     * Gera relatório formatado para LLM
     */
    private generateLLMReport(report: DeepErrorReport): string {
        return `
🐛 ERROR FOR AI: ${report.error.name}

Message: ${report.error.message}
File: ${report.context.file}:${report.context.line}
Trigger: ${report.trigger.directCause}
Last Action: ${report.trigger.userAction || 'None'}

Stack:
${report.error.stack?.split('\n').slice(0, 8).join('\n')}

Event Sequence:
${report.trigger.eventSequence.map((e, i) => `${i + 1}. ${e}`).join('\n')}

Copy this and paste into ChatGPT/Claude with: "Fix this React/TypeScript error"
Error ID: ${report.errorId}
        `.trim();
    }
}

// Singleton instance
export const deepErrorAnalyzer = new DeepErrorAnalyzer();

// Função helper para uso fácil
export const analyzeError = (error: Error, context: string, metadata?: Record<string, any>) => {
    return deepErrorAnalyzer.analyzeError(error, context, metadata);
};
