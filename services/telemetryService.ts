/**
 * Sistema de Telemetria e Observabilidade Completo
 * Monitora e registra TODOS os eventos, ações e mudanças de estado em tempo real
 */

export enum EventCategory {
    USER_ACTION = 'USER_ACTION',
    STATE_CHANGE = 'STATE_CHANGE',
    API_CALL = 'API_CALL',
    NAVIGATION = 'NAVIGATION',
    ERROR = 'ERROR',
    PERFORMANCE = 'PERFORMANCE',
    DATA_MUTATION = 'DATA_MUTATION',
    RENDER = 'RENDER',
    LIFECYCLE = 'LIFECYCLE',
}

export enum EventSeverity {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    CRITICAL = 'CRITICAL',
}

export interface TelemetryEvent {
    id: string;
    timestamp: number;
    category: EventCategory;
    severity: EventSeverity;
    name: string;
    metadata: Record<string, any>;
    tags: string[];
    userId?: string;
    sessionId: string;
    duration?: number;
    stackTrace?: string;
}

export interface PerformanceMetric {
    name: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    metadata?: Record<string, any>;
}

class TelemetryService {
    private events: TelemetryEvent[] = [];
    private sessionId: string;
    private userId?: string;
    private performanceMetrics: Map<string, PerformanceMetric> = new Map();
    private maxEvents = 1000; // Limita eventos em memória
    private listeners: Set<(event: TelemetryEvent) => void> = new Set();

    constructor() {
        this.sessionId = this.generateSessionId();
        this.initializeSessionTracking();
    }

    /**
     * Registra um evento de telemetria
     */
    track(
        category: EventCategory,
        name: string,
        metadata: Record<string, any> = {},
        tags: string[] = [],
        severity: EventSeverity = EventSeverity.INFO
    ): void {
        const event: TelemetryEvent = {
            id: this.generateEventId(),
            timestamp: Date.now(),
            category,
            severity,
            name,
            metadata: {
                ...metadata,
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                },
                url: window.location.href,
            },
            tags,
            userId: this.userId,
            sessionId: this.sessionId,
        };

        // Adiciona stack trace para erros
        if (severity === EventSeverity.ERROR || severity === EventSeverity.CRITICAL) {
            event.stackTrace = new Error().stack;
        }

        this.addEvent(event);
        this.notifyListeners(event);

        // Log no console em desenvolvimento
        const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        if (isDev) {
            this.consoleLog(event);
        }

