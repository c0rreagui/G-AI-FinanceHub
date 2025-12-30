
import { test, expect } from '@playwright/test';

// 🐛 AUTO-GENERATED REPRO SCRIPT
// Agent: Tools_Engineer
// Error: Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: getByText('Ferramentas', { exact: true })
Expected: visible
Error: strict mode violation: getByText('Ferramentas', { exact: true }) resolved to 2 elements:
    1) <h1 class="text-3xl font-bold tracking-tight text-foreground">Ferramentas</h1> aka getByRole('heading', { name: 'Ferramentas' })
    2) <span>Ferramentas</span> aka locator('span').filter({ hasText: 'Ferramentas' })

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for getByText('Ferramentas', { exact: true })[22m

// Generated at: 2025-12-15T01:33:38.874Z

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
