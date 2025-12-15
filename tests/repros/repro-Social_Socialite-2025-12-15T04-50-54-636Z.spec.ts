
import { test, expect } from '@playwright/test';

// 🐛 AUTO-GENERATED REPRO SCRIPT
// Agent: Social_Socialite
// Error: Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: getByRole('heading', { name: 'Família Swarm' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" with timeout 10000ms[22m
[2m  - waiting for getByRole('heading', { name: 'Família Swarm' })[22m

// Generated at: 2025-12-15T04:50:54.636Z

test('Reproduce Bug - Social_Socialite', async ({ page }) => {
    // 1. Initial State
    await page.goto('/');

    // Clique seguro
    await page.click('button:has-text("Login de Desenvolvedor")');

    // Navegar para Família
    await page.click('text=Família');

    // Preencher "Nome da Família"
    await page.fill('Nome da Família', 'Família Swarm');

    // Clique seguro
    await page.click('getByRole('button', { name: 'Criar Família' })');

    // 🛑 The test failed here originally.
    // Assert expectation manually.
});
