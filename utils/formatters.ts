import { Transaction } from '../types';

export const formatCurrencyBRL = (amount: number): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(0);
  }
  if (!isFinite(amount)) {
    return amount > 0 ? 'Ilimitado' : '-Ilimitado';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

export const formatDate = (dateString: string, format: 'short' | 'long' | 'dayMonth' = 'short'): string => {
  const date = new Date(dateString);
  if (format === 'long') {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }
  if (format === 'dayMonth') {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  }
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export const formatDaysUntil = (dateString: string): { text: string; color: 'red' | 'yellow' | 'gray' } => {
  const dueDate = new Date(dateString);
  const today = new Date();
  
  // Reset time part to compare dates only
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: `Vencido há ${Math.abs(diffDays)} dia(s)`, color: 'red' };
  }
  if (diffDays === 0) {
    return { text: 'Vence hoje', color: 'red' };
  }
  if (diffDays === 1) {
    return { text: 'Vence amanhã', color: 'yellow' };
  }
  if (diffDays <= 3) {
    return { text: `Vence em ${diffDays} dias`, color: 'yellow' };
  }
  return { text: `Vence em ${diffDays} dias`, color: 'gray' };
};

// PERFORMANCE NOTE: A criação de `new Date()` dentro de um loop (`forEach`) pode ser
// um gargalo de performance para datasets extremamente grandes (dezenas de milhares de transações).
// Para a escala deste app, esta abordagem é perfeitamente aceitável e mais legível.
export const groupTransactionsByDate = (transactions: Transaction[]): { [key: string]: Transaction[] } => {
  const groups: { [key: string]: Transaction[] } = {};
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

  transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      let groupKey: string;

      if (isSameDay(txDate, today)) {
          groupKey = 'Hoje';
      } else if (isSameDay(txDate, yesterday)) {
          groupKey = 'Ontem';
      } else {
          groupKey = new Intl.DateTimeFormat('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          }).format(txDate);
      }

      if (!groups[groupKey]) {
          groups[groupKey] = [];
      }
      groups[groupKey].push(tx);
  });
  return groups;
};