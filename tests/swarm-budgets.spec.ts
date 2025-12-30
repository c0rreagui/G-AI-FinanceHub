import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.describe('💰 Enterprise Swarm - Budgets Squad', () => {
    let agent: SwarmHelpers;

    test.afterEach(async (_, testInfo) => {
        if (testInfo.status === 'failed' && agent) {
            console.log(`🧨 FALHA EM BUDGETS: ${testInfo.title}`);
            await agent.captureEvidence(`FAILURE_BUDGETS_${testInfo.title.replace(/\s+/g, '_')}`, testInfo.error as Error);
        }
    });

    // 📅 The Planner: Create Budget
    test('📅 The Planner (Create Budget)', async ({ page }) => {
        agent = new SwarmHelpers(page, 'Budget_Planner', '📅'); // Planner emoji
        await agent.login();
        await agent.navigateTo('Orçamentos');

        // Check empty state or existing list
        const emptyState = page.locator('text=Sem orçamentos definidos');
        const addBtn = page.getByRole('button', { name: 'Novo Orçamento' });

        if (await emptyState.isVisible()) {
            await agent.log('📉 Nenhum orçamento encontrado. Criando o primeiro...');
        } else {
            await agent.log('📈 Lista de orçamentos já existe. Adicionando mais um...');
        }

        // Create Budget
        await agent.safeClick(addBtn);
        
        // Modal Interaction
        await expect(page.locator('[role="dialog"]')).toBeVisible();
        await agent.log('📝 Modal de orçamento aberto.');

        // Select Category & Amount
        // Assuming implementation uses Select for category
        await agent.selectOption('Selecione uma categoria', 0); // Seleciona a primeira disponível
        await agent.fillSmartInput('Limite Mensal', '1500.00');

        await agent.safeClick(page.getByRole('button', { name: 'Salvar Orçamento' }));

        // Verify Success
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();
        await agent.log('✅ Orçamento criado com sucesso.');
        
        await agent.captureEvidence('budget_created');
    });

    // 👔 The CFO: Audit & Edit
    test('👔 The CFO (Audit & Edit)', async ({ page }) => {
        agent = new SwarmHelpers(page, 'Budget_CFO', '👔');
        await agent.login();
        await agent.navigateTo('Orçamentos');
        
        // Wait for cards
        const budgetCard = page.locator('.space-y-6 .grid > div').first();
        await expect(budgetCard).toBeVisible({ timeout: 10000 });
        
        const categoryName = await budgetCard.locator('.font-semibold').textContent();
        await agent.log(`🧐 Auditando orçamento de: ${categoryName}`);

        // Click Edit
        const editBtn = budgetCard.locator('button:has-text("Edit"), button svg.lucide-edit-2').first();
        // Fallback for icon button without text
        const cards = page.locator('.space-y-6 .grid > div');
        const firstCard = cards.first();
        const editBtnFallback = firstCard.locator('button').first(); // Adjust selector if needed

        await agent.safeClick(editBtn.or(editBtnFallback));
        
        // Edit Amount
        await expect(page.getByText('Editar Orçamento')).toBeVisible();
        await agent.fillSmartInput('Limite Mensal', '2000.00');
        await agent.safeClick(page.getByRole('button', { name: 'Salvar Orçamento' }));

        await agent.log('✅ Orçamento auditado e ajustado.');
        await agent.captureEvidence('budget_edited');
    });
});
