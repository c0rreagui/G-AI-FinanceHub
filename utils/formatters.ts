import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const safeFloat = (value: number | string): number => {
    const num = typeof value === 'string' ? Number.parseFloat(value) : value;
    // Validate NaN to prevent invalid calculations
    if (Number.isNaN(num)) return 0;
    return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const formatCompactCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatDate = (date: Date | string, formatStr: string = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: ptBR });
};

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: ptBR });
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

export const formatDaysUntil = (date: Date | string): { text: string, color: string } => {
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: 'Atrasado', color: 'red' };
    } else if (diffDays === 0) {
        return { text: 'Hoje', color: 'yellow' };
    } else {
        return { text: `${diffDays} dias restantes`, color: 'green' };
    }
};