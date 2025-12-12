import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Deep Audit & Console Mapping', () => {
    test.setTimeout(300000); // 5 minutos para varredura completa

    const consoleErrors: string[] = [];
    const consoleWarns: string[] = [];
    const pageErrors: string[] = [];
    const failedRequests: string[] = [];

    test.beforeEach(async ({ page }) => {
        // Listeners Globais
        page.on('console', msg => {
            if (msg.type() === 'error') consoleErrors.push(`[${page.url()}] ${msg.text()}`);
            if (msg.type() === 'warning') consoleWarns.push(`[${page.url()}] ${msg.text()}`);
        });
        page.on('pageerror', err => pageErrors.push(`[${page.url()}] ${err.message}`));
        page.on('requestfailed', req => failedRequests.push(`[${page.url()}] ${req.url()} - ${req.failure()?.errorText}`));
    });

    // Definir Rotas
    const routes = [
        { name: 'Dashboard', path: '/' },
        { name: 'Transações', path: '/' }, // SPA navigation triggers logic
        // O Playwright precisa navegar clicando ou via URL direta se suportado, 
        // mas como é SPA e validamos por clicks antes, vamos fazer navegação híbrida
    ];

    test('Auditoria Sistema Completo', async ({ page }) => {
        // 1. Setup & Login
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto('/');
        
        // Tentar login
        const devLogin = page.getByRole('button', { name: /Login de Desenvolvedor/i });
        try {
            if (await devLogin.isVisible({ timeout: 5000 })) {
                await devLogin.click();
                await page.waitForTimeout(1000);
                // Forçar foco e preencher PIN
                const pinInput = page.locator('input[type="tel"]');
                await pinInput.click({ force: true });
                await pinInput.fill('2609');
                await page.waitForTimeout(3000);
            }
        } catch (e) { console.log('ℹ️ Já logado ou skip login'); }

        // 2. Definir Views a visitar via Menu Lateral (para garantir carregamento real de componentes)
        const views = [
            'Transações', 'Metas', 'Investimentos', 'Dívidas', 'Agendamentos', 'Insights', 'Ferramentas', 'Configurações'
        ];

        for (const viewName of views) {
            console.log(`\n🔍 Auditando View: ${viewName}`);
            
            // Expandir Sidebar se necessário
            const sidebar = page.locator('aside');
            const isCollapsed = await sidebar.getAttribute('class').then(c => c?.includes('w-20'));
            if (isCollapsed) {
               const expandBtn = page.locator('button:has(svg.lucide-chevron-right)').first();
               if (await expandBtn.isVisible()) await expandBtn.click();
            }

            // Navegar
            // Mapeamento de nomes de menu se necessário (Metas -> Metas, etc)
            let menuName = viewName;
            
            const menuBtn = page.getByRole('button', { name: menuName }).first();
            try {
                if (await menuBtn.isVisible()) {
                    await menuBtn.click();
                    await page.waitForTimeout(3000); // Aguardar renderização e efeitos
                } else {
                    console.log(`   ⚠️ Menu ${viewName} não encontrado/visível.`);
                }
            } catch (e) {
                console.log(`   ⚠️ Erro ao clicar no menu ${viewName}: ${e}`);
            }

            // 3. Inventário de UI (Botões)
            const buttons = page.locator('button:visible');
            const count = await buttons.count();
            console.log(`   🔘 Botões visíveis encontrados: ${count}`);

            // Validar estado dos botões (Amostragem ou Todos)
            // Para não demorar horas, vamos verificar integridade básica
            for (let i = 0; i < count; i++) {
                const btn = buttons.nth(i);
                // Check integrity
                const box = await btn.boundingBox();
                if (!box || box.width === 0 || box.height === 0) {
                    consoleErrors.push(`[${viewName}] Botão índice ${i} renderizado com tamanho 0x0.`);
                }
                
                // Opcional: Hover para disparar listeners de tooltip e hover effects
                try {
                    await btn.hover({ timeout: 200 });
                } catch (e) {}
            }
        }

        // 4. Salvar Relatório
        const report = `
# Relatório de Auditoria Técnica (Console & UI)
Data: ${new Date().toISOString()}

## 🚨 Erros Críticos (Console.error)
${consoleErrors.length ? consoleErrors.join('\n') : '✅ Nenhum erro crítico encontrado.'}

## ⚠️ Avisos (Console.warn)
${consoleWarns.length ? consoleWarns.join('\n') : '✅ Nenhum aviso encontrado.'}

## 💥 Exceções de Página (Crashes)
${pageErrors.length ? pageErrors.join('\n') : '✅ Nenhuma exceção não tratada.'}

## 🌐 Falhas de Rede
${failedRequests.length ? failedRequests.join('\n') : '✅ Nenhuma falha de rede.'}
        `;

        const reportPath = path.join(process.cwd(), 'audit-report.log');
        fs.writeFileSync(reportPath, report);
        console.log(`\n📄 Relatório salvo em: ${reportPath}`);
    });
});
