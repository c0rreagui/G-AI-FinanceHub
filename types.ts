import React from 'react';
import { Database } from './types/database.types';

export type ViewType = 'home' | 'transactions' | 'budgets' | 'insights' | 'goals' | 'debts' | 'investments' | 'scheduling' | 'tools' | 'settings' | 'devtools' | 'design-system' | 'social';

export type TransactionType = 'receita' | 'despesa' | 'transfer';
export const TransactionType = {
  RECEITA: 'receita' as TransactionType,
  DESPESA: 'despesa' as TransactionType,
  TRANSFER: 'transfer' as TransactionType,
};

// Derived from Database
type CategoryRow = Database['public']['Tables']['categories']['Row'];
export interface Category extends Omit<CategoryRow, 'icon'> {
  icon: React.ElementType;
}

export type TransactionStatus = 'pending' | 'completed' | 'scheduled';
export const TransactionStatus = {
  PENDING: 'pending' as TransactionStatus,
  COMPLETED: 'completed' as TransactionStatus,
  SCHEDULED: 'scheduled' as TransactionStatus,
};

export interface Account {
  id: string;
  name: string;
  type: 'bank' | 'wallet' | 'investment' | 'other';
  balance: number;
  color: string;
  icon?: string;
  user_id: string;
}

type TransactionRow = Database['public']['Tables']['transactions']['Row'];
export interface Transaction extends Omit<TransactionRow, 'type' | 'starred' | 'deleted_at' | 'exclude_from_reports' | 'from_account_id' | 'to_account_id' | 'transfer_id' | 'account_id' | 'notes' | 'reconciled' | 'location'> {
  type: TransactionType;
  category: Category;
  status: TransactionStatus;

  notes?: string | null;
  account_id: string;

  exclude_from_reports?: boolean;
  starred?: boolean | null;
  reconciled?: boolean;
  location?: { latitude: number; longitude: number; address?: string; } | null;
  transfer_id?: string | null;
  from_account_id?: string | null;
  to_account_id?: string | null;
}

export interface AuditLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'restore' | 'permanent_delete';
  entity: 'transaction' | 'goal' | 'debt' | 'scheduled_transaction';
  entity_id: string;
  details: string;
  created_at: string;
  user_id: string;
}

export type GoalStatus = 'EM_ANDAMENTO' | 'CONCLUIDO';
export const GoalStatus = {
  EM_ANDAMENTO: 'EM_ANDAMENTO' as GoalStatus,
  CONCLUIDO: 'CONCLUIDO' as GoalStatus,
};

type GoalRow = Database['public']['Tables']['goals']['Row'];
export interface Goal extends GoalRow {
  status: GoalStatus;
}

export type DebtStatus = 'ATIVA' | 'PAGA';
export const DebtStatus = {
  ATIVA: 'ATIVA' as DebtStatus,
  PAGA: 'PAGA' as DebtStatus,
};

type DebtRow = Database['public']['Tables']['debts']['Row'];
export interface Debt extends DebtRow {
  status: DebtStatus;
}

export type BudgetPeriod = 'monthly' | 'weekly' | 'yearly';

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: BudgetPeriod;
  created_at: string;
  updated_at: string;
}

export type ScheduledTransactionFrequency = 'Diario' | 'Semanal' | 'Quinzenal' | 'Mensal' | 'Anual';
export const ScheduledTransactionFrequency = {
  DIARIO: 'Diario' as ScheduledTransactionFrequency,
  SEMANAL: 'Semanal' as ScheduledTransactionFrequency,
  QUINZENAL: 'Quinzenal' as ScheduledTransactionFrequency,
  MENSAL: 'Mensal' as ScheduledTransactionFrequency,
  ANUAL: 'Anual' as ScheduledTransactionFrequency,
};

type ScheduledTransactionRow = Database['public']['Tables']['scheduled_transactions']['Row'];
export interface ScheduledTransaction extends Omit<ScheduledTransactionRow, 'type' | 'account_id'> {
  type: TransactionType;
  category: Category;
  account_id?: string;
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

export type InvestmentType = 'renda_fixa' | 'acoes' | 'fiis' | 'cripto' | 'exterior' | 'outros';
export const InvestmentType = {
  RENDA_FIXA: 'renda_fixa' as InvestmentType,
  ACOES: 'acoes' as InvestmentType,
  FIIS: 'fiis' as InvestmentType,
  CRIPTO: 'cripto' as InvestmentType,
  EXTERIOR: 'exterior' as InvestmentType,
  OUTROS: 'outros' as InvestmentType,
};

type InvestmentRow = Database['public']['Tables']['investments']['Row'];
export interface Investment extends Omit<InvestmentRow, 'type'> {
  type: InvestmentType;
}



// Omitindo 'category' pois será populada via join
export type NewTransaction = Omit<Transaction, 'id' | 'category' | 'user_id'>;
export type UpdateTransaction = Omit<Transaction, 'category' | 'user_id'>;

export type NewGoal = Omit<Goal, 'id' | 'current_amount' | 'status' | 'user_id'>;
export type NewDebt = Omit<Debt, 'id' | 'paid_amount' | 'status' | 'user_id'>;
export type NewScheduledTransaction = Omit<ScheduledTransaction, 'id' | 'category' | 'next_due_date' | 'user_id'>;
export type UpdateScheduledTransaction = Omit<ScheduledTransaction, 'category' | 'user_id'>;

export type NewInvestment = Omit<Investment, 'id' | 'user_id'>;


export interface DailyMission {
  id: string;
  title: string;
  completed: boolean;
  type: 'add_transaction' | 'check_balance' | 'view_insights' | 'review_goals';
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  xp: number;
  level: number;
}

export interface Family {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export interface FamilyMember {
  user_id: string;
  family_id: string;
  role: 'admin' | 'member' | 'owner';
  profile?: UserProfile;
}

export interface TransactionComment {
  id: string;
  transaction_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: UserProfile; // Joined data
}

export interface FamilyInvite {
  id: string;
  family_id: string;
  email: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  created_by: string;
  expires_at: string;
}

export interface DashboardDataContextType {
  // Data
  transactions: Transaction[];
  accounts: Account[];
  goals: Goal[];
  budgets: Budget[];
  debts: Debt[];
  investments: Investment[];
  scheduledTransactions: ScheduledTransaction[];
  categories: Category[];
  summary: SummaryData;
  monthlyChartData: MonthlyChartData[];
  userLevel: UserLevel | null;
  achievements: Achievement[];
  healthScore: number;
  dailyMissions: DailyMission[];
  savingsSuggestion: string | null;
  dueSoonBills: ScheduledTransaction[];

