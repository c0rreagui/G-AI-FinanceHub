import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import {
    Transaction, Goal, Debt, Summary, ScheduledTransaction, UserLevel, Achievement, Category,
    TransactionType, GoalStatus, DebtStatus, UserRank, DashboardDataContextType
} from '../types';
import {
    Wallet, Target, Lightbulb, Trophy
} from '../components/Icons';
import { useAuth } from './useAuth';
import { supabase } from '../services/supabaseClient';
import { logger } from '../services/loggingService';
import { DashboardDataContext } from '../contexts/DashboardDataContext';
import { getIconByName } from '../utils/categoryIcons';
import { useToast } from './useToast';

// Helper function to convert DB snake_case to app camelCase
const fromSupabase = <T extends Record<string, any>>(data: T | null): any => {
    if (!data) return null;
    const result: Record<string, any> = { ...data };
    for (const key of Object.keys(result)) {
        if (key.includes('_')) {
            const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            if (camelCaseKey !== key) {
                result[camelCaseKey] = result[key];
            }
        }
    }
    return result;
}

// Helper function to convert app camelCase to DB snake_case
const toSupabase = <T extends Record<string, any>>(data: T): any => {
    const result: Record<string, any> = {};
    for (const key of Object.keys(data)) {
        const snakeCaseKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        result[snakeCaseKey] = data[key];
    }
    return result;
}

const FALLBACK_CATEGORY: Category = { id: 'cat-fallback', name: 'Outros', icon: getIconByName('Gift'), color: '#a8a29e' };

