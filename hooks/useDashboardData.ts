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
    addScheduledTransaction: (scheduledTx: Omit<ScheduledTransaction, 'id'|'category'|'nextDueDate'>) => Promise<void>;
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
    
    const categoryMap = useMemo(() => new Map(MOCK_CATEGORIES.map(c => [c.id, c])), []);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const [
                transactionsResponse,
                goalsResponse,
                debtsResponse,
                scheduledTransactionsResponse,
            ] = await Promise.all([
                supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
                supabase.from('goals').select('*').eq('user_id', user.id),
                supabase.from('debts').select('*').eq('user_id', user.id),
                supabase.from('scheduled_transactions').select('*').eq('user_id', user.id),
            ]);

            if (transactionsResponse.error) throw transactionsResponse.error;
            if (goalsResponse.error) throw goalsResponse.error;
            if (debtsResponse.error) throw debtsResponse.error;
            if (scheduledTransactionsResponse.error) throw scheduledTransactionsResponse.error;
            
            const enrichedTransactions = transactionsResponse.data.map(t => ({
                ...t,
                category: categoryMap.get(t.category_id || 'cat12') || MOCK_CATEGORIES[11],
            }));
            setTransactions(enrichedTransactions);
            
            setGoals(goalsResponse.data as Goal[]);
            setDebts(debtsResponse.data as Debt[]);
            
            const enrichedScheduled = scheduledTransactionsResponse.data.map(st => ({
                ...st,
                category: categoryMap.get(st.category_id || 'cat12') || MOCK_CATEGORIES[11],
            }));
            setScheduledTransactions(enrichedScheduled as ScheduledTransaction[]);
            
            // Mocked for now as tables don't exist
            setAchievements([
                { id: 'ac1', name: 'Primeiros Passos', description: 'Adicionou sua primeira transação.', unlocked: transactionsResponse.data.length > 0, dateUnlocked: new Date().toISOString(), icon: Wallet },
                { id: 'ac2', name: 'Planejador', description: 'Criou sua primeira meta financeira.', unlocked: goalsResponse.data.length > 0, dateUnlocked: new Date().toISOString(), icon: Target },
                { id: 'ac3', name: 'Economista', description: 'Manteve as despesas abaixo da receita por um mês.', unlocked: false, icon: Lightbulb },
            ]);
            setUserLevel({ level: 1, xp: transactionsResponse.data.length * 10, xpToNextLevel: 100, rank: UserRank.BRONZE });

        } catch (err) {
            const supabaseError = err as any;
            setError(supabaseError.message || 'Ocorreu um erro desconhecido ao carregar os dados.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user, categoryMap]);

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

        const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

        return { totalBalance, monthlyIncome, monthlyExpenses };
    }, [transactions]);

    const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'category'>) => {
        if (!user) throw new Error("Usuário não autenticado.");
        const { data, error } = await supabase
            .from('transactions')
            .insert({ ...transactionData, user_id: user.id })
            .select()
            .single();

        if (error) {
            setError(error.message);
            throw error;
        }
        
        const newTransaction: Transaction = {
            ...data,
            category: categoryMap.get(data.category_id || 'cat12') || MOCK_CATEGORIES[11],
        };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const addGoal = async (goalData: Omit<Goal, 'id'|'currentAmount'|'status'>) => {
        if (!user) throw new Error("Usuário não autenticado.");
        const newGoalPayload = {
            ...goalData,
            user_id: user.id,
            currentAmount: 0,
            status: GoalStatus.EM_ANDAMENTO,
        };
        const { data, error } = await supabase.from('goals').insert(newGoalPayload).select().single();

        if (error) {
            setError(error.message);
            throw error;
        }
        setGoals(prev => [data as Goal, ...prev]);
    };

    const addDebt = async (debtData: Omit<Debt, 'id'|'paidAmount'|'status'>) => {
        if (!user) throw new Error("Usuário não autenticado.");
         const newDebtPayload = {
            ...debtData,
            user_id: user.id,
            paidAmount: 0,
            status: DebtStatus.ATIVA,
        };
        const { data, error } = await supabase.from('debts').insert(newDebtPayload).select().single();
        if (error) {
            setError(error.message);
            throw error;
        }
        setDebts(prev => [data as Debt, ...prev]);
    };

    const addScheduledTransaction = async (scheduledTxData: Omit<ScheduledTransaction, 'id'|'category'|'nextDueDate'>) => {
        if (!user) throw new Error("Usuário não autenticado.");

        // Lógica simples para calcular o próximo vencimento
        const today = new Date();
        const nextDueDate = new Date(today.getFullYear(), today.getMonth() + 1, new Date(scheduledTxData.startDate).getDate()).toISOString();

        const newScheduledTxPayload = {
            ...scheduledTxData,
            user_id: user.id,
            nextDueDate: nextDueDate,
        };
        const { data, error } = await supabase.from('scheduled_transactions').insert(newScheduledTxPayload).select().single();

        if (error) {
            setError(error.message);
            throw error;
        }
        
        const newScheduledTransaction: ScheduledTransaction = {
            ...data,
            category: categoryMap.get(data.category_id || 'cat12') || MOCK_CATEGORIES[11],
        };

        setScheduledTransactions(prev => [newScheduledTransaction, ...prev]);
    };

    const value = {
        transactions, goals, debts, summary, scheduledTransactions, userLevel, achievements,
        categories: MOCK_CATEGORIES,
        loading, error, clearError, addTransaction, addGoal, addDebt, addScheduledTransaction
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