/**
 * Sistema de Rastreamento de Fluxo de Processos e Dependências
 * Mapeia toda a cadeia de execução de processos para debugging avançado
 */

export interface ProcessFlow {
    id: string;
    name: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    parentId?: string; // Processo pai (dependência)
    children: string[]; // Processos filhos
    status: 'running' | 'success' | 'error' | 'cancelled';
    error?: Error;
    metadata: Record<string, any>;
    tags: string[];
    depth: number; // Profundidade na árvore
}

export interface ProcessTree {
    root: ProcessFlow;
    allProcesses: Map<string, ProcessFlow>;
    maxDepth: number;
    totalDuration: number;
}

class ProcessFlowTracker {
    private processes: Map<string, ProcessFlow> = new Map();
    private activeProcesses: Set<string> = new Set();
    private processHistory: ProcessFlow[] = [];
    private maxHistory = 200;
    
    // Stack para rastrear contexto atual
    private contextStack: string[] = [];

    /**
     * Inicia um novo processo
     */
    startProcess(
        name: string,
        metadata: Record<string, any> = {},
        tags: string[] = []
    ): string {
        const id = this.generateProcessId();
        const parentId = this.getCurrentContext();
        
        const process: ProcessFlow = {
            id,
            name,
            startTime: performance.now(),
            parentId,
            children: [],
            status: 'running',
            metadata: {
                ...metadata,
                timestamp: Date.now(),
                url: typeof window !== 'undefined' ? window.location.href : '',
            },
            tags: [...tags, name.toLowerCase()],
            depth: parentId ? (this.processes.get(parentId)?.depth ?? 0) + 1 : 0,
        };

        this.processes.set(id, process);
        this.activeProcesses.add(id);
        
        // Adiciona como filho do processo pai
        if (parentId) {
            const parent = this.processes.get(parentId);
            if (parent) {
                parent.children.push(id);
            }
        }

        // Adiciona ao contexto
        this.contextStack.push(id);

        console.log(`🔄 [ProcessFlow] START: ${name} (ID: ${id}, Depth: ${process.depth})`);
        
        return id;
    }

    /**
     * Finaliza um processo
     */
    endProcess(processId: string, error?: Error): void {
        const process = this.processes.get(processId);
        if (!process) {
            console.warn(`Process ${processId} not found`);
            return;
        }

        process.endTime = performance.now();
        process.duration = process.endTime - process.startTime;
        process.status = error ? 'error' : 'success';
        
        if (error) {
            process.error = error;
        }

        this.activeProcesses.delete(processId);
        
        // Remove do contexto
        const index = this.contextStack.indexOf(processId);
        if (index !== -1) {
            this.contextStack.splice(index, 1);
        }

        // Adiciona ao histórico
        this.processHistory.unshift(process);
        if (this.processHistory.length > this.maxHistory) {
            this.processHistory = this.processHistory.slice(0, this.maxHistory);
        }

        const statusIcon = error ? '❌' : '✅';
        console.log(
            `${statusIcon} [ProcessFlow] END: ${process.name} ` +
            `(Duration: ${process.duration.toFixed(2)}ms, Status: ${process.status})`
        );
    }

    /**
     * Cancela um processo
     */
    cancelProcess(processId: string, reason?: string): void {
        const process = this.processes.get(processId);
        if (!process) return;

        process.endTime = performance.now();
        process.duration = process.endTime - process.startTime;
        process.status = 'cancelled';
        process.metadata.cancelReason = reason;
        
        this.activeProcesses.delete(processId);
        
        console.log(`🚫 [ProcessFlow] CANCELLED: ${process.name} (Reason: ${reason})`);
    }

    /**
     * Obtém contexto atual (processo pai)
     */
    private getCurrentContext(): string | undefined {
        return this.contextStack[this.contextStack.length - 1];
    }

