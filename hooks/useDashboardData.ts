import React, { createContext, useContext, ReactNode, useEffect, useReducer } from 'react';
import { 
    Transaction, TransactionType, Goal, GoalStatus, Debt, DebtStatus, Category,
    CreditCard, Invoice, Summary, ScheduledTransaction, ScheduledTransactionFrequency,
    UserLevel, UserRank, Achievement
} from '../types';
import { supabase } from '../services/supabaseClient';
import {
    Utensils, ShoppingCart, Car, HomeIcon, Shirt, Heart, BookOpen, Gift, Plane, Dumbbell, Gamepad, Film, PiggyBank, Trophy, LockClosed
} from '../components/Icons';

// --- Static Definitions ---
const categories: Record<string, Category> = {
    alimentacao: { id: 'cat1', name: 'Alimentação', icon: Utensils, color: '#f59e0b' },
    compras: { id: 'cat2', name: 'Compras', icon: ShoppingCart, color: '#8b5cf6' },
    transporte: { id: 'cat3', name: 'Transporte', icon: Car, color: '#3b82f6' },
    moradia: { id: 'cat4', name: 'Moradia', icon: HomeIcon, color: '#10b981' },
    vestuario: { id: 'cat5', name: 'Vestuário', icon: Shirt, color: '#ec4899' },
    saude: { id: 'cat6', name: 'Saúde', icon: Heart, color: '#ef4444' },
    educacao: { id: 'cat7', name: 'Educação', icon: BookOpen, color: '#6366f1' },
    presentes: { id: 'cat8', name: 'Presentes', icon: Gift, color: '#d946ef' },
    viagens: { id: 'cat9', name: 'Viagens', icon: Plane, color: '#06b6d4' },
    lazer: { id: 'cat10', name: 'Lazer', icon: Gamepad, color: '#f43f5e' },
    academia: { id: 'cat11', name: 'Academia', icon: Dumbbell, color: '#22c55e' },
    streaming: { id: 'cat12', name: 'Streaming', icon: Film, color: '#a855f7' },
    salario: { id: 'cat13', name: 'Salário', icon: PiggyBank, color: '#14b8a6' },
    outros: { id: 'cat14', name: 'Outros', icon: Utensils, color: '#64748b' },
};

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// --- Mock Data (Fallback) ---
const mockTransactions: Transaction[] = [
    { id: 'tx1', description: 'Salário', amount: 8000, date: new Date(currentYear, currentMonth, 5).toISOString(), type: TransactionType.RECEITA, category: categories.salario },
    { id: 'tx2', description: 'Aluguel', amount: -2500, date: new Date(currentYear, currentMonth, 10).toISOString(), type: TransactionType.DESPESA, category: categories.moradia },
    { id: 'tx3', description: 'Supermercado', amount: -650, date: new Date(currentYear, currentMonth, 12).toISOString(), type: TransactionType.DESPESA, category: categories.alimentacao },
];
const mockCreditCards: CreditCard[] = [ { id: 'cc1', name: 'Cartão Principal', flag: 'Mastercard Gold', limit: 10000, closingDay: 28 } ];
const mockInvoices: Invoice[] = [ { id: 'inv1', cardId: 'cc1', closingDate: new Date(currentYear, currentMonth, 28).toISOString(), dueDate: new Date(currentYear, currentMonth + 1, 10).toISOString(), totalAmount: 0, status: 'Aberta', transactions: [] } ];
const mockGoals: Goal[] = [
    { id: 'g1', name: 'Reserva de Emergência', targetAmount: 15000, currentAmount: 15000, deadline: new Date(currentYear, 11, 31).toISOString(), status: GoalStatus.CONCLUIDA },
    { id: 'g2', name: 'Viagem para o Japão', targetAmount: 20000, currentAmount: 8500, deadline: new Date(currentYear + 1, 5, 30).toISOString(), status: GoalStatus.EM_ANDAMENTO },
];
const mockDebts: Debt[] = [
    { id: 'd1', name: 'Financiamento Estudantil', totalAmount: 30000, paidAmount: 18000, interestRate: 5.5, category: 'Educação', status: DebtStatus.ATIVA },
];
const mockScheduledTransactions: ScheduledTransaction[] = [
    { id: 'st1', description: 'Aluguel', amount: -2500, type: TransactionType.DESPESA, category: categories.moradia, startDate: new Date(currentYear, 0, 10).toISOString(), frequency: ScheduledTransactionFrequency.MENSAL, nextDueDate: new Date(currentYear, currentMonth + 1, 10).toISOString() },
    { id: 'st2', description: 'Netflix', amount: -39.90, type: TransactionType.DESPESA, category: categories.streaming, startDate: new Date(currentYear, 0, 22).toISOString(), frequency: ScheduledTransactionFrequency.MENSAL, nextDueDate: new Date(currentYear, currentMonth + 1, 22).toISOString() },
];
const mockUserLevel: UserLevel = { level: 5, xp: 120, xpToNextLevel: 500, rank: UserRank.PRATA };
const mockAchievements: Achievement[] = [
    { id: 'ach1', name: 'Poupador Iniciante', description: 'Adicione sua primeira meta de economia.', unlocked: true, dateUnlocked: new Date(currentYear, currentMonth - 2, 15).toISOString(), icon: Trophy },
    { id: 'ach2', name: 'Orçamento em Dia', description: 'Categorize 20 transações em um mês.', unlocked: true, dateUnlocked: new Date(currentYear, currentMonth - 1, 28).toISOString(), icon: Trophy },
    { id: 'ach3', name: 'Livre de Dívidas', description: 'Quite uma dívida completamente.', unlocked: false, icon: LockClosed },
];


