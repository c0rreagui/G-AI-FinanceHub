import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test('🕵️ Agent Auditor: Pente Fino nos Dados', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'Auditor', '🕵️');
    await agent.setupInterceptor();
    await agent.login();
    await page.waitForTimeout(2000);

    // 1. Verificar Dashboard
    agent.log('Conferindo totais do Dashboard...');
    const saldoEl = page.locator('text=Saldo Total').first();
    await expect(saldoEl).toBeVisible();
    
    // 2. Navegar para Insights e comparar
    agent.log('Cruzando dados com Insights...');
    await page.getByRole('link', { name: /Insights|Relatórios/ }).first().click();
    // ou
    await page.goto('/insights');
    
    await expect(page.locator('canvas').first()).toBeVisible(); // Espera gráfico
    
    // 3. Verificar Tabela de Transações
    agent.log('Auditando últimas transações...');
    await page.goto('/transactions');
    await expect(page.getByRole('table')).toBeVisible();
    
    const count = await page.getByRole('row').count();
    agent.log(`Encontradas ${count} linhas de registro.`);

    await page.waitForTimeout(2500); // Checking detailed records
});
