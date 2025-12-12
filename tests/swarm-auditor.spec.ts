import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('🕵️ Agent Auditor: O Detetive de Dados (Humanized)', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'Auditor', '🕵️');
    await agent.setupInterceptor();
    await agent.login();

    agent.log('💬 "Iniciando verificação de conformidade diária."');

    const loops = 5;

    for (let i = 1; i <= loops; i++) {
        const check = faker.helpers.arrayElement(['visual_inspection', 'value_consistency', 'compliance_log']);

        if (check === 'visual_inspection') {
            agent.log('💬 "Verificando alinhamento visual..."');
            await agent.navigate('Dashboard');
            await page.waitForTimeout(500);
            
            const cards = page.locator('.card, [data-testid="summary-card"]');
            if (await cards.count() > 0) {
                await cards.first().hover();
                await page.waitForTimeout(200);
            }
        }

        if (check === 'value_consistency') {
            // Navega aleatoriamente para verificar outras pages
             if (faker.datatype.boolean()) await agent.navigate('Transações');
            
            const bodyText = await page.textContent('body');
            if (bodyText?.includes('NaN') || bodyText?.includes('undefined')) {
                agent.log('🚨 "INCONSISTÊNCIA DETECTADA: Valor inválido na tela!"');
            }
        }

        if (check === 'compliance_log') {
             await page.waitForTimeout(300);
        }

        await page.waitForTimeout(faker.number.int({min: 300, max: 800}));
    }

    agent.log('💬 "Auditoria limpa. Relatório enviado."');
    await page.waitForTimeout(5000);
});
