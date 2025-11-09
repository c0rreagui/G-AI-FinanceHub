import React, { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import {
    Transaction, Goal, Debt, Summary, ScheduledTransaction, UserLevel, Achievement, Category,
    TransactionType, GoalStatus, DebtStatus, ScheduledTransactionFrequency, UserRank
} from '../types';
import {
    Utensils, ShoppingCart, Car, Shirt, PiggyBank, Heart, BookOpen, Gift, Plane, HomeIcon, Dumbbell, Gamepad, Film, ArrowUpRight, TrendingDown, Wallet, Lightbulb, Target
} from '../components/Icons';
import { useAuth } from './useAuth';
import { supabase } from '../services/supabaseClient';

interface DashboardDataContextType {
    transactions: Transaction[];
    goals: Goal[];
    debts: Debt[];
    summary: Summary;
    scheduledTransactions: ScheduledTransaction[];
    userLevel: UserLevel;
    achievements: Achievement[];
    categories: Category[];
    loading: boolean;
    error: string | null;
    clearError: () => void;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'category'>) => Promise<void>;
    addGoal: (goal: Omit<Goal, 'id'|'currentAmount'|'status'>) => Promise<void>;
    addDebt: (debt: Omit<Debt, 'id'|'paidAmount'|'status'>) => Promise<void>;
}

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined);

const MOCK_CATEGORIES: Category[] = [
    { id: 'cat1', name: 'Alimentação', icon: Utensils, color: '#f59e0b' },
    { id: 'cat2', name: 'Compras', icon: ShoppingCart, color: '#8b5cf6' },
    { id: 'cat3', name: 'Transporte', icon: Car, color: '#3b82f6' },
    { id: 'cat4', name: 'Vestuário', icon: Shirt, color: '#ec4899' },
    { id: 'cat5', name: 'Salário', icon: ArrowUpRight, color: '#10b981' },
    { id: 'cat6', name: 'Moradia', icon: HomeIcon, color: '#6366f1' },
    { id: 'cat7', name: 'Saúde', icon: Heart, color: '#ef4444' },
    { id: 'cat8', name: 'Educação', icon: BookOpen, color: '#14b8a6' },
    { id: 'cat9', name: 'Lazer', icon: Gamepad, color: '#d946ef' },
    { id: 'cat10', name: 'Investimentos', icon: PiggyBank, color: '#22c55e' },
    { id: 'cat11', name: 'Dívidas', icon: TrendingDown, color: '#f43f5e' },
    { id: 'cat12', name: 'Outros', icon: Gift, color: '#a8a29e' },
];

