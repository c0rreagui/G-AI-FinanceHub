
import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { faker } from '@faker-js/faker';

// Bloqueio de recursos externos ruidosos
const BLOCK_LIST = ['**/*clearbit.com/**'];

test.beforeEach(async ({ page }) => {
    // Bloquear Clearbit em todos os testes
    await page.route('**/*', route => {
        const url = route.request().url();
        if (BLOCK_LIST.some(blocked => url.includes('clearbit.com'))) {
            return route.abort();
        }
        return route.continue();
    });
});

// Configuração comum para todo o arquivo: Emulação de Mobile no CHROME (Chromium)
test.use({ 
    browserName: 'chromium',
    channel: 'chrome', // Usa Google Chrome instalado
    viewport: { width: 390, height: 844 }, // iPhone 13
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/96.0.4664.116 Mobile/15E148 Safari/604.1',
});

test.describe('📱 Mobile Agent Squad', () => {

    test('⚡ The Quick Spender (Adicionar Transações Rápidas)', async ({ page }) => {
        const agent = new SwarmHelpers(page, 'Mobile_Spender', '⚡');
        test.setTimeout(120000); // 2 min

        await agent.setupInterceptor();
        await agent.login();
        agent.log('💬 "Vou adicionar uns gastos rápidos que esqueci..."');

        for (let i = 0; i < 3; i++) {
            await agent.createTransaction({
                description: faker.commerce.productName(),
                amount: faker.finance.amount({min: 10, max: 100}),
                type: 'Despesa',
                categoryMatch: faker.helpers.arrayElement(['Alimentação', 'Transporte', 'Lazer'])
            });
            await page.waitForTimeout(500);
        }
        
        await agent.hunter.checkResponsiveness();
    });

    test('🧐 The Analyzer (Verificar Gráficos e Metas)', async ({ page }) => {
        const agent = new SwarmHelpers(page, 'Mobile_Analyzer', '🧐');
        test.setTimeout(180000); // 3 min

        await agent.setupInterceptor();
        await agent.login();
        agent.log('💬 "Analisando meus gastos e metas..."');

        // Navegar para Metas
        await agent.navigate('Metas');
        await page.waitForTimeout(1000);
        
        // Swipe em gráficos (se houver carrossel ou apenas scroll)
        await page.mouse.wheel(0, 300); // Scroll down
        
        // Navegar para Insights (Garantir Menu Mais se necessário)
        await agent.navigate('Insights');
        await agent.hunter.checkForGhosts();
        
        // Voltar para Home e ver resumo
        await agent.navigate('Início');
        const summary = page.locator('div').filter({ hasText: 'Saldo Total' }).first();
        await expect(summary).toBeVisible();
    });

    test('📅 The Organizer (Agenda e Dívidas)', async ({ page }) => {
        const agent = new SwarmHelpers(page, 'Mobile_Organizer', '📅');
        test.setTimeout(120000); // 2 min

        await agent.setupInterceptor();
        await agent.login();
        agent.log('💬 "Organizando contas e agendamentos..."');

        await agent.navigate('Agenda');
        // Verificar se tem eventos ou apenas carregar
        await page.waitForTimeout(1000);

        await agent.navigate('Dívidas'); // Menu Mais -> Dívidas
        // Tentar adicionar uma dívida fictícia? Ou apenas listar.
        const addBtn = page.getByRole('button', { name: 'Nova Dívida' });
        if (await addBtn.isVisible()) {
            // Apenas clica e fecha
            await addBtn.click();
            await page.waitForTimeout(500);
            await page.keyboard.press('Escape');
        }

        await agent.hunter.checkResponsiveness();
    });

});
