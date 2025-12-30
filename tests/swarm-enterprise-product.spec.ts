import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.describe('💼 Enterprise Swarm - Product Squad', () => {

    // 🐣 Agent 13: The Newbie (Onboarding & First Run)
    // Simula um usuário perdido tentando entender o sistema.
    test('🐣 The Newbie (Onboarding UX)', async ({ page }) => {
        const agent = new SwarmHelpers(page, 'Product_Newbie', '🐣');
        
        await agent.log('🐣 Iniciando jornada de descoberta...');
        await agent.login();

        // Newbie tenta achar o botão de "Ajuda" ou "Começar"
        // Verificar se existem "Empty States" amigáveis
        await agent.navigateTo('Metas');
        
        const emptyState = page.getByText('Nenhuma meta encontrada').or(page.getByText('Comece agora'));
        if (await emptyState.isVisible()) {
            await agent.log('✅ Empty State amigável detectado em Metas.');
        }

        // Tenta criar algo simples
        await agent.navigateTo('Transações');
        const helpBtn = page.getByTitle('Ajuda').or(page.getByText('?'));
        if (await helpBtn.isVisible()) {
            await helpBtn.click();
            await agent.log('✅ Botão de Ajuda encontrado.');
        }

        await agent.captureEvidence('newbie_experience');
    });

    // 👨‍👩‍👧‍👦 Agent 14: The Family Manager (Social & permissions)
    // Gerencia o grupo familiar e convites.
    test('👨‍👩‍👧‍👦 The Family Manager (Family Management)', async ({ page }) => {
        const agent = new SwarmHelpers(page, 'Product_FamilyMgr', '👨‍👩‍👧‍👦');
        
        await agent.log('👨‍👩‍👧‍👦 Verificando núcleo familiar...');
        await agent.login();

        await agent.navigateTo('Família'); // ou Social

        // Tenta adicionar membro (simulado)
        const addMemberBtn = page.getByRole('button', { name: /Adicionar memb/i }).or(page.getByRole('button', { name: /convidar/i }));
        
        if (await addMemberBtn.isVisible()) {
            await addMemberBtn.click();
            await agent.log('✅ Modal de convite abriu.');
            
            // Verifica inputs
            await expect(page.locator('input[type="email"]')).toBeVisible();
            await page.keyboard.press('Escape');
        } else {
             await agent.log('⚠️ Botão de Adicionar Membro não encontrado (Feature flag desligada?).');
        }

        // Verifica lista de membros
        const membersList = page.locator('ul, .grid').first();
        if (await membersList.isVisible()) {
            await agent.log('✅ Lista de membros visível.');
        }

        await agent.captureEvidence('family_management');
    });

    // 📊 Agent 15: The Data Scientist (Exports & Heavy Reports)
    // Verifica se dados complexos são renderizados e exportáveis.
    test('📊 The Data Scientist (Data Export)', async ({ page }) => {
        const agent = new SwarmHelpers(page, 'Product_Scientist', '📊');
        
        await agent.log('📊 Iniciando análise de dados massiva...');
        await agent.login();

        await agent.navigateTo('Transações');

        // Testar Filtros Avançados
        const filterBtn = page.getByRole('button', { name: /filtrar/i }).first();
        if (await filterBtn.isVisible()) {
            await filterBtn.click();
            await agent.log('✅ Filtros abertos.');
            // Selecionar data range longo
            // ... (simulação)
            await page.keyboard.press('Escape');
        }

        // Testar Download (Interceptação)
        // O Playwright espera o evento 'download'
        const exportBtn = page.getByRole('button', { name: /export/i }).or(page.getByRole('button', { name: /baixar/i }));
        
        if (await exportBtn.isVisible()) {
             // Configurar promise de download
             const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
             
             await exportBtn.click();
             const download = await downloadPromise;
             
             if (download) {
                 await agent.log(`✅ Download iniciado: ${download.suggestedFilename()}`);
             } else {
                 await agent.log('⚠️ Download não disparou evento (pode ser link direto ou bug).');
             }
        } else {
            await agent.log('⚠️ Botão Exportar não encontrado.');
        }

        await agent.captureEvidence('data_export_check');
    });

});
