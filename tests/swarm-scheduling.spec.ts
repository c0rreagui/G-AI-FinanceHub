import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.describe('📅 Enterprise Swarm - Scheduling Squad', () => {
    let agent: SwarmHelpers;

    test.afterEach(async ({}, testInfo) => {
        if (testInfo.status === 'failed' && agent) {
            console.log(`🧨 FALHA EM SCHEDULING: ${testInfo.title}`);
            await agent.captureEvidence(`FAILURE_SCHEDULING_${testInfo.title.replace(/\s+/g, '_')}`, testInfo.error as Error);
        }
    });

    // The Organizer: Create Recurring Schedule
    test('The_Organizer_Create_Recurring_Schedule', async ({ page }) => {
        agent = new SwarmHelpers(page, 'Scheduling_Organizer', '🗓️');
        await agent.login();
        await agent.navigateTo('Agenda');

        // Check Add Button
        const addBtn = page.getByRole('button', { name: 'Novo Agendamento' }).first();
        const iconBtn = page.locator('button:has(svg.lucide-plus-circle)');
        await agent.safeClick(addBtn.or(iconBtn).first());

        // Modal Open
        await expect(page.locator('[role="dialog"] h2')).toContainText('Novo Agendamento');
        await agent.log('📝 Formulário de Agendamento aberto.');

        // Fill Form
        // We can use IDs because the code has them! Great DX.
        await agent.fillSmartInput('Descrição', 'Aluguel Base Swarm');
        await agent.fillSmartInput('Valor (R$)', '2500.00');

        // Date: Tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateString = tomorrow.toISOString().split('T')[0];
        await agent.fillSmartInput('Data de Início', dateString);

        // Frequency: Mensal
        // Use direct ID selection for robustness as it is a native select with ID
        await page.selectOption('#sch-frequency', 'MENSAL');

        // Category needs special handling (CategoryPicker is a Grid of buttons)
        await agent.log('🔽 Selecionando Categoria...');
        
        // Use data-testid for most reliable selection
        const categoryButton = page.locator('[data-testid^="category-button-"]').first();
        
        if (await categoryButton.isVisible({ timeout: 3000 })) {
            await agent.log('🖱️ Botão de categoria encontrado via data-testid.');
            await categoryButton.scrollIntoViewIfNeeded();
            
            // Try multiple click methods
            await categoryButton.click({ force: true });
            await page.waitForTimeout(200);
            
            // Verify selection and retry if needed
            let debugContent = await page.getByTestId('debug-category-id').textContent().catch(() => null);
            
            if (!debugContent || debugContent.startsWith('null')) {
                await agent.log('⚠️ Primeira tentativa falhou. Tentando dblclick...');
                await categoryButton.dblclick({ force: true });
                await page.waitForTimeout(200);
                debugContent = await page.getByTestId('debug-category-id').textContent().catch(() => null);
            }
            
            if (!debugContent || debugContent.startsWith('null')) {
                await agent.log('⚠️ Segunda tentativa falhou. Tentando JS click...');
                await categoryButton.evaluate(el => (el as HTMLButtonElement).click());
                await page.waitForTimeout(200);
                debugContent = await page.getByTestId('debug-category-id').textContent().catch(() => null);
            }
            
            if (debugContent && !debugContent.startsWith('null')) {
                await agent.log(`✅ Categoria selecionada: ${debugContent.split('|')[0].trim()}`);
            } else {
                await agent.log(`❌ CategoryId ainda null após múltiplas tentativas.`);
            }
        } else {
            await agent.log('❌ Nenhum botão de categoria encontrado.');
        }

        // Slight pause for state update
        await page.waitForTimeout(300);

        // Save
        await agent.safeClick(page.getByRole('button', { name: 'Salvar Agendamento' }));

        // Verify
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();
        await expect(page.getByText('Aluguel Base Swarm')).toBeVisible();
        await agent.log('✅ Agendamento criado com sucesso.');

        await agent.captureEvidence('scheduling_created');
    });

    // Optional: Filter test or Calendar View test
});
