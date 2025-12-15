
import { test, expect } from '@playwright/test';

// 🐛 AUTO-GENERATED REPRO SCRIPT
// Agent: Desktop_NetSimpson
// Error: Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: getByText('Receitas vs Despesas')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" with timeout 60000ms[22m
[2m  - waiting for getByText('Receitas vs Despesas')[22m

// Generated at: 2025-12-15T01:00:44.626Z

test('Reproduce Bug - Desktop_NetSimpson', async ({ page }) => {
    // 1. Initial State
    await page.goto('/');

    // Clique seguro
    await page.click('locator('button:has-text("Login de Desenvolvedor")')');

    // Navegar para Insights
    await page.goto('Insights');

    // 🛑 The test failed here originally.
    // Assert expectation manually.
});