  // State
  loading: boolean;
  isMutating: boolean;
  mutatingIds: Set<string>;
  error: string | null;
  monthlyBudgetLimit: number; // User-defined global budget limit

  // Functions
  setMonthlyBudgetLimit: (limit: number) => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'category' | 'user_id' | 'category_id'> & { categoryId: string }) => Promise<boolean | null>;
  updateTransaction: (tx: Omit<Transaction, 'category' | 'user_id' | 'category_id'> & { categoryId: string }) => Promise<boolean | null>;
  addTransfer: (fromAccountId: string, toAccountId: string, amount: number, description: string, date: string, notes?: string) => Promise<boolean | null>;
  deleteTransaction: (id: string) => Promise<boolean | null>;
  updateTransactionsCategory: (transactionIds: string[], newCategoryId: string) => Promise<boolean | null>;
  bulkUpdateTransactions: (ids: string[], updates: Partial<Transaction>) => Promise<boolean | null>;
  bulkDeleteTransactions: (ids: string[]) => Promise<boolean | null>;
  checkForDuplicates: (transaction: Partial<Transaction>) => Transaction[];

  addGoal: (goal: Omit<Goal, 'id' | 'current_amount' | 'status' | 'user_id' | 'target_amount' | 'deadline'> & { targetAmount: number; deadline: string; }) => Promise<Goal | null>;
  updateGoalValue: (goalId: string, amount: number) => Promise<boolean | null>;
  deleteGoal: (id: string) => Promise<boolean | null>;

  addDebt: (debt: Omit<Debt, 'id' | 'paid_amount' | 'status' | 'user_id' | 'total_amount' | 'interest_rate'> & { totalAmount: number; interestRate: number }) => Promise<Debt | null>;
  addPaymentToDebt: (debtId: string, amount: number) => Promise<boolean | null>;
  deleteDebt: (id: string) => Promise<boolean | null>;

  addInvestment: (investment: NewInvestment) => Promise<Investment | null>;
  deleteInvestment: (id: string) => Promise<boolean | null>;

  addBudget: (budget: Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<Budget | null>;
  updateBudget: (budget: Partial<Budget> & { id: string }) => Promise<boolean | null>;
  deleteBudget: (id: string) => Promise<boolean | null>;

  addScheduledTransaction: (transaction: Omit<ScheduledTransaction, 'id' | 'category' | 'next_due_date' | 'user_id' | 'category_id' | 'start_date'> & { categoryId: string; startDate: string }) => Promise<boolean | null>;
  updateScheduledTransaction: (transaction: Omit<ScheduledTransaction, 'category' | 'user_id' | 'category_id' | 'start_date'> & { categoryId: string; startDate: string } & { id: string }) => Promise<boolean | null>;
  deleteScheduledTransaction: (id: string) => Promise<boolean | null>;

  completeMission: (missionId: string) => void;
  clearError: () => void;

  // DevTools / Mock Data
  addMockData: () => Promise<void>;
  clearAllUserData: () => Promise<void>;
  addMockTransactions: (count: number) => Promise<void>;
  addMockGoals: (count: number) => Promise<void>;
  addMockDebts: (count: number) => Promise<void>;
  addMockInvestments: (count: number) => Promise<void>;
  clearTable: (tableName: 'transactions' | 'goals' | 'debts' | 'scheduled_transactions') => Promise<void>;
  forceError: () => Promise<void>;
  toggleTransactionStar: (id: string) => Promise<boolean | null>;
  mergeTransactions: (ids: string[], targetDetails: Partial<Transaction>) => Promise<boolean | null>;
  cloneMonth: (sourceDate: Date, targetDate: Date) => Promise<boolean | null>;
  auditLogs: AuditLog[];
  logAction: (action: 'create' | 'update' | 'delete' | 'restore' | 'permanent_delete', entity: 'transaction' | 'goal' | 'debt' | 'scheduled_transaction', entityId: string, details: string) => Promise<void>;
}