// --- State Management (Reducer) ---
interface AppState {
    summary: Summary;
    transactions: Transaction[];
    goals: Goal[];
    debts: Debt[];
    creditCards: CreditCard[];
    invoices: Invoice[];
    scheduledTransactions: ScheduledTransaction[];
    userLevel: UserLevel | null;
    achievements: Achievement[];
    loading: boolean;
    error: string | null;
}

type Action =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Omit<AppState, 'loading' | 'summary' | 'error'> }
    | { type: 'FETCH_ERROR'; payload: { data: Omit<AppState, 'loading' | 'summary' | 'error'>, error: string } }
    | { type: 'ADD_GOAL_SUCCESS'; payload: Goal }
    | { type: 'ADD_DEBT_SUCCESS'; payload: Debt }
    | { type: 'ADD_TRANSACTION_SUCCESS'; payload: Transaction };

const initialState: AppState = {
    summary: { totalBalance: 0, monthlyIncome: 0, monthlyExpenses: 0 },
    transactions: [],
    goals: [],
    debts: [],
    creditCards: [],
    invoices: [],
    scheduledTransactions: [],
    userLevel: null,
    achievements: [],
    loading: true,
    error: null,
};

const calculateSummary = (transactions: Transaction[]): Summary => {
    if (!transactions) return { totalBalance: 0, monthlyIncome: 0, monthlyExpenses: 0 };
    const monthlyIncome = transactions.filter(t => t.type === TransactionType.RECEITA).reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpenses = transactions.filter(t => t.type === TransactionType.DESPESA).reduce((sum, t) => sum + t.amount, 0);
    const totalBalance = 25340.50; // TODO: Fetch real balance
    return { totalBalance, monthlyIncome, monthlyExpenses };
};

const dashboardReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                ...action.payload,
                summary: calculateSummary(action.payload.transactions),
                loading: false,
                error: null,
            };
        case 'FETCH_ERROR':
            return {
                ...state,
                ...action.payload.data,
                summary: calculateSummary(action.payload.data.transactions),
                loading: false,
                error: action.payload.error,
            };
        case 'ADD_GOAL_SUCCESS':
            return { ...state, goals: [...state.goals, action.payload] };
        case 'ADD_DEBT_SUCCESS':
            return { ...state, debts: [...state.debts, action.payload] };
        case 'ADD_TRANSACTION_SUCCESS': {
            const updatedTransactions = [...state.transactions, action.payload]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return {
                ...state,
                transactions: updatedTransactions,
                summary: calculateSummary(updatedTransactions),
            };
        }
        default:
            return state;
    }
};

// --- Context & Provider ---
interface DashboardDataContextType extends AppState {
    categories: Record<string, Category>;
    addGoal: (goal: Omit<Goal, 'id' | 'currentAmount' | 'status'>) => Promise<void>;
    addDebt: (debt: Omit<Debt, 'id' | 'paidAmount' | 'status'>) => Promise<void>;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
}

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined);

