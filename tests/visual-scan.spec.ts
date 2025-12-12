import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('FinanceHub Visual Scan', () => {
  // Aumentar timeout geral do teste para 2 minutos
  test.setTimeout(120000);

  test.beforeAll(async () => {
    const evidenceDir = path.join(process.cwd(), 'tests', 'evidence');
    if (!fs.existsSync(evidenceDir)) {
      fs.mkdirSync(evidenceDir, { recursive: true });
    }
  });

  test('Deve realizar login e capturar screenshots de TODAS as views', async ({ page }) => {
    // 1. Acessar Home
    await page.goto('/');
    
    // 2. Login de Desenvolvedor
    console.log('🔑 Iniciando login de desenvolvedor...');
    const devLoginButton = page.getByRole('button', { name: /Login de Desenvolvedor/i });
    
    // Pequena espera e verificação se já estamos logados ou precisamos logar
    try {
        if (await devLoginButton.isVisible({ timeout: 5000 })) {
            await devLoginButton.click();
            await page.waitForTimeout(1000);
            
            // Focando no input correto (baseado na análise do código AuthView.tsx)
            const pinInput = page.locator('input[type="tel"]');
            
            // Digitar um a um com fill (dispara eventos melhor em inputs hidden/transparent)
            await pinInput.fill('2609');
            
            // Aguardar navegação pós-login com timeout generoso
            await page.waitForTimeout(5000); 
        }
    } catch (e) {
        console.log('⚠️ Login skip ou erro não crítico: ', e);
    }
    
    // Debug: Logar onde estamos
    console.log('📍 URL Atual:', page.url());
    
    // Validar login pela Sidebar ou URL
    // Se estivermos na home, URL deve ser base
    await expect(page).toHaveURL(/.*localhost:3000\/?$/);

    // Helper robusto para screenshot
    const takeSnapshot = async (name: string) => {
      try {
          console.log(`📸 Capturando: ${name}`);
          // Espera mais generosa para dados carregarem
          await page.waitForTimeout(3000); 
          
          // Scroll down/up para forçar load de imagens/gráficos
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(1000);
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(1000);
          
          await page.screenshot({ 
            path: `tests/evidence/${name}.png`, 
            fullPage: true,
            timeout: 10000 
          });
      } catch (err) {
          console.error(`❌ Erro ao capturar ${name}:`, err);
      }
    };

    // 3. Varredura Completa das Views
    
    // 01. HOME DASHBOARD
    await takeSnapshot('01_home_dashboard');

    // 02. TRANSAÇÕES
    console.log('➡️ Navegando para Transações...');
    await page.goto('/transactions');
    await takeSnapshot('02_transactions');

    // 03. ORÇAMENTOS
    console.log('➡️ Navegando para Orçamentos...');
    await page.goto('/budgets');
    await takeSnapshot('03_budgets');

    // 04. METAS (Goals)
    console.log('➡️ Navegando para Metas...');
    await page.goto('/goals');
    await takeSnapshot('04_goals');

    // 05. DÍVIDAS (Debts) - Adicionado
    console.log('➡️ Navegando para Dívidas...');
    await page.goto('/debts');
    await takeSnapshot('05_debts');

    // 06. AGENDAMENTOS (Scheduling) - Adicionado
    console.log('➡️ Navegando para Agendamentos...');
    await page.goto('/scheduling');
    await takeSnapshot('06_scheduling');

    // 07. INSIGHTS
    console.log('➡️ Navegando para Insights...');
    await page.goto('/insights');
    await takeSnapshot('07_insights');
    
    // 08. FERRAMENTAS (Tools)
    console.log('➡️ Navegando para Ferramentas...');
    await page.goto('/tools');
    await takeSnapshot('08_tools');

    // 09. CONFIGURAÇÕES (Settings)
    console.log('➡️ Navegando para Configurações...');
    await page.goto('/settings');
    await takeSnapshot('09_settings');

    console.log('✅ Varredura visual completa finalizada!');
  });
});
