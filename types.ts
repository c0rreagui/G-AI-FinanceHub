import React from 'react';

// Core Enums
export enum TransactionType {
  RECEITA = 'receita',
  DESPESA = 'despesa',
}

export enum GoalStatus {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
}

export enum DebtStatus {
  ATIVA = 'ATIVA',
  PAGA = 'PAGA',
}

export enum ScheduledTransactionFrequency {
  DIARIO = 'Diário',
  SEMANAL = 'Semanal',
  MENSAL = 'Mensal',
  ANUAL = 'Anual',
}

export enum UserRank {
    BRONZE = 'Bronze',
    PRATA = 'Prata',
    OURO = 'Ouro',
    PLATINA = 'Platina',
    DIAMANTE = 'Diamante',
}

// Interfaces
export interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string; // ISO string
  categoryId: string;
  category: Category;
  goalContributionId?: string;
  debtPaymentId?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO string
  status: GoalStatus;
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  paidAmount: number;
  interestRate: number; // Annual percentage
  category: string;
  status: DebtStatus;
}

export interface ScheduledTransaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  category: Category;
  startDate: string; // ISO string
  nextDueDate: string; // ISO string
  frequency: ScheduledTransactionFrequency;
}

export interface UserLevel {
    level: number;
    xp: number;
    xpToNextLevel: number;
    rank: UserRank;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    unlocked: boolean;
    dateUnlocked?: string; // ISO string
}

export interface SummaryData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface MonthlyChartData {
    name: string; // Month name
    receita: number;
    despesa: number;
}

// View Management
export type ViewType = 'home' | 'transactions' | 'insights' | 'goals' | 'debts' | 'scheduling' | 'tools' | 'settings';

// Context
export interface DashboardDataContextType {
  transactions: Transaction[];
  goals: Goal[];
  debts: Debt[];
  scheduledTransactions: ScheduledTransaction[];
  categories: Category[];
  summary: SummaryData;
  monthlyChartData: MonthlyChartData[];
  userLevel: UserLevel | null;
  achievements: Achievement[];
  loading: boolean;
  isMutating: boolean;
  mutatingIds: Set<string>;
  error: string | null;
  addTransaction: (tx: Omit<Transaction, 'id' | 'category'>) => Promise<boolean>;
  updateTransaction: (tx: Omit<Transaction, 'category'>) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  updateTransactionsCategory: (ids: string[], categoryId: string) => Promise<boolean>;
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount' | 'status'>) => Promise<boolean>;
  updateGoalValue: (id: string, valueToAdd: number) => Promise<boolean>;
  deleteGoal: (id: string) => Promise<boolean>;
  addDebt: (debt: Omit<Debt, 'id' | 'paidAmount' | 'status'>) => Promise<boolean>;
  addPaymentToDebt: (id: string, paymentAmount: number) => Promise<boolean>;
  deleteDebt: (id: string) => Promise<boolean>;
  addScheduledTransaction: (tx: Omit<ScheduledTransaction, 'id' | 'category' | 'nextDueDate'>) => Promise<boolean>;
  clearError: () => void;
}