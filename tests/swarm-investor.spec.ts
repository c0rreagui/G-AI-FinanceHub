import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('📈 Agent Investor: O Lobo de Wall Street', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'Investor', '📈');
    await agent.setupInterceptor();
    await agent.login();

    // 1. Acesso à Carteira
    agent.log('Analisando mercado...');
    await page.goto('/investments'); // Rota suposta

    // 2. Novo Aporte
    const ticker = faker.string.alpha({ length: 4, casing: 'upper' }) + (Math.random() > 0.5 ? '3' : '4'); // Ex: PETR4
    const value = faker.finance.amount({ min: 100, max: 5000, dec: 2 });
    
    agent.log(`Comprando ${ticker} (R$ ${value})...`);
    
    // Tentar criar via botão genérico de transação (Investimento muitas vezes é uma transação ou módulo próprio)
    // Se for módulo próprio:
    const newInvBtn = page.getByRole('button', { name: /Novo Investimento|Aportar/i });
    if (await newInvBtn.isVisible()) {
        await newInvBtn.click();
        await agent.fillSmartInput('Código / Ativo', ticker);
        await agent.fillSmartInput('0,00', value);
        await page.getByRole('button', { name: 'Salvar' }).click();
    } else {
        // Fallback: Criar Transação categorizada como Investimento
        await agent.createTransaction({
            description: `Aporte ${ticker}`,
            amount: value,
            type: 'Despesa', // Saiu do caixa
            categoryMatch: 'Investimento'
        });
    }

    // 3. Verificar Rentabilidade (Simulado)
    await page.mouse.move(100, 100);
    await page.waitForTimeout(2000); // Watching the stonks go up
});
