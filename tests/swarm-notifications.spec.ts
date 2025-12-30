import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.describe('🔔 Enterprise Swarm - Notification Squad', () => {
    let agent: SwarmHelpers;

    test.afterEach(async ({}, testInfo) => {
        if (testInfo.status === 'failed' && agent) {
            console.log(`🧨 FALHA EM NOTIFICATIONS: ${testInfo.title}`);
            await agent.captureEvidence(`FAILURE_NOTIFICATIONS_${testInfo.title.replace(/\s+/g, '_')}`, testInfo.error as Error);
        }
    });

    // The Sentinel: Monitor Alerts
    test('The_Sentinel_Check_Notification_Center', async ({ page }) => {
        agent = new SwarmHelpers(page, 'Notification_Sentinel', '🔔');
        await agent.login();
        // Stay on Dashboard (Notifications are global)

        await agent.log('🛡️ The Sentinel: Verificando Central de Notificações...');
        
        // Find Bell Icon
        // Shadcn Tooltip removes native title. Target by Icon.
        // Capture console logs
        page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));

        // Find Bell Icon
        const bellBtn = page.getByTestId('notification-bell');
        await expect(bellBtn).toBeVisible();

        // Click to Open
        await bellBtn.click();
        await agent.log('🔔 Clicado no sino (GreetingHeader).');

        // Wait a bit for render
        await page.waitForTimeout(1000);

        // Verify Dialog Content
        const dialogTitle = page.getByRole('heading', { name: 'Notificações', level: 2 });
        await expect(dialogTitle).toBeVisible();

        // Verify Sheet Content (Clean Logic)
        const emptyState = page.getByText('Sem notificações');
        // const emptyStateDesc = page.getByText('Você está em dia!'); // Optional
        
        // Wait for animation
        await page.waitForTimeout(500);

        // If no notifications (default state), expect empty state
        if (await emptyState.isVisible()) {
             await agent.log('✅ Estado vazio detectado.');
        } else {
             // If items exist, good too.
             const items = page.locator('button[role="menuitem"]');
             if (await items.count() > 0) {
                 await agent.log(`✅ ${await items.count()} notificações detectadas.`);
             } else {
                  // Fallback check
                  await expect(page.getByText('Tudo em dia')).toBeVisible();
             }
        }

        // Close Notification Center (Click outside or X)
        // Usually clicking outside works or press Escape
        await page.keyboard.press('Escape');
        await expect(dialogTitle).not.toBeVisible();
        await agent.log('✅ Central fechada.');

        await agent.captureEvidence('notification_center_checked');
    });
});
