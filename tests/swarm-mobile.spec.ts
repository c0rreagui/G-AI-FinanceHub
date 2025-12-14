import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('📱 Agent Mobile: O Commuter (Humanized)', async ({ page }) => {
    // iPhone 13 aspect ratio
    await page.setViewportSize({ width: 375, height: 812 }); 

    const agent = new SwarmHelpers(page, 'Mobile', '📱');
    await agent.setupInterceptor();
    await agent.login();
    
    agent.log('💬 "No ônibus, rapidinho conferindo o saldo..."');

    const loops = 5;

    for (let i = 1; i <= loops; i++) {
        const gesture = faker.helpers.arrayElement(['thumb_scroll', 'open_menu', 'miss_click', 'rotate_phone']);

        if (gesture === 'thumb_scroll') {
            await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
            await page.waitForTimeout(300);
            agent.log('💬 "Scrolando feed..."');
        }

        if (gesture === 'open_menu') {
            const target = faker.helpers.arrayElement(['Transações', 'Metas', 'Início', 'Agenda', 'Tools']);
            // navigate agora lida com menu hamburguer e menu "Mais" (Tools e Agenda estão lá)
            await agent.navigate(target);
        }

        if (gesture === 'miss_click') {
            await page.mouse.click(10, 200); 
        }

        if (gesture === 'rotate_phone') {
            if (i % 25 === 0) {
                 agent.log('💬 "Virando a tela pra ver melhor..."');
                 await page.setViewportSize({ width: 812, height: 375 });
                 await page.waitForTimeout(1000);
                 await page.setViewportSize({ width: 375, height: 812 });
            }
        }

        await page.waitForTimeout(faker.number.int({min: 200, max: 500}));
    }

    agent.log('💬 "Cheguei no ponto. Guardando o celular."');
    await page.waitForTimeout(5000);
});