export const DashboardDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [debts, setDebts] = useState<Debt[]>([]);
    const [scheduledTransactions, setScheduledTransactions] = useState<ScheduledTransaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [userLevel, setUserLevel] = useState<UserLevel>({ level: 1, xp: 0, xpToNextLevel: 100, rank: UserRank.BRONZE });
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);
    
    const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            // Fetch categories first as other data depends on it for enrichment
            // FIX: Removed the .or() filter as the 'categories' table doesn't have a user_id column
            const categoriesResponse = await supabase.from('categories').select('*');
            if (categoriesResponse.error) throw categoriesResponse.error;
            
            const fetchedCategories = categoriesResponse.data.map(c => ({
                ...fromSupabase(c),
                icon: getIconByName(c.icon),
            }));
            setCategories(fetchedCategories);
            const tempCategoryMap = new Map(fetchedCategories.map(c => [c.id, c]));

            // Fetch rest of the data
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
                ...fromSupabase(t),
                category: tempCategoryMap.get(t.category_id) || FALLBACK_CATEGORY,
            }));
            setTransactions(enrichedTransactions);
            
            setGoals(goalsResponse.data.map(g => fromSupabase(g)));
            setDebts(debtsResponse.data.map(d => fromSupabase(d)));
            
            const enrichedScheduled = scheduledTransactionsResponse.data.map(st => ({
                ...fromSupabase(st),
                category: tempCategoryMap.get(st.category_id) || FALLBACK_CATEGORY,
            }));
            setScheduledTransactions(enrichedScheduled);
            
            // Gamification logic
            const monthlyIncome = enrichedTransactions.filter(t => t.type === TransactionType.RECEITA).reduce((sum, t) => sum + t.amount, 0);
            const monthlyExpenses = enrichedTransactions.filter(t => t.type === TransactionType.DESPESA).reduce((sum, t) => sum + Math.abs(t.amount), 0);

            setAchievements([
                { id: 'ac1', name: 'Primeiros Passos', description: 'Adicionou sua primeira transação.', unlocked: transactionsResponse.data.length > 0, dateUnlocked: new Date().toISOString(), icon: Wallet },
                { id: 'ac2', name: 'Planejador', description: 'Criou sua primeira meta financeira.', unlocked: goalsResponse.data.length > 0, dateUnlocked: new Date().toISOString(), icon: Target },
                { id: 'ac3', name: 'Economista', description: 'Manteve as despesas abaixo da receita este mês.', unlocked: monthlyIncome > 0 && monthlyExpenses < monthlyIncome, icon: Lightbulb },
                { id: 'ac4', name: 'Registrador Ativo', description: 'Adicionou mais de 10 transações.', unlocked: transactionsResponse.data.length > 10, icon: Trophy },
            ]);
            setUserLevel({ level: 1, xp: transactionsResponse.data.length * 10, xpToNextLevel: 100, rank: UserRank.BRONZE });

        } catch (err) {
            const supabaseError = err as any;
            const errorMessage = supabaseError.message || 'Ocorreu um erro desconhecido ao carregar os dados.';
            setError(errorMessage);
            showToast('Erro ao carregar dados', { type: 'error', description: errorMessage });
            logger.error("Falha ao carregar dados do dashboard", {
                component: 'useDashboardData',
                function: 'fetchData',
                error: err,
            });
        } finally {
            setLoading(false);
        }
    }, [user, showToast]);

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
            .filter(t => t.type === TransactionType.RECEITA)
            .reduce((sum, t) => sum + t.amount, 0);

        const monthlyExpenses = monthlyTransactions
            .filter(t => t.type === TransactionType.DESPESA)
            .reduce((sum, t) => sum + t.amount, 0); // Amount is already negative
        
        const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

        return { totalBalance, monthlyIncome, monthlyExpenses };
    }, [transactions]);

    const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'category' | 'userId'>): Promise<boolean> => {
        if (!user) { setError("Usuário não autenticado."); return false; }
        const mappedData = toSupabase(transactionData);
        const payload = {
            ...mappedData,
            amount: transactionData.type === TransactionType.DESPESA 
                ? -Math.abs(transactionData.amount) 
                : Math.abs(transactionData.amount),
            user_id: user.id,
        };

        const { data, error: supabaseError } = await supabase.from('transactions').insert(payload).select().single();

        if (supabaseError) {
            setError(supabaseError.message);
            showToast('Erro ao salvar transação', { type: 'error', description: supabaseError.message });
            logger.error("Falha ao adicionar transação", { error: supabaseError });
            return false;
        }
        
        const newTransaction: Transaction = { 
            ...fromSupabase(data),
            category: categoryMap.get(data.category_id) || FALLBACK_CATEGORY 
        };
        setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        showToast('Transação salva com sucesso!', { type: 'success' });
        return true;
    };
    
    const updateTransaction = async (transactionId: string, updates: Partial<Omit<Transaction, 'id' | 'category'>>): Promise<boolean> => {
        if (!user) { setError("Usuário não autenticado."); return false; }
        let payload = toSupabase(updates);
        if (payload.amount !== undefined && payload.type !== undefined) {
             payload.amount = payload.type === TransactionType.DESPESA 
                ? -Math.abs(payload.amount) 
                : Math.abs(payload.amount);
        }

        const { data, error: supabaseError } = await supabase.from('transactions').update(payload).eq('id', transactionId).eq('user_id', user.id).select().single();

        if (supabaseError) {
            setError(supabaseError.message);
            showToast('Erro ao atualizar transação', { type: 'error', description: supabaseError.message });
            logger.error("Falha ao atualizar transação", { error: supabaseError });
            return false;
        }
        
        const updatedTransaction: Transaction = {
             ...fromSupabase(data),
             category: categoryMap.get(data.category_id) || FALLBACK_CATEGORY 
        };
        setTransactions(prev => prev.map(t => (t.id === transactionId ? updatedTransaction : t)));
        showToast('Transação atualizada!', { type: 'success' });
        return true;
    };

    const deleteTransaction = async (transactionId: string): Promise<boolean> => {
        if (!user) throw new Error("Usuário não autenticado.");
        const { error: supabaseError } = await supabase.from('transactions').delete().eq('id', transactionId).eq('user_id', user.id);

        if (supabaseError) {
            setError(supabaseError.message);
            showToast('Erro ao excluir transação', { type: 'error', description: supabaseError.message });
            logger.error("Falha ao deletar transação", { error: supabaseError });
            throw supabaseError;
        }

        setTransactions(prev => prev.filter(t => t.id !== transactionId));
        showToast('Transação excluída.', { type: 'info' });
        return true;
    };

    const addGoal = async (goalData: Omit<Goal, 'id'|'currentAmount'|'status'|'userId'>): Promise<boolean> => {
        if (!user) { setError("Usuário não autenticado."); return false; }
        const payload = { ...toSupabase(goalData), user_id: user.id, current_amount: 0, status: GoalStatus.EM_ANDAMENTO };
        const { data, error: supabaseError } = await supabase.from('goals').insert(payload).select().single();
        if (supabaseError) { 
            setError(supabaseError.message);
            showToast('Erro ao criar meta', { type: 'error', description: supabaseError.message });
            logger.error("Falha ao adicionar meta", { error: supabaseError });
            return false; 
        }
        setGoals(prev => [fromSupabase(data), ...prev]);
        showToast('Nova meta criada!', { type: 'success' });
        return true;
    };

    const updateGoalValue = async (goalId: string, newCurrentAmount: number) => {
        if (!user) throw new Error("Usuário não autenticado.");
        const { data, error: supabaseError } = await supabase.from('goals').update({ current_amount: newCurrentAmount }).eq('id', goalId).select().single();
        if (supabaseError) {
            setError(supabaseError.message);
            showToast('Erro ao atualizar meta', { type: 'error', description: supabaseError.message });
            logger.error("Falha ao atualizar valor da meta", { error: supabaseError });
            throw supabaseError;
        }
        setGoals(prev => prev.map(g => (g.id === goalId ? fromSupabase(data) : g)));
        showToast('Valor adicionado à meta!', { type: 'success' });
    };

    const addDebt = async (debtData: Omit<Debt, 'id'|'paidAmount'|'status'|'userId'>): Promise<boolean> => {
        if (!user) { setError("Usuário não autenticado."); return false; }
        const payload = { ...toSupabase(debtData), user_id: user.id, paid_amount: 0, status: DebtStatus.ATIVA };
        const { data, error: supabaseError } = await supabase.from('debts').insert(payload).select().single();
        if (supabaseError) { 
            setError(supabaseError.message); 
            showToast('Erro ao adicionar dívida', { type: 'error', description: supabaseError.message });
            logger.error("Falha ao adicionar dívida", { error: supabaseError });
            return false; 
        }
        setDebts(prev => [fromSupabase(data), ...prev]);
        showToast('Dívida adicionada.', { type: 'success' });
        return true;
    };

    const addPaymentToDebt = async (debtId: string, paymentAmount: number) => {
        if (!user) throw new Error("Usuário não autenticado.");
        const debtToUpdate = debts.find(d => d.id === debtId);
        if (!debtToUpdate) throw new Error("Dívida não encontrada.");

        const newPaidAmount = debtToUpdate.paidAmount + paymentAmount;
        const newStatus = newPaidAmount >= debtToUpdate.totalAmount ? DebtStatus.PAGA : DebtStatus.ATIVA;
        const { data, error: supabaseError } = await supabase.from('debts').update({ paid_amount: newPaidAmount, status: newStatus }).eq('id', debtId).select().single();
        if (supabaseError) {
            setError(supabaseError.message);
            showToast('Erro ao registrar pagamento', { type: 'error', description: supabaseError.message });
            logger.error("Falha ao adicionar pagamento à dívida", { error: supabaseError });
            throw supabaseError;
        }
        setDebts(prev => prev.map(d => (d.id === debtId ? fromSupabase(data) : d)));
        showToast('Pagamento registrado com sucesso!', { type: 'success' });
    };

    const addScheduledTransaction = async (scheduledTxData: Omit<ScheduledTransaction, 'id'|'category'|'nextDueDate'>): Promise<boolean> => {
        if (!user) { setError("Usuário não autenticado."); return false; }
        const nextDueDateValue = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date(scheduledTxData.startDate).getDate()).toISOString();
        const payload = { ...toSupabase(scheduledTxData), user_id: user.id, next_due_date: nextDueDateValue };
        const { data, error: supabaseError } = await supabase.from('scheduled_transactions').insert(payload).select().single();
        if (supabaseError) { 
            setError(supabaseError.message);
            showToast('Erro ao criar agendamento', { type: 'error', description: supabaseError.message });
            logger.error("Falha ao adicionar transação agendada", { error: supabaseError });
            return false; 
        }
        const newScheduledTransaction: ScheduledTransaction = { 
            ...fromSupabase(data),
            category: categoryMap.get(data.category_id) || FALLBACK_CATEGORY 
        };
        setScheduledTransactions(prev => [newScheduledTransaction, ...prev]);
        showToast('Agendamento criado!', { type: 'success' });
        return true;
    };

    const value = {
        transactions, goals, debts, summary, scheduledTransactions, userLevel, achievements,
        categories, loading, error, clearError, addTransaction, updateTransaction, addGoal, addDebt, addScheduledTransaction,
        deleteTransaction, updateGoalValue, addPaymentToDebt
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