export const DashboardDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(dashboardReducer, initialState);

    const MOCK_FALLBACK_PAYLOAD: Omit<AppState, 'loading' | 'summary' | 'error'> = {
        transactions: mockTransactions,
        goals: mockGoals,
        debts: mockDebts,
        creditCards: mockCreditCards,
        invoices: mockInvoices,
        scheduledTransactions: mockScheduledTransactions,
        userLevel: mockUserLevel,
        achievements: mockAchievements,
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            dispatch({ type: 'FETCH_START' });
            
            try {
                // Tenta buscar dados reais
                const [transactionsRes, goalsRes, debtsRes] = await Promise.all([
                    supabase.from('transactions').select('*'),
                    supabase.from('goals').select('*'),
                    supabase.from('debts').select('*')
                ]);

                if (transactionsRes.error || goalsRes.error || debtsRes.error || !transactionsRes.data || !goalsRes.data || !debtsRes.data) {
                    throw new Error(transactionsRes.error?.message || goalsRes.error?.message || debtsRes.error?.message || 'Falha ao buscar dados do Supabase');
                }

                // **HIDRATAÇÃO DE DADOS (O BUG FIX)**
                const hydratedTransactions = transactionsRes.data.map((tx: any) => ({
                    ...tx,
                    category: categories[tx.category_id] || categories.outros
                }));

                const payload = {
                    transactions: hydratedTransactions,
                    goals: goalsRes.data as Goal[],
                    debts: debtsRes.data as Debt[],
                    creditCards: mockCreditCards,
                    invoices: mockInvoices,
                    scheduledTransactions: mockScheduledTransactions,
                    userLevel: mockUserLevel,
                    achievements: mockAchievements,
                };
                dispatch({ type: 'FETCH_SUCCESS', payload });

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
                console.warn("MODO OFFLINE: Usando mock data como fallback.", error);
                // **FALLBACK**
                dispatch({ type: 'FETCH_ERROR', payload: { data: MOCK_FALLBACK_PAYLOAD, error: errorMessage } });
            }
        };

        fetchInitialData();
    }, []);

    const addGoal = async (goalData: Omit<Goal, 'id' | 'currentAmount' | 'status'>) => {
        const newGoalData = { ...goalData, currentAmount: 0, status: GoalStatus.EM_ANDAMENTO };
        const { data, error } = await supabase.from('goals').insert([newGoalData]).select();
        
        if (error || !data) {
            console.error('Falha ao adicionar meta:', error);
        } else {
             dispatch({ type: 'ADD_GOAL_SUCCESS', payload: data[0] as Goal });
        }
    };

    const addDebt = async (debtData: Omit<Debt, 'id' | 'paidAmount' | 'status'>) => {
        const newDebtData = { ...debtData, paidAmount: 0, status: DebtStatus.ATIVA, category: debtData.category || 'Outros' };
        const { data, error } = await supabase.from('debts').insert([newDebtData]).select();
        
        if (error || !data) {
            console.error('Falha ao adicionar dívida:', error);
        } else {
            dispatch({ type: 'ADD_DEBT_SUCCESS', payload: data[0] as Debt });
        }
    };

    const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
        const { category, ...restOfData } = transactionData;
        const dataToInsert = { ...restOfData, category_id: category.id };

        const { data, error } = await supabase.from('transactions').insert([dataToInsert]).select();

        if (error || !data) {
            console.error('Falha ao adicionar transação:', error);
            // Poderia despachar uma ação de erro aqui para notificar o usuário
        } else {
            const newTransaction: Transaction = { ...data[0], category };
            dispatch({ type: 'ADD_TRANSACTION_SUCCESS', payload: newTransaction });
        }
    };

    const value = { ...state, categories, addGoal, addDebt, addTransaction };

    return React.createElement(DashboardDataContext.Provider, { value }, children);
};

// --- Hook ---
export const useDashboardData = () => {
    const context = useContext(DashboardDataContext);
    if (context === undefined) {
        throw new Error('useDashboardData must be used within a DashboardDataProvider');
    }
    return context;
};
