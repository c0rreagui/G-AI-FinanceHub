import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.describe('🤝 Enterprise Swarm - Social Squad', () => {
    let agent: SwarmHelpers;

    test.afterEach(async ({}, testInfo) => {
        if (testInfo.status === 'failed' && agent) {
            console.log(`🧨 FALHA EM SOCIAL: ${testInfo.title}`);
            await agent.captureEvidence(`FAILURE_SOCIAL_${testInfo.title.replace(/\s+/g, '_')}`, testInfo.error as Error);
        }
    });

    // The Socialite: Create or Validate Family
    test('The_Socialite_Manage_Family', async ({ page }) => {
        agent = new SwarmHelpers(page, 'Social_Socialite', '🤝');
        await agent.login();
        await agent.navigateTo('Família');

        await agent.log('👨‍👩‍👧‍👦 Acessando Área Social...');
        
        // Check Header
        await expect(page.getByRole('heading', { name: 'Família & Social' })).toBeVisible();

        // Check State: No Family vs Has Family
        // If "Criar nova Família" is visible -> Create
        const createHeader = page.getByRole('heading', { name: 'Criar nova Família' });
        
        if (await createHeader.isVisible()) {
            await agent.log('🆕 Nenhuma família detectada. Criando...');
            
            await agent.fillSmartInput('Nome da Família', 'Família Swarm');
            await agent.safeClick(page.getByRole('button', { name: 'Criar Família' }));
            
            // Wait for transition
            await agent.log('⏳ Aguardando criação...');
            await expect(page.getByRole('heading', { name: 'Família Swarm' })).toBeVisible({ timeout: 10000 });
            await agent.log('✅ Família criada com sucesso!');
        } else {
            await agent.log('ℹ️ Usuário já tem família. Validando visualização...');
            const familyName = page.locator('h2.text-3xl.font-bold');
            await expect(familyName).toBeVisible();
            await agent.log(`✅ Família detectada: ${await familyName.textContent()}`);
            
            // Validate Members section
            await expect(page.getByText('Membros')).toBeVisible();
            await expect(page.getByText('Convites')).toBeVisible();
        }

        await agent.captureEvidence('social_view');
    });
});
