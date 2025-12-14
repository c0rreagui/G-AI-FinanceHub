import * as fs from 'fs';
import * as path from 'path';

export interface AgentMemory {
    successfulNavigations: string[];
    failedNavigations: string[];
    lastLoginMethod: 'standard' | 'dev_bypass';
    experiencedErrors: string[];
    achievements: string[];
    transactionStats: { success: number; failure: number };
}

export class SwarmMemory {
    private static memoryPath = path.resolve('./tests/swarm-memory.json');

    static getMemory(agentName: string): AgentMemory {
        let memory: Record<string, AgentMemory> = {};
        
        try {
            if (fs.existsSync(this.memoryPath)) {
                const data = fs.readFileSync(this.memoryPath, 'utf-8');
                memory = JSON.parse(data);
            }
        } catch (e) {
            console.warn('⚠️ Falha ao ler memória do enxame:', e);
        }

        if (!memory[agentName]) {
            memory[agentName] = {
                successfulNavigations: [],
                failedNavigations: [],
                lastLoginMethod: 'standard',
                experiencedErrors: [],
                achievements: [],
                transactionStats: { success: 0, failure: 0 }
            };
        }

        return memory[agentName];
    }

    static saveMemory(agentName: string, data: Partial<AgentMemory>) {
        let memory: Record<string, AgentMemory> = {};

        try {
             if (fs.existsSync(this.memoryPath)) {
                const existingData = fs.readFileSync(this.memoryPath, 'utf-8');
                memory = JSON.parse(existingData);
            }
        } catch { /* Ignora erro de leitura inicial */ }

        if (!memory[agentName]) {
             memory[agentName] = {
                successfulNavigations: [],
                failedNavigations: [],
                lastLoginMethod: 'standard',
                experiencedErrors: [],
                achievements: [],
                transactionStats: { success: 0, failure: 0 }
            };
        }

        // Merge deep simples
        memory[agentName] = { ...memory[agentName], ...data };

        try {
            fs.writeFileSync(this.memoryPath, JSON.stringify(memory, null, 2));
        } catch (e) {
            console.error('❌ Falha ao gravar memória:', e);
        }
    }

    static learn(agentName: string, type: 'nav_success' | 'nav_fail' | 'error' | 'achievement' | 'transaction_success' | 'transaction_fail', value: string) {
        const mem = this.getMemory(agentName);
        
        if (type === 'nav_success') {
            if (!mem.successfulNavigations.includes(value)) mem.successfulNavigations.push(value);
        }
        if (type === 'nav_fail') {
             if (!mem.failedNavigations.includes(value)) mem.failedNavigations.push(value);
        }
        if (type === 'error') {
            if (!mem.experiencedErrors.includes(value)) mem.experiencedErrors.push(value);
        }
        if (type === 'achievement') {
             if (!mem.achievements.includes(value)) mem.achievements.push(value);
        }
        if (type === 'transaction_success') mem.transactionStats.success++;
        if (type === 'transaction_fail') mem.transactionStats.failure++;

        this.saveMemory(agentName, mem);
    }
}
