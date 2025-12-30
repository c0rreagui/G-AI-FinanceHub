
import { test, expect } from '@playwright/test';

// 🐛 AUTO-GENERATED REPRO SCRIPT
// Agent: Desktop_BugHunter
// Error: Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('[role="button"]:has-text("Nova Transação")').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for locator('[role="button"]:has-text("Nova Transação")').first()[22m

// Generated at: 2025-12-15T04:39:03.137Z

test('Reproduce Bug - Desktop_BugHunter', async ({ page }) => {
    // 1. Initial State
    await page.goto('/');

    // Clique seguro
    await page.click('button:has-text("Login de Desenvolvedor")');

    // Navegar para Transações
    await page.click('text=Transações');

    // 🛑 The test failed here originally.
    // Assert expectation manually.
});
