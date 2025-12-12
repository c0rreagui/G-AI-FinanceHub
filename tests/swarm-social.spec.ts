import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('💬 Agent Socialite: Influencer da Família', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'Socialite', '💬');
    await agent.setupInterceptor();
    await agent.login();

    // 1. Área Social
    await page.goto('/social'); // Rota suposta
    
    // 2. Interagir com Feed (se houver) ou Comentários em Transações
    // Vamos comentar em uma transação recente
    agent.log('Procurando transação para comentar...');
    await page.goto('/transactions');
    await page.waitForTimeout(1000);
    
    const row = page.getByRole('row').nth(1); // Segunda linha (pular header)
    if (await row.isVisible()) {
        await row.click();
        
        // Procurar botão de comentário
        const commentBtn = page.locator('button[aria-label*="Comentário"], button svg.lucide-message-square');
        if (await commentBtn.count() > 0) {
            await commentBtn.first().click();
            
            const comment = faker.helpers.arrayElement([
                'Tá caro isso hein!', 
                'Precisamos economizar...', 
                'Boa compra! 👏', 
                `Valor confere? ${faker.finance.currencySymbol()}`
            ]);
            
            agent.log(`Comentando: "${comment}"`);
            await page.getByPlaceholder(/Adicione um comentário|Escreva algo/i).fill(comment);
            await page.keyboard.press('Enter');
        }
    }

    await page.waitForTimeout(2500);
});
