export const Brain = {
    routes: {
        home: 'http://localhost:3000/',
        transactions: '/transactions',
        goals: '/goals',
        debts: '/debts',
        insights: '/insights',
        settings: '/settings',
        social: '/social',
        investments: '/investments'
    },
    selectors: {
        login: {
            authCheck: 'text=Saldo Total',
            // Prioriza o Login de Desenvolvedor para bypass rápido
            signInBtn: 'button:has-text("Login de Desenvolvedor")',
            pinInput: 'input[type="password"], input[name="pin"], input[placeholder*="PIN"], input[type="tel"], input[type="number"], input[inputmode="numeric"]',
            pinCode: '2609',
            fallbackDashboard: '[data-testid="dashboard-view"]'
        },
        modal: {
            trigger: 'button:has-text("Nova Transação")',
            dialog: '[role="dialog"]',
            saveBtn: 'button:has-text("Salvar")',
            cancelBtn: 'button:has-text("Cancelar")'
        },
        inputs: {
            amount: '0,00',
            description: 'Ex: Supermercado, Salário...'
        }
    },
    timeouts: {
        short: 2000,    // Was 5000
        medium: 5000,   // Was 10000
        long: 10000,    // Was 30000
        staggerBase: 0
    }
};
