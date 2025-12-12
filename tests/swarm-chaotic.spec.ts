import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test('🐒 Agent Chaotic: Monkey Testing', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'Chaotic', '🐒');
    await agent.setupInterceptor();
    await agent.login();

    agent.log('Iniciando caos controlado...');

    // 1. Cliques Aleatórios (Monkey Patch)
    // Clica em lugares aleatórios da tela para ver se algo quebra ou abre
    for (let i = 0; i < 15; i++) {
        const x = Math.floor(Math.random() * 1000);
        const y = Math.floor(Math.random() * 800);
        
        await page.mouse.click(x, y);
        
        // Pequeno delay randômico
        if (Math.random() > 0.7) await page.waitForTimeout(200);
    }

    // 2. Navegação Rápida
    const routes = ['/', '/transactions', '/insights', '/settings', '/goals'];
    const randomRoute = routes[Math.floor(Math.random() * routes.length)];
    agent.log(`Navegação súbita para: ${randomRoute}`);
    await page.goto(randomRoute);

    // 3. Input Spam
    // Tenta digitar em qualquer input visível
    const inputs = await page.getByRole('textbox').all();
    if (inputs.length > 0) {
        const randomInput = inputs[Math.floor(Math.random() * inputs.length)];
        if (await randomInput.isVisible()) {
            try {
                await randomInput.fill('🐒🍌🍌🍌');
            } catch {}
        }
    }

    agent.log('Sessão de caos finalizada. O sistema sobreviveu?');
    await page.waitForTimeout(2000);
});
