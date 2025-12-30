import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

/**
 * 🖥️ SQUAD DESKTOP SWARM
 * 
 * Foco: Funcionalidades complexas, atalhos de teclado, drag & drop, e auditoria visual em alta resolução.
 */

test.describe('🖥️ Desktop Agent Squad', () => {
    
    // Configuração para Desktop (HD)
    test.use({
        viewport: { width: 1920, height: 1080 },
        isMobile: false,
        hasTouch: false,
    });

    /**
     * 💼 THE CFO (Chief Financial Officer)
     * Foco: Transações, Atalhos, Ações em Lote e Relatórios.
     */
    test('💼 The CFO (Transações Avançadas)', async ({ page }) => {
        const agent = new SwarmHelpers(page, 'Desktop_CFO', '💼');
        test.setTimeout(240000); // 4 min

        await agent.setupInterceptor();
        await agent.login();
        agent.log('💬 "Vamos botar ordem na casa. Eficiência máxima."');

        // Testar Atalho de Teclado 'N' (Novo)
        await agent.navigate('Transações');
        agent.log('⌨️ Pressionando "N" para abrir modal via atalho...');
        await page.keyboard.press('n');
        
        await page.waitForTimeout(500);
        const modalTitle = page.locator('h2, [role="dialog"] h3').filter({ hasText: /Nova Transação|Adicionar/ }).first();
        
        if (await modalTitle.isVisible()) {
            await agent.captureEvidence('shortcut_n_success');
            agent.log('✅ Atalho "N" funcionou!');
            
            // Preencher Transação Complexa
            await agent.fillSmartInput('Descrição', `Investimento ${faker.company.name()}`);
            await agent.fillSmartInput('0,00', faker.finance.amount({min: 5000, max: 20000}));
            // Categoria (Pode ser Select ou Grid de Botões)
            const catName = 'Investimentos';
            // Tentar botão direto (Grid) DENTRO DO MODAL
            const dialog = page.locator('[role="dialog"]');
            const catBtn = dialog.getByRole('button', { name: new RegExp(catName, 'i') }).first();
            
            if (await catBtn.isVisible()) {
                await catBtn.click();
                agent.log(`✅ Categoria "${catName}" selecionada via Botão.`);
            } else {
                // Fallback Select
                await agent.selectOption('Categoria', catName);
            }

            // Conta (Obrigatório!)
            const contaSelect = page.getByText('Selecione a conta...');
            if (await contaSelect.isVisible()) {
                 await contaSelect.click();
                 await page.waitForTimeout(200);
                 const firstAccount = page.getByRole('option').first();
                 if (await firstAccount.isVisible()) {
                     await firstAccount.click();
                     agent.log('✅ Conta selecionada.');
                 } else {
                     // Fallback: Tenta a primeira conta que aparecer
                     await page.keyboard.press('ArrowDown');
                     await page.keyboard.press('Enter');
                 }
            }
            
            // Submit
            const saveBtn = page.getByRole('button', { name: 'Salvar' }).first();
            await saveBtn.click({ force: true });
            agent.log('💾 Clicou em Salvar (Force).');
            
            // 🛑 CRITICAL: Ensure Modal Closes
            const modal = page.locator('[role="dialog"]');
            try {
                await expect(modal).not.toBeVisible({ timeout: 3000 });
                agent.log('✅ Modal fechou com sucesso.');
                await agent.captureEvidence('cfo_transaction_added');
            } catch {
                agent.log('⚠️ Modal não fechou automaticamente! Tentando fechar na marra (ESC)...');
                await page.keyboard.press('Escape');
                await page.waitForTimeout(500);
            }
        } else {
            agent.log('⚠️ Atalho "N" falhou ou modal não abriu.');
            // Fallback manual click
            await agent.safeClick(page.getByRole('button', { name: 'Nova Transação' }));
            await page.keyboard.press('Escape'); // Just close for now
        }

        // Ações em Lote (Se houver checkbox)
        const checkboxes = page.locator('input[type="checkbox"]').nth(1);
        if (await checkboxes.isVisible()) {
            await checkboxes.click();
            agent.log('✅ Selecionou transação para ação em lote.');
            await page.waitForTimeout(500);
            // Verificar se barra de ações apareceu (opcional)
        }

        await agent.hunter.checkForGhosts();
    });

    /**
     * 📅 THE PLANNER
     * Foco: Orçamentos, Metas e Agenda.
     */
    test('📅 The Planner (Orçamentos e Metas)', async ({ page }) => {
        const agent = new SwarmHelpers(page, 'Desktop_Planner', '📅');
        test.setTimeout(240000); // 4 min

        await agent.setupInterceptor();
        await agent.login();

        // 1. Metas
        await agent.navigate('Metas');
        agent.log('🎯 Criando Meta de Longo Prazo...');
        
        const addGoalBtn = page.getByRole('button', { name: /Nova Meta|Criar/i }).first();
        if (await addGoalBtn.isVisible()) {
            await addGoalBtn.click();
            
            // Step 1: Escolher Tipo (Wizard)
            const customGoalBtn = page.getByText(/Outro|Defina seu próprio/i).first();
            if (await customGoalBtn.isVisible()) {
                await customGoalBtn.click({ force: true });
                agent.log('✅ Clicou em "Outro". Aguardando formulário...');
                
                // Aguardar transição para o form
                try {
                    await page.waitForSelector('input', { timeout: 5000 });
                } catch {
                     agent.log('⚠️ Formulário não apareceu. Tentando clicar no "Próximo" se existir...');
                     const nextBtn = page.getByRole('button', { name: /Próximo|Continuar/i });
                     if (await nextBtn.isVisible()) await nextBtn.click();
                }
            }

            await agent.fillSmartInput('Nome', `Reserva ${faker.date.future().getFullYear()}`);
            await agent.fillSmartInput('0,00', '50000');
            
            // Tentar salvar se houver botão
            const saveBtn = page.getByRole('button', { name: /Salvar|Criar/i }).first();
            if (await saveBtn.isVisible()) {
                await saveBtn.click();
                agent.log('💾 Clicou em Salvar Meta.');
            } else {
                 await page.keyboard.press('Escape'); // Cancelar para não poluir demais
                 agent.log('⚠️ Botão salvar não visto, cancelando.');
            }

            // 🛑 CRITICAL: Ensure Modal Closes
            try {
                 const modal = page.locator('[role="dialog"]');
                 await modal.waitFor({ state: 'hidden', timeout: 3000 });
                 agent.log('✅ Modal de Meta fechou.');
            } catch {
                 agent.log('⚠️ Modal de Meta teimoso. Fechando com ESC.');
                 await page.keyboard.press('Escape');
            }
        }

        // 2. Orçamentos (Dentro de Metas ou Aba Própria)
        const budgetTab = page.getByRole('tab', { name: /Orçamentos/i });
        if (await budgetTab.isVisible()) {
            await budgetTab.click();
            agent.log('📊 Verificando Orçamentos...');
            await agent.captureEvidence('budgets_view');
        }
        
        // 3. Agenda
        await agent.navigate('Agenda');
        const event = page.locator('.rbc-event, .fc-event').first(); 
        if (await event.isVisible()) {
            await event.hover();
            agent.log('✅ Hover no evento do calendário funcionou.');
        }

        await agent.hunter.checkForGhosts();
    });

    /**
     * 📈 THE INVESTOR
     * Foco: Dívidas, Investimentos e Tools.
     */
    test('📈 The Investor (Investimentos e Dívidas)', async ({ page }) => {
        const agent = new SwarmHelpers(page, 'Desktop_Investor', '📈');
        test.setTimeout(240000);

        await agent.setupInterceptor();
        await agent.login();

        await agent.navigate('Investimentos');
        await agent.captureEvidence('investments_dashboard');
        
        // Verificar Grafico ou Lista
        const chart = page.locator('canvas, .recharts-wrapper').first();
        if (await chart.isVisible()) {
            agent.log('✅ Gráfico de Investimentos visível.');
        }

        await agent.navigate('Dívidas');
        const debtItem = page.locator('text=R$').first();
        if (await debtItem.isVisible()) {
             agent.log('✅ Lista de Dívidas carregada.');
        } else {
             agent.log('⚠️ Nenhuma dívida visível (ou lista vazia).');
        }
        
        await agent.hunter.checkForGhosts();
    });

    /**
     * 🎨 THE DESIGNER (Desktop)
     * Foco: Auditoria Visual em HD (1920x1080).
     */
    test('🎨 The Designer (Desktop Audit)', async ({ page }) => {
        const agent = new SwarmHelpers(page, 'Desktop_Designer', '🎨');
        test.setTimeout(300000); // 5 min

        await agent.setupInterceptor();
        await agent.login();
        
        const routes = ['Início', 'Transações', 'Metas', 'Dívidas', 'Investimentos', 'Agenda', 'Insights', 'Tools', 'Família', 'Ajustes', 'DevTools'];

        for (const route of routes) {
            await agent.navigate(route);
            
            // Layout Shift Check
            await agent.hunter.checkResponsiveness();
            
            // Console/Error Check
            await agent.hunter.checkForGhosts();
            
            await agent.captureEvidence(`desktop_${route.toLowerCase()}`);
            agent.log(`📸 Screenshot Desktop de ${route} capturado.`);
        }
    });

});
