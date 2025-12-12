/**
 * LLM-Friendly Error Report Generator
 * Gera relatórios formatados para serem colados em LLMs (ChatGPT, Claude, etc)
 */

import { DeepErrorReport } from './deepErrorAnalyzer';

export class LLMErrorReporter {
    /**
     * Gera relatório formatado para LLM
     */
    static generateLLMReport(report: DeepErrorReport): string {
        return `
# 🐛 Bug Report for AI Debugging

## Error Information

**Error Type**: ${report.error.name}  
**Error Message**: ${report.error.message}  
**Error ID**: ${report.errorId}  
**Timestamp**: ${new Date(report.timestamp).toISOString()}

## Context

**Component**: ${report.context.component}  
**File**: ${report.context.file || 'Unknown'}  
**Line**: ${report.context.line || 'Unknown'}  
**Column**: ${report.context.column || 'Unknown'}

## Stack Trace

\`\`\`
${report.error.stack || 'No stack trace available'}
\`\`\`

## What Triggered This Error

**Direct Cause**: ${report.trigger.directCause}  
${report.trigger.userAction ? `**Last User Action**: ${report.trigger.userAction}` : ''}  
${report.trigger.apiFailure ? `**API Failure**: ${report.trigger.apiFailure}` : ''}  
${report.trigger.stateChange ? `**State Change**: ${report.trigger.stateChange}` : ''}

**Event Sequence (what led to the error)**:
${report.trigger.eventSequence.map((e, i) => `${i + 1}. ${e}`).join('\n')}

## Timeline: Last 10 Events Before Error

${report.timeline.last10Events.map((e, i) => `
### Event ${i + 1}
- **Category**: ${e.category}
- **Name**: ${e.name}
- **Time**: ${new Date(e.timestamp).toLocaleString()}
- **Tags**: ${e.tags.join(', ')}
`).join('\n')}

## Last User Actions

${report.timeline.last10UserActions.length > 0 
    ? report.timeline.last10UserActions.map(a => `- ${a.name} at ${new Date(a.timestamp).toLocaleTimeString()}`).join('\n')
    : 'No user actions recorded'}

## Last API Calls

${report.timeline.lastApiCalls.length > 0
    ? report.timeline.lastApiCalls.map(a => `
- **${a.name}**
  - Status: ${a.metadata?.status || 'Unknown'}
  - Duration: ${a.metadata?.duration ? `${a.metadata.duration.toFixed(2)}ms` : 'Unknown'}
  - Time: ${new Date(a.timestamp).toLocaleTimeString()}
`).join('\n')
    : 'No API calls recorded'}

## Browser State

**Memory**:
${report.fullContext.browserState.memory 
    ? `- Used: ${(report.fullContext.browserState.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB
- Total: ${(report.fullContext.browserState.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB
- Limit: ${(report.fullContext.browserState.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
    : 'Memory info not available'}

**Network**:
${report.fullContext.browserState.connection.effectiveType 
    ? `- Connection Type: ${report.fullContext.browserState.connection.effectiveType}
- Downlink: ${report.fullContext.browserState.connection.downlink} Mbps
- RTT: ${report.fullContext.browserState.connection.rtt} ms`
    : 'Network info not available'}

**Viewport**: ${report.fullContext.browserState.viewport.width}x${report.fullContext.browserState.viewport.height}

## Application State

- **Current Route**: ${report.fullContext.appState.currentRoute}
- **Previous Route**: ${report.fullContext.appState.previousRoute || 'Unknown'}
- **Session Duration**: ${(report.fullContext.appState.sessionDuration / 1000).toFixed(1)}s

## 🔄 Process Flow & Dependencies

${report.processFlow.errorFlowChain.length > 0 
    ? `**Error Flow Chain** (${report.processFlow.errorFlowChain.length} processes):
\`\`\`
${report.processFlow.errorFlowChain.map((p, i) => 
    `${'  '.repeat(p.depth)}${i + 1}. ${p.status === 'error' ? '❌' : '🔄'} ${p.name} (${p.duration ? p.duration.toFixed(0) + 'ms' : 'running'})`
).join('\n')}
\`\`\`
${report.processFlow.errorFlowChain.find(p => p.error) 
    ? `\n**Failed Process**: ${report.processFlow.errorFlowChain.find(p => p.error)?.name}\n**Error**: ${report.processFlow.errorFlowChain.find(p => p.error)?.error?.message}`
    : ''}`
    : 'No error flow chain available'}

**Process Flow Visualization**:
\`\`\`
${report.processFlow.flowVisualization}
\`\`\`

**Process Statistics**:
- Total Processes: ${report.processFlow.stats.totalProcesses}
- Errors: ${report.processFlow.stats.errorCount}
- Avg Duration: ${report.processFlow.stats.avgDuration.toFixed(2)}ms
- Active Now: ${report.processFlow.activeProcesses.length}

${report.processFlow.activeProcesses.length > 0 
    ? `**Still Running**:\n${report.processFlow.activeProcesses.map(p => `- ${p.name} (${(Date.now() - p.startTime).toFixed(0)}ms)`).join('\n')}`
    : ''}

## Recent Console Activity

**Console Errors**:
${report.fullContext.recentConsoleActivity.errors.length > 0
    ? '```\n' + report.fullContext.recentConsoleActivity.errors.slice(-5).join('\n') + '\n```'
    : 'No console errors'}

**Console Warnings**:
${report.fullContext.recentConsoleActivity.warnings.length > 0
    ? '```\n' + report.fullContext.recentConsoleActivity.warnings.slice(-5).join('\n') + '\n```'
    : 'No console warnings'}

## Environment

- **User Agent**: ${report.metadata.userAgent}
- **Platform**: ${report.metadata.platform}
- **Language**: ${report.metadata.language}
- **Timezone**: ${report.metadata.timeZone}
- **Online Status**: ${report.metadata.onlineStatus ? 'Online' : 'Offline'}

## Tech Stack Context

**Framework**: React + TypeScript  
**State Management**: React Context + Hooks  
**Database**: Supabase  
**Build Tool**: Vite  
**Styling**: TailwindCSS

## Question for AI

Please analyze this error and provide:

1. **Root Cause**: What exactly caused this error?
2. **Fix**: Specific code changes needed (with file paths and line numbers)
3. **Prevention**: How to prevent this error in the future
4. **Related Issues**: Any other potential issues in related code

${report.metadata.sessionId ? `\n**Session ID**: ${report.metadata.sessionId}` : ''}
${report.metadata.userId ? `**User ID**: ${report.metadata.userId}` : ''}

---

*This report was automatically generated by Deep Error Analyzer*
*Copy this entire message and paste it into ChatGPT, Claude, or any AI assistant*
`.trim();
    }

    /**
     * Copia relatório para clipboard
     */
    static async copyToClipboard(report: DeepErrorReport): Promise<boolean> {
        const formattedReport = this.generateLLMReport(report);
        
        try {
            await navigator.clipboard.writeText(formattedReport);
            return true;
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            return false;
        }
    }

    /**
     * Download relatório como arquivo .md
     */
    static downloadAsMarkdown(report: DeepErrorReport): void {
        const formattedReport = this.generateLLMReport(report);
        const blob = new Blob([formattedReport], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-report-${report.errorId}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Gera template compacto para quick debugging
     */
    static generateQuickReport(report: DeepErrorReport): string {
        return `
**Error**: ${report.error.name}: ${report.error.message}
**File**: ${report.context.file}:${report.context.line}
**Trigger**: ${report.trigger.directCause}
**Last Action**: ${report.trigger.userAction || 'None'}

Stack:
\`\`\`
${report.error.stack?.split('\n').slice(0, 5).join('\n')}
\`\`\`

Fix this error in the React/TypeScript codebase.
`.trim();
    }
}

/**
 * Hook para copiar erro para AI
 */
export const useCopyErrorForAI = () => {
    const copyForAI = async (errorReport: DeepErrorReport, format: 'full' | 'quick' = 'full') => {
        if (format === 'quick') {
            const quickReport = LLMErrorReporter.generateQuickReport(errorReport);
            await navigator.clipboard.writeText(quickReport);
        } else {
            await LLMErrorReporter.copyToClipboard(errorReport);
        }
    };

    const downloadForAI = (errorReport: DeepErrorReport) => {
        LLMErrorReporter.downloadAsMarkdown(errorReport);
    };

    return { copyForAI, downloadForAI };
};
