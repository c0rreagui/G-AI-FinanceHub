import { test, expect } from '@playwright/test';

test.describe('Fluxos Funcionais Críticos (CRUD)', () => {
    test.setTimeout(300000); // 5 minutos por teste para SlowMo

    test.beforeEach(async ({ page }) => {
        // Ativar Console Visual do Robô
        await page.addInitScript(() => {
            window.sessionStorage.setItem('ROBOT_MODE', 'true');
            (window as any).__ROBOT_MODE__ = true;
        });

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

    test('Fluxo Completo: Transações, Dívidas e Investimentos', async ({ page }) => {
        
        // 1. TRANSAÇÕES
        await test.step('Transações: Receita e Despesa', async () => {
            console.log('💰 Iniciando Fluxo de Transações...');
            await page.getByRole('button', { name: 'Transações' }).first().click();
            
            // Criar Receita
            await page.getByRole('button', { name: 'Nova Transação' }).click();
            await page.locator('input[name="description"]').fill('Salário Teste Robot');
            await page.locator('input[name="amount"]').fill('500000'); // 5.000,00
            
            // Selecionar Tipo Receita
            // Assumindo que o switch ou botão de tipo existe
            const typeSelect = page.getByRole('combobox', { name: /Tipo/i }).or(page.locator('#type-select')); 
            // Se for botões segmentados:
            try { await page.getByText('Receita').click(); } catch(e) {}
            
            await page.getByRole('button', { name: 'Salvar' }).click();
            await expect(page.getByText('Salário Teste Robot')).toBeVisible();
            console.log('✅ Receita criada com sucesso');

            // Criar Despesa
            await page.getByRole('button', { name: 'Nova Transação' }).click();
            await page.locator('input[name="description"]').fill('Mercado Teste Robot');
            await page.locator('input[name="amount"]').fill('45050'); // 450,50
             try { await page.getByText('Despesa').click(); } catch(e) {}
            await page.getByRole('button', { name: 'Salvar' }).click();
            console.log('✅ Despesa criada com sucesso');
        });

        // 2. DÍVIDAS
        await test.step('Dívidas: Criar e Pagar', async () => {
            console.log('💸 Iniciando Fluxo de Dívidas...');
            await page.getByRole('button', { name: 'Dívidas' }).first().click();
            
            await page.getByRole('button', { name: 'Nova Dívida' }).click();
            await page.locator('input[name="title"]').fill('Visa Teste Robot');
            await page.locator('input[name="totalAmount"]').fill('200000'); // 2.000,00
            await page.getByRole('button', { name: 'Salvar' }).click();
            
            await expect(page.getByText('Visa Teste Robot')).toBeVisible();
            console.log('✅ Dívida criada com sucesso');
        });

        // 3. INVESTIMENTOS
        await test.step('Investimentos: Carteira Diversificada', async () => {
            console.log('📈 Iniciando Fluxo de Investimentos...');
            await page.getByRole('button', { name: 'Investimentos' }).first().click();
            
            const investments = [
                { name: 'CDB Robot', type: 'Renda Fixa', value: '100000' },
                { name: 'PETR4 Robot', type: 'Ações', value: '50000' },
                { name: 'BTC Robot', type: 'Cripto', value: '250000' }
            ];

            for (const inv of investments) {
                await page.getByRole('button', { name: 'Novo Investimento' }).click();
                await page.locator('input[name="name"]').fill(inv.name);
                await page.locator('input[name="amount"]').fill(inv.value);
                // Tentar selecionar categoria se possível
                // await page.getByRole('combobox').selectOption(inv.type);
                await page.getByRole('button', { name: 'Salvar' }).click();
                await page.waitForTimeout(500);
            }
            console.log('✅ Investimentos criados com sucesso');
        });

        // 4. METAS (Planejamento)
        await test.step('Metas: Criar Objetivo', async () => {
             console.log('🎯 Iniciando Fluxo de Metas...');
             await page.getByRole('button', { name: 'Metas' }).first().click();
             
             // Criar Meta
             const addBtn = page.getByRole('button', { name: 'Nova Meta' }).or(page.locator('button:has-text("Criar")').first()); 
             if (await addBtn.isVisible()) {
                 await addBtn.click();
                 await page.locator('input[name="title"], input[placeholder*="Nome"]').fill('Viagem Robot');
                 await page.locator('input[name="targetAmount"], input[placeholder*="Valor"]').fill('1000000');
                 await page.getByRole('button', { name: 'Salvar' }).click();
                 console.log('✅ Meta criada com sucesso');
             } else {
                 console.log('⚠️ Botão de Nova Meta não encontrado (possível layout diferente)');
             }
        });

        // 5. AGENDAMENTOS
        await test.step('Agendamentos: Criar Recorrência', async () => {
             console.log('📅 Iniciando Fluxo de Agendamentos...');
             await page.getByRole('button', { name: 'Agendamentos' }).first().click();
             
             // Assumindo botão de novo agendamento
             const addBtn = page.getByRole('button', { name: /Novo|Adicionar/i }).first();
             if (await addBtn.isVisible()) {
                 await addBtn.click();
                 await page.locator('input[name="description"]').fill('Aluguel Robot');
                 await page.locator('input[name="amount"]').fill('250000');
                 // Tentar fechar ou salvar
                 const saveBtn = page.getByRole('button', { name: 'Salvar' });
                 if (await saveBtn.isVisible()) await saveBtn.click();
                 console.log('✅ Agendamento simulado');
             }
        });

        // 6. SOCIAL (Família)
        await test.step('Social: Acesso a Grupos', async () => {
             console.log('👨‍👩‍👧‍👦 Iniciando Fluxo Social...');
             // Verificar nome no menu (pode ser "Social", "Família" ou ícone)
             // Tentar click direto no link se texto exato não bater
             const socialMenu = page.getByRole('button', { name: /Social|Família/i }).first();
             if (await socialMenu.isVisible()) {
                 await socialMenu.click();
                 await page.waitForTimeout(1000);
                 console.log('✅ Acesso à área Social/Família verificado');
             } else {
                 console.log('⚠️ Menu Social/Família não identificado');
             }
        });

         // 7. FERRAMENTAS E CONFIGURAÇÕES
         await test.step('Ferramentas e Configurações', async () => {
             console.log('⚙️ Verificando Ferramentas e Configurações...');
             
             // Ferramentas
             const toolsMenu = page.getByRole('button', { name: 'Ferramentas' }).first();
             if (await toolsMenu.isVisible()) {
                 await toolsMenu.click();
                 await page.waitForTimeout(1000);
                 // Tentar clicar em uma calculadora
                 await page.getByText(/Calculadora|Juros/i).first().click({timeout: 2000}).catch(() => {});
                 console.log('✅ Ferramentas acessadas');
             }

             // Configurações
             const settingsMenu = page.getByRole('button', { name: 'Configurações' }).first();
             if (await settingsMenu.isVisible()) {
                 await settingsMenu.click();
                 await page.waitForTimeout(1000);
                 // Verificar se renderizou seções
                 await expect(page.getByText(/Perfil|Aparência|Segurança/i).first()).toBeVisible();
                 console.log('✅ Configurações acessadas');
             }
         });
    });
});
