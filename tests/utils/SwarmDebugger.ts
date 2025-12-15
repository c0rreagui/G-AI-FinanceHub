import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface ActionLog {
    type: 'click' | 'fill' | 'navigate' | 'check' | 'select';
    target: string;
    value?: string;
    description: string;
    timestamp: number;
}

export class SwarmDebugger {
    private actions: ActionLog[] = [];
    private consoleLogs: string[] = [];
    private networkErrors: string[] = [];
    private page: Page;
    private agentName: string;

    constructor(page: Page, agentName: string) {
        this.page = page;
        this.agentName = agentName;
        this.setupListeners();
    }

    private setupListeners() {
        // Capture Console Logs
        this.page.on('console', msg => {
            const type = msg.type();
            if (type === 'error' || type === 'warning') {
                this.consoleLogs.push(`[CONSOLE ${type.toUpperCase()}] ${msg.text()}`);
            }
        });

        // Capture Network Errors (5xx & 4xx)
        this.page.on('response', response => {
            if (response.status() >= 400) {
                this.networkErrors.push(`[NETWORK ERROR] ${response.status()} ${response.url()}`);
            }
        });
    }

    /**
     * Registra uma ação realizada pelo bot para futura reprodução.
     */
    logAction(type: ActionLog['type'], target: string, description: string, value?: string) {
        this.actions.push({
            type,
            target,
            value,
            description,
            timestamp: Date.now()
        });
    }

    /**
     * Gera um arquivo .spec.ts isolado que reproduz os passos exatos até a falha.
     */
    async generateReproScript(error: Error): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `repro-${this.agentName}-${timestamp}.spec.ts`;
        const filepath = path.join(process.cwd(), 'tests', 'repros', filename);

        const stepsCode = this.actions.map(action => {
            // Clean Selector: Remove "locator('" and "')" wrapper if present
            let target = action.target;
            if (target.startsWith("locator('") && target.endsWith("')")) {
                target = target.slice(9, -2);
            }
            if (target.startsWith("Locator@")) {
                 target = target.replace("Locator@", "");
            }

            switch (action.type) {
                case 'navigate':
                    // Se parece uma URL, usa goto, senão tenta clicar num link com esse texto
                    if (action.value?.startsWith('/') || action.value?.startsWith('http')) {
                         return `    // ${action.description}\n    await page.goto('${action.value}');`;
                    }
                    return `    // ${action.description}\n    await page.click('text=${action.value}');`;
                case 'click':
                    return `    // ${action.description}\n    await page.click('${target}');`;
                case 'fill':
                    return `    // ${action.description}\n    await page.fill('${target}', '${action.value}');`;
                case 'select':
                     return `    // ${action.description}\n    await page.selectOption('${target}', '${action.value}');`;
                default:
                    return `    // ${action.description}`;
            }
        }).join('\n\n');

        const fileContent = `
import { test, expect } from '@playwright/test';

// 🐛 AUTO-GENERATED REPRO SCRIPT
// Agent: ${this.agentName}
// Error: ${error.message}
// Generated at: ${new Date().toISOString()}

test('Reproduce Bug - ${this.agentName}', async ({ page }) => {
    // 1. Initial State
    await page.goto('/');

${stepsCode}

    // 🛑 The test failed here originally.
    // Assert expectation manually.
});
`;
        
        // Ensure directory exists
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filepath, fileContent);
        return filename;
    }

    /**
     * Retorna o "Black Box" contendo logs e erros de rede.
     */
    getBlackBoxDump(): string {
        return [
            '--- BLACK BOX DUMP ---',
            '>>> Console Logs:',
            ...this.consoleLogs,
            '',
            '>>> Network Errors:',
            ...this.networkErrors,
            '',
            '>>> Action History:',
            ...this.actions.map(a => `[${new Date(a.timestamp).toISOString()}] ${a.type.toUpperCase()}: ${a.description}`)
        ].join('\n');
    }
}
