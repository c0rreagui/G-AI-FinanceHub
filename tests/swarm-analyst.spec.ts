import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test('📊 Agent Analyst: Data Science Freestyle', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'Analyst', '📊');
    await agent.setupInterceptor();
    await agent.login();

    // 1. Deep Dive em Insights
    agent.log('Carregando Dashboard Analítico...');
    await page.goto('/insights');

    // 2. Stress Test de Filtros
    agent.log('Testando comportamento dos gráficos...');
    
    const filters = ['Mês Atual', 'Últimos 3 Meses', 'Ano Atual', 'Tudo'];
    
    for (const filter of filters) {
        // Tentar encontrar tab ou select
        const trigger = page.getByText(filter).first();
        if (await trigger.isVisible()) {
            agent.log(`Filtrando por: ${filter}`);
            await trigger.click();
            await page.waitForTimeout(800); // Wait for chart animation
            await expect(page.locator('canvas').first()).toBeVisible();
        }
    }

    // 3. Verificar Categorias
    agent.log('Analisando distribuição de categorias...');
    await page.mouse.move(300, 300); // Hover no gráfico
    await page.waitForTimeout(500);
    await page.mouse.move(400, 300);

    await page.waitForTimeout(2000);
});
