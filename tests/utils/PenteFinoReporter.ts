import * as fs from 'fs';
import * as path from 'path';

export interface PenteFinoConfig {
    thresholds: {
        minScore: number;
        maxCritical: number;
        maxWarning: number;
    };
    ignore: string[];
    customRules: CustomRule[];
    output: {
        html: boolean;
        json: boolean;
        console: boolean;
    };
}

interface CustomRule {
    name: string;
    selector: string;
    check: 'exists' | 'notExists' | 'minSize' | 'maxCount';
    value?: number;
    severity: 'critical' | 'warning' | 'info';
    message: string;
}

interface HistoricalEntry {
    timestamp: string;
    score: number;
    issues: number;
    viewport: string;
    theme: string;
}

const DEFAULT_CONFIG: PenteFinoConfig = {
    thresholds: { minScore: 70, maxCritical: 0, maxWarning: 10 },
    ignore: ['.blur', '.decorative', '[aria-hidden="true"]'],
    customRules: [],
    output: { html: true, json: true, console: true }
};

/**
 * Módulo de Configuração e Relatórios do Pente Fino
 */
export class PenteFinoReporter {
    private historyFile = 'tests/reports/pente-fino-history.json';
    private config: PenteFinoConfig;

    constructor() {
        this.config = this.loadConfig();
    }

    loadConfig(): PenteFinoConfig {
        const configPath = '.pentetinorc.json';
        if (fs.existsSync(configPath)) {
            try {
                const content = fs.readFileSync(configPath, 'utf-8');
                return { ...DEFAULT_CONFIG, ...JSON.parse(content) };
            } catch {}
        }
        return DEFAULT_CONFIG;
    }

    getConfig(): PenteFinoConfig {
        return this.config;
    }

    saveHistory(entry: Omit<HistoricalEntry, 'timestamp'>) {
        const history = this.loadHistory();
        history.push({ ...entry, timestamp: new Date().toISOString() });
        
        // Keep last 100 entries
        const trimmed = history.slice(-100);
        
        const dir = path.dirname(this.historyFile);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(this.historyFile, JSON.stringify(trimmed, null, 2));
    }

    loadHistory(): HistoricalEntry[] {
        if (fs.existsSync(this.historyFile)) {
            try {
                return JSON.parse(fs.readFileSync(this.historyFile, 'utf-8'));
            } catch {}
        }
        return [];
    }

    generateDiffReport(current: any, previous: any): string {
        if (!previous) return 'Sem histórico anterior para comparação.';
        
        const scoreDiff = current.score - previous.score;
        const issuesDiff = current.issues.length - previous.issues;
        
        let diff = `## 📊 Comparação com Versão Anterior\n\n`;
        diff += `| Métrica | Anterior | Atual | Diff |\n`;
        diff += `|---------|----------|-------|------|\n`;
        diff += `| Score | ${previous.score} | ${current.score} | ${scoreDiff >= 0 ? '+' : ''}${scoreDiff} |\n`;
        diff += `| Issues | ${previous.issues} | ${current.issues.length} | ${issuesDiff >= 0 ? '+' : ''}${issuesDiff} |\n`;
        
        return diff;
    }

    exportJSON(report: any, filepath: string) {
        fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    }

    generateBadge(score: number): string {
        const color = score >= 90 ? 'brightgreen' : score >= 70 ? 'yellow' : score >= 50 ? 'orange' : 'red';
        return `![Pente Fino Score](https://img.shields.io/badge/visual_score-${score}%25-${color})`;
    }

    generateHistoryChart(): string {
        const history = this.loadHistory().slice(-10);
        if (history.length < 2) return '';
        
        let chart = `## 📈 Evolução do Score\n\n`;
        chart += `\`\`\`\n`;
        
        const max = Math.max(...history.map(h => h.score));
        const min = Math.min(...history.map(h => h.score));
        const range = max - min || 1;
        
        history.forEach(h => {
            const bars = Math.round(((h.score - min) / range) * 20) + 1;
            const date = new Date(h.timestamp).toLocaleDateString('pt-BR');
            chart += `${date} | ${'█'.repeat(bars)}${'░'.repeat(21 - bars)} ${h.score}\n`;
        });
        
        chart += `\`\`\`\n`;
        return chart;
    }
}
