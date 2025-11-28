import { Transaction, TransactionType } from '../types';

export interface Challenge {
    id: string;
    title: string;
    description: string;
    target: number;
    unit: 'currency' | 'count';
    rewardXp: number;
}

export const getMonthlyChallenges = (): Challenge[] => {
    const now = new Date();
    const month = now.getMonth();
    
    // Simple rotation of challenges based on month
    const challengesPool = [
        [
            { id: 'c1', title: 'Economia Mensal', description: 'Economize pelo menos R$ 500 este mês.', target: 500, unit: 'currency', rewardXp: 100 },
            { id: 'c2', title: 'Registro Constante', description: 'Registre 10 transações.', target: 10, unit: 'count', rewardXp: 50 }
        ],
        [
            { id: 'c3', title: 'Foco na Meta', description: 'Adicione R$ 200 a uma meta.', target: 200, unit: 'currency', rewardXp: 100 },
            { id: 'c4', title: 'Controle de Gastos', description: 'Mantenha as despesas abaixo de R$ 2000.', target: 2000, unit: 'currency', rewardXp: 150 } // Logic for "below" is different, maybe skip for now or handle specifically
        ]
    ];

    return challengesPool[month % challengesPool.length] as Challenge[];
};

export const calculateChallengeProgress = (challenge: Challenge, transactions: Transaction[]): number => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    if (challenge.id === 'c1') {
        // Savings = Income - Expenses
        const income = monthlyTransactions.filter(t => t.type === TransactionType.RECEITA).reduce((acc, t) => acc + t.amount, 0);
        const expenses = monthlyTransactions.filter(t => t.type === TransactionType.DESPESA).reduce((acc, t) => acc + Math.abs(t.amount), 0);
        return Math.max(0, income - expenses);
    }
    
    if (challenge.id === 'c2') {
        return monthlyTransactions.length;
    }

    if (challenge.id === 'c3') {
        // Goal contributions
        return monthlyTransactions
            .filter(t => t.goal_contribution_id)
            .reduce((acc, t) => acc + Math.abs(t.amount), 0);
    }

    return 0;
};