    /**
     * Gera ID único para processo
     */
    private generateProcessId(): string {
        return `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Constrói árvore de processos a partir de um processo raiz
     */
    buildProcessTree(rootId: string): ProcessTree | null {
        const root = this.processes.get(rootId);
        if (!root) return null;

        const allProcesses = new Map<string, ProcessFlow>();
        let maxDepth = 0;
        let totalDuration = 0;

        const traverse = (processId: string) => {
            const process = this.processes.get(processId);
            if (!process) return;

            allProcesses.set(processId, process);
            maxDepth = Math.max(maxDepth, process.depth);
            totalDuration += process.duration || 0;

            process.children.forEach(childId => traverse(childId));
        };

        traverse(rootId);

        return {
            root,
            allProcesses,
            maxDepth,
            totalDuration,
        };
    }

    /**
     * Obtém todos os processos ativos
     */
    getActiveProcesses(): ProcessFlow[] {
        return Array.from(this.activeProcesses)
            .map(id => this.processes.get(id))
            .filter((p): p is ProcessFlow => p !== undefined);
    }

    /**
     * Obtém histórico de processos
     */
    getProcessHistory(limit: number = 50): ProcessFlow[] {
        return this.processHistory.slice(0, limit);
    }

    /**
     * Obtém fluxo de processos que levaram a um erro
     */
    getErrorFlowChain(): ProcessFlow[] {
        // Encontra processos com erro
        const errorProcesses = this.processHistory.filter(p => p.status === 'error');
        if (errorProcesses.length === 0) return [];

        // Pega o erro mais recente
        const latestError = errorProcesses[0];
        
        // Constrói cadeia de processos até a raiz
        const chain: ProcessFlow[] = [];
        let current: ProcessFlow | undefined = latestError;
        
        while (current) {
            chain.unshift(current);
            current = current.parentId ? this.processes.get(current.parentId) : undefined;
        }

        return chain;
    }

    /**
     * Gera visualização em texto da árvore de processos
     */
    visualizeProcessTree(rootId: string): string {
        const tree = this.buildProcessTree(rootId);
        if (!tree) return 'Process not found';

        const lines: string[] = [];
        
        const traverse = (processId: string, prefix: string = '', isLast: boolean = true) => {
            const process = tree.allProcesses.get(processId);
            if (!process) return;

            const statusIcon = 
                process.status === 'running' ? '🔄' :
                process.status === 'success' ? '✅' :
                process.status === 'error' ? '❌' : '🚫';
            
            const durationStr = process.duration ? ` (${process.duration.toFixed(2)}ms)` : ' (running)';
            const connector = isLast ? '└── ' : '├── ';
            
            lines.push(`${prefix}${connector}${statusIcon} ${process.name}${durationStr}`);
            
            const childPrefix = prefix + (isLast ? '    ' : '│   ');
            process.children.forEach((childId, index) => {
                const isLastChild = index === process.children.length - 1;
                traverse(childId, childPrefix, isLastChild);
            });
        };

        traverse(rootId);
        return lines.join('\n');
    }

    /**
     * Gera resumo de fluxo para LLM
     */
    generateFlowSummary(limit: number = 20): string {
        const recentProcesses = this.getProcessHistory(limit);
        if (recentProcesses.length === 0) return 'No process history';

        const lines: string[] = ['Recent Process Flow:'];
        
        recentProcesses.forEach((process, index) => {
            const indent = '  '.repeat(process.depth);
            const statusIcon = 
                process.status === 'success' ? '✅' :
                process.status === 'error' ? '❌' :
                process.status === 'cancelled' ? '🚫' : '🔄';
            
            const duration = process.duration ? `${process.duration.toFixed(0)}ms` : 'running';
            lines.push(
                `${index + 1}. ${indent}${statusIcon} ${process.name} (${duration})`
            );
            
            if (process.error) {
                lines.push(`${indent}   Error: ${process.error.message}`);
            }
        });

        return lines.join('\n');
    }

    /**
     * Exporta dados para análise
     */
    exportData(): {
        activeProcesses: ProcessFlow[];
        history: ProcessFlow[];
        stats: {
            totalProcesses: number;
            activeCount: number;
            errorCount: number;
            avgDuration: number;
        };
    } {
        const history = this.getProcessHistory(100);
        const errorCount = history.filter(p => p.status === 'error').length;
        const completedProcesses = history.filter(p => p.duration !== undefined);
        const avgDuration = completedProcesses.length > 0
            ? completedProcesses.reduce((sum, p) => sum + (p.duration || 0), 0) / completedProcesses.length
            : 0;

        return {
            activeProcesses: this.getActiveProcesses(),
            history,
            stats: {
                totalProcesses: this.processes.size,
                activeCount: this.activeProcesses.size,
                errorCount,
                avgDuration,
            },
        };
    }

    /**
     * Limpa dados antigos
     */
    cleanup(olderThan: number = 300000): void {
        const cutoff = Date.now() - olderThan;
        
        // Limpa processos antigos que não estão mais ativos
        this.processes.forEach((process, id) => {
            if (!this.activeProcesses.has(id) && process.metadata.timestamp < cutoff) {
                this.processes.delete(id);
            }
        });

        console.log('🧹 [ProcessFlow] Cleanup completed');
    }

    /**
     * Reseta todos os dados
     */
    reset(): void {
        this.processes.clear();
        this.activeProcesses.clear();
        this.processHistory = [];
        this.contextStack = [];
        console.log('🔄 [ProcessFlow] Reset completed');
    }
}

// Singleton instance
export const processFlowTracker = new ProcessFlowTracker();

// Helper functions
export const startProcess = (name: string, metadata?: Record<string, any>, tags?: string[]) => 
    processFlowTracker.startProcess(name, metadata, tags);

export const endProcess = (id: string, error?: Error) => 
    processFlowTracker.endProcess(id, error);

export const cancelProcess = (id: string, reason?: string) => 
    processFlowTracker.cancelProcess(id, reason);

// Decorator para auto-tracking de funções
export function trackProcess(processName?: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;
        const name = processName || `${target.constructor.name}.${propertyKey}`;

        descriptor.value = async function (...args: any[]) {
            const processId = startProcess(name, { args });
            try {
                const result = await originalMethod.apply(this, args);
                endProcess(processId);
                return result;
            } catch (error) {
                endProcess(processId, error as Error);
                throw error;
            }
        };

        return descriptor;
    };
}

// Export global para debugging
if (typeof window !== 'undefined') {
    (window as any).__PROCESS_FLOW__ = processFlowTracker;
    console.log('🔄 Process Flow Tracker: ACTIVE');
}
