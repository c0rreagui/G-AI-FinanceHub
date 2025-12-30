import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.describe('🎯 Enterprise Swarm - Goals Squad', () => {
    let agent: SwarmHelpers;

    test.afterEach(async (_, testInfo) => {
        if (testInfo.status === 'failed' && agent) {
            console.log(`🧨 FALHA EM GOALS: ${testInfo.title}`);
            await agent.captureEvidence(`FAILURE_GOALS_${testInfo.title.replace(/\s+/g, '_')}`, testInfo.error as Error);
        }
    });

    // 📅 The Planner: Create Standard Goal
    test('📅 The Planner (Create Smart Goal)', async ({ page }) => {
        agent = new SwarmHelpers(page, 'Goal_Planner', '📅'); 
        await agent.login();
        await agent.navigateTo('Metas');

        // Check if there are existing goals or empty state
        const createBtn = page.getByRole('button', { name: 'Nova Meta' }).first();
        // Adjust for potentially hidden button on mobile/desktop variants
        const visibleCreateBtn = createBtn.or(page.locator('button:has(svg.lucide-plus-circle)'));

        await agent.safeClick(visibleCreateBtn);

        // Wizard Interaction
        await expect(page.locator('[role="dialog"]')).toBeVisible();
        await agent.log('📝 Smart Wizard aberto.');

        // Step 1: Goal Type (Click "Outro" or generic if smart logic is complex)
        // Trying to find a generic option to simplify test
        // Wizard usually has "Comprar algo", "Viajar", "Reserva", "Outro"
        const outroBtn = page.locator('button:has-text("Outro")');
        if (await outroBtn.isVisible()) {
            await agent.safeClick(outroBtn);
        } else {
            // Fallback: Click the first available option card
            await agent.safeClick(page.locator('.grid > button').first());
        }

        // Wait for next step (Wizard transition)
        await page.waitForTimeout(500);

        // Step 2: Details
        // Fields: "Nome da Meta", "Quanto você quer juntar?", "Para quando?"
        await agent.fillSmartInput('Nome da Meta', 'Fundo de Emergência Swarm');
        await agent.fillSmartInput('Quanto você quer juntar?', '10000.00');
        
        // Date Input handling
        // Playwright fill usually works for date inputs with YYYY-MM-DD
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        const dateString = futureDate.toISOString().split('T')[0];
        
        await agent.fillSmartInput('Para quando?', dateString);

        // Step 3: Review & Save
        const nextBtn = page.getByRole('button', { name: 'Próximo' });
        await agent.safeClick(nextBtn);

        // Final Save
        const saveBtn = page.getByRole('button', { name: 'Criar Meta' });
        await agent.safeClick(saveBtn);

        // Verify Success
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();
        await expect(page.getByText('Fundo de Emergência Swarm')).toBeVisible();
        await agent.log('✅ Meta Inteligente criada com sucesso.');
        
        await agent.captureEvidence('goal_created');
    });
});
