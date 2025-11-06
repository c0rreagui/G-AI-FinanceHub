import React from 'react';

export enum ChatRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  role: ChatRole;
  text: string;
  imageUrl?: string;
  isTyping?: boolean;
  grounding?: any[];
}

export type ViewType = 'home' | 'dashboard' | 'transactions' | 'insights' | 'goals' | 'debts' | 'scheduling' | 'tools' | 'settings';

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
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: Category;
  installment?: Installment;
}

export interface CreditCard {
    id: string;
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
    category: Category;
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
