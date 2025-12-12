import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('👔 Agent CFO: Gestão Financeira Intensiva', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'CFO', '👔');
    
    // Setup
    await agent.setupInterceptor();
    await agent.login();
    await page.waitForTimeout(1000);

    // 1. Receita Variável (Freelance/Vendas)
    const incomeDesc = `Projeto ${faker.company.name()}`;
    const incomeValue = faker.finance.amount({ min: 1000, max: 15000, dec: 2 });
    
    await agent.createTransaction({
        description: incomeDesc,
        amount: incomeValue,
        type: 'Receita',
        categoryMatch: 'Salário' // ou Outras Receitas
    });

    // 2. Despesa Corporativa
    const expenseDesc = `Almoço ${faker.company.name()}`;
    const expenseValue = faker.finance.amount({ min: 50, max: 300, dec: 2 });

    await agent.createTransaction({
        description: expenseDesc,
        amount: expenseValue,
        type: 'Despesa',
        categoryMatch: 'Alimentação'
    });

    // 3. Pagamento de Dívida (Simulado via Despesa por enquanto)
    const debtDesc = `Fatura ${faker.finance.creditCardIssuer()}`;
    await agent.createTransaction({
        description: debtDesc,
        amount: faker.finance.amount({ min: 500, max: 2000, dec: 2 }),
        type: 'Despesa',
        categoryMatch: 'Casa' // Fallback
    });

    // 4. Validação de Saldo (Visual)
    agent.log('Validando impacto financeiro no Dashboard...');
    await page.goto('/');
    await page.waitForTimeout(2000); // Admiring the work
});
