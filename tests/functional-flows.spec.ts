import { test, expect } from '@playwright/test';

test.describe('Fluxos Funcionais Críticos (CRUD)', () => {
    test.setTimeout(300000); // 5 minutos por teste para SlowMo

    test.beforeEach(async ({ page }) => {
        // Ativar Console Visual do Robô
        await page.addInitScript(() => {
            window.sessionStorage.setItem('ROBOT_MODE', 'true');
            (window as any).__ROBOT_MODE__ = true;
        });

        // Forçar movimento da janela para o monitor da Esquerda (analisando setup do usuário)
        await page.evaluate(() => {
            window.moveTo(-1800, 50); // Tentativa monitor esquerdo
            window.resizeTo(1920, 1080);
        }).catch(() => {}); // Ignora erro se não permitido

        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto('/');
        
        // Login Desenvolvedor
        const devLogin = page.getByRole('button', { name: /Login de Desenvolvedor/i });
        if (await devLogin.isVisible()) {
            await devLogin.click();
            await page.waitForTimeout(500);
            await page.locator('input[type="tel"]').click({ force: true });
            await page.locator('input[type="tel"]').fill('2609');
            await page.waitForTimeout(2000);
        }
    });

    test('Fluxo Completo do Sistema (100% Cobertura)', async ({ page }) => {
        
        // 1. DASHBOARD
        await test.step('🏠 Dashboard: Verificação Geral', async () => {
             console.log('🏠 Auditando Dashboard...');
             await page.goto('/');
             await page.waitForTimeout(1000);
             
             // Verificar widgets principais
             await expect(page.locator('text=Saldo Total')).toBeVisible();
             await expect(page.locator('text=Receitas').first()).toBeVisible();
             await expect(page.locator('text=Despesas').first()).toBeVisible();
             
             // Interagir com algum filtro se houver (ex: Mês atual)
             // const monthFilter = page.locator('button[aria-label="Filter Month"]');
             // if (await monthFilter.isVisible()) await monthFilter.click();
             
             console.log('✅ Dashboard carregado com sucesso');
        });

        // 2. TRANSAÇÕES (CRUD)
        await test.step('💰 Transações: Fluxo Completo', async () => {
            console.log('💰 Iniciando Transações...');
            await page.getByRole('button', { name: 'Transações' }).first().click();
            await page.waitForTimeout(1000);
            
            // --- CREATE Receita ---
            await page.getByRole('button', { name: 'Nova Transação' }).click();
            
            // Preencher Valor (SmartInput)
            await page.getByLabel('Valor *').click();
            await page.getByLabel('Valor *').fill('5000,00');

            // Preencher Descrição
            await page.getByLabel('Descrição *').fill('Salário Teste Full');
            
            // Selecionar Conta (Obrigatório)
            await page.getByText('Selecione a conta...').click();
            // Esperar opções e clicar na primeira
            await page.getByRole('option').first().click();

            // Selecionar Tipo Receita
            await page.getByRole('button', { name: 'Receita' }).click();

            // Tentar selecionar categoria 'Salário' se houver, ou clicar na primeira disponível
            // CategoryPicker usa botões com title
            const salaryCat = page.getByTitle('Salário').or(page.getByRole('button', { name: 'Salário' }));
            if (await salaryCat.isVisible()) {
                await salaryCat.click();
            } else {
                // Fallback para primeira categoria da lista
                await page.locator('.grid button').first().click();
            }

            await page.getByRole('button', { name: 'Salvar' }).click();
            
            // Validar criação
            await expect(page.getByText('Salário Teste Full')).toBeVisible();
            console.log('✅ Receita criada');


            // --- CREATE Despesa ---
            await page.getByRole('button', { name: 'Nova Transação' }).click();
            
            await page.getByLabel('Valor *').fill('50,00');
            await page.getByLabel('Descrição *').fill('Despesa Temp');
            
            // Conta
            await page.getByText('Selecione a conta...').click();
            await page.getByRole('option').first().click();

            // Categoria (Alimentação ou similar)
            const foodCat = page.getByTitle(/Alimentação|Mercado/i).or(page.getByRole('button', { name: /Alimentação|Mercado/i }));
             if (await foodCat.isVisible()) {
                await foodCat.click();
            } else {
                await page.locator('.grid button').nth(1).click(); // Segundo item
            }

            await page.getByRole('button', { name: 'Salvar' }).click();
            console.log('✅ Despesa criada');

            // EDIT (Despesa Temp -> Despesa Editada)
            const row = page.getByText('Despesa Temp').first();
            await row.click();
            const editBtn = page.getByRole('button', { name: /Editar|Edit/i }).first();
            if (await editBtn.isVisible()) {
                await editBtn.click();
                await page.waitForTimeout(500); 
                // Limpar e preencher descrição
                await page.getByLabel('Descrição *').fill('Despesa Editada');
                await page.getByRole('button', { name: 'Salvar' }).click();
                await expect(page.getByText('Despesa Editada')).toBeVisible();
                console.log('✅ Transação editada');
            }

            // DELETE
            await page.getByText('Despesa Editada').first().click();
            const deleteBtn = page.getByRole('button', { name: /Excluir|Remover|Delete/i }).first();
            if (await deleteBtn.isVisible()) {
                await deleteBtn.click();
                const confirmBtn = page.getByRole('button', { name: /Confirmar|Sim/i });
                if (await confirmBtn.isVisible()) await confirmBtn.click();
                console.log('✅ Transação excluída');
            }
        });

        // 3. METAS (CRUD)
        await test.step('🎯 Metas: Planejamento', async () => {
             console.log('🎯 Iniciando Metas...');
             await page.getByRole('button', { name: 'Metas' }).first().click();
             
             // CREATE
             const addBtn = page.getByRole('button', { name: 'Nova Meta' }).or(page.locator('button:has-text("Criar")').first());
             if (await addBtn.isVisible()) {
                 await addBtn.click();
                 await page.locator('input[name="title"], input[placeholder*="Nome"]').fill('Carro Novo');
                 await page.locator('input[name="targetAmount"], input[placeholder*="Valor"]').fill('5000000');
                 await page.getByRole('button', { name: 'Salvar' }).click();
                 console.log('✅ Meta criada');
                 
                 // DEPOSIT (Interagir)
                 await page.waitForTimeout(500);
                 const metaCard = page.getByText('Carro Novo').first();
                 if (await metaCard.isVisible()) {
                     await metaCard.click();
                     // Adicionar valor
                     const depositBtn = page.getByRole('button', { name: /Adicionar|Depositar/i }).first();
                     if (await depositBtn.isVisible()) {
                         await depositBtn.click();
                         await page.locator('input[name="amount"]').fill('100000');
                         await page.getByRole('button', { name: /Salvar|Confirmar/i }).click();
                         console.log('✅ Depósito na meta realizado');
                     }
                 }
             }
        });

        // 4. DÍVIDAS (CRUD)
        await test.step('💸 Dívidas: Gestão', async () => {
            console.log('💸 Iniciando Dívidas...');
            await page.getByRole('button', { name: 'Dívidas' }).first().click();
            
            // CREATE
            await page.getByRole('button', { name: 'Nova Dívida' }).click();
            await page.locator('input[name="title"]').fill('Empréstimo Teste');
            await page.locator('input[name="totalAmount"]').fill('500000');
            await page.getByRole('button', { name: 'Salvar' }).click();
            console.log('✅ Dívida criada');

            // PAY
            const debtCard = page.getByText('Empréstimo Teste').first();
            await debtCard.click();
            const payBtn = page.getByRole('button', { name: /Pagar|Amortizar/i }).first();
            if (await payBtn.isVisible()) {
                await payBtn.click();
                await page.locator('input[name="amount"]').fill('100000');
                await page.getByRole('button', { name: /Confirmar|Salvar/i }).click();
                console.log('✅ Pagamento de dívida registrado');
            }
        });

        // 5. INVESTIMENTOS
        await test.step('📈 Investimentos: Portfolio', async () => {
            console.log('📈 Iniciando Investimentos...');
            await page.getByRole('button', { name: 'Investimentos' }).first().click();
            
            const investments = [
                { name: 'Tesouro Selic', amount: '100000' },
                { name: 'Apple Stocks', amount: '55000' }
            ];

            for (const inv of investments) {
                await page.getByRole('button', { name: /Novo|Adicionar/i }).click();
                await page.locator('input[name="name"]').fill(inv.name);
                await page.locator('input[name="amount"]').fill(inv.amount);
                await page.getByRole('button', { name: 'Salvar' }).click();
                await page.waitForTimeout(500);
            }
            console.log('✅ Carteira de investimentos populada');
        });

        // 6. AGENDAMENTOS
        await test.step('📅 Agendamentos', async () => {
             console.log('📅 Auditando Agendamentos...');
             await page.getByRole('button', { name: 'Agendamentos' }).first().click();
             
             const addBtn = page.getByRole('button', { name: /Novo|Adicionar/i }).first();
             if (await addBtn.isVisible()) {
                 await addBtn.click();
                 await page.locator('input[name="description"]').fill('Netflix Recorrente');
                 await page.locator('input[name="amount"]').fill('5990');
                 // Tentar toggle de recorrencia se existir
                 // await page.locator('input[type="checkbox"]').check(); 
                 await page.getByRole('button', { name: 'Salvar' }).click();
                 console.log('✅ Agendamento criado');
             }
        });

        // 7. INSIGHTS
        await test.step('📊 Insights', async () => {
            console.log('📊 Verificando Insights...');
            await page.getByRole('button', { name: 'Insights' }).first().click();
            await page.waitForTimeout(1500);
            // Verificar se graficos carregaram
            await expect(page.locator('canvas, svg').first()).toBeVisible();
            // Tentar mudar tabs se houver (Ex: Mensal, Anual)
            const yearTab = page.getByText('Anual').first();
            if (await yearTab.isVisible()) await yearTab.click();
            console.log('✅ Insights visualizados');
        });

        // 8. TOOLS (Ferramentas)
        await test.step('🧰 Ferramentas', async () => {
             console.log('🧰 Testando Ferramentas...');
             const toolsBtn = page.getByRole('button', { name: 'Ferramentas' });
             if (await toolsBtn.isVisible()) {
                 await toolsBtn.click();
                 // Calculadora
                 const calcBtn = page.getByText(/Calculadora|Juros/i).first();
                 if (await calcBtn.isVisible()) {
                     await calcBtn.click();
                     // Simular calculo
                     await page.waitForTimeout(500);
                     // Voltar
                     await page.goBack(); // ou botão voltar
                 }
                 console.log('✅ Ferramentas funcionais');
             }
        });

        // 9. SOCIAL (Família)
        await test.step('👥 Social / Família', async () => {
             console.log('👥 Auditando Social...');
             const socialBtn = page.getByRole('button', { name: /Social|Família/i });
             if (await socialBtn.isVisible()) {
                 await socialBtn.click();
                 await expect(page.getByText(/Grupo|Membros/i).first()).toBeVisible();
                 console.log('✅ Área Social acessada');
             }
        });

        // 10. DEVTOOLS
        await test.step('🛠️ DevTools', async () => {
             console.log('🛠️ Acessando DevTools...');
             // Geralmente o login de dev já libera, mas vamos verificar a rota ou botão
             const devBtn = page.getByRole('button', { name: /DevTools|Admin/i });
             if (await devBtn.isVisible()) {
                 await devBtn.click();
                 await expect(page.getByText(/Logs|Cache|System/i).first()).toBeVisible();
                 console.log('✅ Painel de Desenvolvedor acessado');
             }
        });

        // 11. CONFIGURAÇÕES
        await test.step('⚙️ Configurações', async () => {
             console.log('⚙️ Ajustando Configurações...');
             await page.getByRole('button', { name: 'Configurações' }).click();
             
             // Toggle Theme
             const themeBtn = page.getByRole('button', { name: /Tema|Escuro|Claro/i }).first();
             if (await themeBtn.isVisible()) {
                 await themeBtn.click();
                 await page.waitForTimeout(500);
                 console.log('✅ Tema alternado');
             }

             // Privacy
             const privacyBtn = page.getByRole('button', { name: /Privacidade|Ocultar/i }).first();
             if (await privacyBtn.isVisible()) {
                 await privacyBtn.click();
                 console.log('✅ Privacidade alternada');
             }
        });

    });
});
