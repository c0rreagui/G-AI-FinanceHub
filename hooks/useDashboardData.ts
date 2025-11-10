import React, { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import {
    Transaction, Goal, Debt, Summary, ScheduledTransaction, UserLevel, Achievement, Category,
    TransactionType, GoalStatus, DebtStatus, ScheduledTransactionFrequency, UserRank
} from '../types';
import {
    Utensils, ShoppingCart, Car, Shirt, PiggyBank, Heart, BookOpen, Gift, Plane, HomeIcon, Dumbbell, Gamepad, Film, // FIX: Corrected typo in icon import from 'ArrowUpright' to 'ArrowUpRight'.
ArrowUpRight, TrendingDown, Wallet, Lightbulb, Target
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
    addTransaction: (transaction: Omit<Transaction, 'id' | 'category'>) => Promise<boolean>;
    updateTransaction: (transactionId: string, updates: Partial<Omit<Transaction, 'id' | 'category'>>) => Promise<boolean>;
    addGoal: (goal: Omit<Goal, 'id'|'currentAmount'|'status'>) => Promise<boolean>;
    addDebt: (debt: Omit<Debt, 'id'|'paidAmount'|'status'>) => Promise<boolean>;
    addScheduledTransaction: (scheduledTx: Omit<ScheduledTransaction, 'id'|'category'|'nextDueDate'>) => Promise<boolean>;
    deleteTransaction: (transactionId: string) => Promise<boolean>;
    updateGoalValue: (goalId: string, newCurrentAmount: number) => Promise<void>;
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
            
            const enrichedDebts = (debtsResponse.data as any[]).map(d => ({
                ...d,
                totalAmount: d.total_amount,
                interestRate: d.interest_rate,
                paidAmount: d.paid_amount,
            }));
            setDebts(enrichedDebts as Debt[]);
            
            const enrichedScheduled = (scheduledTransactionsResponse.data as any[]).map(st => ({
                ...st,
                startDate: st.start_date,
                nextDueDate: st.next_due_date,
                category: categoryMap.get(st.category_id || 'cat12') || MOCK_CATEGORIES[11],
            }));
            setScheduledTransactions(enrichedScheduled as ScheduledTransaction[]);
            
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

        const monthlyTransactions = transactions.filter(t => 
            new Date(t.date).getMonth() === currentMonth && 
            new Date(t.date).getFullYear() === currentYear
        );

        const monthlyIncome = monthlyTransactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);

        const monthlyExpenses = monthlyTransactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

        return { totalBalance, monthlyIncome, monthlyExpenses };
    }, [transactions]);

    const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'category'>): Promise<boolean> => {
        if (!user) {
            setError("Usuário não autenticado.");
            return false;
        }
        const payload = {
            ...transactionData,
            amount: transactionData.type === TransactionType.DESPESA 
                ? -Math.abs(transactionData.amount) 
                : Math.abs(transactionData.amount),
            user_id: user.id,
        };

        const { data, error } = await supabase.from('transactions').insert(payload).select().single();

        if (error) {
            setError(error.message);
            return false;
        }
        
        const newTransaction: Transaction = { ...data, category: categoryMap.get(data.category_id || 'cat12') || MOCK_CATEGORIES[11] };
        setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        return true;
    };
    
    const updateTransaction = async (transactionId: string, updates: Partial<Omit<Transaction, 'id' | 'category'>>): Promise<boolean> => {
        if (!user) {
            setError("Usuário não autenticado.");
            return false;
        }
        const payload = { ...updates };
        if (payload.amount !== undefined && payload.type !== undefined) {
             payload.amount = payload.type === TransactionType.DESPESA 
                ? -Math.abs(payload.amount) 
                : Math.abs(payload.amount);
        }

        const { data, error } = await supabase.from('transactions').update(payload).eq('id', transactionId).eq('user_id', user.id).select().single();

        if (error) {
            setError(error.message);
            return false;
        }
        
        const updatedTransaction: Transaction = { ...data, category: categoryMap.get(data.category_id || 'cat12') || MOCK_CATEGORIES[11] };
        setTransactions(prev => prev.map(t => (t.id === transactionId ? updatedTransaction : t)));
        return true;
    };

    const deleteTransaction = async (transactionId: string): Promise<boolean> => {
        if (!user) {
            setError("Usuário não autenticado.");
            throw new Error("Usuário não autenticado.");
        }

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', transactionId)
            .eq('user_id', user.id);

        if (error) {
            console.error("Erro ao deletar:", error);
            setError(error.message);
            throw error;
        }

        setTransactions(prev => prev.filter(t => t.id !== transactionId));
        return true;
    };

    const addGoal = async (goalData: Omit<Goal, 'id'|'currentAmount'|'status'>): Promise<boolean> => {
        if (!user) { setError("Usuário não autenticado."); return false; }
        const { data, error } = await supabase.from('goals').insert({ ...goalData, user_id: user.id, currentAmount: 0, status: GoalStatus.EM_ANDAMENTO }).select().single();
        if (error) { setError(error.message); return false; }
        setGoals(prev => [data as Goal, ...prev]);
        return true;
    };

    const updateGoalValue = async (goalId: string, newCurrentAmount: number) => {
        if (!user) throw new Error("Usuário não autenticado.");
        const { data, error } = await supabase
            .from('goals')
            .update({ currentAmount: newCurrentAmount })
            .eq('id', goalId)
            .select()
            .single();
        if (error) {
            setError(error.message);
            throw error;
        }
        
        // Atualiza o estado local
        setGoals(prev => 
            prev.map(g => (g.id === goalId ? data as Goal : g))
        );
    };

    const addDebt = async (debtData: Omit<Debt, 'id'|'paidAmount'|'status'>): Promise<boolean> => {
        if (!user) { setError("Usuário não autenticado."); return false; }
        
        const { totalAmount, interestRate, ...rest } = debtData;
        const payload = { 
            ...rest,
            total_amount: totalAmount,
            interest_rate: interestRate, 
            user_id: user.id, 
            paid_amount: 0, 
            status: DebtStatus.ATIVA 
        };

        const { data, error } = await supabase.from('debts').insert(payload).select().single();
        if (error) { setError(error.message); return false; }
        
        const returnedData = data as any;
        const newDebt: Debt = {
            ...returnedData,
            totalAmount: returnedData.total_amount,
            interestRate: returnedData.interest_rate,
            paidAmount: returnedData.paid_amount,
        };
        
        setDebts(prev => [newDebt, ...prev]);
        return true;
    };

    const addScheduledTransaction = async (scheduledTxData: Omit<ScheduledTransaction, 'id'|'category'|'nextDueDate'>): Promise<boolean> => {
        if (!user) { setError("Usuário não autenticado."); return false; }

        const nextDueDateValue = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date(scheduledTxData.startDate).getDate()).toISOString();
        
        const { startDate, ...restOfData } = scheduledTxData;
        const payload = {
            ...restOfData,
            start_date: startDate,
            user_id: user.id,
            next_due_date: nextDueDateValue
        };

        const { data, error } = await supabase.from('scheduled_transactions').insert(payload).select().single();

        if (error) { 
            setError(error.message); 
            return false; 
        }
        
        const returnedData = data as any;
        const newScheduledTransaction: ScheduledTransaction = { 
            ...returnedData, 
            startDate: returnedData.start_date,
            nextDueDate: returnedData.next_due_date,
            category: categoryMap.get(data.category_id || 'cat12') || MOCK_CATEGORIES[11] 
        };

        setScheduledTransactions(prev => [newScheduledTransaction, ...prev]);
        return true;
    };


    const value = {
        transactions, goals, debts, summary, scheduledTransactions, userLevel, achievements,
        categories: MOCK_CATEGORIES,
        loading, error, clearError, addTransaction, updateTransaction, addGoal, addDebt, addScheduledTransaction,
        deleteTransaction, updateGoalValue,
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