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
        await agent.log('🔽 Selecionando Categoria (Grid)...');
        
        // Wait specifically for the picker container
        const picker = page.locator('.grid.grid-cols-3'); 
        await picker.waitFor({ state: 'visible', timeout: 5000 }).catch(() => agent.log('⚠️ Grid category picker não visível.'));

        // Try to click the first button found inside the picker
        const catButtons = picker.locator('button');
        const count = await catButtons.count();
        if (count > 0) {
            await catButtons.first().click();
            await agent.log(`✅ Categoria 1/${count} selecionada via clique direto.`);
        } else {
            await agent.log('❌ Nenhum botão de categoria encontrado no grid.');
            // Fallback: Try identifying by text if grid class changed
            await page.getByText('Alimentação').first().click().catch(() => {});
        }

        // Slight pause for state update
        await page.waitForTimeout(500);

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
