import { test, expect } from '@playwright/test';

test.describe('Visual Verification: Sidebar', () => {
    test.use({ baseURL: 'http://localhost:3002' });

    // Simple inline login helper
    const login = async (page) => {
        await page.goto('/');
        // Try to handle dev login or auto-login
        try {
            const loginBtn = page.locator('button:has-text("Login")');
            if (await loginBtn.isVisible({ timeout: 2000 })) {
                await loginBtn.click();
                // Simple PIN fill if needed (mocked usually in dev)
                const pinInput = page.locator('input[type="password"]');
                if (await pinInput.isVisible()) {
                    await pinInput.fill('123456'); // Default dev pin often
                    await page.keyboard.press('Enter');
                }
            }
        } catch (e) {
            // Already logged in or different flow
        }
        // Wait for Sidebar instead of specific text (more robust)
        await page.waitForSelector('aside', { state: 'visible', timeout: 15000 });
    };

    test('Should render sidebar items correctly in active and inactive states', async ({ page }) => {
        await login(page);

        // Wait for animations to settle
        await page.waitForTimeout(2000);

        // Sidebar locator
        const sidebar = page.locator('aside');
        await expect(sidebar).toBeVisible();

        // 1. Capture Dashboard Active State (Default)
        // Ensure "Visão Geral" is active (usually checked by color)
        await sidebar.screenshot({ path: 'artifacts/sidebar-active-dashboard.png' });
        console.log('📸 Captured Dashboard Active State');

        // 2. Navigate to Transactions
        const transactionsBtn = page.locator('button:has-text("Transações")');
        await transactionsBtn.click();
        await page.waitForSelector('text=Nova Transação', { state: 'visible' });
        await page.waitForTimeout(1000); // Wait for transition
        await sidebar.screenshot({ path: 'artifacts/sidebar-active-transactions.png' });
        console.log('📸 Captured Transactions Active State');

        // 3. Navigate to Goals
        const goalsBtn = page.locator('button:has-text("Metas")');
        await goalsBtn.click();
        await page.waitForSelector('text=Nova Meta', { state: 'visible' });
        await page.waitForTimeout(1000);
        await sidebar.screenshot({ path: 'artifacts/sidebar-active-goals.png' });
        console.log('📸 Captured Goals Active State');

        // 4. Hover Verification
        const toolsBtn = page.locator('button:has-text("Ferramentas")');
        await toolsBtn.hover();
        await page.waitForTimeout(500);
        await sidebar.screenshot({ path: 'artifacts/sidebar-hover-tools.png' });
        console.log('📸 Captured Sidebar Hover State');
    });
});
