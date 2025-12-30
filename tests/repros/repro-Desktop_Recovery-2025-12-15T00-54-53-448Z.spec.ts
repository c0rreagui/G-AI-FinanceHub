
import { test, expect } from '@playwright/test';

// 🐛 AUTO-GENERATED REPRO SCRIPT
// Agent: Desktop_Recovery
// Error: Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('#root, main, body')
Expected: visible
Error: strict mode violation: locator('#root, main, body') resolved to 3 elements:
    1) <body>…</body> aka locator('body')
    2) <div id="root">…</div> aka locator('#root')
    3) <main class="flex-1 flex flex-col overflow-hidden ">…</main> aka getByRole('main')

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for locator('#root, main, body')[22m

// Generated at: 2025-12-15T00:54:53.448Z

test('Reproduce Bug - Desktop_Recovery', async ({ page }) => {
    // 1. Initial State
    await page.goto('/');

    // Clique seguro
    await page.click('locator('button:has-text("Login de Desenvolvedor")')');

    // 🛑 The test failed here originally.
    // Assert expectation manually.
});
