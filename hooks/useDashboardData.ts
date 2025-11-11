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

// Categorias pré-definidas. Movidas para fora do componente para evitar recriação.
const defaultCategoriesData: Omit<Category, 'icon'>[] = [
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
        return defaultCategoriesData.map(cat => ({
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
    
    // Fallback de categoria robusto para evitar crashes.
    const fallbackCategory = useMemo(() => {
        return categoriesById['cat_outros'] || (categories.length > 0 ? categories[0] : { id: 'fallback', name: 'Outros', icon: getIconByName('Gift'), color: '#808080'});
    }, [categoriesById, categories]);

    // Função de tratamento de erro centralizada
    const handleError = useCallback((err: any, context: string, userMessage?: string) => {
        const errorMessage = userMessage || err.message || 'Ocorreu um erro desconhecido.';
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
                supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
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
            
            // Mapeia snake_case do DB para camelCase da aplicação
            const mappedTransactions = transactionsData?.map(tx => {
                const { category_id, goal_contribution_id, debt_payment_id, ...rest } = tx;
                return { 
                    ...rest, 
                    categoryId: category_id, 
                    goalContributionId: goal_contribution_id, 
                    debtPaymentId: debt_payment_id,
                    category: categoriesById[category_id] || fallbackCategory 
                };
            }) || [];
            setTransactions(mappedTransactions);
            
            const mappedGoals = goalsData?.map(goal => {
                const { target_amount, current_amount, ...rest } = goal;
                return { ...rest, targetAmount: target_amount, currentAmount: current_amount };
            }) || [];
            setGoals(mappedGoals);

            const mappedDebts = debtsData?.map(debt => {
                const { total_amount, paid_amount, interest_rate, ...rest } = debt;
                return { ...rest, totalAmount: total_amount, paidAmount: paid_amount, interestRate: interest_rate };
            }) || [];
            setDebts(mappedDebts);

            const mappedScheduled = scheduledData?.map(stx => {
                const { category_id, start_date, next_due_date, ...rest } = stx;
                return { 
                    ...rest, 
                    categoryId: category_id, 
                    startDate: start_date,
                    nextDueDate: next_due_date,
                    category: categoriesById[category_id] || fallbackCategory 
                };
            }) || [];
            setScheduledTransactions(mappedScheduled);


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
    }, [user, categoriesById, handleError, fallbackCategory]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- FUNÇÕES DE CRUD (COM UI OTIMISTA) ---

    // Transações
    const addTransaction = useCallback(async (tx: Omit<Transaction, 'id' | 'category'>): Promise<boolean> => {
        const tempId = `temp-${Date.now()}`;
        const newTx: Transaction = { ...tx, id: tempId, category: categoriesById[tx.categoryId] || fallbackCategory };

        setTransactions(prev => [newTx, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        
        const payload = {
            description: tx.description,
            amount: tx.amount,
            type: String(tx.type).toLowerCase() === 'receita' ? 'receita' : 'despesa',
            date: tx.date,
            category_id: tx.categoryId,
            goal_contribution_id: tx.goalContributionId,
            debt_payment_id: tx.debtPaymentId,
            user_id: user!.id,
        };
        const { data, error } = await supabase.from('transactions').insert(payload).select().single();

        if (error) {
            handleError(error, 'addTransaction');
            setTransactions(prev => prev.filter(t => t.id !== tempId));
            return false;
        }
        
        showToast('Transação adicionada!', { type: 'success' });
        
        if (data) {
            const { category_id, goal_contribution_id, debt_payment_id, ...rest } = data;
            const finalTx: Transaction = {
                ...rest,
                categoryId: category_id,
                goalContributionId: goal_contribution_id,
                debtPaymentId: debt_payment_id,
                category: categoriesById[category_id] || fallbackCategory
            };
            setTransactions(prev => prev.map(t => t.id === tempId ? finalTx : t));
        }
        return true;
    }, [user, categoriesById, fallbackCategory, handleError, showToast]);
        
    const updateTransaction = useCallback(async (tx: Omit<Transaction, 'category'>): Promise<boolean> => {
        const originalTransactions = [...transactions];
        const updatedTx: Transaction = { ...tx, category: categoriesById[tx.categoryId] || fallbackCategory };

        setTransactions(prev => prev.map(t => t.id === tx.id ? updatedTx : t));
        
        const payload = {
            description: tx.description,
            amount: tx.amount,
            type: String(tx.type).toLowerCase() === 'receita' ? 'receita' : 'despesa',
            date: tx.date,
            category_id: tx.categoryId,
            goal_contribution_id: tx.goalContributionId,
            debt_payment_id: tx.debtPaymentId,
        };
        const { error } = await supabase.from('transactions').update(payload).eq('id', tx.id);

        if (error) {
            handleError(error, 'updateTransaction');
            setTransactions(originalTransactions);
            return false;
        }

        showToast('Transação atualizada!', { type: 'success' });
        return true;
    }, [transactions, categoriesById, fallbackCategory, handleError, showToast]);

    const deleteTransaction = useCallback(async (id: string): Promise<boolean> => {
        const originalTransactions = [...transactions];
        
        setTransactions(prev => prev.filter(t => t.id !== id));
        const { error } = await supabase.from('transactions').delete().eq('id', id);

        if (error) {
            handleError(error, 'deleteTransaction');
            setTransactions(originalTransactions);
            return false;
        }

        showToast('Transação excluída.', { type: 'success' });
        return true;
    }, [transactions, handleError, showToast]);

    const updateTransactionsCategory = useCallback(async (ids: string[], categoryId: string): Promise<boolean> => {
        const originalTransactions = [...transactions];
        const updatedCategory = categoriesById[categoryId] || fallbackCategory;
        
        setTransactions(prev => prev.map(tx => ids.includes(tx.id) ? { ...tx, categoryId, category: updatedCategory } : tx));
        const { error } = await supabase.from('transactions').update({ category_id: categoryId }).in('id', ids);

        if (error) {
            handleError(error, 'updateTransactionsCategory');
            setTransactions(originalTransactions);
            return false;
        }
        showToast(`${ids.length} transações atualizadas!`, { type: 'success' });
        return true;
    }, [transactions, categoriesById, fallbackCategory, handleError, showToast]);

    // Metas
    const addGoal = useCallback(async (goal: Omit<Goal, 'id' | 'currentAmount' | 'status'>): Promise<Goal | null> => {
        const tempId = `temp-goal-${Date.now()}`;
        const newGoal: Goal = { ...goal, id: tempId, currentAmount: 0, status: GoalStatus.EM_ANDAMENTO };
        
        setGoals(prev => [newGoal, ...prev]);

        const payload = {
            name: goal.name,
            target_amount: goal.targetAmount,
            deadline: goal.deadline,
            user_id: user!.id,
            current_amount: 0,
            status: GoalStatus.EM_ANDAMENTO
        };
        const { data, error } = await supabase.from('goals').insert(payload).select().single();
        
        if (error) {
            handleError(error, 'addGoal');
            setGoals(prev => prev.filter(g => g.id !== tempId));
            return null;
        }

        showToast('Meta criada com sucesso!', { type: 'success' });
        await fetchData(); // Refetch para sincronizar ID real e dados mapeados
        
        if (data) {
            const { target_amount, current_amount, ...rest } = data;
            return { ...rest, targetAmount: target_amount, currentAmount: current_amount };
        }
        return null;
    }, [user, handleError, showToast, fetchData]);

    const updateGoalValue = useCallback(async (id: string, valueToAdd: number): Promise<boolean> => {
        const goal = goals.find(g => g.id === id);
        if (!goal) return false;

        const txSuccess = await addTransaction({
            description: `Contribuição para a meta: ${goal.name}`, 
            amount: -Math.abs(valueToAdd), // FIX: Despesas devem ter valor negativo
            type: TransactionType.DESPESA, date: new Date().toISOString(),
            categoryId: 'cat_contribuicao_meta', goalContributionId: id,
        });

        if (!txSuccess) {
            handleError(new Error('A meta não foi atualizada porque o registro da transação falhou.'), 'updateGoalValue-tx-failure', 'Falha ao registrar a transação. A meta não foi alterada.');
            return false;
        }
        
        const originalGoals = [...goals];
        const newAmount = goal.currentAmount + valueToAdd;
        const newStatus = newAmount >= goal.targetAmount ? GoalStatus.CONCLUIDO : goal.status;
        setGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: newAmount, status: newStatus } : g));

        const { error } = await supabase.from('goals').update({ current_amount: newAmount, status: newStatus }).eq('id', id);

        if (error) {
            handleError(error, 'updateGoalValue-goal-update-failure', 'A transação foi salva, mas a atualização da meta falhou. Sincronizando...');
            setGoals(originalGoals); 
            await fetchData(); 
            return false;
        }

        showToast(`Valor adicionado à meta ${goal.name}!`, { type: 'success' });
        return true;
    }, [goals, addTransaction, handleError, showToast, fetchData]);

    const deleteGoal = useCallback(async (id: string): Promise<boolean> => {
        const originalGoals = [...goals];
        const originalTransactions = [...transactions];
        
        setGoals(prev => prev.filter(g => g.id !== id));
        setTransactions(prev => prev.filter(tx => tx.goalContributionId !== id));

        const linkedTxIds = originalTransactions.filter(tx => tx.goalContributionId === id).map(tx => tx.id);
        if (linkedTxIds.length > 0) {
            const { error: txError } = await supabase.from('transactions').delete().in('id', linkedTxIds);
            if (txError) {
                handleError(txError, 'deleteGoal-tx-deletion');
                setGoals(originalGoals);
                setTransactions(originalTransactions);
                return false;
            }
        }
        
        const { error: goalError } = await supabase.from('goals').delete().eq('id', id);

        if (goalError) {
            handleError(goalError, 'deleteGoal-goal-deletion');
            setGoals(originalGoals);
            setTransactions(originalTransactions);
            await fetchData();
            return false;
        }

        showToast('Meta e contribuições excluídas!', { type: 'success' });
        return true;
    }, [transactions, goals, handleError, showToast, fetchData]);

    // Dívidas
    const addDebt = useCallback(async (debt: Omit<Debt, 'id' | 'paidAmount' | 'status'>): Promise<Debt | null> => {
        const tempId = `temp-debt-${Date.now()}`;
        const newDebt: Debt = { ...debt, id: tempId, paidAmount: 0, status: DebtStatus.ATIVA };

        setDebts(prev => [newDebt, ...prev]);

        const payload = {
            name: debt.name,
            total_amount: debt.totalAmount,
            interest_rate: debt.interestRate,
            category: debt.category,
            user_id: user!.id,
            paid_amount: 0,
            status: DebtStatus.ATIVA,
        };
        const { data, error } = await supabase.from('debts').insert(payload).select().single();
        if (error) {
            handleError(error, 'addDebt');
            setDebts(prev => prev.filter(d => d.id !== tempId));
            return null;
        }
        
        showToast('Dívida registrada.', { type: 'success' });
        await fetchData();
        
        if (data) {
            const { total_amount, paid_amount, interest_rate, ...rest } = data;
            return { ...rest, totalAmount: total_amount, paidAmount: paid_amount, interestRate: interest_rate };
        }
        return null;
    }, [user, handleError, showToast, fetchData]);

    const addPaymentToDebt = useCallback(async (id: string, paymentAmount: number): Promise<boolean> => {
        const debt = debts.find(d => d.id === id);
        if (!debt) return false;

        const txSuccess = await addTransaction({
            description: `Pagamento da dívida: ${debt.name}`, 
            amount: -Math.abs(paymentAmount), // FIX: Despesas devem ter valor negativo
            type: TransactionType.DESPESA, date: new Date().toISOString(),
            categoryId: 'cat_pagamento_divida', debtPaymentId: id
        });

        if (!txSuccess) {
            handleError(new Error('A dívida não foi atualizada porque o registro da transação falhou.'), 'addPaymentToDebt-tx-failure', 'Falha ao registrar a transação. A dívida não foi alterada.');
            return false;
        }

        const originalDebts = [...debts];
        const newPaidAmount = debt.paidAmount + paymentAmount;
        const newStatus = newPaidAmount >= debt.totalAmount ? DebtStatus.PAGA : debt.status;
        setDebts(prev => prev.map(d => d.id === id ? { ...d, paidAmount: newPaidAmount, status: newStatus } : d));

        const { error } = await supabase.from('debts').update({ paid_amount: newPaidAmount, status: newStatus }).eq('id', id);

        if (error) {
            handleError(error, 'addPaymentToDebt-debt-update-failure', 'A transação foi salva, mas a atualização da dívida falhou. Sincronizando...');
            setDebts(originalDebts);
            await fetchData();
            return false;
        }

        showToast(`Pagamento para ${debt.name} registrado!`, { type: 'success' });
        return true;
    }, [debts, addTransaction, handleError, showToast, fetchData]);

    const deleteDebt = useCallback(async (id: string): Promise<boolean> => {
        const originalDebts = [...debts];
        const originalTransactions = [...transactions];

        setDebts(prev => prev.filter(d => d.id !== id));
        setTransactions(prev => prev.filter(tx => tx.debtPaymentId !== id));
        
        const linkedTxIds = originalTransactions.filter(tx => tx.debtPaymentId === id).map(tx => tx.id);
        if (linkedTxIds.length > 0) {
            const { error: txError } = await supabase.from('transactions').delete().in('id', linkedTxIds);
            if (txError) {
                handleError(txError, 'deleteDebt-tx-deletion');
                setDebts(originalDebts);
                setTransactions(originalTransactions);
                return false;
            }
        }

        const { error: debtError } = await supabase.from('debts').delete().eq('id', id);
        if (debtError) {
            handleError(debtError, 'deleteDebt-debt-deletion');
            setDebts(originalDebts);
            setTransactions(originalTransactions);
            await fetchData();
            return false;
        }
        
        showToast('Dívida e pagamentos excluídos!', { type: 'success' });
        return true;
    }, [transactions, debts, handleError, showToast, fetchData]);

    // Agendamentos
    const addScheduledTransaction = useCallback(async (tx: Omit<ScheduledTransaction, 'id' | 'category' | 'nextDueDate'>): Promise<boolean> => {
        const tempId = `temp-sch-${Date.now()}`;
        const newScheduledTx: ScheduledTransaction = { 
            ...tx, 
            id: tempId, 
            category: categoriesById[tx.categoryId] || fallbackCategory,
            nextDueDate: new Date(tx.startDate).toISOString()
        };

        setScheduledTransactions(prev => [newScheduledTx, ...prev]);

        const payload = {
            description: tx.description,
            amount: tx.amount,
            type: String(tx.type).toLowerCase() === 'receita' ? 'receita' : 'despesa',
            category_id: tx.categoryId,
            start_date: tx.startDate,
            frequency: tx.frequency,
            next_due_date: newScheduledTx.nextDueDate,
            user_id: user!.id
        };
        const { error } = await supabase.from('scheduled_transactions').insert(payload);

        if (error) {
            handleError(error, 'addScheduledTransaction');
            setScheduledTransactions(prev => prev.filter(t => t.id !== tempId));
            return false;
        }
        
        showToast('Agendamento criado!', { type: 'success' });
        await fetchData();
        return true;
    }, [user, categoriesById, fallbackCategory, handleError, showToast, fetchData]);

    const updateScheduledTransaction = useCallback(async (tx: Omit<ScheduledTransaction, 'category'>): Promise<boolean> => {
        const originalScheduled = [...scheduledTransactions];
        const updatedTx: ScheduledTransaction = { ...tx, category: categoriesById[tx.categoryId] || fallbackCategory };
        
        setScheduledTransactions(prev => prev.map(item => item.id === tx.id ? updatedTx : item));

        const payload = {
            description: tx.description,
            amount: tx.amount,
            type: String(tx.type).toLowerCase() === 'receita' ? 'receita' : 'despesa',
            category_id: tx.categoryId,
            start_date: tx.startDate,
            frequency: tx.frequency,
            next_due_date: tx.nextDueDate,
        };
        const { error } = await supabase.from('scheduled_transactions').update(payload).eq('id', tx.id);
        
        if(error) {
            handleError(error, 'updateScheduledTransaction');
            setScheduledTransactions(originalScheduled);
            return false;
        }
        
        showToast('Agendamento atualizado!', { type: 'success' });
        return true;
    }, [scheduledTransactions, categoriesById, fallbackCategory, handleError, showToast]);

    const deleteScheduledTransaction = useCallback(async (id: string): Promise<boolean> => {
        const originalScheduled = [...scheduledTransactions];
        setScheduledTransactions(prev => prev.filter(item => item.id !== id));
        const { error } = await supabase.from('scheduled_transactions').delete().eq('id', id);

        if (error) {
            handleError(error, 'deleteScheduledTransaction');
            setScheduledTransactions(originalScheduled);
            return false;
        }

        showToast('Agendamento excluído.', { type: 'success' });
        return true;
    }, [scheduledTransactions, handleError, showToast]);

    // --- FUNÇÕES DE DEVTOOLS ---
    const addRandomTransactions = useCallback(async (count: number) => {
        if (!user) return;
        setIsMutating(true);
        const descriptions = ['Supermercado', 'Gasolina', 'Restaurante', 'Cinema', 'Uber', 'Salário', 'Freelance'];
        const expenseCategories = categories.filter(c => c.id !== 'cat_salario').map(c => c.id);
        
        const newTransactions = Array.from({ length: count }).map(() => {
            const isExpense = Math.random() > 0.2; // 80% chance of expense
            const amount = isExpense 
                ? -(Math.random() * 200 + 5) // 5 a 205
                : (Math.random() * 1500 + 500); // 500 a 2000
            const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // last 30 days

            return {
                user_id: user.id,
                description: descriptions[Math.floor(Math.random() * descriptions.length)],
                amount: parseFloat(amount.toFixed(2)),
                type: isExpense ? 'despesa' : 'receita',
                date: date.toISOString(),
                category_id: isExpense
                    ? expenseCategories[Math.floor(Math.random() * expenseCategories.length)]
                    : 'cat_salario',
            };
        });

        const { error } = await supabase.from('transactions').insert(newTransactions);
        if (error) {
            handleError(error, 'addRandomTransactions');
        } else {
            showToast(`${count} transações aleatórias adicionadas!`, { type: 'success' });
            await fetchData();
        }
        setIsMutating(false);
    }, [user, categories, handleError, showToast, fetchData]);

    const deleteAllUserData = useCallback(async () => {
        if (!user) return;
        setIsMutating(true);

        const tables = ['transactions', 'goals', 'debts', 'scheduled_transactions', 'achievements'];
        const promises = tables.map(table => supabase.from(table).delete().eq('user_id', user.id));

        const results = await Promise.all(promises);
        const someError = results.some(res => res.error);

        if (someError) {
            handleError(results.find(r => r.error)?.error, 'deleteAllUserData', 'Erro ao limpar todos os dados.');
        } else {
            showToast('Todos os dados do usuário foram resetados.', { type: 'success' });
            await fetchData();
        }
        setIsMutating(false);
    }, [user, handleError, showToast, fetchData]);

    const grantXp = useCallback(async (amount: number) => {
        const transactionsNeeded = Math.ceil(amount / 10);
        showToast(`Adicionando ${transactionsNeeded} transações para conceder ${amount} XP...`, { type: 'info' });
        await addRandomTransactions(transactionsNeeded);
    }, [addRandomTransactions, showToast]);

    const simulateError = useCallback(() => {
        handleError(new Error("Erro simulado pelo DevTools"), "simulateError", "Este é um erro de teste para verificar o ErrorModal.");
    }, [handleError]);


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
    
    const contextValue: DashboardDataContextType = useMemo(() => ({
        transactions, goals, debts, scheduledTransactions, categories, summary, monthlyChartData,
        userLevel, achievements, loading, isMutating, mutatingIds, error,
        clearError: () => setError(null),
        addTransaction, updateTransaction, deleteTransaction, updateTransactionsCategory,
        addGoal, updateGoalValue, deleteGoal, addDebt, addPaymentToDebt, deleteDebt,
        addScheduledTransaction, updateScheduledTransaction, deleteScheduledTransaction,
        addRandomTransactions, deleteAllUserData, grantXp, simulateError,
    }), [
        transactions, goals, debts, scheduledTransactions, categories, summary, monthlyChartData,
        userLevel, achievements, loading, isMutating, mutatingIds, error,
        addTransaction, updateTransaction, deleteTransaction, updateTransactionsCategory,
        addGoal, updateGoalValue, deleteGoal, addDebt, addPaymentToDebt, deleteDebt,
        addScheduledTransaction, updateScheduledTransaction, deleteScheduledTransaction,
        addRandomTransactions, deleteAllUserData, grantXp, simulateError
    ]);

    return React.createElement(DashboardDataContext.Provider, { value: contextValue }, children);
};

export const useDashboardData = (): DashboardDataContextType => {
    const context = useContext(DashboardDataContext);
    if (context === undefined) {
        throw new Error('useDashboardData must be used within a DashboardDataProvider');
    }
    return context;
};