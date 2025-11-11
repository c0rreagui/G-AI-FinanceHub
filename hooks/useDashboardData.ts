import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { 
    Transaction, 
    Goal, 
    Debt, 
    ScheduledTransaction, 
    Category, 
    SummaryData, 
    MonthlyChartData,
    UserLevel,
    Achievement,
    DashboardDataContextType, 
    TransactionType,
    GoalStatus,
    DebtStatus,
    UserRank
} from '../types';
import { getIconByName } from '../utils/categoryIcons';
import { logger } from '../services/loggingService';
import { DashboardDataContext } from '../contexts/DashboardDataContext';


// --- DADOS MOCKADOS / CONFIGURAÇÃO ---

// Categorias pré-definidas. Em um app real, viriam do backend.
const defaultCategories: Omit<Category, 'icon'>[] = [
    { id: 'cat_alimentacao', name: 'Alimentação', color: '#ff8c00' },
    { id: 'cat_transporte', name: 'Transporte', color: '#4682b4' },
    { id: 'cat_moradia', name: 'Moradia', color: '#dc143c' },
    { id: 'cat_compras', name: 'Compras', color: '#9932cc' },
    { id: 'cat_saude', name: 'Saúde', color: '#32cd32' },
    { id: 'cat_lazer', name: 'Lazer', color: '#ff1493' },
    { id: 'cat_educacao', name: 'Educação', color: '#1e90ff' },
    { id: 'cat_salario', name: 'Salário', color: '#20b2aa' },
    { id: 'cat_investimentos', name: 'Investimentos', color: '#ffd700' },
    { id: 'cat_outros', name: 'Outros', color: '#808080' },
    { id: 'cat_pagamento_divida', name: 'Pagamento de Dívida', color: '#f08080'},
    { id: 'cat_contribuicao_meta', name: 'Contribuição de Meta', color: '#98fb98'},
];

const iconMapping: { [key: string]: string } = {
    cat_alimentacao: 'Utensils',
    cat_transporte: 'Car',
    cat_moradia: 'HomeIcon',
    cat_compras: 'ShoppingCart',
    cat_saude: 'Heart',
    cat_lazer: 'Gamepad',
    cat_educacao: 'BookOpen',
    cat_salario: 'Wallet',
    cat_investimentos: 'TrendingUp',
    cat_outros: 'Gift',
    cat_pagamento_divida: 'TrendingDown',
    cat_contribuicao_meta: 'Target'
};

const initialAchievements: Omit<Achievement, 'unlocked' | 'dateUnlocked'>[] = [
    { id: 'ach_first_transaction', name: 'Primeiros Passos', description: 'Adicione sua primeira transação.' },
    { id: 'ach_first_goal', name: 'Sonhador', description: 'Crie sua primeira meta financeira.' },
    { id: 'ach_first_debt_paid', name: 'Começando a Limpar', description: 'Faça o primeiro pagamento de uma dívida.' },
    { id: 'ach_one_week_streak', name: 'Consistente', description: 'Use o app por 7 dias seguidos.' },
];


