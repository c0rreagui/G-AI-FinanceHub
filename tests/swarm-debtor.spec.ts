import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('📉 Agent Debtor: O Equilibrista (Humanized)', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'Debtor', '📉');
    await agent.setupInterceptor();
    await agent.login();
    
    agent.log('💬 "Respirando fundo... Vamos ver o tamanho do buraco."');
    await agent.navigate('Dívidas');

    const loops = 5;

    for (let i = 1; i <= loops; i++) {
        const action = faker.helpers.arrayElement(['panic_scroll', 'dream_of_freedom', 'negotiate']);

        if (action === 'panic_scroll') {
            agent.log('💬 "Olhando todas as parcelas..."');
            await page.mouse.wheel(0, 500);
            await page.waitForTimeout(200);
            await page.mouse.wheel(0, -200);
            agent.log('💬 "Meu Deus, quantos juros..."');
        }

        if (action === 'dream_of_freedom') {
            const debtCard = page.locator('.card, [data-testid="debt-card"]').first();
            if (await debtCard.isVisible()) {
                await debtCard.hover();
                agent.log('💬 "Esse aqui falta pouco..."');
            }
        }

        if (action === 'negotiate') {
            agent.log('💬 "Vou tentar pagar algo hoje."');
            const payBtn = page.getByRole('button', { name: /Pagar|Amortizar/i }).first();
            if (await payBtn.isVisible()) {
                await payBtn.click();
                await page.waitForTimeout(1000); 
                agent.log('💬 "Melhor deixar para o mês que vem."');
                await page.keyboard.press('Escape');
            }
        }
        
        await page.waitForTimeout(faker.number.int({min: 400, max: 1000}));
    }

    agent.log('💬 "Sobrevivi a mais um dia. Nome limpo em breve."');
    await page.waitForTimeout(5000);
});
