import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test('⚙️ Agent SysAdmin: Configuração e Segurança', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'SysAdmin', '⚙️');
    await agent.setupInterceptor();
    await agent.login();

    // 1. Acessar Configurações
    agent.log('Acessando painel de controle...');
    await page.goto('/settings');

    // 2. Toggle Theme (Dark/Light)
    agent.log('Testando troca de tema...');
    const themeToggle = page.locator('button[aria-label*="Tema"], button[title*="Tema"]');
    if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await page.waitForTimeout(1000);
        await themeToggle.click(); // Revert
    }

    // 3. Privacy Mode
    agent.log('Ativando modo privacidade...');
    const privacyBtn = page.locator('button[aria-label*="Privacidade"]'); // Olhinho
    if (await privacyBtn.count() > 0) {
        await privacyBtn.first().click();
        await expect(page.locator('.blur-sm, .filter-blur').first()).toBeVisible();
        await page.waitForTimeout(2000);
        await privacyBtn.first().click();
    }

    // 4. DevTools (se existir rota)
    agent.log('Verificando logs de sistema...');
    await page.goto('/devtools');
    
    await page.waitForTimeout(2000);
});
