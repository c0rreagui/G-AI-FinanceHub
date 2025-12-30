import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('📅 Agent Planner: O Arquiteto do Futuro (Humanized)', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'Planner', '📅');
    await agent.setupInterceptor();
    await agent.login();

    agent.log('💬 "Vamos ver como está o nosso futuro financeiro..."');
    await page.waitForTimeout(1000);

    const loops = 5;

    for (let i = 1; i <= loops; i++) {
        const focus = faker.helpers.arrayElement(['review_calendar', 'set_goal', 'check_budget']);

        if (focus === 'review_calendar') {
            agent.log('💬 "Conferindo agendamentos do mês..."');
            await agent.navigate('Agenda'); 
            
            const nextMonthBtn = page.locator('button:has(.lucide-chevron-down)').last();
            if (await nextMonthBtn.isVisible()) {
                await nextMonthBtn.click();
                agent.log('💬 "Mês que vem tem bastante conta..."');
                await page.waitForTimeout(800);
                
                const todayBtn = page.getByText('Hoje');
                if (await todayBtn.isVisible()) await todayBtn.click();
            }
        }

        if (focus === 'set_goal') {
            agent.log('💬 "Precisamos focar nos sonhos. Criando nova meta."');
            await agent.navigate('Metas'); 
            
            const addBtn = page.getByRole('button', { name: /Nova Meta|Criar/i }).first();
            if (await addBtn.isVisible()) {
                await agent.safeClick(addBtn);
                const goalName = `Viagem para ${faker.location.city()}`;
                await agent.fillSmartInput('Nome', goalName);
                await agent.fillSmartInput('0,00', faker.finance.amount({min: 2000, max: 15000, dec: 0}));
                agent.log(`💬 "Meta: ${goalName}. Vamos conseguir."`);
                
                if (faker.datatype.boolean()) {
                    await page.keyboard.press('Escape'); 
                    agent.log('💬 "Vou refinar esse plano depois."');
                } else {
                     const saveBtn = page.locator('button:has-text("Salvar")');
                     if (await saveBtn.isVisible()) await saveBtn.click();
                     agent.log('💬 "Plano traçado!"');
                }
            }
        }

        if (focus === 'check_budget') {
             agent.log('💬 "Será que estouramos o orçamento de Lazer?"');
             // Opcional: Navegar para Metas pois Orçamentos costuma estar lá
             await agent.navigate('Metas'); 
             const budgetTab = page.getByRole('tab', { name: /Orçamentos/i });
             if (await budgetTab.isVisible()) {
                 await agent.safeClick(budgetTab);
             }
             
             await page.waitForTimeout(1500); 
             agent.log('💬 "Hmmm, estamos dentro do previsto."');
        }

        await page.waitForTimeout(faker.number.int({ min: 500, max: 1200 }));
    }

    agent.log('💬 "Planejamento atualizado. Caminho seguro à frente."');
    await page.waitForTimeout(5000);
});
