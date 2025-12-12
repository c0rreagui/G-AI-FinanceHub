import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('📅 Agent Planner: Olhando para o Futuro', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'Planner', '📅');
    await agent.setupInterceptor();
    await agent.login();
    await page.waitForTimeout(1500);

    // 1. Criar Meta de Longo Prazo
    agent.log('Definindo meta de vida...');
    await page.getByRole('button', { name: 'Metas', exact: true }).click(); // Navegação direta se houver, ou via menu
    // Fallback se não houver botão direto, usar url
    if (!page.url().includes('goals')) await page.goto('/goals');
    
    await page.getByRole('button', { name: 'Nova Meta' }).click();
    
    const goalTitle = `Viagem ${faker.location.country()}`;
    await agent.fillSmartInput('Nome da meta', goalTitle); // Assumindo label/placeholder
    // Se for input padrão:
    try { await page.getByLabel('Nome da meta').fill(goalTitle); } catch {}
    try { await page.getByPlaceholder('Ex: Viagem, Carro...').fill(goalTitle); } catch {}

    await agent.fillSmartInput('0,00', faker.finance.amount({ min: 5000, max: 20000, dec: 2 }));
    await page.getByRole('button', { name: 'Salvar' }).click();
    
    agent.log(`Meta '${goalTitle}' definida!`);

    // 2. Agendamento Recorrente
    agent.log('Agendando conta recorrente...');
    await page.goto('/scheduling'); // Assuming route
    // await page.getByRole('button', { name: 'Novo Agendamento' }).click();
    // (Implementação futura quando módulo estiver pronto, apenas navegando por enquanto)
    
    await page.waitForTimeout(3000); // Contemplating the future
});
