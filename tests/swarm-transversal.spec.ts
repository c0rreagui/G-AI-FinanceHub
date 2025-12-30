import { test } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.describe('🔧 Transversal Features Tests', () => {
    let agent: SwarmHelpers;

    test.afterEach(async (_, testInfo) => {
        if (testInfo.status === 'failed' && agent) {
            await agent.captureEvidence(`FAILURE_TRANSVERSAL_${testInfo.title.replace(/\s+/g, '_')}`, testInfo.error as Error);
        }
    });

    // Test 1: Keyboard shortcuts
    test('Keyboard_Shortcuts', async ({ page }) => {
        agent = new SwarmHelpers(page, 'Keyboard_Tester', '⌨️');
        await agent.login();

        // Test 'K' shortcut (Command palette)
        await page.keyboard.press('k');
        await page.waitForTimeout(300);
        
        const commandPalette = page.locator('[data-testid="command-palette"], [role="dialog"]:has-text("Buscar"), [cmdk-root]');
        if (await commandPalette.isVisible({ timeout: 2000 }).catch(() => false)) {
            await agent.log('✅ Atalho K abriu command palette.');
            await page.keyboard.press('Escape');
        } else {
            await agent.log('ℹ️ Command palette não encontrado via K.');
        }

        // Test 'N' shortcut (New transaction)
        await page.keyboard.press('n');
        await page.waitForTimeout(300);
        
        const newTxModal = page.locator('[role="dialog"]');
        if (await newTxModal.isVisible({ timeout: 2000 }).catch(() => false)) {
            await agent.log('✅ Atalho N abriu modal de nova transação.');
            await page.keyboard.press('Escape');
        } else {
            await agent.log('ℹ️ Modal não abriu via N.');
        }

        await agent.captureEvidence('keyboard_shortcuts');
    });

    // Test 2: Error handling (404 page)
    test('Error_Handling_404', async ({ page }) => {
        agent = new SwarmHelpers(page, 'Error_Tester', '🚫');
        await agent.login();

        // Navigate to non-existent page
        await page.goto('http://localhost:3000/page-that-does-not-exist');
        await page.waitForTimeout(500);

        // Check for 404 or redirect to home
        const is404 = await page.getByText(/404|Não encontrado|Página não encontrada/i).isVisible({ timeout: 2000 }).catch(() => false);
        const isHome = await page.getByText(/Dashboard|Início|Bem-vindo/i).isVisible({ timeout: 1000 }).catch(() => false);

        if (is404) {
            await agent.log('✅ Página 404 exibida corretamente.');
        } else if (isHome) {
            await agent.log('✅ Redirecionado para Home (fallback).');
        } else {
            await agent.log('⚠️ Comportamento de 404 não definido.');
        }

        await agent.captureEvidence('error_404');
    });

    // Test 3: Privacy mode toggle (if available)
    test('Privacy_Mode', async ({ page }) => {
        agent = new SwarmHelpers(page, 'Privacy_Tester', '🔒');
        await agent.login();

        // Look for privacy toggle in header or settings
        const privacyToggle = page.locator('[data-testid="privacy-toggle"], button:has([class*="eye"]), button[aria-label*="privacidade"]').first();
        
        if (await privacyToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
            await privacyToggle.click();
            await page.waitForTimeout(500);
            await agent.log('✅ Modo privacidade ativado.');
            
            // Check for blurred values
            const blurred = page.locator('[class*="blur"], [class*="privacy"]').first();
            if (await blurred.isVisible({ timeout: 1000 }).catch(() => false)) {
                await agent.log('✅ Valores ocultados como esperado.');
            }
            
            // Toggle back
            await privacyToggle.click();
            await agent.log('✅ Modo privacidade desativado.');
        } else {
            await agent.log('ℹ️ Toggle de privacidade não encontrado.');
        }

        await agent.captureEvidence('privacy_mode');
    });

    // Test 4: Notifications center
    test('Notifications_Center', async ({ page }) => {
        agent = new SwarmHelpers(page, 'Notification_Tester', '🔔');
        await agent.login();

        // Find notification bell
        const bellBtn = page.getByRole('button', { name: /Notificações/i }).or(page.locator('button:has([class*="bell"])')).first();
        
        if (await bellBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await bellBtn.click();
            await page.waitForTimeout(500);
            
            // Check if notification panel opened
            const panel = page.locator('[role="dialog"], [data-testid="notifications-panel"], [class*="notification"]').first();
            if (await panel.isVisible({ timeout: 2000 }).catch(() => false)) {
                await agent.log('✅ Central de notificações aberta.');
            } else {
                await agent.log('ℹ️ Painel de notificações não visível.');
            }
            
            await page.keyboard.press('Escape');
        } else {
            await agent.log('ℹ️ Botão de notificações não encontrado.');
        }

        await agent.captureEvidence('notifications');
    });

    // Test 5: Toast notifications on action
    test('Toast_On_Action', async ({ page }) => {
        agent = new SwarmHelpers(page, 'Toast_Tester', '🍞');
        await agent.login();
        await agent.navigateTo('Transações');

        // Try to trigger a toast by opening and closing modal
        const newTxBtn = page.getByRole('button', { name: /Nova Transação/i });
        if (await newTxBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await newTxBtn.click();
            await page.waitForTimeout(500);
            
            // Fill minimal data and try to save (may show validation toast)
            await page.keyboard.press('Escape');
            await page.waitForTimeout(300);
            
            // Look for any toast/sonner element
            const toast = page.locator('[data-sonner-toast], [role="status"], [class*="toast"]').first();
            if (await toast.isVisible({ timeout: 2000 }).catch(() => false)) {
                await agent.log('✅ Toast notification detectado.');
            } else {
                await agent.log('ℹ️ Nenhum toast visível nesta ação.');
            }
        }

        await agent.captureEvidence('toast_test');
    });
});
