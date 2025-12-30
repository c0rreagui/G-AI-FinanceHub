import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.describe('⚙️ Enterprise Swarm - Settings Squad', () => {
    let agent: SwarmHelpers;

    test.afterEach(async (_, testInfo) => {
        if (testInfo.status === 'failed' && agent) {
            console.log(`🧨 FALHA EM SETTINGS: ${testInfo.title}`);
            await agent.captureEvidence(`FAILURE_SETTINGS_${testInfo.title.replace(/\s+/g, '_')}`, testInfo.error as Error);
        }
    });

    // The SysAdmin: Validate Settings Page
    test('The_SysAdmin_Validate_Settings', async ({ page }) => {
        agent = new SwarmHelpers(page, 'Settings_Admin', '⚙️');
        await agent.login();
        await agent.navigateTo('Ajustes');

        await agent.log('⚙️ Validando página de Configurações...');

        // Check Header
        await expect(page.locator('h1')).toContainText(/Ajustes|Configurações|Settings/i);
        await agent.log('✅ Header de Configurações encontrado.');

        // Check for settings sections
        const potentialSections = [
            'Tema',
            'Notificações',
            'Perfil',
            'Conta',
            'Privacidade',
            'Sobre'
        ];

        let foundSections = 0;
        for (const section of potentialSections) {
            const sectionEl = page.getByText(section, { exact: false }).first();
            if (await sectionEl.isVisible({ timeout: 500 }).catch(() => false)) {
                await agent.log(`✅ Seção "${section}" encontrada.`);
                foundSections++;
            }
        }

        if (foundSections === 0) {
            await agent.log('⚠️ Nenhuma seção específica encontrada, mas página carregou.');
        }

        // Check for toggle/switch elements (common in settings)
        const toggles = page.locator('button[role="switch"], [data-state="checked"], [data-state="unchecked"]');
        const toggleCount = await toggles.count();
        if (toggleCount > 0) {
            await agent.log(`✅ ${toggleCount} toggles/switches encontrados.`);
        }

        await agent.captureEvidence('settings_view');
        await agent.log('✅ Página de Configurações validada.');
    });
});
