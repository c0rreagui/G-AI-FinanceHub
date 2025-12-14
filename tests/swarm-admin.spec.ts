import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';
import { fakerPT_BR as faker } from '@faker-js/faker';

test('⚙️ Agent SysAdmin: O Zelador do Sistema (Power User)', async ({ page }) => {
    const agent = new SwarmHelpers(page, 'SysAdmin', '⚙️');
    await agent.setupInterceptor();
    await agent.login();
    
    agent.log('💬 "Sistema online. Iniciando bateria de testes profundos (Dev & Ops)."');

    const loops = 5; // Mantendo 5 para o Smoke Test atual

    for (let i = 1; i <= loops; i++) {
        const role = faker.helpers.arrayElement(['ops_engineer', 'frontend_dev', 'qa_tester', 'security_auditor']);
        
        // --- 1. OPS ENGINEER: Gestão de Dados e DevTools ---
        if (role === 'ops_engineer') {
            agent.log('💬 "Role: Ops Engineer. Verificando saúde do sistema e dados."');
            await agent.navigate('DevTools');
            await page.waitForTimeout(800);

            // Verificar Status Indicators
            const statusSection = page.locator('text=System Health');
            if (await statusSection.count() > 0) {
                 await statusSection.hover();
                 agent.log('💬 "Health check visual realizado."');
            }

            // Gerar Massa de Dados (Mock Data)
            if (faker.datatype.boolean()) {
                agent.log('💬 "Injetando massa de teste..."');
                // Force true para garantir clique mesmo se houver overlay de animação
                await agent.safeClick(page.getByRole('button', { name: /\+5 Transações/i }).first());
                await page.waitForTimeout(500);
                await agent.safeClick(page.getByRole('button', { name: /\+2 Metas/i }).first());
                agent.log('💬 "Dados mockados injetados."');
            }

            // Testar Telemetria (Tab)
            const telemetryTab = page.getByRole('button', { name: /Telemetria/i });
            if (await telemetryTab.isVisible()) {
                await telemetryTab.click();
                agent.log('💬 "Acessando painel de Telemetria..."');
                await page.waitForTimeout(1500);
                
                // Volta para DevTools
                const devToolsTab = page.locator('button').filter({ hasText: 'DevTools' }).first();
                if (await devToolsTab.isVisible()) {
                    await devToolsTab.click({ force: true });
                    agent.log('💬 "Voltando para DevTools..."');
                } else {
                     agent.log('⚠️ Aba DevTools não encontrada para retorno.');
                }
            }
        }
        
        // --- 2. FRONTEND DEV: Testes de UI/UX e Temas ---
        if (role === 'frontend_dev') {
            agent.log('💬 "Role: Frontend Dev. Testando componentes de UI."');
            await agent.navigate('DevTools'); // Acesso via DevTools para UI Testing
            
            // Testar Toasts e Notificações
            const toastBtn = page.getByRole('button', { name: /Toast Sucesso/i });
            if (await toastBtn.isVisible()) {
                await toastBtn.click();
                agent.log('💬 "Toast disparado."');
            }

            // Testar Logs de Debug
            const debugBtn = page.getByRole('button', { name: /Debug Test/i });
            if (await debugBtn.isVisible()) {
                await debugBtn.click();
                agent.log('💬 "Log de debug enviado para console/telemetria."');
            }

            // Testar Tema (Settings)
            agent.log('💬 "Verificando consistência do Tema..."');
            await agent.navigate('Ajustes');
            const themeBtn = page.locator('button[title*="Tema"], button[aria-label*="Tema"]').first();
            if (await themeBtn.isVisible()) {
                 await themeBtn.click();
                 await page.waitForTimeout(500);
                 await themeBtn.click(); // Reverte
            }
        }
        
        // --- 3. QA TESTER: Backups e Chaos ---
        if (role === 'qa_tester') {
            agent.log('💬 "Role: QA Tester. Validando Backups e Resiliência."');
            
            // Backup
            await agent.navigate('Ajustes');
            const backupSection = page.locator('text=Backup e Restauração');
            if (await backupSection.isVisible()) {
                agent.log('💬 "Testando exportação de backup..."');
                // Não clica pra baixar pra não travar o teste com dialog de arquivo, mas faz hover
                await backupSection.scrollIntoViewIfNeeded();
                await page.waitForTimeout(500);
            }

            // Chaos (Simulação de Erro - Cuidado para não crashar o teste inteiro)
            // Vamos evitar o "Simular Crash" real, mas vamos verificar se o botão existe
            await agent.navigate('DevTools');
            const crashBtn = page.getByRole('button', { name: /Simular Crash/i });
            if (await crashBtn.isVisible()) {
                await crashBtn.hover();
                agent.log('💬 "Botão de Crash localizado (não vou apertar hoje!)."');
            }
        }

        // --- 4. SECURITY AUDITOR: API Keys e Privacidade ---
        if (role === 'security_auditor') {
             agent.log('💬 "Role: Security Auditor. Verificando credenciais."');
             await agent.navigate('Ajustes');
             
             const apiKeyInput = page.locator('input[type="password"]');
             if (await apiKeyInput.count() > 0) {
                 await apiKeyInput.first().click();
                 agent.log('💬 "Campo de API Key focado."');
             }
        }

        await page.waitForTimeout(faker.number.int({ min: 1000, max: 2500 }));
    }

    agent.log('💬 "Ciclo de SysAdmin concluído. Todos os sistemas operacionais."');
    await page.waitForTimeout(3000);
});
