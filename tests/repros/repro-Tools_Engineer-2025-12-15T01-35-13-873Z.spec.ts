
import { test, expect } from '@playwright/test';

// 🐛 AUTO-GENERATED REPRO SCRIPT
// Agent: Tools_Engineer
// Error: Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('.card').filter({ hasText: 'Calculadora de Juros Compostos' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for locator('.card').filter({ hasText: 'Calculadora de Juros Compostos' })[22m

// Generated at: 2025-12-15T01:35:13.873Z

test('Reproduce Bug - Tools_Engineer', async ({ page }) => {
    // 1. Initial State
    await page.goto('/');

    // Clique seguro
    await page.click('button:has-text("Login de Desenvolvedor")');

    // Navegar para Tools
    await page.click('text=Tools');

    // 🛑 The test failed here originally.
    // Assert expectation manually.
});