export const DashboardDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { showToast } = useToast();

    // Estados de dados
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [debts, setDebts] = useState<Debt[]>([]);
    const [scheduledTransactions, setScheduledTransactions] = useState<ScheduledTransaction[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    
    // Estados de UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMutating, setIsMutating] = useState(false);
    const [mutatingIds, setMutatingIds] = useState<Set<string>>(new Set());

    // Dados derivados e processados
    const categories = useMemo((): Category[] => {
        return defaultCategories.map(cat => ({
            ...cat,
            icon: getIconByName(iconMapping[cat.id] || 'Gift')
        }));
    }, []);

    const categoriesById = useMemo(() => {
        return categories.reduce((acc, cat) => {
            acc[cat.id] = cat;
            return acc;
        }, {} as { [key: string]: Category });
    }, [categories]);

    // Função de tratamento de erro centralizada
    const handleError = useCallback((err: any, context: string) => {
        const errorMessage = err.message || 'Ocorreu um erro desconhecido.';
        logger.error(`Erro em ${context}`, { error: err });
        setError(errorMessage);
        showToast(`Erro: ${errorMessage}`, { type: 'error' });
    }, [showToast]);
    
    // --- LÓGICA DE FETCH ---
    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [
                { data: transactionsData, error: transactionsError },
                { data: goalsData, error: goalsError },
                { data: debtsData, error: debtsError },
                { data: scheduledData, error: scheduledError },
                { data: achievementsData, error: achievementsError }
            ] = await Promise.all([
                supabase.from('transactions').select('*').eq('user_id', user.id),
                supabase.from('goals').select('*').eq('user_id', user.id),
                supabase.from('debts').select('*').eq('user_id', user.id),
                supabase.from('scheduled_transactions').select('*').eq('user_id', user.id),
                supabase.from('achievements').select('*').eq('user_id', user.id),
            ]);

            if (transactionsError) throw transactionsError;
            if (goalsError) throw goalsError;
            if (debtsError) throw debtsError;
            if (scheduledError) throw scheduledError;
            if (achievementsError) throw achievementsError;
            
            const fallbackCategory = categoriesById['cat_outros'];

            setTransactions(transactionsData?.map(tx => ({ ...tx, category: categoriesById[tx.category_id] || fallbackCategory })) || []);
            setGoals(goalsData || []);
            setDebts(debtsData || []);
            setScheduledTransactions(scheduledData?.map(stx => ({ ...stx, category: categoriesById[stx.category_id] || fallbackCategory })) || []);

            const unlockedAchievements = achievementsData?.map(a => a.achievement_id) || [];
            const processedAchievements = initialAchievements.map(ach => ({
                ...ach,
                unlocked: unlockedAchievements.includes(ach.id),
                dateUnlocked: achievementsData?.find(a => a.achievement_id === ach.id)?.unlocked_at
            }));
            setAchievements(processedAchievements);

        } catch (err: any) {
            handleError(err, 'fetchData');
        } finally {
            setLoading(false);
        }
    }, [user, categoriesById, handleError]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    // --- LÓGICA DE MUTATION ---
    const performMutation = async <T, R>(
        operation: () => Promise<{ data?: T[] | null; error: any }>,
        { id, successMessage }: { id?: string | string[], successMessage: string },
        returnData: boolean = false
    ): Promise<{ success: boolean; data?: T | null }> => {
        setIsMutating(true);
        if(id) {
            const idsToAdd = Array.isArray(id) ? id : [id];
            setMutatingIds(prev => new Set([...prev, ...idsToAdd]));
        }
        
        const { data: opData, error: opError } = await operation();
        
        if (opError) {
            handleError(opError, 'performMutation');
            setIsMutating(false);
            if (id) setMutatingIds(prev => {
                const newSet = new Set(prev);
                const idsToRemove = Array.isArray(id) ? id : [id];
                idsToRemove.forEach(i => newSet.delete(i));
                return newSet;
            });
            return { success: false };
        } else {
            showToast(successMessage, { type: 'success' });
            await fetchData(); // Re-fetch all data to ensure consistency
            setIsMutating(false);
            if (id) setMutatingIds(new Set());
            return { success: true, data: returnData && opData ? opData[0] : null };
        }
    };


    // Funções de CRUD
    const addTransaction = (tx: Omit<Transaction, 'id' | 'category'>) => {
        const { categoryId, ...rest } = tx;
        return performMutation(
            () => supabase.from('transactions').insert({ ...rest, category_id: categoryId, user_id: user!.id }),
            { successMessage: 'Transação adicionada com sucesso!' }
        ).then(res => res.success);
    }
        
    const updateTransaction = (tx: Omit<Transaction, 'category'>) => {
        const { categoryId, ...rest } = tx;
        return performMutation(
            () => supabase.from('transactions').update({ ...rest, category_id: categoryId }).eq('id', tx.id),
            { id: tx.id, successMessage: 'Transação atualizada!' }
        ).then(res => res.success);
    }

    const deleteTransaction = (id: string) =>
        performMutation(
            () => supabase.from('transactions').delete().eq('id', id),
            { id, successMessage: 'Transação excluída.' }
        ).then(res => res.success);

    const updateTransactionsCategory = (ids: string[], categoryId: string) =>
        performMutation(
            () => supabase.from('transactions').update({ category_id: categoryId }).in('id', ids),
            { id: ids, successMessage: `${ids.length} transações atualizadas!` }
        ).then(res => res.success);

    const addGoal = async (goal: Omit<Goal, 'id' | 'currentAmount' | 'status'>): Promise<Goal | null> => {
        const { success, data } = await performMutation<Goal, Goal>(
            () => supabase.from('goals').insert({ 
                ...goal, 
                user_id: user!.id,
                currentAmount: 0,
                status: GoalStatus.EM_ANDAMENTO,
             }).select().single(),
            { successMessage: 'Meta criada com sucesso!' },
            true
        );
        return success ? data : null;
    }
        
    const updateGoalValue = async (id: string, valueToAdd: number) => {
        const goal = goals.find(g => g.id === id);
        if (!goal) return false;

        const newAmount = goal.currentAmount + valueToAdd;
        const newStatus = newAmount >= goal.targetAmount ? GoalStatus.CONCLUIDO : goal.status;

        const { success } = await performMutation(
            () => supabase.from('goals').update({ currentAmount: newAmount, status: newStatus }).eq('id', id),
            { id, successMessage: `Valor adicionado à meta ${goal.name}!` }
        );
        
        if (success) {
            const txSuccess = await addTransaction({
                description: `Contribuição para a meta: ${goal.name}`,
                amount: -Math.abs(valueToAdd),
                type: TransactionType.DESPESA,
                date: new Date().toISOString(),
                categoryId: 'cat_contribuicao_meta',
                goalContributionId: id,
            });

            if (!txSuccess) {
                handleError(
                    new Error('A meta foi atualizada, mas a transação de contrapartida falhou ao ser registrada.'),
                    'updateGoalValue-tx-failure'
                );
                return false;
            }
        }
        return success;
    };
    
    const deleteGoal = (id: string) => performMutation(async () => {
        const linkedTxIds = transactions.filter(tx => tx.goalContributionId === id).map(tx => tx.id);
        if (linkedTxIds.length > 0) {
            const { error: txError } = await supabase.from('transactions').delete().in('id', linkedTxIds);
            if (txError) return { error: txError };
        }
        return supabase.from('goals').delete().eq('id', id);
    }, { id, successMessage: 'Meta e contribuições associadas foram excluídas!' }).then(res => res.success);


    const addDebt = async (debt: Omit<Debt, 'id' | 'paidAmount' | 'status'>): Promise<Debt | null> => {
        const { success, data } = await performMutation<Debt, Debt>(
            () => supabase.from('debts').insert({ 
                ...debt, 
                user_id: user!.id,
                paidAmount: 0,
                status: DebtStatus.ATIVA,
            }).select().single(),
            { successMessage: 'Dívida registrada.' },
            true
        );
        return success ? data : null;
    }
    
    const addPaymentToDebt = async (id: string, paymentAmount: number) => {
        const debt = debts.find(d => d.id === id);
        if (!debt) return false;
        
        const newPaidAmount = debt.paidAmount + paymentAmount;
        const newStatus = newPaidAmount >= debt.totalAmount ? DebtStatus.PAGA : debt.status;

        const { success } = await performMutation(
            () => supabase.from('debts').update({ paidAmount: newPaidAmount, status: newStatus }).eq('id', id),
            { id, successMessage: `Pagamento para ${debt.name} registrado!` }
        );

        if (success) {
            const txSuccess = await addTransaction({
                description: `Pagamento da dívida: ${debt.name}`,
                amount: -Math.abs(paymentAmount),
                type: TransactionType.DESPESA,
                date: new Date().toISOString(),
                categoryId: 'cat_pagamento_divida',
                debtPaymentId: id
            });
            
            if (!txSuccess) {
                handleError(
                    new Error('A dívida foi atualizada, mas a transação de pagamento falhou ao ser registrada.'),
                    'addPaymentToDebt-tx-failure'
                );
                return false;
            }
        }
        return success;
    };
    
    const deleteDebt = (id: string) => performMutation(async () => {
        const linkedTxIds = transactions.filter(tx => tx.debtPaymentId === id).map(tx => tx.id);
        if (linkedTxIds.length > 0) {
            const { error: txError } = await supabase.from('transactions').delete().in('id', linkedTxIds);
            if (txError) return { error: txError };
        }
        return supabase.from('debts').delete().eq('id', id);
    }, { id, successMessage: 'Dívida e pagamentos associados foram excluídos!' }).then(res => res.success);


    const addScheduledTransaction = (tx: Omit<ScheduledTransaction, 'id' | 'category' | 'nextDueDate'>) => {
        const nextDueDate = new Date(tx.startDate);
        const { categoryId, ...rest } = tx;
        return performMutation(
            () => supabase.from('scheduled_transactions').insert({
                ...rest,
                category_id: categoryId,
                user_id: user!.id,
                nextDueDate: nextDueDate.toISOString(),
            }),
            { successMessage: 'Agendamento criado!' }
        ).then(res => res.success);
    };


    // --- DADOS DERIVADOS (SUMMARY, CHARTS, GAMIFICATION) ---
    const summary: SummaryData = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyIncome = transactions
            .filter(t => t.type === TransactionType.RECEITA && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const monthlyExpenses = transactions
            .filter(t => t.type === TransactionType.DESPESA && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);

        const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

        return { totalBalance, monthlyIncome, monthlyExpenses };
    }, [transactions]);
    
    const monthlyChartData: MonthlyChartData[] = useMemo(() => {
        const data: { [key: string]: { receita: number, despesa: number } } = {};
        const monthLabels: string[] = [];
        
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthKey = d.toLocaleString('pt-BR', { month: 'short' });
            monthLabels.push(monthKey.charAt(0).toUpperCase() + monthKey.slice(1));
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            data[key] = { receita: 0, despesa: 0 };
        }
        
        transactions.forEach(tx => {
            const txDate = new Date(tx.date);
            const key = `${txDate.getFullYear()}-${txDate.getMonth()}`;
            if (data[key]) {
                if (tx.type === TransactionType.RECEITA) data[key].receita += tx.amount;
                else data[key].despesa += Math.abs(tx.amount);
            }
        });

        return monthLabels.map((label, index) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - index));
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            return {
                name: label,
                ...data[key],
            }
        });
    }, [transactions]);
    
    const userLevel: UserLevel | null = useMemo(() => {
        if (loading) return null;
        
        const manualTransactions = transactions.filter(tx => !tx.goalContributionId && !tx.debtPaymentId);
        
        const xp = manualTransactions.length * 10 + goals.length * 50 + debts.filter(d => d.status === DebtStatus.PAGA).length * 100;
        let level = 1;
        let xpToNextLevel = 100;
        let requiredForLevelUp = 100;
        
        while (xp >= requiredForLevelUp) {
            level++;
            xpToNextLevel = Math.floor(xpToNextLevel * 1.5);
            requiredForLevelUp += xpToNextLevel;
        }

        let rank = UserRank.BRONZE;
        if (level >= 5) rank = UserRank.PRATA;
        if (level >= 10) rank = UserRank.OURO;
        if (level >= 20) rank = UserRank.PLATINA;
        if (level >= 50) rank = UserRank.DIAMANTE;

        return { level, xp, xpToNextLevel: requiredForLevelUp, rank };
    }, [transactions, goals, debts, loading]);
    
    const contextValue: DashboardDataContextType = {
        transactions,
        goals,
        debts,
        scheduledTransactions,
        categories,
        summary,
        monthlyChartData,
        userLevel,
        achievements,
        loading,
        isMutating,
        mutatingIds,
        error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateTransactionsCategory,
        addGoal,
        updateGoalValue,
        deleteGoal,
        addDebt,
        addPaymentToDebt,
        deleteDebt,
        addScheduledTransaction,
        clearError: () => setError(null),
    };

    return React.createElement(DashboardDataContext.Provider, { value: contextValue }, children);
};

export const useDashboardData = (): DashboardDataContextType => {
    const context = useContext(DashboardDataContext);
    if (context === undefined) {
        throw new Error('useDashboardData must be used within a DashboardDataProvider');
    }
    return context;
};