import { useEffect, useRef, useCallback } from 'react';
import { telemetry, EventCategory, EventSeverity } from '../services/telemetryService';

/**
 * Hook para rastreamento de ações do usuário
 */
export const useUserActionTracking = () => {
    const trackAction = useCallback((action: string, target: string, metadata?: Record<string, any>) => {
        telemetry.trackUserAction(action, target, metadata);
    }, []);

    return { trackAction };
};

/**
 * Hook para rastreamento de renderizações de componente
 */
export const useRenderTracking = (componentName: string) => {
    const renderCount = useRef(0);

    useEffect(() => {
        renderCount.current += 1;
        telemetry.trackRender(componentName, renderCount.current);
    });

    return renderCount.current;
};

/**
 * Hook para rastreamento de performance de componente
 */
export const usePerformanceTracking = (componentName: string) => {
    useEffect(() => {
        const perfId = `COMPONENT_${componentName}`;
        telemetry.startPerformance(perfId, { componentName });

        return () => {
            telemetry.endPerformance(perfId);
        };
    }, [componentName]);
};

/**
 * Hook para rastreamento de mudanças de estado
 */
export const useStateTracking = <T,>(stateName: string, value: T) => {
    const previousValue = useRef<T>(value);

    useEffect(() => {
        if (previousValue.current !== value) {
            telemetry.trackStateChange(stateName, previousValue.current, value);
            previousValue.current = value;
        }
    }, [stateName, value]);
};

/**
 * Hook para rastreamento de lifecycle do componente
 */
export const useLifecycleTracking = (componentName: string) => {
    useEffect(() => {
        telemetry.track(
            EventCategory.LIFECYCLE,
            `${componentName}_MOUNT`,
            { componentName },
            ['lifecycle', 'mount', componentName.toLowerCase()]
        );

        return () => {
            telemetry.track(
                EventCategory.LIFECYCLE,
                `${componentName}_UNMOUNT`,
                { componentName },
                ['lifecycle', 'unmount', componentName.toLowerCase()]
            );
        };
    }, [componentName]);
};

/**
 * Hook para rastreamento de efeitos colaterais
 */
export const useEffectTracking = (effectName: string, dependencies: any[]) => {
    const runCount = useRef(0);

    useEffect(() => {
        runCount.current += 1;
        telemetry.track(
            EventCategory.LIFECYCLE,
            `EFFECT_${effectName}`,
            {
                effectName,
                runCount: runCount.current,
                dependencies: dependencies.map((d, i) => ({
                    index: i,
                    value: typeof d,
                })),
            },
            ['lifecycle', 'effect', effectName.toLowerCase()]
        );
    }, dependencies);
};

/**
 * Hook para rastreamento de chamadas de API com auto-tracking
 */
export const useApiTracking = () => {
    const trackApi = useCallback(async <T,>(
        endpoint: string,
        method: string,
        apiCall: () => Promise<T>,
        metadata?: Record<string, any>
    ): Promise<T> => {
        const perfId = `API_${method}_${endpoint}`;
        telemetry.startPerformance(perfId, { endpoint, method, ...metadata });

        try {
            const result = await apiCall();
            const duration = telemetry.endPerformance(perfId) || 0;
            
            telemetry.trackApiCall(endpoint, method, 200, duration, {
                success: true,
                ...metadata,
            });

            return result;
        } catch (error) {
            const duration = telemetry.endPerformance(perfId) || 0;
            
            telemetry.trackApiCall(endpoint, method, 500, duration, {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                ...metadata,
            });

            telemetry.trackError(
                error instanceof Error ? error : new Error(String(error)),
                `API_${method}_${endpoint}`,
                metadata,
                EventSeverity.ERROR
            );

            throw error;
        }
    }, []);

    return { trackApi };
};

/**
 * Hook para rastreamento de formulários
 */
export const useFormTracking = (formName: string) => {
    const trackFormStart = useCallback(() => {
        telemetry.trackUserAction('FORM_START', formName, { formName });
    }, [formName]);

    const trackFormSubmit = useCallback((success: boolean, metadata?: Record<string, any>) => {
        telemetry.trackUserAction(
            success ? 'FORM_SUBMIT_SUCCESS' : 'FORM_SUBMIT_ERROR',
            formName,
            { formName, success, ...metadata }
        );
    }, [formName]);

    const trackFieldChange = useCallback((fieldName: string, value: any) => {
        telemetry.trackUserAction('FORM_FIELD_CHANGE', `${formName}.${fieldName}`, {
            formName,
            fieldName,
            valueType: typeof value,
        });
    }, [formName]);

    return {
        trackFormStart,
        trackFormSubmit,
        trackFieldChange,
    };
};

/**
 * Hook para rastreamento de navegação
 */
export const useNavigationTracking = () => {
    const previousRoute = useRef<string>(globalThis.location.pathname);

    useEffect(() => {
        const handleRouteChange = () => {
            const newRoute = globalThis.location.pathname;
            if (previousRoute.current !== newRoute) {
                telemetry.trackNavigation(previousRoute.current, newRoute, {
                    hash: globalThis.location.hash,
                    search: globalThis.location.search,
                });
                previousRoute.current = newRoute;
            }
        };

        globalThis.addEventListener('popstate', handleRouteChange);
        globalThis.addEventListener('pushstate', handleRouteChange);
        globalThis.addEventListener('replacestate', handleRouteChange);

        return () => {
            globalThis.removeEventListener('popstate', handleRouteChange);
            globalThis.removeEventListener('pushstate', handleRouteChange);
            globalThis.removeEventListener('replacestate', handleRouteChange);
        };
    }, []);
};

/**
 * Hook para rastreamento de mutações de dados
 */
export const useDataMutationTracking = () => {
    const trackCreate = useCallback((entityType: string, entityId: string, metadata?: Record<string, any>) => {
        telemetry.trackDataMutation(entityType, 'CREATE', entityId, metadata);
    }, []);

    const trackUpdate = useCallback((entityType: string, entityId: string, metadata?: Record<string, any>) => {
        telemetry.trackDataMutation(entityType, 'UPDATE', entityId, metadata);
    }, []);

    const trackDelete = useCallback((entityType: string, entityId: string, metadata?: Record<string, any>) => {
        telemetry.trackDataMutation(entityType, 'DELETE', entityId, metadata);
    }, []);

    return {
        trackCreate,
        trackUpdate,
        trackDelete,
    };
};

/**
 * Hook para subscrição a eventos de telemetria em tempo real
 */
export const useTelemetrySubscription = (
    callback: (event: any) => void,
    filters?: {
        category?: EventCategory;
        severity?: EventSeverity;
        tags?: string[];
    }
) => {
    useEffect(() => {
        const unsubscribe = telemetry.subscribe((event) => {
            // Aplica filtros
            if (filters) {
                if (filters.category && event.category !== filters.category) return;
                if (filters.severity && event.severity !== filters.severity) return;
                if (filters.tags && !filters.tags.some(tag => event.tags.includes(tag))) return;
            }
            
            callback(event);
        });

        return unsubscribe;
    }, [callback, filters]);
};
