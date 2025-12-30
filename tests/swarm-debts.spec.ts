import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.describe('📉 Enterprise Swarm - Debts Squad', () => {
    let agent: SwarmHelpers;

    test.afterEach(async ({}, testInfo) => {
        if (testInfo.status === 'failed' && agent) {
            console.log(`🧨 FALHA EM DEBTS: ${testInfo.title}`);
            await agent.captureEvidence(`FAILURE_DEBTS_${testInfo.title.replace(/\s+/g, '_')}`, testInfo.error as Error);
        }
    });

    // 📉 The Debtor: Add Debt
    test('📉 The Debtor (Add Debt Flow)', async ({ page }) => {
        agent = new SwarmHelpers(page, 'Debt_Debtor', '📉');
        await agent.login();
        await agent.navigateTo('Dívidas');

        // Check Button
        // Usually "Nova Dívida" or just a general add button (if EmptyState)
        // Adjust selector based on DebtsView (which we haven't read yet, but assuming similar pattern)
        // If DebtsView is like GoalsView, it might have a "Nova Dívida" button.
        
        // Wait for page load
        await page.waitForLoadState('networkidle');

        const addBtn = page.getByRole('button', { name: 'Nova Dívida' }).first();
        const iconBtn = page.locator('button:has(svg.lucide-plus), button:has(svg.lucide-plus-circle)');
        
        await agent.safeClick(addBtn.or(iconBtn).first());

        // Modal Open
        // Fix for Strict Mode: target the dialog title specifically
        await expect(page.locator('[role="dialog"] h2')).toContainText('Nova Dívida');
        await agent.log('📝 Formulário de Dívida aberto.');

        // Fill Form
        await agent.fillSmartInput('Nome da Dívida', 'Cartão de Crédito Master');
        await agent.fillSmartInput('Valor Total (R$)', '5000.00');
        await agent.fillSmartInput('Taxa de Juros (% a.a.)', '14.5');
        // Category optional

        await agent.safeClick(page.getByRole('button', { name: 'Salvar Dívida' }));

        // Check for chained modal (Payment)
        // Code proactively opens 'add-payment-to-debt'
        // Wait for potential Payment Dialog
        try {
            const paymentModal = page.locator('[role="dialog"] h2', { hasText: 'Realizar Pagamento' });
            await expect(paymentModal).toBeVisible({ timeout: 5000 });
            await agent.log('💸 Modal de Pagamento Inicial detectado.');
            
            // Close it to verify the list
            const closeBtn = page.locator('[role="dialog"] button[aria-label="Fechar"], [role="dialog"] button:has(svg.lucide-x)');
            // Fallback: click Cancel or X
            if (await closeBtn.isVisible()) {
                await closeBtn.click();
            } else {
                 await page.keyboard.press('Escape');
            }
        } catch (e) {
            await agent.log('ℹ️ Modal de pagamento não apareceu automaticamente (ok).');
        }
        
        // Now check list availability
        await page.waitForTimeout(500); // Wait for modal animation
        
        // Use specific locator for list item to avoid Modal Title collision
        // Assuming list items are in a grid or list
         const debtCard = page.locator('.grid > div, li').filter({ hasText: 'Cartão de Crédito Master' }).first();
        await expect(debtCard).toBeVisible();
        await agent.log('✅ Dívida criada e visível na lista.');
        
        await agent.captureEvidence('debt_created');
    });
});
