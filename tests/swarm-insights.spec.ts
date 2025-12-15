import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.describe('📊 Enterprise Swarm - Insights Squad', () => {
    let agent: SwarmHelpers;

    test.afterEach(async ({}, testInfo) => {
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

        // Check for Charts OR Empty State
        const emptyState = page.locator('text=Sem Dados para Análise').or(page.locator('text=Nenhum dado neste período'));
        const charts = page.locator('.recharts-responsive-container');

        if (await emptyState.isVisible()) {
            await agent.log('⚠️ Estado vazio detectado. (OK se não houver dados)');
            await expect(emptyState).toBeVisible();
        } else {
            // Wait for charts
            await charts.first().waitFor({ state: 'visible', timeout: 10000 });
            await agent.log('✅ Gráficos carregados.');
            
            // Check Export Button
            const exportBtn = page.getByRole('button', { name: 'Exportar CSV' });
            if (await exportBtn.isEnabled()) {
                // Testing download triggers requires event listener
                const downloadPromise = page.waitForEvent('download');
                await exportBtn.click();
                const download = await downloadPromise;
                await agent.log(`✅ Download iniciado: ${download.suggestedFilename()}`);
            } else {
                 await agent.log('⚠️ Botão Exportar desabilitado (provavelmente sem dados filtrados).');
            }
        }

        await agent.captureEvidence('insights_view');
    });
});
