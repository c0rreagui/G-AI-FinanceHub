
import { test, expect } from '@playwright/test';

// 🐛 AUTO-GENERATED REPRO SCRIPT
// Agent: Debt_Debtor
// Error: Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: getByText('Cartão de Crédito Master')
Expected: visible
Error: strict mode violation: getByText('Cartão de Crédito Master') resolved to 2 elements:
    1) <h3 class="text-2xl font-semibold leading-none tracking-tight">Cartão de Crédito Master</h3> aka getByRole('heading', { name: 'Cartão de Crédito Master', exact: true })
    2) <h2 id="modal-title" class="text-xl font-semibold text-white">Realizar Pagamento: Cartão de Crédito Master</h2> aka getByRole('heading', { name: 'Realizar Pagamento: Cartão de' })

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for getByText('Cartão de Crédito Master')[22m

// Generated at: 2025-12-15T01:11:51.381Z

test('Reproduce Bug - Debt_Debtor', async ({ page }) => {
    // 1. Initial State
    await page.goto('/');

    // Clique seguro
    await page.click('button:has-text("Login de Desenvolvedor")');

    // Navegar para Dívidas
    await page.click('text=Dívidas');

    // Clique seguro
    await page.click('getByRole('button', { name: 'Nova Dívida' }).first().or(locator('button:has(svg.lucide-plus), button:has(svg.lucide-plus-circle)')).first()');

    // Preencher "Nome da Dívida"
    await page.fill('Nome da Dívida', 'Cartão de Crédito Master');

    // Preencher "Valor Total (R$)"
    await page.fill('Valor Total (R$)', '5000.00');

    // Preencher "Taxa de Juros (% a.a.)"
    await page.fill('Taxa de Juros (% a.a.)', '14.5');

    // Clique seguro
    await page.click('getByRole('button', { name: 'Salvar Dívida' })');

    // 🛑 The test failed here originally.
    // Assert expectation manually.
});
