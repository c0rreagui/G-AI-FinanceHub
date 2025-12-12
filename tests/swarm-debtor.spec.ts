import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('📉 Agent Debtor: Pagando os Pecados', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'Debtor', '📉');
    await agent.setupInterceptor();
    await agent.login();

    // 1. Módulo Dívidas
    agent.log('Consultando Serasa...');
    await page.goto('/debts');

    // 2. Cadastrar Nova Dívida
    const debtName = `Cartão ${faker.finance.creditCardIssuer()}`;
    const debtValue = faker.finance.amount({ min: 1000, max: 5000, dec: 2 });
    
    agent.log(`Assumindo dívida: ${debtName}`);
    
    const addBtn = page.getByRole('button', { name: /Nova Dívida|Adicionar/i });
    if (await addBtn.isVisible()) {
        await addBtn.click();
        await agent.fillSmartInput('Nome', debtName);
        await agent.fillSmartInput('0,00', debtValue);
        await page.getByRole('button', { name: 'Salvar' }).click();
    }

    // 3. Amortizar (Pagar parte)
    await page.waitForTimeout(1000);
    const payBtn = page.getByRole('button', { name: /Pagar|Amortizar/i }).first();
    if (await payBtn.isVisible()) {
        await payBtn.click();
        agent.log('Fazendo pagamento parcial...');
        const payValue = (parseFloat(debtValue) / 10).toFixed(2);
        await agent.fillSmartInput('Valor', payValue);
        await page.getByRole('button', { name: /Confirmar/i }).click();
    }

    await page.waitForTimeout(2000);
});
