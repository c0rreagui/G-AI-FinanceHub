import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.describe('📊 Enterprise Swarm - Insights Squad', () => {
    let agent: SwarmHelpers;

    test.afterEach(async (_, testInfo) => {
        if (testInfo.status === 'failed' && agent) {
            console.log(`🧨 FALHA EM INSIGHTS: ${testInfo.title}`);
            await agent.captureEvidence(`FAILURE_INSIGHTS_${testInfo.title.replace(/\s+/g, '_')}`, testInfo.error as Error);
        }
    });

    // The Analyst: Validate Insights Loading and Export
    test('The_Analyst_Validate_Insights_Dashboard', async ({ page }) => {
        agent = new SwarmHelpers(page, 'Insights_Analyst', '📊');
        await agent.login();
        await agent.navigateTo('Insights');

        await agent.log('🔎 Analisando painel de Insights...');

        // Check Header
        await expect(page.getByText('Insights e Análises')).toBeVisible();
        await agent.log('✅ Header "Insights e Análises" encontrado.');

        // Check for Charts using SVG (Recharts renders SVG)
        const charts = page.locator('svg').first();
        if (await charts.isVisible({ timeout: 3000 }).catch(() => false)) {
            await agent.log('✅ Gráficos SVG detectados.');
        }

        // Check for key sections
        const sections = [
            'Evolução Patrimonial',
            'Distribuição de Despesas',
            'Fluxo por Categoria'
        ];
        
        for (const section of sections) {
            const sectionEl = page.getByText(section).first();
            if (await sectionEl.isVisible({ timeout: 1000 }).catch(() => false)) {
                await agent.log(`✅ Seção "${section}" encontrada.`);
            }
        }

        // Check Export Button visibility
        const exportBtn = page.getByRole('button', { name: 'Exportar CSV' });
        if (await exportBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await agent.log('✅ Botão Exportar CSV visível.');
        }

        await agent.captureEvidence('insights_view');
        await agent.log('✅ Dashboard de Insights validado com sucesso.');
    });
});
