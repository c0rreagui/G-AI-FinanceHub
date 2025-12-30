import { test, devices } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

// Usando Device Descriptor real para simular touch, viewport e userAgent
test.use({ ...devices['iPhone 13'] });

test('📱 Agent Mobile: O Commuter (Humanized)', async ({ page }) => {
    test.setTimeout(300000); // 5 min
    const agent = new SwarmHelpers(page, 'Mobile', '📱');
    
    // Block Clearbit to avoid 403 and noise
    await page.route('**/*clearbit.com/**', route => route.abort());

    await agent.setupInterceptor();
    await agent.login();
    
    agent.log('💬 "No ônibus, rapidinho conferindo o saldo no iPhone 13..."');
    await agent.hunter.checkResponsiveness();

    const loops = 10; // Optimized for CI/Local balance

    for (let i = 1; i <= loops; i++) {
        // Expanded Action Pool
        const action = faker.helpers.arrayElement([
            'thumb_scroll', 
            'open_menu', 
            'quick_transaction', 
            'swipe_gestures',
            'check_details'
        ]);

        if (action === 'thumb_scroll') {
            agent.log('💬 "Scrolando feed com o dedão..."');
            await page.touchscreen.tap(200, 600);
            await page.mouse.move(200, 600);
            await page.mouse.down();
            await page.mouse.move(200, 300, { steps: 5 });
            await page.mouse.up();
        }

        if (action === 'swipe_gestures') {
             agent.log('💬 "Swiping lateral para ver gráficos..."');
            await page.mouse.move(300, 400); // Right to left
            await page.mouse.down();
            await page.mouse.move(50, 400, { steps: 10 });
            await page.mouse.up();
        }

        if (action === 'check_details') {
            agent.log('💬 "Verificando detalhes de uma transação..."');
            const txRow = page.locator('div[className*="TransactionRow"]').first();
            if (await txRow.isVisible()) {
                await txRow.click();
                await page.waitForTimeout(1000);
                // Close if modal opens (assuming read only details view or edit modal)
                await page.keyboard.press('Escape');
            }
        }

        if (action === 'open_menu') {
            const target = faker.helpers.arrayElement(['Transações', 'Metas', 'Início', 'Tools']);
            await agent.navigate(target);
        }

        if (action === 'quick_transaction') {
            // Reduced frequency
            if (faker.datatype.boolean(0.3)) {
                agent.log('💬 "Lembrar de anotar o café..."');
                try {
                    await agent.createTransaction({
                        description: `Café ${faker.commerce.productAdjective()}`,
                        amount: faker.finance.amount({min: 5, max: 20}),
                        type: 'Despesa',
                        categoryMatch: 'Alimentação'
                    });
                } catch (e) {
                    agent.log(`⚠️ Erro ao anotar: ${e}`);
                }
            }
        }

        await page.waitForTimeout(faker.number.int({min: 100, max: 300}));
    }

    agent.log('💬 "Cheguei no ponto. Guardando o celular."');
});
