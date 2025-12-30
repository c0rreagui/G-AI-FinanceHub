import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('🐒 Agent Chaotic: O Estagiário Desastrado (Humanized)', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'Chaotic', '🐒');
    await agent.setupInterceptor();
    await agent.login();
    
    agent.log('💬 "Click click... O que esse botão faz?"');

    const loops = 5;

    for (let i = 1; i <= loops; i++) {
        const chaos = faker.helpers.arrayElement(['rage_click', 'cat_on_keyboard', 'lost_navigation']);

        try {
            if (chaos === 'rage_click') {
                agent.log('💬 "Por que não carregaaa?! (Clicks frenéticos)"');
                const x = faker.number.int({ min: 100, max: 1000 });
                const y = faker.number.int({ min: 100, max: 800 });
                await page.mouse.click(x, y, { clickCount: 3 });
            }

            if (chaos === 'cat_on_keyboard') {
                agent.log('💬 "Miau! (Gato pulou no teclado)"');
                const keys = ['F5', 'Escape', 'Enter', 'Space', 'Tab'];
                await page.keyboard.press(faker.helpers.arrayElement(keys));
            }

            if (chaos === 'lost_navigation') {
                // Tenta navegar para qualquer lugar
                const randomNav = faker.helpers.arrayElement(['Início', 'Transações', 'Metas', 'Ajustes']);
                agent.navigate(randomNav).catch(() => {});
            }
        } catch (e) {
            agent.log('💬 "Ops! Quebrei algo? Acho que não."');
        }

        await page.waitForTimeout(faker.number.int({min: 100, max: 400}));
    }

    agent.log('💬 "Vou ali tomar um café antes que percebam."');
    await page.waitForTimeout(5000);
});
