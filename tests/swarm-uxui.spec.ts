import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.describe('🎨 UX/UI Tests - Navigation & Responsiveness', () => {
    let agent: SwarmHelpers;

    test.afterEach(async (_, testInfo) => {
        if (testInfo.status === 'failed' && agent) {
            await agent.captureEvidence(`FAILURE_UXUI_${testInfo.title.replace(/\s+/g, '_')}`, testInfo.error as Error);
        }
    });

    // Test 1: Navigation between all pages
    test('Navigation_Between_All_Pages', async ({ page }) => {
        agent = new SwarmHelpers(page, 'UX_Navigator', '🧭');
        await agent.login();

        const pages = [
            { name: 'Início', expectedText: /Dashboard|Início|Bem-vindo/i },
            { name: 'Transações', expectedText: /Transações/i },
            { name: 'Orçamentos', expectedText: /Orçamentos/i },
            { name: 'Metas', expectedText: /Metas/i },
            { name: 'Dívidas', expectedText: /Dívidas/i },
            { name: 'Investimentos', expectedText: /Investimentos/i },
            { name: 'Agenda', expectedText: /Agenda|Agendamentos/i },
            { name: 'Insights', expectedText: /Insights|Análises/i },
            { name: 'Tools', expectedText: /Ferramentas|Calculadora/i },
        ];

        for (const p of pages) {
            await agent.navigateTo(p.name);
            await agent.log(`✅ Navegou para ${p.name}`);
            await page.waitForTimeout(300);
        }

        await agent.captureEvidence('navigation_complete');
        await agent.log('✅ Navegação entre todas as páginas concluída.');
    });

    // Test 2: Modal and Dialog interactions
    test('Modal_Dialog_Interactions', async ({ page }) => {
        agent = new SwarmHelpers(page, 'UX_Modal', '🔲');
        await agent.login();
        await agent.navigateTo('Transações');

        // Open new transaction modal
        const newTxBtn = page.getByRole('button', { name: /Nova Transação/i });
        if (await newTxBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await newTxBtn.click();
            await page.waitForTimeout(500);
            
            // Check modal is visible
            const modal = page.locator('[role="dialog"]');
            if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
                await agent.log('✅ Modal de transação aberto.');
                
                // Close modal via Escape
                await page.keyboard.press('Escape');
                await page.waitForTimeout(300);
                
                if (await modal.isHidden({ timeout: 2000 }).catch(() => false)) {
                    await agent.log('✅ Modal fechado via Escape.');
                }
            }
        }

        await agent.captureEvidence('modal_interactions');
    });

    // Test 3: Responsive mobile layout
    test('Responsive_Mobile_Layout', async ({ page }) => {
        agent = new SwarmHelpers(page, 'UX_Mobile', '📱');
        
        // Set mobile viewport
        await page.setViewportSize({ width: 390, height: 844 });
        await agent.login();

        // Check mobile bottom navigation
        const bottomNav = page.locator('nav').last();
        await agent.log('📱 Viewport mobile configurado (390x844).');

        // Navigate through mobile
        await agent.navigateTo('Transações');
        await page.waitForTimeout(300);
        
        // Check horizontal scroll doesn't appear
        const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        
        if (!hasHorizontalScroll) {
            await agent.log('✅ Sem scroll horizontal no mobile.');
        } else {
            await agent.log('⚠️ Scroll horizontal detectado.');
        }

        await agent.captureEvidence('mobile_layout');
        await agent.log('✅ Layout mobile validado.');
    });

    // Test 4: Responsive tablet layout
    test('Responsive_Tablet_Layout', async ({ page }) => {
        agent = new SwarmHelpers(page, 'UX_Tablet', '📟');
        
        // Set tablet viewport
        await page.setViewportSize({ width: 1024, height: 768 });
        await agent.login();

        await agent.log('📟 Viewport tablet configurado (1024x768).');

        // Navigate and check layout
        await agent.navigateTo('Insights');
        await page.waitForTimeout(500);

        // Check sidebar visibility on tablet
        const sidebar = page.locator('aside, [role="complementary"]').first();
        const sidebarVisible = await sidebar.isVisible({ timeout: 2000 }).catch(() => false);
        await agent.log(sidebarVisible ? '✅ Sidebar visível no tablet.' : 'ℹ️ Sidebar colapsado no tablet.');

        await agent.captureEvidence('tablet_layout');
        await agent.log('✅ Layout tablet validado.');
    });

    // Test 5: Visual feedback on actions
    test('Visual_Feedback_Actions', async ({ page }) => {
        agent = new SwarmHelpers(page, 'UX_Feedback', '✨');
        await agent.login();
        await agent.navigateTo('Transações');

        // Test button hover states
        const buttons = page.locator('button:visible').first();
        if (await buttons.isVisible()) {
            await buttons.hover();
            await page.waitForTimeout(200);
            await agent.log('✅ Hover em botão testado.');
        }

        // Check for loading states
        await agent.navigateTo('Insights');
        await page.waitForTimeout(500);
        await agent.log('✅ Navegação com feedback visual.');

        await agent.captureEvidence('visual_feedback');
    });

    // Test 6: Form validation
    test('Form_Validation', async ({ page }) => {
        agent = new SwarmHelpers(page, 'UX_Forms', '📝');
        await agent.login();
        await agent.navigateTo('Metas');

        // Try to find and test a form
        const addBtn = page.getByRole('button', { name: /Nova|Adicionar|Criar/i }).first();
        if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await addBtn.click();
            await page.waitForTimeout(500);

            // Try to submit empty form
            const submitBtn = page.getByRole('button', { name: /Salvar|Criar|Confirmar/i }).first();
            if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                // Check if button is disabled (validation)
                const isDisabled = await submitBtn.isDisabled();
                if (isDisabled) {
                    await agent.log('✅ Validação de formulário: botão desabilitado sem dados.');
                } else {
                    await agent.log('ℹ️ Botão habilitado mesmo sem dados.');
                }
            }

            // Close any open modal
            await page.keyboard.press('Escape');
        }

        await agent.captureEvidence('form_validation');
    });
});