        // Persiste eventos críticos
        if (severity === EventSeverity.ERROR || severity === EventSeverity.CRITICAL) {
            this.persistEvent(event);
        }
    }

    /**
     * Inicia medição de performance
     */
    startPerformance(name: string, metadata?: Record<string, any>): void {
        const metric: PerformanceMetric = {
            name,
            startTime: performance.now(),
            metadata,
        };
        this.performanceMetrics.set(name, metric);

        this.track(
            EventCategory.PERFORMANCE,
            `${name}_START`,
            { ...metadata },
            ['performance', 'start']
        );
    }

    /**
     * Finaliza medição de performance
     */
    endPerformance(name: string, additionalMetadata?: Record<string, any>): number | null {
        const metric = this.performanceMetrics.get(name);
        if (!metric) {
            console.warn(`Performance metric "${name}" not found`);
            return null;
        }

        metric.endTime = performance.now();
        metric.duration = metric.endTime - metric.startTime;

        this.track(
            EventCategory.PERFORMANCE,
            `${name}_END`,
            {
                ...metric.metadata,
                ...additionalMetadata,
                duration: metric.duration,
            },
            ['performance', 'end'],
            metric.duration > 1000 ? EventSeverity.WARNING : EventSeverity.INFO
        );

        this.performanceMetrics.delete(name);
        return metric.duration;
    }

    /**
     * Rastreia ação do usuário
     */
    trackUserAction(
        action: string,
        target: string,
        metadata: Record<string, any> = {}
    ): void {
        this.track(
            EventCategory.USER_ACTION,
            action,
            { target, ...metadata },
            ['user-action', action.toLowerCase()]
        );
    }

    /**
     * Rastreia mudança de estado
     */
    trackStateChange(
        stateName: string,
        oldValue: any,
        newValue: any,
        metadata: Record<string, any> = {}
    ): void {
        this.track(
            EventCategory.STATE_CHANGE,
            `${stateName}_CHANGED`,
            {
                stateName,
                oldValue: this.sanitizeValue(oldValue),
                newValue: this.sanitizeValue(newValue),
                ...metadata,
            },
            ['state-change', stateName]
        );
    }

    /**
     * Rastreia chamada de API
     */
    trackApiCall(
        endpoint: string,
        method: string,
        status: number,
        duration: number,
        metadata: Record<string, any> = {}
    ): void {
        const severity = status >= 400 ? EventSeverity.ERROR : EventSeverity.INFO;
        
        this.track(
            EventCategory.API_CALL,
            `API_${method}_${endpoint}`,
            {
                endpoint,
                method,
                status,
                duration,
                ...metadata,
            },
            ['api', method.toLowerCase(), `status-${status}`],
            severity
        );
    }

    /**
     * Rastreia navegação
     */
    trackNavigation(from: string, to: string, metadata: Record<string, any> = {}): void {
        this.track(
            EventCategory.NAVIGATION,
            'NAVIGATION',
            { from, to, ...metadata },
            ['navigation', 'route-change']
        );
    }

    /**
     * Rastreia erro
     */
    trackError(
        error: Error,
        context: string,
        metadata: Record<string, any> = {},
        severity: EventSeverity = EventSeverity.ERROR
    ): void {
        this.track(
            EventCategory.ERROR,
            error.name || 'UnknownError',
            {
                message: error.message,
                context,
                stack: error.stack,
                ...metadata,
            },
            ['error', context],
            severity
        );
    }

    /**
     * Rastreia mutação de dados
     */
    trackDataMutation(
        entityType: string,
        operation: 'CREATE' | 'UPDATE' | 'DELETE',
        entityId: string,
        metadata: Record<string, any> = {}
    ): void {
        this.track(
            EventCategory.DATA_MUTATION,
            `${entityType}_${operation}`,
            {
                entityType,
                operation,
                entityId,
                ...metadata,
            },
            ['data-mutation', entityType.toLowerCase(), operation.toLowerCase()]
        );
    }

    /**
     * Rastreia renderização de componente
     */
    trackRender(componentName: string, renderCount: number, metadata: Record<string, any> = {}): void {
        this.track(
            EventCategory.RENDER,
            `${componentName}_RENDER`,
            {
                componentName,
                renderCount,
                ...metadata,
            },
            ['render', componentName.toLowerCase()]
        );
    }

    /**
     * Obtém todos os eventos
     */
    getEvents(filters?: {
        category?: EventCategory;
        severity?: EventSeverity;
        since?: number;
        tags?: string[];
    }): TelemetryEvent[] {
        let filtered = [...this.events];

        if (filters) {
            if (filters.category) {
                filtered = filtered.filter(e => e.category === filters.category);
            }
            if (filters.severity) {
                filtered = filtered.filter(e => e.severity === filters.severity);
            }
            if (filters.since) {
                filtered = filtered.filter(e => e.timestamp >= filters.since);
            }
            if (filters.tags && filters.tags.length > 0) {
                filtered = filtered.filter(e =>
                    filters.tags!.some(tag => e.tags.includes(tag))
                );
            }
        }

        return filtered;
    }

    /**
     * Obtém estatísticas de eventos
     */
    getStatistics(): {
        totalEvents: number;
        byCategory: Record<string, number>;
        bySeverity: Record<string, number>;
        errorRate: number;
        avgPerformance: Record<string, number>;
    } {
        const stats = {
            totalEvents: this.events.length,
            byCategory: {} as Record<string, number>,
            bySeverity: {} as Record<string, number>,
            errorRate: 0,
            avgPerformance: {} as Record<string, number>,
        };

        this.events.forEach(event => {
            stats.byCategory[event.category] = (stats.byCategory[event.category] || 0) + 1;
            stats.bySeverity[event.severity] = (stats.bySeverity[event.severity] || 0) + 1;
        });

        const errorCount = (stats.bySeverity[EventSeverity.ERROR] || 0) + 
                          (stats.bySeverity[EventSeverity.CRITICAL] || 0);
        stats.errorRate = stats.totalEvents > 0 ? (errorCount / stats.totalEvents) * 100 : 0;

        // Calcula performance média
        const perfEvents = this.events.filter(e => 
            e.category === EventCategory.PERFORMANCE && e.duration
        );
        perfEvents.forEach(event => {
            const name = event.name.replace('_END', '');
            if (!stats.avgPerformance[name]) {
                stats.avgPerformance[name] = 0;
            }
            stats.avgPerformance[name] += event.duration!;
        });

        Object.keys(stats.avgPerformance).forEach(name => {
            const count = perfEvents.filter(e => e.name.includes(name)).length;
            stats.avgPerformance[name] = stats.avgPerformance[name] / count;
        });

        return stats;
    }

    /**
     * Subscreve para receber eventos em tempo real
     */
    subscribe(callback: (event: TelemetryEvent) => void): () => void {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    /**
     * Exporta eventos para análise
     */
    exportEvents(): string {
        return JSON.stringify({
            sessionId: this.sessionId,
            userId: this.userId,
            exportedAt: new Date().toISOString(),
            events: this.events,
            statistics: this.getStatistics(),
        }, null, 2);
    }

    /**
     * Limpa eventos antigos
     */
    clearOldEvents(olderThan: number = 3600000): void {
        const cutoff = Date.now() - olderThan;
        this.events = this.events.filter(e => e.timestamp > cutoff);
    }

    /**
     * Define ID do usuário
     */
    setUserId(userId: string): void {
        this.userId = userId;
        this.track(
            EventCategory.LIFECYCLE,
            'USER_IDENTIFIED',
            { userId },
            ['lifecycle', 'user']
        );
    }

    // Métodos privados

    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateEventId(): string {
        return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private addEvent(event: TelemetryEvent): void {
        this.events.unshift(event);
        
        // Limita tamanho do array
        if (this.events.length > this.maxEvents) {
            this.events = this.events.slice(0, this.maxEvents);
        }
    }

    private notifyListeners(event: TelemetryEvent): void {
        this.listeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('Error in telemetry listener:', error);
            }
        });
    }

    private consoleLog(event: TelemetryEvent): void {
        const emoji = this.getSeverityEmoji(event.severity);
        const categoryBadge = `[${event.category}]`;
        
        console.groupCollapsed(`${emoji} ${categoryBadge} ${event.name}`);
        console.log('Timestamp:', new Date(event.timestamp).toISOString());
        console.log('Tags:', event.tags);
        console.log('Metadata:', event.metadata);
        if (event.duration) console.log('Duration:', `${event.duration.toFixed(2)}ms`);
        if (event.stackTrace) console.log('Stack:', event.stackTrace);
        console.groupEnd();
    }

    private getSeverityEmoji(severity: EventSeverity): string {
        switch (severity) {
            case EventSeverity.DEBUG: return '🔍';
            case EventSeverity.INFO: return 'ℹ️';
            case EventSeverity.WARNING: return '⚠️';
            case EventSeverity.ERROR: return '❌';
            case EventSeverity.CRITICAL: return '🚨';
        }
    }

    private sanitizeValue(value: any): any {
        if (value === null || value === undefined) return value;
        if (typeof value !== 'object') return value;
        
        // Evita objetos muito grandes
        try {
            const json = JSON.stringify(value);
            return json.length > 1000 ? `[Object: ${json.length} bytes]` : value;
        } catch {
            return '[Circular or Complex Object]';
        }
    }

    private persistEvent(event: TelemetryEvent): void {
        try {
            const key = `telemetry_error_${event.id}`;
            localStorage.setItem(key, JSON.stringify(event));
            
            // Limpa eventos erro antigos
            const allKeys = Object.keys(localStorage);
            const errorKeys = allKeys.filter(k => k.startsWith('telemetry_error_'));
            if (errorKeys.length > 50) {
                errorKeys.slice(0, errorKeys.length - 50).forEach(k => {
                    localStorage.removeItem(k);
                });
            }
        } catch (error) {
            console.error('Failed to persist telemetry event:', error);
        }
    }

    private initializeSessionTracking(): void {
        // Rastreia lifecycle da sessão
        this.track(
            EventCategory.LIFECYCLE,
            'SESSION_START',
            {
                sessionId: this.sessionId,
                startTime: new Date().toISOString(),
            },
            ['lifecycle', 'session-start']
        );

        // Rastreia saída
        window.addEventListener('beforeunload', () => {
            this.track(
                EventCategory.LIFECYCLE,
                'SESSION_END',
                {
                    sessionId: this.sessionId,
                    duration: Date.now() - this.events[this.events.length - 1]?.timestamp,
                },
                ['lifecycle', 'session-end']
            );
        });

        // Rastreia visibilidade
        document.addEventListener('visibilitychange', () => {
            this.track(
                EventCategory.LIFECYCLE,
                document.hidden ? 'TAB_HIDDEN' : 'TAB_VISIBLE',
                { visibility: document.visibilityState },
                ['lifecycle', 'visibility']
            );
        });
    }
}

// Singleton instance
export const telemetry = new TelemetryService();

// Export para uso global
if (typeof window !== 'undefined') {
    (window as any).__TELEMETRY__ = telemetry;
}
