
import { test, expect } from '@playwright/test';

// 🐛 AUTO-GENERATED REPRO SCRIPT
// Agent: Insights_Analyst
// Error: TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
[2m  - waiting for locator('.recharts-responsive-container').first() to be visible[22m
[2m    24 × locator resolved to hidden <div class="recharts-responsive-container"></div>[22m

// Generated at: 2025-12-15T04:18:30.585Z

test('Reproduce Bug - Insights_Analyst', async ({ page }) => {
    // 1. Initial State
    await page.goto('/');

    // Clique seguro
    await page.click('button:has-text("Login de Desenvolvedor")');

    // Navegar para Insights
    await page.click('text=Insights');

    // 🛑 The test failed here originally.
    // Assert expectation manually.
});
