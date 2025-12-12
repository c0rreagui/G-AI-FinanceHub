export const Brain = {
    routes: {
        home: '/',
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
            signInBtn: 'button:has-text("Sign In")',
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
        short: 5000,
        medium: 10000,
        long: 30000,
        staggerBase: 0
    }
};
