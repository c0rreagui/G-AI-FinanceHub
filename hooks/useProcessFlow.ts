import { useEffect, useRef, useCallback } from 'react';
import { startProcess, endProcess, cancelProcess, processFlowTracker } from '../services/processFlowTracker';

/**
 * Hook para rastrear um processo durante o lifecycle de um componente
 */
export function useProcessFlow(
    processName: string,
    metadata?: Record<string, any>,
    dependencies: any[] = []
) {
    const processIdRef = useRef<string | null>(null);

    useEffect(() => {
        // Inicia processo
        processIdRef.current = startProcess(processName, metadata);

        // Cleanup: finaliza processo quando componente desmonta
        return () => {
            if (processIdRef.current) {
                endProcess(processIdRef.current);
            }
        };
    }, dependencies);

    return processIdRef.current;
}

/**
 * Hook para rastrear processos assíncronos
 */
export function useAsyncProcess() {
    const trackAsync = useCallback(async <T,>(
        processName: string,
        fn: () => Promise<T>,
        metadata?: Record<string, any>
    ): Promise<T> => {
        const processId = startProcess(processName, metadata);
        try {
            const result = await fn();
            endProcess(processId);
            return result;
        } catch (error) {
            endProcess(processId, error as Error);
            throw error;
        }
    }, []);

    const trackAsyncWithCancel = useCallback(<T,>(
        processName: string,
        fn: (signal: AbortSignal) => Promise<T>,
        metadata?: Record<string, any>
    ) => {
        const abortController = new AbortController();
        const processId = startProcess(processName, {
            ...metadata,
            cancellable: true
        });

        const promise = (async () => {
            try {
                const result = await fn(abortController.signal);
                endProcess(processId);
                return result;
            } catch (error) {
                if (abortController.signal.aborted) {
                    cancelProcess(processId, 'User cancelled');
                } else {
                    endProcess(processId, error as Error);
                }
                throw error;
            }
        })();

        return {
            promise,
            cancel: (reason?: string) => {
                abortController.abort();
                cancelProcess(processId, reason);
            },
        };
    }, []);

    return { trackAsync, trackAsyncWithCancel };
}

/**
 * Hook para agrupar múltiplos processos
 */
export function useProcessGroup(groupName: string) {
    const processes = useRef<string[]>([]);

    const startSubProcess = useCallback((name: string, metadata?: Record<string, any>) => {
        const processId = startProcess(`${groupName}:${name}`, metadata);
        processes.current.push(processId);
        return processId;
    }, [groupName]);

    const endAll = useCallback((error?: Error) => {
        processes.current.forEach(id => endProcess(id, error));
        processes.current = [];
    }, []);

    useEffect(() => {
        // Cleanup: finaliza todos os processos quando desmonta
        return () => {
            endAll();
        };
    }, [endAll]);

    return { startSubProcess, endAll };
}

/**
 * Hook para obter dados de processo flow
 */
export function useProcessFlowData() {
    const getActiveProcesses = useCallback(() => {
        return processFlowTracker.getActiveProcesses();
    }, []);

    const getProcessHistory = useCallback((limit?: number) => {
        return processFlowTracker.getProcessHistory(limit);
    }, []);

    const getErrorFlowChain = useCallback(() => {
        return processFlowTracker.getErrorFlowChain();
    }, []);

    const exportData = useCallback(() => {
        return processFlowTracker.exportData();
    }, []);

    return {
        getActiveProcesses,
        getProcessHistory,
        getErrorFlowChain,
        exportData,
    };
}

/**
 * Hook para auto-tracking de efeitos
 */
export function useEffectWithProcess(
    effect: () => void | (() => void),
    deps: React.DependencyList,
    processName: string
) {
    useEffect(() => {
        const processId = startProcess(processName);
        
        try {
            const cleanup = effect();
            endProcess(processId);
            
            return () => {
                if (cleanup) cleanup();
            };
        } catch (error) {
            endProcess(processId, error as Error);
            throw error;
        }
    }, deps);
}

/**
 * Wrapper para funções com auto-tracking
 */
export function withProcessTracking<T extends (...args: any[]) => any>(
    fn: T,
    processName?: string
): T {
    return ((...args: any[]) => {
        const name = processName || fn.name || 'anonymous';
        const processId = startProcess(name, { args });
        
        try {
            const result = fn(...args);
            
            // Se retornar Promise, aguarda
            if (result instanceof Promise) {
                return result
                    .then(value => {
                        endProcess(processId);
                        return value;
                    })
                    .catch(error => {
                        endProcess(processId, error);
                        throw error;
                    });
            }
            
            endProcess(processId);
            return result;
        } catch (error) {
            endProcess(processId, error as Error);
            throw error;
        }
    }) as T;
}
