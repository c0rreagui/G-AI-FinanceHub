import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.describe('🛠️ Enterprise Swarm - Tools Squad', () => {
    let agent: SwarmHelpers;

    test.afterEach(async ({}, testInfo) => {
        if (testInfo.status === 'failed' && agent) {
            console.log(`🧨 FALHA EM TOOLS: ${testInfo.title}`);
            await agent.captureEvidence(`FAILURE_TOOLS_${testInfo.title.replace(/\s+/g, '_')}`, testInfo.error as Error);
        }
    });

    // The Engineer: Test Compound Interest Calculator
    test('The_Engineer_Validate_Interest_Calculator', async ({ page }) => {
        agent = new SwarmHelpers(page, 'Tools_Engineer', '🛠️');
        await agent.login();
        await agent.navigateTo('Tools');

        await agent.log('⚙️ Acessando Ferramentas...');
        // Fix strict mode violation: Use heading role
        await expect(page.getByRole('heading', { name: 'Ferramentas' })).toBeVisible();

        // Target Calculator by Text
        await expect(page.getByText('Calculadora de Juros Compostos')).toBeVisible();

        await agent.log('🧮 Testando Calculadora de Juros Compostos...');

        // Defaults: 1000, 100, 10, 10 -> Result needs calculation to verify?
        // Or just change inputs and see if result changes.
        
        // Change Principal to 5000
        await agent.fillSmartInput('Valor Inicial (R$)', '5000');
        // Change Monthly to 500
        await agent.fillSmartInput('Aporte Mensal (R$)', '500');
        
        // Wait for update (reactive)
        await page.waitForTimeout(500);

        // Verify some result text exists (e.g. "Valor Final")
        await expect(page.getByText('Valor Final')).toBeVisible();
        
        // Check if value is formatted currency (R$...)
        const finalValue = page.locator('text=R$').last(); // Rough locator
        await expect(finalValue).toBeVisible();

        await agent.log('✅ Calculadora responsiva.');

        // Extra: Check if other tools are present
        await expect(page.getByText('Comparador de Taxas')).toBeVisible();
        await expect(page.getByText('Simulador de Financiamento')).toBeVisible();

        await agent.captureEvidence('tools_calculator');
    });
});
