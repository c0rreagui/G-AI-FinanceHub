
import { test, expect } from '@playwright/test';

// 🐛 AUTO-GENERATED REPRO SCRIPT
// Agent: Notification_Sentinel
// Error: Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: getByRole('heading', { name: 'Notificações' }).last()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for getByRole('heading', { name: 'Notificações' }).last()[22m

// Generated at: 2025-12-15T01:44:36.744Z

test('Reproduce Bug - Notification_Sentinel', async ({ page }) => {
    // 1. Initial State
    await page.goto('/');

    // Clique seguro
    await page.click('button:has-text("Login de Desenvolvedor")');

    // Clique seguro
    await page.click('locator('button').filter({ has: locator('svg.lucide-bell') }).last()');

    // 🛑 The test failed here originally.
    // Assert expectation manually.
});
