import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
    Transaction, TransactionType, Goal, GoalStatus, Debt, DebtStatus, Category,
    CreditCard, Invoice, Summary, ScheduledTransaction, ScheduledTransactionFrequency,
    UserLevel, UserRank, Achievement
} from '../types';
import {
    Utensils, ShoppingCart, Car, HomeIcon, Shirt, Heart, BookOpen, Gift, Plane, Dumbbell, Gamepad, Film, PiggyBank
} from '../components/Icons';

// Mock Categories
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

// Mock Data
const mockTransactions: Transaction[] = [
    { id: 'tx1', description: 'Salário', amount: 8000, date: new Date(currentYear, currentMonth, 5).toISOString(), type: TransactionType.RECEITA, category: categories.salario },
    { id: 'tx2', description: 'Aluguel', amount: -2500, date: new Date(currentYear, currentMonth, 10).toISOString(), type: TransactionType.DESPESA, category: categories.moradia },
    { id: 'tx3', description: 'Supermercado', amount: -650, date: new Date(currentYear, currentMonth, 12).toISOString(), type: TransactionType.DESPESA, category: categories.alimentacao },
];
const mockCreditCards: CreditCard[] = [ { id: 'cc1', name: 'Cartão Principal', flag: 'Mastercard Gold', limit: 10000, closingDay: 28 } ];
const mockInvoices: Invoice[] = [ { id: 'inv1', cardId: 'cc1', closingDate: new Date(currentYear, currentMonth, 28).toISOString(), dueDate: new Date(currentYear, currentMonth + 1, 10).toISOString(), totalAmount: 1219.90, status: 'Aberta', transactions: [] } ];
const mockGoals: Goal[] = [
    { id: 'g1', name: 'Reserva de Emergência', targetAmount: 15000, currentAmount: 15000, deadline: new Date(currentYear, 11, 31).toISOString(), status: GoalStatus.CONCLUIDA },
    { id: 'g2', name: 'Viagem para o Japão', targetAmount: 20000, currentAmount: 8500, deadline: new Date(currentYear + 1, 5, 30).toISOString(), status: GoalStatus.EM_ANDAMENTO },
];
const mockDebts: Debt[] = [
    { id: 'd1', name: 'Financiamento Estudantil', totalAmount: 30000, paidAmount: 18000, interestRate: 5.5, category: 'Educação', status: DebtStatus.ATIVA },
];
const mockScheduledTransactions: ScheduledTransaction[] = [
    { id: 'st1', description: 'Aluguel', amount: 2500, type: TransactionType.DESPESA, category: categories.moradia, startDate: new Date(currentYear, 0, 10).toISOString(), frequency: ScheduledTransactionFrequency.MENSAL, nextDueDate: new Date(currentYear, currentMonth + 1, 10).toISOString() },
    { id: 'st2', description: 'Netflix', amount: 39.90, type: TransactionType.DESPESA, category: categories.streaming, startDate: new Date(currentYear, 0, 22).toISOString(), frequency: ScheduledTransactionFrequency.MENSAL, nextDueDate: new Date(currentYear, currentMonth + 1, 22).toISOString() },
];
const mockUserLevel: UserLevel = { level: 5, xp: 120, xpToNextLevel: 500, rank: UserRank.PRATA };
const mockAchievements: Achievement[] = [
    { id: 'ach1', name: 'Poupador Iniciante', description: 'Adicione sua primeira meta de economia.', unlocked: true, dateUnlocked: new Date(currentYear, currentMonth - 2, 15).toISOString() },
    { id: 'ach2', name: 'Orçamento em Dia', description: 'Categorize 20 transações em um mês.', unlocked: true, dateUnlocked: new Date(currentYear, currentMonth - 1, 28).toISOString() },
    { id: 'ach3', name: 'Livre de Dívidas', description: 'Quite uma dívida completamente.', unlocked: false },
];

// Helper
const calculateSummary = (transactions: Transaction[]): Summary => {
    const monthlyIncome = transactions.filter(t => t.type === TransactionType.RECEITA).reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpenses = transactions.filter(t => t.type === TransactionType.DESPESA).reduce((sum, t) => sum + t.amount, 0);
    const totalBalance = 25340.50; // Mocked static balance
    return { totalBalance, monthlyIncome, monthlyExpenses };
};

// Context
interface DashboardDataContextType {
    summary: Summary;
    transactions: Transaction[];
    goals: Goal[];
    addGoal: (goal: Omit<Goal, 'id' | 'currentAmount' | 'status'>) => void;
    debts: Debt[];
    addDebt: (debt: Omit<Debt, 'id' | 'paidAmount' | 'status'>) => void;
    creditCards: CreditCard[];
    invoices: Invoice[];
    scheduledTransactions: ScheduledTransaction[];
    userLevel: UserLevel;
    achievements: Achievement[];
}

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined);

// Provider
export const DashboardDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [transactions, setTransactions] = useState(mockTransactions);
    const [goals, setGoals] = useState(mockGoals);
    const [debts, setDebts] = useState(mockDebts);
    const [creditCards, setCreditCards] = useState(mockCreditCards);
    const [invoices, setInvoices] = useState(mockInvoices);
    const [scheduledTransactions, setScheduledTransactions] = useState(mockScheduledTransactions);
    const [userLevel, setUserLevel] = useState(mockUserLevel);
    const [achievements, setAchievements] = useState(mockAchievements);

    const summary = calculateSummary(transactions);

    const addGoal = (goalData: Omit<Goal, 'id' | 'currentAmount' | 'status'>) => {
        const newGoal: Goal = {
            ...goalData,
            id: `g${goals.length + 1}`,
            currentAmount: 0,
            status: GoalStatus.EM_ANDAMENTO,
        };
        setGoals(prev => [...prev, newGoal]);
    };

    const addDebt = (debtData: Omit<Debt, 'id' | 'paidAmount' | 'status'>) => {
        const newDebt: Debt = {
            ...debtData,
            id: `d${debts.length + 1}`,
            paidAmount: 0,
            status: DebtStatus.ATIVA,
            category: debtData.category || 'Outros',
        };
        setDebts(prev => [...prev, newDebt]);
    };

    const value = {
        summary,
        transactions,
        goals,
        addGoal,
        debts,
        addDebt,
        creditCards,
        invoices,
        scheduledTransactions,
        userLevel,
        achievements,
    };

    return React.createElement(DashboardDataContext.Provider, { value: value }, children);
};

// Hook
export const useDashboardData = () => {
    const context = useContext(DashboardDataContext);
    if (context === undefined) {
        throw new Error('useDashboardData must be used within a DashboardDataProvider');
    }
    return context;
};