
import { test, expect } from '@playwright/test';

// 🐛 AUTO-GENERATED REPRO SCRIPT
// Agent: Notification_Sentinel
// Error: Error: locator.isVisible: Error: strict mode violation: locator('text=Sem notificações').or(locator('text=Tudo em dia')) resolved to 2 elements:
    1) <p class="text-sm text-muted-foreground">Tudo em dia</p> aka getByText('Tudo em dia')
    2) <h3 class="text-lg font-medium text-foreground">Sem notificações</h3> aka getByRole('heading', { name: 'Sem notificações' })

Call log:
[2m    - checking visibility of locator('text=Sem notificações').or(locator('text=Tudo em dia'))[22m

// Generated at: 2025-12-15T02:38:27.534Z

test('Reproduce Bug - Notification_Sentinel', async ({ page }) => {
    // 1. Initial State
    await page.goto('/');

    // Clique seguro
    await page.click('button:has-text("Login de Desenvolvedor")');

    // 🛑 The test failed here originally.
    // Assert expectation manually.
});
