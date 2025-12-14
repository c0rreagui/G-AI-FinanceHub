/**
 * Hook para análise profunda de erros em componentes React
 */

import { useEffect, useCallback } from 'react';
import { analyzeError } from '../services/deepErrorAnalyzer';

/**
 * Hook para capturar e analisar erros em try-catch
 */
export const useDeepErrorAnalysis = (componentName: string) => {
    const captureError = useCallback((error: Error, context: string, metadata?: Record<string, any>) => {
        return analyzeError(error, `${componentName}.${context}`, metadata);
    }, [componentName]);

    return { captureError };
};

/**
 * Hook para envolver funções assíncronas com análise de erro
 */
export const useAsyncErrorHandler = <T extends (...args: any[]) => Promise<any>>(
    asyncFn: T,
    context: string
): T => {
    return useCallback((async (...args: any[]) => {
        try {
            return await asyncFn(...args);
        } catch (error) {
            // Captura erro com full context
            analyzeError(
                error instanceof Error ? error : new Error(String(error)),
                context,
                {
                    functionArgs: args.map((arg, i) => ({
                        index: i,
                        type: typeof arg,
                        value: arg?.toString?.() || String(arg),
                    })),
                    asyncOperation: true,
                }
            );
            throw error;
        }
    }) as any, [asyncFn, context]) as T;
};

/**
 * Hook para monitorar efeitos com análise de erro
 */
export const useEffectWithErrorAnalysis = (
    effect: React.EffectCallback,
    deps: React.DependencyList,
    effectName: string
) => {
    useEffect(() => {
        try {
            return effect();
        } catch (error) {
            analyzeError(
                error instanceof Error ? error : new Error(String(error)),
                `useEffect.${effectName}`,
                {
                    dependencies: deps,
                    effectContext: effectName,
                }
            );
            throw error;
        }
    }, deps);
};
