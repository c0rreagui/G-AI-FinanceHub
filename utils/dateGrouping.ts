import { Transaction } from '../types';
import { startOfDay, startOfWeek, startOfMonth, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type GroupBy = 'none' | 'day' | 'week' | 'month';

export interface TransactionGroup {
  dateKey: string;
  dateLabel: string;
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  netTotal: number;
}

export const groupTransactionsByDate = (
  transactions: Transaction[],
  groupBy: GroupBy
): TransactionGroup[] => {
  if (groupBy === 'none') {
    return [];
  }

  const groups = new Map<string, Transaction[]>();

  transactions.forEach((tx) => {
    const date = new Date(tx.date);
    let key: string;

    switch (groupBy) {
      case 'day':
        key = format(startOfDay(date), 'yyyy-MM-dd');
        break;
      case 'week':
        key = format(startOfWeek(date, { locale: ptBR }), 'yyyy-MM-dd');
        break;
      case 'month':
        key = format(startOfMonth(date), 'yyyy-MM');
        break;
      default:
        key = format(date, 'yyyy-MM-dd');
    }

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(tx);
  });

  // Convert to array and sort by date (most recent first)
  const groupArray: TransactionGroup[] = Array.from(groups.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([dateKey, txs]) => {
      const date = new Date(dateKey);
      let dateLabel: string;

      switch (groupBy) {
        case 'day':
          dateLabel = format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
          break;
        case 'week':
          const weekEnd = new Date(date);
          weekEnd.setDate(weekEnd.getDate() + 6);
          dateLabel = `Semana de ${format(date, 'dd/MM', { locale: ptBR })} a ${format(weekEnd, 'dd/MM/yyyy', { locale: ptBR })}`;
          break;
        case 'month':
          dateLabel = format(date, "MMMM 'de' yyyy", { locale: ptBR });
          break;
        default:
          dateLabel = format(date, 'dd/MM/yyyy', { locale: ptBR });
      }

      const totalIncome = txs
        .filter((tx) => tx.amount > 0)
        .reduce((sum, tx) => sum + tx.amount, 0);

      const totalExpense = txs
        .filter((tx) => tx.amount < 0)
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

      const netTotal = totalIncome - totalExpense;

      return {
        dateKey,
        dateLabel: dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1),
        transactions: txs,
        totalIncome,
        totalExpense,
        netTotal,
      };
    });

  return groupArray;
};
