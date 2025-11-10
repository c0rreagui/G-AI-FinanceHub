import React from 'react';

export type ViewType = 'home' | 'transactions' | 'insights' | 'goals' | 'debts' | 'scheduling' | 'tools' | 'settings';

export enum TransactionType {
  RECEITA = 'Receita',
  DESPESA = 'Despesa',
}

export interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

export interface Installment {
  current: number;
  total: number;
}

export interface Transaction {
  id: string;
  userId?: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId?: string;
  accountId?: string;
  category: Category; // Joined data in the app
  installment?: Installment;
  cardName?: string; // Optional credit card name
}

export interface Account {
    id: string;
    name: string;
    type: 'Carteira' | 'Conta Corrente' | 'Poupança';
    balance: number;
}

export interface CreditCard {
    id:string;
    name: string;
    flag: string;
    limit: number;
    closingDay: number;
}

export interface Invoice {
    id: string;
    cardId: string;
    closingDate: string;
    dueDate: string;
    totalAmount: number;
    status: 'Aberta' | 'Fechada' | 'Paga';
    transactions: Transaction[];
}

export interface Summary {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
}

export enum GoalStatus {
    EM_ANDAMENTO = 'Em Andamento',
    CONCLUIDA = 'Concluída',
    CANCELADA = 'Cancelada',
}

export interface Goal {
    id: string;
    userId?: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    status: GoalStatus;
}

export enum DebtStatus {
    ATIVA = 'Ativa',
    PAGA = 'Paga',
}

export interface Debt {
    id: string;
    userId?: string;
    name: string;
    totalAmount: number;
    paidAmount: number;
    interestRate: number;
    category: string;
    status: DebtStatus;
}

export enum ScheduledTransactionFrequency {
    DIARIO = 'Diário',
    SEMANAL = 'Semanal',
    MENSAL = 'Mensal',
    ANUAL = 'Anual',
}

export interface ScheduledTransaction {
    id: string;
    description: string;
    amount: number;
    type: TransactionType;
    categoryId?: string;
    category: Category; // Joined data in the app
    startDate: string;
    frequency: ScheduledTransactionFrequency;
    nextDueDate: string;
}

// Gamificação
export enum UserRank {
    BRONZE = 'Bronze',
    PRATA = 'Prata',
    OURO = 'Ouro',
    PLATINA = 'Platina',
    DIAMANTE = 'Diamante',
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
    dateUnlocked?: string;
    icon: React.ElementType;
}

// Colaboração
export interface Workspace {
    id: string;
    name: string;
    members: string[]; // Array of user IDs
}

export interface SharedBudget {
    id: string;
    workspaceId: string;
    name: string;
    totalAmount: number;
    spentAmount: number;
    categories: Record<string, number>; // Category ID and its budget
}

// Investimentos
export enum InvestmentType {
    ACAO = 'Ação',
    FUNDO_IMOBILIARIO = 'Fundo Imobiliário',
    RENDA_FIXA = 'Renda Fixa',
    CRIPTOMOEDA = 'Criptomoeda',
}

export interface Investment {
    id: string;
    name: string;
    ticker: string;
    type: InvestmentType;
    quantity: number;
    averagePrice: number;
    currentValue: number;
}

// Lista de Desejos
export interface WishlistItem {
    id: string;
    name: string;
    price: number;
    priority: 'Baixa' | 'Média' | 'Alta';
    savedAmount: number;
}
// FIX: Adicionados tipos para o componente AIHub e serviço Gemini.
// Inteligência Artificial / AI Hub
export enum ChatRole {
    USER = 'user',
    MODEL = 'model',
}

export interface ChatMessage {
    role: ChatRole;
    text: string;
    isTyping?: boolean;
    imageUrl?: string; // for display in the UI
    imageData?: { // for sending to the API
        data: string;
        mimeType: string;
    };
    grounding?: any[]; // for search/maps results
}

// Define a interface para o contexto de dados do dashboard.
export interface DashboardDataContextType {
    transactions: Transaction[];
    goals: Goal[];
    debts: Debt[];
    summary: Summary;
    scheduledTransactions: ScheduledTransaction[];
    userLevel: UserLevel;
    achievements: Achievement[];
    categories: Category[];
    loading: boolean;
    error: string | null;
    clearError: () => void;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'category' | 'userId'>) => Promise<boolean>;
    updateTransaction: (transactionId: string, updates: Partial<Omit<Transaction, 'id' | 'category'>>) => Promise<boolean>;
    addGoal: (goal: Omit<Goal, 'id' | 'currentAmount' | 'status' | 'userId'>) => Promise<boolean>;
    addDebt: (debt: Omit<Debt, 'id' | 'paidAmount' | 'status' | 'userId'>) => Promise<boolean>;
    addScheduledTransaction: (scheduledTx: Omit<ScheduledTransaction, 'id'|'category'|'nextDueDate'>) => Promise<boolean>;
    deleteTransaction: (transactionId: string) => Promise<boolean>;
    updateGoalValue: (goalId: string, newCurrentAmount: number) => Promise<void>;
    addPaymentToDebt: (debtId: string, paymentAmount: number) => Promise<void>;
}