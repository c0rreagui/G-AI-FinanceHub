// hooks/useDashboardData.ts
// FIX: Imported React to resolve the "UMD global" error when using React.createElement.
import React, { createContext, useState, useEffect, useContext, useCallback, useMemo, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './useAuth';
import { 
    Transaction, 
    Goal, 
    Debt, 
    ScheduledTransaction, 
    Category,
    DashboardDataContextType,
    SummaryData,
    GoalStatus,
    DebtStatus,
    TransactionType,
    MonthlyChartData,
    UserLevel,
    UserRank,
    Achievement,
    ScheduledTransactionFrequency,
} from '../types';
import { DashboardDataContext } from '../contexts/DashboardDataContext';
import { getIconByName } from '../utils/categoryIcons';
import { useToast } from './useToast';
import { logger } from '../services/loggingService';
import { triggerConfetti } from '../components/ui/Confetti';

const GUEST_DATA_KEY = 'financehub_guest_data';

const getDefaultCategories = (userId: string | 'guest'): Omit<Category, 'id'>[] => [
    { user_id: userId, name: 'Alimentação', icon: getIconByName('Utensils'), color: '#f59e0b' },
    { user_id: userId, name: 'Compras', icon: getIconByName('ShoppingCart'), color: '#84cc16' },
    { user_id: userId, name: 'Transporte', icon: getIconByName('Car'), color: '#3b82f6' },
    { user_id: userId, name: 'Moradia', icon: getIconByName('HomeIcon'), color: '#14b8a6' },
    { user_id: userId, name: 'Saúde', icon: getIconByName('Heart'), color: '#ef4444' },
    { user_id: userId, name: 'Educação', icon: getIconByName('BookOpen'), color: '#a855f7' },
    { user_id: userId, name: 'Lazer', icon: getIconByName('Gamepad'), color: '#ec4899' },
    { user_id: userId, name: 'Salário', icon: getIconByName('Wallet'), color: '#22c55e' },
    { user_id: userId, name: 'Investimentos', icon: getIconByName('PiggyBank'), color: '#10b981' },
    { user_id: userId, name: 'Outros', icon: getIconByName('Gift'), color: '#6b7280' },
];

const generateMockData = (userId: string, categories: Category[]) => {
    const now = new Date();
    const goals: Omit<Goal, 'id'>[] = [];
    const debts: Omit<Debt, 'id'>[] = [];
    const transactions: Omit<Transaction, 'category' | 'id'>[] = [];
    const scheduledTransactions: Omit<ScheduledTransaction, 'category' | 'id'>[] = [];

    const catMap = new Map(categories.map(c => [c.name, c.id]));
    const getRandomCatId = (type: 'receita' | 'despesa') => {
        const despesaCats = ['Alimentação', 'Compras', 'Transporte', 'Moradia', 'Lazer'];
        if (type === 'receita') return catMap.get('Salário')!;
        return catMap.get(despesaCats[Math.floor(Math.random() * despesaCats.length)])!;
    };

    // 1. Metas
    const goal1: Omit<Goal, 'id'> = {
        user_id: userId,
        name: 'Viagem para o Japão',
        target_amount: 25000,
        current_amount: 7500,
        deadline: new Date(now.getFullYear() + 2, 5, 1).toISOString(),
        status: GoalStatus.EM_ANDAMENTO,
    };
    goals.push(goal1);
    
    // As contribuições de meta/dívida são criadas como transações normais
    // A lógica no backend ou frontend deve associá-las
    // Para simplificar o mock, vamos criar uma transação que *representa* a contribuição
    transactions.push({
        description: 'Contribuição para a meta: Viagem para o Japão',
        amount: -7500,
        type: TransactionType.DESPESA,
        date: new Date(now.getFullYear(), now.getMonth() - 2, 15).toISOString(),
        category_id: catMap.get('Investimentos')!,
        user_id: userId,
        goal_contribution_id: 'mock_goal_1', // Placeholder ID
    });


    // 2. Dívidas
    const debt1: Omit<Debt, 'id'> = {
        user_id: userId,
        name: 'Financiamento do Carro',
        total_amount: 60000,
        paid_amount: 15000,
        interest_rate: 18.5,
        category: 'Automóvel',
        status: DebtStatus.ATIVA,
    };
    debts.push(debt1);
    transactions.push({
        description: 'Pagamento da dívida: Financiamento do Carro',
        amount: -15000,
        type: TransactionType.DESPESA,
        date: new Date(now.getFullYear(), now.getMonth() - 1, 5).toISOString(),
        category_id: catMap.get('Transporte')!,
        user_id: userId,
        debt_payment_id: 'mock_debt_1', // Placeholder ID
    });

    // 3. Transações Recorrentes
    for (let i = 0; i < 6; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        transactions.push({
            description: 'Salário',
            amount: 7500,
            type: TransactionType.RECEITA,
            date: date.toISOString(),
            category_id: catMap.get('Salário')!,
            user_id: userId,
        });
        
        for (let j = 0; j < 15; j++) {
            transactions.push({
                description: `Compra Aleatória ${i}-${j}`,
                amount: -(Math.random() * 200 + 10),
                type: TransactionType.DESPESA,
                date: new Date(now.getFullYear(), now.getMonth() - i, Math.floor(Math.random() * 28) + 1).toISOString(),
                category_id: getRandomCatId('despesa'),
                user_id: userId,
            });
        }
    }
    
    // 4. Agendamentos
    scheduledTransactions.push({
        description: 'Assinatura Netflix',
        amount: -39.90,
        type: TransactionType.DESPESA,
        category_id: catMap.get('Lazer')!,
        start_date: new Date(now.getFullYear(), now.getMonth(), 10).toISOString(),
        next_due_date: new Date(now.getFullYear(), now.getMonth() + 1, 10).toISOString(),
        frequency: ScheduledTransactionFrequency.MENSAL,
        user_id: userId,
    });
     scheduledTransactions.push({
        description: 'Aluguel',
        amount: -2500,
        type: TransactionType.DESPESA,
        category_id: catMap.get('Moradia')!,
        start_date: new Date(now.getFullYear(), now.getMonth(), 5).toISOString(),
        next_due_date: new Date(now.getFullYear(), now.getMonth() + 1, 5).toISOString(),
        frequency: ScheduledTransactionFrequency.MENSAL,
        user_id: userId,
    });

    return { goals, debts, transactions, scheduledTransactions };
};

export const DashboardDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isGuest, isDeveloper } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMutating, setIsMutating] = useState(false);
    const [mutatingIds, setMutatingIds] = useState<Set<string>>(new Set());

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [debts, setDebts] = useState<Debt[]>([]);
    const [scheduledTransactions, setScheduledTransactions] = useState<ScheduledTransaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // --- GUEST DATA HANDLING ---
    const getGuestData = useCallback(() => {
        try {
            const data = localStorage.getItem(GUEST_DATA_KEY);
            return data ? JSON.parse(data) : { transactions: [], goals: [], debts: [], scheduledTransactions: [], categories: [] };
        } catch (e) {
            logger.error("Erro ao ler dados do visitante do localStorage", { error: e });
            return { transactions: [], goals: [], debts: [], scheduledTransactions: [], categories: [] };
        }
    }, []);

    const setGuestData = useCallback((data: any) => {
        try {
            localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(data));
        } catch (e) {
            logger.error("Erro ao salvar dados do visitante no localStorage", { error: e });
        }
    }, []);
    
    // --- UTILITY FUNCTIONS ---
    const withMutation = useCallback(async <T>(asyncFunc: () => Promise<T>, ...ids: string[]): Promise<T | null> => {
        setIsMutating(true);
        if (ids.length > 0) {
            setMutatingIds(prev => new Set([...prev, ...ids]));
        }
        try {
            const result = await asyncFunc();
            return result;
        } catch (e: any) {
            const errorMessage = e.message || "Ocorreu um erro desconhecido.";
            logger.error("Erro na mutação de dados", { error: e });
            setError(errorMessage);
            showToast('Erro na Operação', { description: errorMessage, type: 'error' });
            return null;
        } finally {
            setIsMutating(false);
            if (ids.length > 0) {
                setMutatingIds(prev => {
                    const newSet = new Set(prev);
                    ids.forEach(id => newSet.delete(id));
                    return newSet;
                });
            }
        }
    }, [showToast]);

    // --- DATA FETCHING ---
    const fetchData = useCallback(async () => {
        if (isGuest || isDeveloper) {
            setLoading(true);
            setError(null);
            
            // For developer mode, we can use a separate key or just in-memory/mock data
            // For now, let's reuse the guest data logic but perhaps seeded with rich data if empty
            // Or better, just treat it like guest mode but with a different persistence or none.
            // Actually, the prompt implies developer mode should just work. 
            // Let's use the same local storage for now to persist dev changes, 
            // OR we could generate fresh mock data every time if we want a "clean slate" dev mode.
            // Given the user wants to "access login", persistence is likely expected.
            // Let's share the guest data mechanism for simplicity but maybe with a different key if we wanted separation.
            // For now, let's just use the guest logic.
            
            let data = getGuestData();
            if (!data.categories || data.categories.length === 0) {
                const userId = isDeveloper ? 'developer' : 'guest';
                data.categories = getDefaultCategories(userId).map(cat => ({ ...cat, id: crypto.randomUUID() }));
                
                // If developer, maybe seed with some initial data immediately?
                if (isDeveloper) {
                     const mockData = generateMockData(userId, data.categories);
                     data.transactions = mockData.transactions.map(t => ({...t, id: crypto.randomUUID(), created_at: new Date().toISOString()}));
                     data.goals = mockData.goals.map(g => ({...g, id: crypto.randomUUID()}));
                     data.debts = mockData.debts.map(d => ({...d, id: crypto.randomUUID()}));
                     data.scheduledTransactions = mockData.scheduledTransactions.map(s => ({...s, id: crypto.randomUUID(), created_at: new Date().toISOString()}));
                }
                
                setGuestData(data);
            }
            const populatedCategories = data.categories.map((c: any) => ({ ...c, icon: getIconByName(c.icon.displayName || c.icon) }));
            const categoryMap = new Map(populatedCategories.map((c: any) => [c.id, c]));
            const fallbackCategory = populatedCategories.find((c: any) => c.name === 'Outros') || populatedCategories[0];
            
            setCategories(populatedCategories);
            setTransactions(data.transactions?.map((tx: any) => ({ ...tx, category: categoryMap.get(tx.category_id) || fallbackCategory })).sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime()) || []);
            setGoals(data.goals?.sort((a: Goal, b: Goal) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()) || []);
            setDebts(data.debts || []);
            setScheduledTransactions(data.scheduledTransactions?.map((stx: any) => ({ ...stx, category: categoryMap.get(stx.category_id) || fallbackCategory })).sort((a: ScheduledTransaction, b: ScheduledTransaction) => new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime()) || []);
            setLoading(false);
            return;
        }

        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            let { data: categoriesData, error: categoriesError } = await supabase
                .from('categories')
                .select('*')
                .eq('user_id', user.id);

            if (categoriesError) throw categoriesError;

            // Se o usuário não tiver categorias, crie as padrão para ele.
            if (!categoriesData || categoriesData.length === 0) {
                const defaultCategories = getDefaultCategories(user.id);
                const { data: newCategories, error: insertError } = await supabase
                    .from('categories')
                    .insert(defaultCategories)
                    .select();
                if (insertError) throw insertError;
                categoriesData = newCategories;
            }


            const populatedCategories: Category[] = categoriesData.map(c => ({...c, icon: getIconByName(c.icon) }));
            setCategories(populatedCategories);
            
            const categoryMap = new Map(populatedCategories.map(c => [c.id, c]));
            const fallbackCategory = populatedCategories.find(c => c.name === 'Outros') || populatedCategories[0];

            const [
                { data: transactionsData, error: transactionsError },
                { data: goalsData, error: goalsError },
                { data: debtsData, error: debtsError },
                { data: scheduledData, error: scheduledError }
            ] = await Promise.all([
                supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
                supabase.from('goals').select('*').eq('user_id', user.id).order('deadline', { ascending: true }),
                supabase.from('debts').select('*').eq('user_id', user.id),
                supabase.from('scheduled_transactions').select('*').eq('user_id', user.id).order('next_due_date', { ascending: true })
            ]);

            if (transactionsError) throw transactionsError;
            if (goalsError) throw goalsError;
            if (debtsError) throw debtsError;
            if (scheduledError) throw scheduledError;

            setTransactions(transactionsData?.map(tx => ({...tx, category: categoryMap.get(tx.category_id) || fallbackCategory })) || []);
            setGoals(goalsData || []);
            setDebts(debtsData || []);
            setScheduledTransactions(scheduledData?.map(stx => ({...stx, category: categoryMap.get(stx.category_id) || fallbackCategory })) || []);

        } catch (e: any) {
            const errorMessage = e.message || "Falha ao carregar os dados.";
            logger.error("Erro ao buscar dados do Supabase", { error: e });
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [user, isGuest, isDeveloper, getGuestData, setGuestData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const clearError = () => setError(null);

    // --- COMPUTED DATA (MEMOIZED) ---
    const summary = useMemo<SummaryData>(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyIncome = transactions
            .filter(t => t.type === TransactionType.RECEITA && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);

        const monthlyExpenses = transactions
            .filter(t => t.type === TransactionType.DESPESA && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);
        
        // FIX: Simplificado o cálculo do saldo total para somar diretamente os valores,
        // garantindo que os valores de despesa sejam negativos.
        const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

        return { totalBalance, monthlyIncome, monthlyExpenses };
    }, [transactions]);
    
    const monthlyChartData = useMemo<MonthlyChartData[]>(() => {
        const data: { [key: string]: MonthlyChartData } = {};
        const today = new Date();

        for(let i=5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
            const year = date.getFullYear().toString().slice(-2);
            const key = `${monthName}/${year}`;
            data[key] = { name: key, receita: 0, despesa: 0 };
        }

        transactions.forEach(tx => {
            const txDate = new Date(tx.date);
            const monthName = txDate.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
            const year = txDate.getFullYear().toString().slice(-2);
            const key = `${monthName}/${year}`;

            if(data[key]) {
                 if (tx.type === TransactionType.RECEITA) {
                    data[key].receita += tx.amount;
                } else {
                    data[key].despesa += Math.abs(tx.amount);
                }
            }
        });

        return Object.values(data);

    }, [transactions]);
    
    const userLevel: UserLevel | null = useMemo(() => {
        if (!user && !isGuest) return null;
        const xp = (transactions.length * 10) + (goals.length * 50) + (debts.filter(d => d.status === DebtStatus.PAGA).length * 100);
        let level = 1;
        let xpToNextLevel = 100;
        let currentXp = xp;
        
        while (currentXp >= xpToNextLevel) {
            currentXp -= xpToNextLevel;
            level++;
            xpToNextLevel = Math.floor(xpToNextLevel * 1.5);
        }

        let rank = UserRank.BRONZE;
        if (level >= 50) rank = UserRank.DIAMANTE;
        else if (level >= 25) rank = UserRank.PLATINA;
        else if (level >= 10) rank = UserRank.OURO;
        else if (level >= 5) rank = UserRank.PRATA;
        
        return { level, xp: currentXp, xpToNextLevel, rank };
    }, [transactions, goals, debts, user, isGuest]);
    
    const achievements: Achievement[] = useMemo(() => {
        return [
            { id: '1', name: 'Primeiros Passos', description: 'Adicione sua primeira transação.', unlocked: transactions.length > 0, dateUnlocked: transactions[0]?.date },
            { id: '2', name: 'Planejador', description: 'Crie sua primeira meta financeira.', unlocked: goals.length > 0 },
            { id: '3', name: 'Economista', description: 'Acumule R$ 1.000,00 em saldo.', unlocked: summary.totalBalance >= 1000 },
            { id: '4', name: 'Livre de Dívidas', description: 'Pague sua primeira dívida.', unlocked: debts.some(d => d.status === DebtStatus.PAGA) },
        ];
    }, [transactions, goals, debts, summary.totalBalance]);

    // --- CRUD FUNCTIONS ---
    const addTransaction = (tx: Omit<Transaction, 'id' | 'category'|'user_id'|'category_id'> & {categoryId: string}) => withMutation(async () => {
        if (isGuest) {
            const data = getGuestData();
            const newTx = { ...tx, id: crypto.randomUUID(), user_id: 'guest', category_id: tx.categoryId, created_at: new Date().toISOString() };
            data.transactions.push(newTx);
            setGuestData(data);
            await fetchData();
            showToast('Transação Adicionada!', { type: 'success' });
            return true;
        }
        // FIX: Destructure categoryId to avoid sending it to Supabase, which expects category_id.
        const { categoryId, ...txData } = tx;
        const { error } = await supabase.from('transactions').insert({ ...txData, category_id: categoryId, user_id: user!.id });
        if (error) throw error;
        await fetchData();
        showToast('Transação Adicionada!', { type: 'success' });
        return true;
    });

    const updateTransaction = (tx: Omit<Transaction, 'category'|'user_id'|'category_id'> & {categoryId: string}) => withMutation(async () => {
        if (isGuest) {
            const data = getGuestData();
            const index = data.transactions.findIndex((t: Transaction) => t.id === tx.id);
            if (index > -1) {
                data.transactions[index] = { ...data.transactions[index], ...tx, category_id: tx.categoryId };
                setGuestData(data);
            }
            await fetchData();
            showToast('Transação Atualizada!', { type: 'success' });
            return true;
        }
        // FIX: Destructure categoryId to avoid sending it to Supabase, which expects category_id.
        const { categoryId, ...txData } = tx;
        const { error } = await supabase.from('transactions').update({ ...txData, category_id: categoryId }).eq('id', tx.id);
        if (error) throw error;
        await fetchData();
        showToast('Transação Atualizada!', { type: 'success' });
        return true;
    }, tx.id);

    const deleteTransaction = (id: string) => withMutation(async () => {
        const txToDelete = transactions.find(t => t.id === id);
        if (!txToDelete) return false;

        if (isGuest) {
            const data = getGuestData();
            data.transactions = data.transactions.filter((t: Transaction) => t.id !== id);
            setGuestData(data);
            await fetchData();
        } else {
            const { error } = await supabase.from('transactions').delete().eq('id', id);
            if (error) throw error;
            await fetchData();
        }

        showToast('Transação Excluída!', { 
            type: 'success',
            action: {
                label: 'Desfazer',
                onClick: async () => {
                    if (isGuest) {
                        const data = getGuestData();
                        data.transactions.push(txToDelete);
                        setGuestData(data);
                    } else {
                        // Restore to Supabase
                        // Omit ID to generate a new one, or keep it? Let's omit to be safe with PK constraints if any.
                        // Actually, if it was deleted, the ID is free. But let's let DB handle it or use the old one.
                        // We need to strip the 'category' object and ensure 'category_id' is present.
                        const { id: oldId, category, ...rest } = txToDelete;
                        const txToRestore = { 
                            ...rest, 
                            category_id: category.id, 
                            user_id: user!.id 
                        };
                        await supabase.from('transactions').insert(txToRestore);
                    }
                    await fetchData();
                    showToast('Transação Restaurada!', { type: 'success' });
                }
            }
        });
        return true;
    }, id);
    
    const updateTransactionsCategory = (transactionIds: string[], newCategoryId: string) => withMutation(async () => {
        if (isGuest) {
            const data = getGuestData();
            data.transactions.forEach((tx: Transaction) => {
                if (transactionIds.includes(tx.id)) {
                    tx.category_id = newCategoryId;
                }
            });
            setGuestData(data);
            await fetchData();
            showToast(`${transactionIds.length} transações foram atualizadas!`, { type: 'success' });
            return true;
        }
        const { error } = await supabase.from('transactions').update({ category_id: newCategoryId }).in('id', transactionIds);
        if (error) throw error;
        await fetchData();
        showToast(`${transactionIds.length} transações foram atualizadas!`, { type: 'success' });
        return true;
    }, ...transactionIds);

    const addGoal = (goal: Omit<Goal, 'id' | 'current_amount' | 'status' | 'user_id' | 'target_amount' | 'deadline'> & {targetAmount: number; deadline: string;}) => withMutation(async () => {
        if (isGuest) {
            const data = getGuestData();
            const newGoal: Goal = {
                id: crypto.randomUUID(),
                name: goal.name,
                target_amount: goal.targetAmount,
                deadline: goal.deadline,
                current_amount: 0,
                status: GoalStatus.EM_ANDAMENTO,
                user_id: 'guest',
            };
            data.goals.push(newGoal);
            setGuestData(data);
            await fetchData();
            showToast('Meta Criada!', { description: 'Agora adicione o primeiro valor!', type: 'success' });
            return newGoal;
        }
        const { data, error } = await supabase.from('goals').insert({ name: goal.name, target_amount: goal.targetAmount, deadline: goal.deadline, user_id: user!.id }).select().single();
        if (error) throw error;
        await fetchData();
        showToast('Meta Criada!', { description: 'Agora adicione o primeiro valor!', type: 'success' });
        return data as Goal;
    });
    
    const updateGoalValue = (goalId: string, amount: number) => withMutation(async () => {
        // Encontra a meta no estado atual para obter os valores
        const goal = (isGuest ? getGuestData().goals : goals).find((g: Goal) => g.id === goalId);
        if (!goal) throw new Error("Meta não encontrada.");

        // Cria a transação de contribuição
        const tx: Omit<Transaction, 'id' | 'category'|'user_id'|'category_id'> & {categoryId: string} = {
            description: `Contribuição para a meta: ${goal.name}`,
            amount: -Math.abs(amount),
            type: TransactionType.DESPESA,
            date: new Date().toISOString(),
            categoryId: categories.find(c => c.name === 'Investimentos')?.id || categories[0].id,
            goal_contribution_id: goalId,
        };

        if (isGuest) {
            const data = getGuestData();
            // Adiciona a transação
            const newTx = { ...tx, id: crypto.randomUUID(), user_id: 'guest', category_id: tx.categoryId, created_at: new Date().toISOString() };
            data.transactions.push(newTx);
            // Atualiza a meta
            const goalIndex = data.goals.findIndex((g: Goal) => g.id === goalId);
            if (goalIndex > -1) {
                data.goals[goalIndex].current_amount += Math.abs(amount);
                if (data.goals[goalIndex].current_amount >= data.goals[goalIndex].target_amount) {
                    data.goals[goalIndex].status = GoalStatus.CONCLUIDO;
                }
            }
            setGuestData(data);
        } else {
            // Insere a transação no Supabase
            const { categoryId, ...txData } = tx;
            const { error: txError } = await supabase.from('transactions').insert({ ...txData, category_id: categoryId, user_id: user!.id });
            if (txError) throw txError;
            
            // **FIX**: Atualiza a meta no Supabase
            const newAmount = goal.current_amount + Math.abs(amount);
            const newStatus = newAmount >= goal.target_amount ? GoalStatus.CONCLUIDO : GoalStatus.EM_ANDAMENTO;
            const { error: goalUpdateError } = await supabase
                .from('goals')
                .update({ current_amount: newAmount, status: newStatus })
                .eq('id', goalId);

            if (goalUpdateError) throw goalUpdateError;
        }
        
        await fetchData();
        showToast('Valor Adicionado à Meta!', { type: 'success' });
        
        // A busca de dados (fetchData) já trará a meta atualizada
        // A busca de dados (fetchData) já trará a meta atualizada
        const updatedGoal = goals.find((g: Goal) => g.id === goalId);
        
        if (updatedGoal) {
            const oldProgress = (goal.current_amount / goal.target_amount) * 100;
            const newProgress = (updatedGoal.current_amount / updatedGoal.target_amount) * 100;

            if (updatedGoal.status === GoalStatus.CONCLUIDO && goal.status !== GoalStatus.CONCLUIDO) {
                triggerConfetti();
                showToast('Parabéns!', { description: `Meta "${goal.name}" concluída! 🎉`, type: 'success' });
            } else if (newProgress >= 75 && oldProgress < 75) {
                triggerConfetti();
                showToast('Quase lá!', { description: `Você já atingiu 75% da meta "${goal.name}"! 🚀`, type: 'success' });
            } else if (newProgress >= 50 && oldProgress < 50) {
                triggerConfetti();
                showToast('Metade do caminho!', { description: `Você já atingiu 50% da meta "${goal.name}"! 💪`, type: 'success' });
            } else if (newProgress >= 25 && oldProgress < 25) {
                showToast('Bom começo!', { description: `Você já atingiu 25% da meta "${goal.name}"! 🌱`, type: 'success' });
            }
        }
        return true;
    }, goalId);

    const deleteGoal = (id: string) => withMutation(async () => {
        if (isGuest) {
            const data = getGuestData();
            data.transactions = data.transactions.filter((t: Transaction) => t.goal_contribution_id !== id);
            data.goals = data.goals.filter((g: Goal) => g.id !== id);
            setGuestData(data);
        } else {
            const { error: txError } = await supabase.from('transactions').delete().eq('goal_contribution_id', id);
            if (txError) throw txError;
            const { error } = await supabase.from('goals').delete().eq('id', id);
            if (error) throw error;
        }

        await fetchData();
        showToast('Meta Excluída!', { description: 'As contribuições foram removidas.', type: 'info' });
        return true;
    }, id);

    const addDebt = (debt: Omit<Debt, 'id' | 'paid_amount' | 'status' | 'user_id' | 'total_amount' | 'interest_rate'> & {totalAmount: number; interestRate: number}) => withMutation(async () => {
        if (isGuest) {
            const data = getGuestData();
            const newDebt: Debt = {
                id: crypto.randomUUID(),
                name: debt.name,
                total_amount: debt.totalAmount,
                interest_rate: debt.interestRate,
                category: debt.category,
                paid_amount: 0,
                status: DebtStatus.ATIVA,
                user_id: 'guest',
            };
            data.debts.push(newDebt);
            setGuestData(data);
            await fetchData();
            showToast('Dívida Adicionada!', { type: 'success' });
            return newDebt;
        }
        const { data, error } = await supabase.from('debts').insert({ name: debt.name, total_amount: debt.totalAmount, interest_rate: debt.interestRate, category: debt.category, user_id: user!.id }).select().single();
        if (error) throw error;
        await fetchData();
        showToast('Dívida Adicionada!', { type: 'success' });
        return data as Debt;
    });

    const addPaymentToDebt = (debtId: string, amount: number) => withMutation(async () => {
        const debt = (isGuest ? getGuestData().debts : debts).find((d: Debt) => d.id === debtId);
        if (!debt) throw new Error("Dívida não encontrada.");

        const tx: Omit<Transaction, 'id' | 'category'|'user_id'|'category_id'> & {categoryId: string} = {
            description: `Pagamento da dívida: ${debt.name}`,
            amount: -Math.abs(amount),
            type: TransactionType.DESPESA,
            date: new Date().toISOString(),
            categoryId: categories.find(c => c.name === 'Outros')?.id || categories[0].id,
            debt_payment_id: debtId,
        };

        if (isGuest) {
            const data = getGuestData();
            const newTx = { ...tx, id: crypto.randomUUID(), user_id: 'guest', category_id: tx.categoryId, created_at: new Date().toISOString() };
            data.transactions.push(newTx);
            const debtIndex = data.debts.findIndex((d: Debt) => d.id === debtId);
            if (debtIndex > -1) {
                data.debts[debtIndex].paid_amount += Math.abs(amount);
                if (data.debts[debtIndex].paid_amount >= data.debts[debtIndex].total_amount) {
                    data.debts[debtIndex].status = DebtStatus.PAGA;
                }
            }
            setGuestData(data);
        } else {
            const { categoryId, ...txData } = tx;
            const { error: txError } = await supabase.from('transactions').insert({ ...txData, category_id: categoryId, user_id: user!.id });
            if (txError) throw txError;

            // **FIX**: Atualiza a dívida no Supabase
            const newPaidAmount = debt.paid_amount + Math.abs(amount);
            const newStatus = newPaidAmount >= debt.total_amount ? DebtStatus.PAGA : DebtStatus.ATIVA;
            const { error: debtUpdateError } = await supabase
                .from('debts')
                .update({ paid_amount: newPaidAmount, status: newStatus })
                .eq('id', debtId);

            if (debtUpdateError) throw debtUpdateError;
        }

        await fetchData();
        showToast('Pagamento Realizado!', { type: 'success' });
        
        const updatedDebt = debts.find((d: Debt) => d.id === debtId);
        if(updatedDebt?.status === DebtStatus.PAGA && debt.status !== DebtStatus.PAGA) {
            showToast('Dívida Quitada!', { description: `Parabéns por quitar "${debt.name}"!`, type: 'success' });
        }
        return true;
    }, debtId);
    
    const deleteDebt = (id: string) => withMutation(async () => {
        if(isGuest) {
            const data = getGuestData();
            data.transactions = data.transactions.filter((t: Transaction) => t.debt_payment_id !== id);
            data.debts = data.debts.filter((d: Debt) => d.id !== id);
            setGuestData(data);
        } else {
            const { error: txError } = await supabase.from('transactions').delete().eq('debt_payment_id', id);
            if (txError) throw txError;
            const { error } = await supabase.from('debts').delete().eq('id', id);
            if (error) throw error;
        }

        await fetchData();
        showToast('Dívida Excluída!', { description: 'Os pagamentos foram removidos.', type: 'info' });
        return true;
    }, id);
    
    const calculateNextDueDate = (startDate: string, frequency: ScheduledTransactionFrequency): string => {
        const date = new Date(startDate);
        switch (frequency) {
            case ScheduledTransactionFrequency.DIARIO: date.setDate(date.getDate() + 1); break;
            case ScheduledTransactionFrequency.SEMANAL: date.setDate(date.getDate() + 7); break;
            case ScheduledTransactionFrequency.QUINZENAL: date.setDate(date.getDate() + 15); break;
            case ScheduledTransactionFrequency.MENSAL: date.setMonth(date.getMonth() + 1); break;
            case ScheduledTransactionFrequency.ANUAL: date.setFullYear(date.getFullYear() + 1); break;
        }
        return date.toISOString();
    };

    const addScheduledTransaction = (item: Omit<ScheduledTransaction, 'id'|'category'|'next_due_date'|'user_id'|'category_id'|'start_date'> & {categoryId: string; startDate: string}) => withMutation(async () => {
        const nextDueDate = calculateNextDueDate(item.startDate, item.frequency);
        const { categoryId, startDate, ...rest } = item;
        const newItem = { ...rest, category_id: categoryId, start_date: startDate, next_due_date: nextDueDate, user_id: isGuest ? 'guest' : user!.id };

        if (isGuest) {
            const guestItem = { ...newItem, id: crypto.randomUUID(), created_at: new Date().toISOString() };
            const data = getGuestData();
            data.scheduledTransactions.push(guestItem);
            setGuestData(data);
        } else {
            const { error } = await supabase.from('scheduled_transactions').insert(newItem);
            if (error) throw error;
        }
        await fetchData();
        showToast('Agendamento Criado!', { type: 'success' });
        return true;
    });

    const updateScheduledTransaction = (item: Omit<ScheduledTransaction, 'category'|'user_id'|'category_id'|'start_date'> & {categoryId: string; startDate: string}) => withMutation(async () => {
        const { categoryId, startDate, ...rest } = item;
        const updatedItem = { ...rest, category_id: categoryId, start_date: startDate };
        
        if (isGuest) {
            const data = getGuestData();
            const index = data.scheduledTransactions.findIndex((st: ScheduledTransaction) => st.id === item.id);
            if (index > -1) {
                data.scheduledTransactions[index] = { ...data.scheduledTransactions[index], ...updatedItem };
                setGuestData(data);
            }
        } else {
            const { error } = await supabase.from('scheduled_transactions').update(updatedItem).eq('id', item.id);
            if (error) throw error;
        }
        await fetchData();
        showToast('Agendamento Atualizado!', { type: 'success' });
        return true;
    }, item.id);

    const deleteScheduledTransaction = (id: string) => withMutation(async () => {
        if (isGuest) {
            const data = getGuestData();
            data.scheduledTransactions = data.scheduledTransactions.filter((st: ScheduledTransaction) => st.id !== id);
            setGuestData(data);
        } else {
            const { error } = await supabase.from('scheduled_transactions').delete().eq('id', id);
            if (error) throw error;
        }
        await fetchData();
        showToast('Agendamento Excluído!', { type: 'success' });
        return true;
    }, id);

    const clearAllUserData = () => withMutation(async () => {
        if (isGuest || isDeveloper) {
            localStorage.removeItem(GUEST_DATA_KEY);
            await fetchData();
            showToast(isDeveloper ? 'Dados de desenvolvedor resetados!' : 'Todos os dados de visitante foram apagados!', { type: 'info' });
            return;
        }
        if (!user) return;
        const tables = ['transactions', 'goals', 'debts', 'scheduled_transactions', 'categories'];
        for (const table of tables) {
            const { error } = await supabase.from(table).delete().eq('user_id', user.id);
            if(error) throw error;
        }
        await fetchData();
        showToast('Todos os dados foram apagados!', { type: 'info' });
    });

    const addMockData = () => withMutation(async () => {
        if (isGuest) {
            localStorage.removeItem(GUEST_DATA_KEY);
            const userId = 'guest';
            const mockCategories = getDefaultCategories(userId).map(c => ({...c, id: crypto.randomUUID()}));
            const mockData = generateMockData(userId, mockCategories);
            
            const goalIdMap = new Map<string, string>();
            const debtIdMap = new Map<string, string>();
            
            const finalGoals = mockData.goals.map((g, i) => {
                const newId = crypto.randomUUID();
                goalIdMap.set(`mock_goal_${i+1}`, newId);
                return { ...g, id: newId };
            });
            const finalDebts = mockData.debts.map((d, i) => {
                const newId = crypto.randomUUID();
                debtIdMap.set(`mock_debt_${i+1}`, newId);
                return { ...d, id: newId };
            });
            
            const finalTransactions = mockData.transactions.map(t => ({
                ...t,
                id: crypto.randomUUID(),
                goal_contribution_id: t.goal_contribution_id ? goalIdMap.get(t.goal_contribution_id) : null,
                debt_payment_id: t.debt_payment_id ? debtIdMap.get(t.debt_payment_id) : null,
            }));

            const guestData = {
                categories: mockCategories,
                transactions: finalTransactions,
                goals: finalGoals,
                debts: finalDebts,
                scheduledTransactions: mockData.scheduledTransactions.map(st => ({ ...st, id: crypto.randomUUID() })),
            };
            setGuestData(guestData);

        } else if (user) {
            const tablesToClear = ['transactions', 'goals', 'debts', 'scheduled_transactions', 'categories'];
            for (const table of tablesToClear) {
                const { error: deleteError } = await supabase.from(table).delete().eq('user_id', user.id);
                if (deleteError) throw deleteError;
            }

            const newMockCategories = getDefaultCategories(user.id);
            const { error: catInsertError } = await supabase.from('categories').insert(newMockCategories);
            if (catInsertError) throw catInsertError;

            let { data: fetchedCategories, error: fetchError } = await supabase.from('categories').select('*').eq('user_id', user.id);
            if (fetchError || !fetchedCategories) throw fetchError || new Error("Falha ao buscar categorias após inserção.");

            const mockData = generateMockData(user.id, fetchedCategories as Category[]);

            const { data: insertedGoals, error: goalsError } = await supabase.from('goals').insert(mockData.goals).select();
            if (goalsError) throw goalsError;

            const { data: insertedDebts, error: debtsError } = await supabase.from('debts').insert(mockData.debts).select();
            if (debtsError) throw debtsError;
            
            const finalTransactions = mockData.transactions.map(t => ({
                ...t,
                goal_contribution_id: t.goal_contribution_id ? insertedGoals?.[0].id : null,
                debt_payment_id: t.debt_payment_id ? insertedDebts?.[0].id : null,
            }));

            await Promise.all([
                supabase.from('transactions').insert(finalTransactions),
                supabase.from('scheduled_transactions').insert(mockData.scheduledTransactions),
            ]);
        }
        
        await fetchData();
        showToast('Dados Fictícios Adicionados!', { type: 'success' });
    });

    // --- DEV TOOLS ---
    const addMockTransactions = (count: number) => withMutation(async () => {
        const userId = isGuest ? 'guest' : user!.id;
        if (!userId || categories.length === 0) return;

        const despesaCats = categories.filter(c => ['Alimentação', 'Compras', 'Transporte', 'Moradia', 'Lazer'].includes(c.name)).map(c => c.id);
        const getRandomCatId = () => despesaCats[Math.floor(Math.random() * despesaCats.length)] || categories[0].id;
        const now = new Date();
        const newTransactions = Array.from({ length: count }, () => ({
            user_id: userId,
            description: `Mock Transaction #${Math.floor(Math.random() * 1000)}`,
            amount: -(Math.random() * 150 + 5),
            type: TransactionType.DESPESA,
            date: new Date(now.getFullYear(), now.getMonth(), Math.floor(Math.random() * 28) + 1).toISOString(),
            category_id: getRandomCatId(),
        }));

        if (isGuest) {
            const data = getGuestData();
            data.transactions.push(...newTransactions.map(t => ({...t, id: crypto.randomUUID() })));
            setGuestData(data);
        } else {
            const { error } = await supabase.from('transactions').insert(newTransactions);
            if (error) throw error;
        }
        await fetchData();
        showToast(`${count} transações fictícias adicionadas!`, { type: 'success' });
    });
    
    const addMockGoals = (count: number) => withMutation(async () => {
        const userId = isGuest ? 'guest' : user!.id;
        const now = new Date();
        const newGoals = Array.from({ length: count }, (_, i) => ({
            user_id: userId,
            name: `Meta de Teste ${i + 1}`,
            target_amount: Math.floor(Math.random() * 10000) + 1000,
            current_amount: 0,
            deadline: new Date(now.getFullYear() + 1, Math.floor(Math.random() * 12), 1).toISOString(),
            status: GoalStatus.EM_ANDAMENTO,
        }));
         if (isGuest) {
            const data = getGuestData();
            data.goals.push(...newGoals.map(g => ({...g, id: crypto.randomUUID() })));
            setGuestData(data);
        } else {
            const { error } = await supabase.from('goals').insert(newGoals);
            if (error) throw error;
        }
        await fetchData();
        showToast(`${count} metas fictícias adicionadas!`, { type: 'success' });
    });

    const addMockDebts = (count: number) => withMutation(async () => {
         const userId = isGuest ? 'guest' : user!.id;
         const newDebts = Array.from({ length: count }, (_, i) => ({
             user_id: userId,
             name: `Dívida de Teste ${i+1}`,
             total_amount: Math.floor(Math.random() * 5000) + 500,
             paid_amount: 0,
             interest_rate: parseFloat((Math.random() * 20 + 5).toFixed(2)),
             category: 'Teste',
             status: DebtStatus.ATIVA,
         }));
          if (isGuest) {
            const data = getGuestData();
            data.debts.push(...newDebts.map(d => ({...d, id: crypto.randomUUID() })));
            setGuestData(data);
        } else {
            const { error } = await supabase.from('debts').insert(newDebts);
            if (error) throw error;
        }
        await fetchData();
        showToast(`${count} dívidas fictícias adicionadas!`, { type: 'success' });
    });

    const clearTable = (tableName: 'transactions' | 'goals' | 'debts' | 'scheduled_transactions') => withMutation(async () => {
        if (isGuest) {
            const data = getGuestData();
            data[tableName] = [];
            setGuestData(data);
        } else {
             if (!user) return;
             const { error } = await supabase.from(tableName).delete().eq('user_id', user.id);
             if (error) throw error;
        }
        await fetchData();
        showToast(`Tabela "${tableName}" foi limpa!`, { type: 'info' });
    });

    const forceError = () => withMutation(async () => {
        throw new Error("Erro de teste acionado pelas DevTools.");
    });


    const value: DashboardDataContextType = useMemo(() => ({
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
        clearError,
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
        updateScheduledTransaction,
        deleteScheduledTransaction,
        addMockData,
        clearAllUserData,
        addMockTransactions,
        addMockGoals,
        addMockDebts,
        clearTable,
        forceError,
    }), [
        transactions, goals, debts, scheduledTransactions, categories, summary, monthlyChartData, userLevel, achievements, 
        loading, isMutating, mutatingIds, error, user, isGuest
    ]);

    // FIX: Replaced JSX with `React.createElement` to avoid syntax errors in a `.ts` file.
    return React.createElement(DashboardDataContext.Provider, { value: value }, children);
};

export const useDashboardData = (): DashboardDataContextType => {
    const context = useContext(DashboardDataContext);
    if (context === undefined) {
        throw new Error('useDashboardData must be used within a DashboardDataProvider');
    }
    return context;
};