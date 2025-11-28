import React from 'react';

export type ViewType = 'home' | 'transactions' | 'insights' | 'goals' | 'debts' | 'scheduling' | 'tools' | 'settings' | 'devtools' | 'design-system';

export enum TransactionType {
  RECEITA = 'receita',
  DESPESA = 'despesa',
}

export interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  user_id: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string; // ISO 8601 format
  category_id: string;
  category: Category; // Joined data
  user_id: string;
  goal_contribution_id?: string | null;
  debt_payment_id?: string | null;
}

export enum GoalStatus {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
}

export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string; // ISO 8601 format
  status: GoalStatus;
  user_id: string;
}

export enum DebtStatus {
  ATIVA = 'ATIVA',
  PAGA = 'PAGA',
}

export interface Debt {
  id: string;
  name: string;
  total_amount: number;
  paid_amount: number;
  interest_rate: number; // Annual percentage rate
  category: string;
  status: DebtStatus;
  user_id: string;
}

export enum ScheduledTransactionFrequency {
  DIARIO = 'Diário',
  SEMANAL = 'Semanal',
  QUINZENAL = 'Quinzenal',
  MENSAL = 'Mensal',
  ANUAL = 'Anual',
}

export interface ScheduledTransaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category_id: string;
  category: Category; // Joined data
  start_date: string; // ISO 8601 format
  next_due_date: string; // ISO 8601 format
  frequency: ScheduledTransactionFrequency;
  user_id: string;
}

export interface SummaryData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export enum UserRank {
  BRONZE = 'Bronze',
  PRATA = 'Prata',
  OURO = 'Ouro',
  PLATINA = 'Platina',
  DIAMANTE = 'Diamante'
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
  dateUnlocked?: string | null;
}

export interface MonthlyChartData {
  name: string;
  receita: number;
  despesa: number;
}

// Omitindo 'category' pois será populada via join
export type NewTransaction = Omit<Transaction, 'id' | 'category' | 'user_id'>;
export type UpdateTransaction = Omit<Transaction, 'category' | 'user_id'>;

export type NewGoal = Omit<Goal, 'id' | 'current_amount' | 'status' | 'user_id'>;
export type NewDebt = Omit<Debt, 'id' | 'paid_amount' | 'status' | 'user_id'>;
export type NewScheduledTransaction = Omit<ScheduledTransaction, 'id' | 'category' | 'next_due_date' | 'user_id'>;
export type UpdateScheduledTransaction = Omit<ScheduledTransaction, 'category' | 'user_id'>;


export interface DashboardDataContextType {
  // Data
  transactions: Transaction[];
  goals: Goal[];
  debts: Debt[];
  scheduledTransactions: ScheduledTransaction[];
  categories: Category[];
  summary: SummaryData;
  monthlyChartData: MonthlyChartData[];
  userLevel: UserLevel | null;
  achievements: Achievement[];

  // State
  loading: boolean;
  isMutating: boolean;
  mutatingIds: Set<string>;
  error: string | null;

  // Functions
  addTransaction: (tx: Omit<Transaction, 'id' | 'category' | 'user_id' | 'category_id'> & { categoryId: string }) => Promise<boolean>;
  updateTransaction: (tx: Omit<Transaction, 'category' | 'user_id' | 'category_id'> & { categoryId: string }) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  updateTransactionsCategory: (transactionIds: string[], newCategoryId: string) => Promise<boolean>;

  addGoal: (goal: Omit<Goal, 'id' | 'current_amount' | 'status' | 'user_id' | 'target_amount' | 'deadline'> & { targetAmount: number; deadline: string; }) => Promise<Goal | null>;
  updateGoalValue: (goalId: string, amount: number) => Promise<boolean>;
  deleteGoal: (id: string) => Promise<boolean>;

  addDebt: (debt: Omit<Debt, 'id' | 'paid_amount' | 'status' | 'user_id' | 'total_amount' | 'interest_rate'> & { totalAmount: number; interestRate: number }) => Promise<Debt | null>;
  addPaymentToDebt: (debtId: string, amount: number) => Promise<boolean>;
  deleteDebt: (id: string) => Promise<boolean>;

  addScheduledTransaction: (item: Omit<ScheduledTransaction, 'id' | 'category' | 'next_due_date' | 'user_id' | 'category_id' | 'start_date'> & { categoryId: string; startDate: string }) => Promise<boolean>;
  updateScheduledTransaction: (item: Omit<ScheduledTransaction, 'category' | 'user_id' | 'category_id' | 'start_date'> & { categoryId: string; startDate: string }) => Promise<boolean>;
  deleteScheduledTransaction: (id: string) => Promise<boolean>;

  clearError: () => void;

  // Dev Tools
  addMockData: () => Promise<void>;
  clearAllUserData: () => Promise<void>;
  addMockTransactions: (count: number) => Promise<void>;
  addMockGoals: (count: number) => Promise<void>;
  addMockDebts: (count: number) => Promise<void>;
  clearTable: (tableName: 'transactions' | 'goals' | 'debts' | 'scheduled_transactions') => Promise<void>;
  forceError: () => Promise<void>;
}