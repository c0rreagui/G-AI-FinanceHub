import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('💬 Agent Socialite: O Influencer da Família (Humanized)', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'Socialite', '💬');
    await agent.setupInterceptor();
    await agent.login();
    await agent.navigate('Social'); // Link provável "Social" ou "Comunidade"

    agent.log('💬 "Oi gente! Conferindo as novidades..."');

    const loops = 5;

    for (let i = 1; i <= loops; i++) {
        const interaction = faker.helpers.arrayElement(['stalking', 'reacting', 'posting']);

        if (interaction === 'stalking') {
            await page.evaluate(() => window.scrollBy({ top: 200, behavior: 'smooth' }));
        }

        if (interaction === 'reacting') {
            agent.log('💬 "Amei! ❤️"');
            const likeBtn = page.locator('.heart-icon, button[aria-label="Like"]').first();
            if (await likeBtn.isVisible()) {
                await likeBtn.click();
            } else {
                await page.mouse.click(faker.number.int({min:300, max:500}), faker.number.int({min:300, max:500}));
            }
        }

        if (interaction === 'posting') {
            agent.log('💬 "Vou postar sobre minha economia."');
            const postInput = page.getByPlaceholder(/No que você está pensando/i);
            if (await postInput.isVisible()) {
                await postInput.click();
                await page.keyboard.type('Economizei muito hoje! #foco', { delay: 100 });
                await page.waitForTimeout(500);
                await page.keyboard.press('Escape'); 
            }
        }

        await page.waitForTimeout(faker.number.int({min: 300, max: 900}));
    }

    agent.log('💬 "Por hoje é só, pessoal! Beijos."');
    await page.waitForTimeout(5000);
});
