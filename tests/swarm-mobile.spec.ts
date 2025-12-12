import { test, devices } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.use({ ...devices['iPhone 14'] });

test('📱 Agent Mobile: Teste de Campo (iPhone 14)', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'MobileQA', '📱');
    await agent.setupInterceptor();
    
    agent.log('Iniciando app mobile...');
    await page.goto('/');
    
    // 1. Verificar Menu Hamburger
    agent.log('Testando navegação mobile...');
    const menuBtn = page.getByRole('button', { name: /menu|navigation/i }).first();
    if (await menuBtn.isVisible()) {
        await menuBtn.tap(); // Tap no mobile
        await page.waitForTimeout(500);
        await page.getByRole('button', { name: /fechar|close/i }).first().tap().catch(() => page.keyboard.press('Escape'));
    }

    // 2. Scroll Infinito
    // 2. Scroll Infinito (Touch emulation)
    agent.log('Testando scroll touch...');
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollBy(0, -500));

    // 3. Teste de Toque em Cards
    agent.log('Interagindo com widgets...');
    await page.locator('.card, .widget').first().click();

    await page.waitForTimeout(3000);
});