export const DashboardDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [debts, setDebts] = useState<Debt[]>([]);
    const [scheduledTransactions, setScheduledTransactions] = useState<ScheduledTransaction[]>([]);
    const [userLevel, setUserLevel] = useState<UserLevel>({ level: 1, xp: 0, xpToNextLevel: 100, rank: UserRank.BRONZE });
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);
    
    const categoryMap = new Map(MOCK_CATEGORIES.map(c => [c.id, c]));

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            // Mock data for demonstration purposes. In a real app, this would be an API call.
            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

            const initialTransactions: Transaction[] = [
                { id: '1', user_id: user.id, description: 'Almoço no restaurante', amount: -45.50, date: new Date().toISOString(), type: TransactionType.DESPESA, category: MOCK_CATEGORIES[0] },
                { id: '2', user_id: user.id, description: 'Salário do mês', amount: 5000, date: firstDayOfMonth, type: TransactionType.RECEITA, category: MOCK_CATEGORIES[4] },
                { id: '3', user_id: user.id, description: 'Compra de Jogo', amount: -150, date: new Date(Date.now() - 2 * 86400000).toISOString(), type: TransactionType.DESPESA, category: MOCK_CATEGORIES[8] },
                { id: '4', user_id: user.id, description: 'Uber para o trabalho', amount: -25.00, date: new Date(Date.now() - 3 * 86400000).toISOString(), type: TransactionType.DESPESA, category: MOCK_CATEGORIES[2] },
                { id: '5', user_id: user.id, description: 'Aluguel', amount: -1500, date: new Date(Date.now() - 5 * 86400000).toISOString(), type: TransactionType.DESPESA, category: MOCK_CATEGORIES[5] },
            ];
            setTransactions(initialTransactions);

            setGoals([
                { id: 'g1', name: 'Viagem para o Japão', targetAmount: 20000, currentAmount: 8500, deadline: '2025-12-31T00:00:00Z', status: GoalStatus.EM_ANDAMENTO },
                { id: 'g2', name: 'Reserva de Emergência', targetAmount: 15000, currentAmount: 15000, deadline: '2024-06-30T00:00:00Z', status: GoalStatus.CONCLUIDA },
            ]);
            setDebts([
                { id: 'd1', name: 'Financiamento do Carro', totalAmount: 45000, paidAmount: 20000, interestRate: 12.5, category: 'Veículo', status: DebtStatus.ATIVA },
            ]);
            setScheduledTransactions([
                { id: 'st1', description: 'Assinatura Netflix', amount: 39.90, type: TransactionType.DESPESA, category: MOCK_CATEGORIES[1], startDate: '2023-01-10T00:00:00Z', frequency: ScheduledTransactionFrequency.MENSAL, nextDueDate: new Date(today.getFullYear(), today.getMonth() + 1, 10).toISOString() },
                { id: 'st2', description: 'Conta de Internet', amount: 120.00, type: TransactionType.DESPESA, category: MOCK_CATEGORIES[5], startDate: '2023-01-15T00:00:00Z', frequency: ScheduledTransactionFrequency.MENSAL, nextDueDate: new Date(today.getFullYear(), today.getMonth() + 1, 15).toISOString() },
            ]);
            setAchievements([
                { id: 'ac1', name: 'Primeiros Passos', description: 'Adicionou sua primeira transação.', unlocked: true, dateUnlocked: new Date().toISOString(), icon: Wallet },
                { id: 'ac2', name: 'Planejador', description: 'Criou sua primeira meta financeira.', unlocked: true, dateUnlocked: new Date().toISOString(), icon: Target },
                { id: 'ac3', name: 'Economista', description: 'Manteve as despesas abaixo da receita por um mês.', unlocked: false, icon: Lightbulb },
            ]);
            setUserLevel({ level: 5, xp: 450, xpToNextLevel: 1000, rank: UserRank.BRONZE });
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const summary = useMemo<Summary>(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyIncome = transactions
            .filter(t => t.type === TransactionType.RECEITA && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);

        const monthlyExpenses = transactions
            .filter(t => t.type === TransactionType.DESPESA && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);

        const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 12540.78); // Assuming a starting balance for demo

        return { totalBalance, monthlyIncome, monthlyExpenses };
    }, [transactions]);

    const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'category'>) => {
        const newTransaction: Transaction = {
            ...transactionData,
            id: new Date().getTime().toString(),
            category: categoryMap.get(transactionData.category_id || 'cat12') || MOCK_CATEGORIES[11],
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const addGoal = async (goalData: Omit<Goal, 'id'|'currentAmount'|'status'>) => {
        const newGoal: Goal = {
            ...goalData,
            id: new Date().getTime().toString(),
            currentAmount: 0,
            status: GoalStatus.EM_ANDAMENTO,
        };
        setGoals(prev => [newGoal, ...prev]);
    };

    const addDebt = async (debtData: Omit<Debt, 'id'|'paidAmount'|'status'>) => {
        const newDebt: Debt = {
            ...debtData,
            id: new Date().getTime().toString(),
            paidAmount: 0,
            status: DebtStatus.ATIVA,
        };
        setDebts(prev => [newDebt, ...prev]);
    };

    const value = {
        transactions, goals, debts, summary, scheduledTransactions, userLevel, achievements,
        categories: MOCK_CATEGORIES,
        loading, error, clearError, addTransaction, addGoal, addDebt
    };

    return React.createElement(DashboardDataContext.Provider, { value: value }, children);
};

export const useDashboardData = (): DashboardDataContextType => {
    const context = useContext(DashboardDataContext);
    if (context === undefined) {
        throw new Error('useDashboardData must be used within a DashboardDataProvider');
    }
    return context;
};