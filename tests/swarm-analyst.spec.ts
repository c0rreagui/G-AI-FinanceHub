import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('📊 Agent Analyst: O Estrategista (Humanized)', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'Analyst', '📊');
    await agent.setupInterceptor();
    await agent.login();

    agent.log('💬 "Vejamos o que os números nos dizem hoje."');
    await agent.navigate('Insights'); // Ou Dashboard se Insights não existir direto

    const loops = 5;

    for (let i = 1; i <= loops; i++) {
        const analysis = faker.helpers.arrayElement(['time_travel', 'segmentation', 'export_sim']);

        if (analysis === 'time_travel') {
            agent.log('💬 "Comparando com o mês passado..."');
            // Mock interaction
            await page.mouse.move(100, 200); 
            await page.waitForTimeout(200);
            agent.log('💬 "Tendência de alta confirmada."');
        }

        if (analysis === 'segmentation') {
            agent.log('💬 "Segmentando por categoria..."');
            await page.mouse.wheel(0, 400);
            const chart = page.locator('canvas, svg').first();
            if (await chart.isVisible()) {
                await chart.hover();
                await page.waitForTimeout(500);
            }
            await page.mouse.wheel(0, -400);
        }

        if (analysis === 'export_sim') {
            agent.log('💬 "Gerando PDF mental..."');
            await page.waitForTimeout(1000);
        }

        await page.waitForTimeout(faker.number.int({min: 400, max: 1000}));
    }

    agent.log('💬 "Insights gerados. Dashboard atualizado."');
    await page.waitForTimeout(5000);
});
