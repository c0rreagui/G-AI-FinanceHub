import React from 'react';

export type ViewType = 'home' | 'transactions' | 'insights' | 'goals' | 'debts' | 'investments' | 'scheduling' | 'tools' | 'settings' | 'devtools' | 'design-system' | 'social';

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
  investment_id?: string | null;
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

export enum InvestmentType {
  RENDA_FIXA = 'renda_fixa',
  ACOES = 'acoes',
  FIIS = 'fiis',
  CRIPTO = 'cripto',
  EXTERIOR = 'exterior',
  OUTROS = 'outros',
}

export interface Investment {
  id: string;
  user_id: string;
  name: string;
  ticker?: string;
  type: InvestmentType;
  amount: number;
  quantity: number;
  current_price?: number;
  purchase_date: string; // ISO 8601
  color?: string;
  logo_url?: string;
  sector?: string;
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
    role: 'admin' | 'member';
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
  goals: Goal[];
  debts: Debt[];
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

  // Functions
  addTransaction: (tx: Omit<Transaction, 'id' | 'category' | 'user_id' | 'category_id'> & { categoryId: string }) => Promise<boolean>;
  updateTransaction: (tx: Omit<Transaction, 'category' | 'user_id' | 'category_id'> & { categoryId: string }) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  updateTransactionsCategory: (transactionIds: string[], newCategoryId: string) => Promise<boolean>;
  checkForDuplicates: (transaction: Partial<Transaction>) => Transaction[];

  addGoal: (goal: Omit<Goal, 'id' | 'current_amount' | 'status' | 'user_id' | 'target_amount' | 'deadline'> & { targetAmount: number; deadline: string; }) => Promise<Goal | null>;
  updateGoalValue: (goalId: string, amount: number) => Promise<boolean>;
  deleteGoal: (id: string) => Promise<boolean>;

  addDebt: (debt: Omit<Debt, 'id' | 'paid_amount' | 'status' | 'user_id' | 'total_amount' | 'interest_rate'> & { totalAmount: number; interestRate: number }) => Promise<Debt | null>;
  addPaymentToDebt: (debtId: string, amount: number) => Promise<boolean>;
  deleteDebt: (id: string) => Promise<boolean>;

  addScheduledTransaction: (transaction: Omit<ScheduledTransaction, 'id' | 'category' | 'next_due_date' | 'user_id' | 'category_id' | 'start_date'> & { categoryId: string; startDate: string }) => Promise<boolean>;
  updateScheduledTransaction: (transaction: Omit<ScheduledTransaction, 'category' | 'user_id' | 'category_id' | 'start_date'> & { categoryId: string; startDate: string } & { id: string }) => Promise<boolean>;
  deleteScheduledTransaction: (id: string) => Promise<boolean>;

  completeMission: (missionId: string) => void;
  clearError: () => void;

  // DevTools / Mock Data
  addMockData: () => Promise<void>;
  clearAllUserData: () => Promise<void>;
  addMockTransactions: (count: number) => Promise<void>;
  addMockGoals: (count: number) => Promise<void>;
  addMockDebts: (count: number) => Promise<void>;
  clearTable: (tableName: 'transactions' | 'goals' | 'debts' | 'scheduled_transactions') => Promise<void>;
  forceError: () => Promise<void>;
}