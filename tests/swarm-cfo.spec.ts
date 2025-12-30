import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('👔 Agent CFO: O Guardião do Caixa (Humanized)', async ({ page }) => {
    test.setTimeout(300000); // 5 minutos para smoke test lento
    const agent = new SwarmHelpers(page, 'CFO', '👔');
    
    await agent.setupInterceptor();
    await agent.login();
    await page.waitForTimeout(1500); 

    const loops = 5;
    agent.log(`💬 "Bom dia, equipe. Iniciando auditoria e gestão de caixa. Faremos ${loops} verificações hoje."`);

    for (let i = 1; i <= loops; i++) {
        agent.log(`🔄 [Turno ${i}] Analisando situação...`);

        // Comportamento humano: Checar Inicio
        await agent.navigate('Início');  // Ou Inicio sem acento, dependendo da sidebar. User disse "Inicio" (sem acento no prompt), mas sidebar tem "Início"? Sidebar.tsx tem "Início". Vou usar "Início".
        await page.waitForTimeout(faker.number.int({ min: 500, max: 1500 })); 
        
        const mood = faker.helpers.arrayElement(['otimista', 'preocupado', 'neutro']);

        if (mood === 'otimista') {
            agent.log('💬 "O fluxo está bom. Vou registrar aquela receita pendente."');
            await agent.createTransaction({
                description: `Recebimento: ${faker.company.name()}`,
                amount: faker.finance.amount({ min: 5000, max: 20000, dec: 2 }),
                type: 'Receita',
                categoryMatch: 'Salário'
            });
        } else if (mood === 'preocupado') {
            agent.log('💬 "Muitas saídas previstas. Preciso lançar as despesas operacionais agora."');
            for (let j = 0; j < 2; j++) {
                 await agent.createTransaction({
                    description: `Pagamento: ${faker.commerce.department()}`,
                    amount: faker.finance.amount({ min: 100, max: 1500, dec: 2 }),
                    type: 'Despesa',
                    categoryMatch: faker.helpers.arrayElement(['Alimentação', 'Transporte', 'Casa'])
                });
                await page.waitForTimeout(500);
            }
        } else {
            agent.log('💬 "Dia calmo. Vou apenas conferir os relatórios."');
            await agent.navigate('Transações'); 
            await page.mouse.wheel(0, 300);
            await page.waitForTimeout(800);
            await page.mouse.wheel(0, -300);
        }

        await page.mouse.move(faker.number.int({min:100, max:500}), faker.number.int({min:100, max:500}));
        await page.waitForTimeout(300);
    }

    agent.log('💬 "Fechamento do dia concluído. Caixa conciliado."');
    await page.waitForTimeout(5000);
});
