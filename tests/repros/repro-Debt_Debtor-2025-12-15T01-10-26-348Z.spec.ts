
import { test, expect } from '@playwright/test';

// 🐛 AUTO-GENERATED REPRO SCRIPT
// Agent: Debt_Debtor
// Error: Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('text=Adicionar Nova Dívida').or(locator('text=Nova Dívida'))
Expected: visible
Error: strict mode violation: locator('text=Adicionar Nova Dívida').or(locator('text=Nova Dívida')) resolved to 2 elements:
    1) <button class="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-glow hover:-translate-y-0.5 h-10 px-4 py-2">…</button> aka getByRole('button', { name: 'Nova Dívida' })
    2) <h2 id="modal-title" class="text-xl font-semibold text-white">Adicionar Nova Dívida</h2> aka getByRole('heading', { name: 'Adicionar Nova Dívida' })

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for locator('text=Adicionar Nova Dívida').or(locator('text=Nova Dívida'))[22m

// Generated at: 2025-12-15T01:10:26.348Z

test('Reproduce Bug - Debt_Debtor', async ({ page }) => {
    // 1. Initial State
    await page.goto('/');

    // Clique seguro
    await page.click('button:has-text("Login de Desenvolvedor")');

    // Navegar para Dívidas
    await page.click('text=Dívidas');

    // Clique seguro
    await page.click('getByRole('button', { name: 'Nova Dívida' }).first().or(locator('button:has(svg.lucide-plus), button:has(svg.lucide-plus-circle)')).first()');

    // 🛑 The test failed here originally.
    // Assert expectation manually.
});
