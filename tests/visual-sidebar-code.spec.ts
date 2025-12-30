import { test, expect } from '@playwright/test';
import { SwarmHelpers } from './utils/SwarmHelpers';

test.describe('Code-Level Verification: Sidebar Styles', () => {
    test.use({ baseURL: 'http://localhost:3002' });

    test('Should match exact CSS classes for active state', async ({ page }) => {
        // Use the robust SwarmHelpers for login
        const agent = new SwarmHelpers(page, 'VisualVerifier', '👁️');
        
        await agent.log('Iniciando verificação visual programática...');
        await agent.login();
        
        // Wait for Sidebar to be ready
        await page.waitForSelector('nav button', { state: 'visible', timeout: 15000 });

        // 1. Dashboard is Active by Default
        agent.log('🔍 Verifying Dashboard Active State...');
        const homeBtn = page.locator('nav button').filter({ hasText: 'Início' }).first();
        
        // Assert Button Classes
        await expect(homeBtn).toHaveClass(/bg-primary\/10/);
        await expect(homeBtn).toHaveClass(/text-primary/);

        // Assert Icons and Text
        const homeIcon = homeBtn.locator('svg').first();
        await expect(homeIcon).toHaveClass(/text-primary/);
        await expect(homeIcon).toHaveClass(/drop-shadow-/);

        // Assert Absence of Conflicting Bar
        const conflictBar = homeBtn.locator('.rounded-r-full');
        await expect(conflictBar).toHaveCount(0);
        agent.log('✅ Visual Conflict Bar (rounded-r-full) is correctly REMOVED.');

        // 2. Navigate to Transactions
        agent.log('🔄 Switching to Transactions...');
        
        // Use agent navigation or manual click
        const transactionsBtn = page.locator('aside button, nav button').filter({ hasText: 'Transações' }).first();
        await transactionsBtn.click();
        await page.waitForTimeout(500); // Animation

        // Assert Transactions Active
        await expect(transactionsBtn).toHaveClass(/bg-primary\/10/);
        await expect(transactionsBtn).toHaveClass(/text-primary/); 

        // Assert Home Inactive
        agent.log('🔍 Verifying Home Inactive State...');
        await expect(homeBtn).not.toHaveClass(/bg-primary\/10/);
        await expect(homeBtn).toHaveClass(/text-muted-foreground/);

        agent.log('✅ Sidebar Visual Logic Confirmed via Code.');
    });
});
