import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('📈 Agent Investor: O Lobo dos Investimentos (Humanized)', async ({ page }) => {
    test.setTimeout(300000);
    const agent = new SwarmHelpers(page, 'Investor', '📈');
    await agent.setupInterceptor();
    await agent.login();

    agent.log('💬 "Hora de fazer o dinheiro trabalhar. Abrindo terminal..."');
    await agent.navigate('Investimentos');

    const loops = 5;

    for (let i = 1; i <= loops; i++) {
        const strategy = faker.helpers.arrayElement(['analyze_portfolio', 'buy_asset', 'rebalance', 'cagr_calc']);

        if (strategy === 'analyze_portfolio') {
            agent.log('💬 "Analisando alocação de ativos..."');
            const pieChart = page.locator('.recharts-wrapper').first();
            if (await pieChart.isVisible()) {
                await pieChart.hover();
                agent.log('💬 "Estamos muito expostos em Renda Fixa. Preciso arriscar mais."');
            }
            // Filtros - tenta clicar nos tabs/botões da view
            const stocksBtn = page.getByRole('button', { name: 'Ações', exact: true });
            if (await stocksBtn.isVisible()) {
                 await agent.safeClick(stocksBtn);
            } else {
                 agent.log('⚠️ Tab Ações não visível.');
            }
            
            await page.waitForTimeout(800);
            
            const cryptoBtn = page.getByRole('button', { name: 'Cripto', exact: true });
             if (await cryptoBtn.isVisible()) {
                 await agent.safeClick(cryptoBtn);
             }
             
            agent.log('💬 "Cripto está lateralizando..."');
            await page.waitForTimeout(800);
        }

        if (strategy === 'buy_asset') {
            const asset = faker.finance.currencyCode() + "Coin"; 
            agent.log(`💬 "Oportunidade detectada em ${asset}. Comprando."`);
            
            const addBtn = page.getByRole('button', { name: /Novo Aporte/i });
            if (await addBtn.isVisible()) {
                await addBtn.click();
                await page.waitForTimeout(1000); 
                await page.keyboard.press('Escape'); 
                agent.log('💬 "Ordem executada (mentalmente)."');
            }
        }

        if (strategy === 'cagr_calc') {
            agent.log('💬 "Calculando juros compostos para aposentadoria..."');
            const calcSection = page.locator('text=Calculadora');
            await calcSection.scrollIntoViewIfNeeded();
            
            const input = page.locator('input[type="number"]').first();
            if (await input.isVisible()) {
                await input.fill(faker.finance.amount({min:100000, max:1000000, dec:0}));
                agent.log('💬 "Se rendermos 10% a.a., ficamos ricos."');
            }
        }

        await page.waitForTimeout(faker.number.int({ min: 600, max: 1500 }));
    }

    agent.log('💬 "Mercado fechado. Resultados sólidos."');
    await page.waitForTimeout(5000);
});
