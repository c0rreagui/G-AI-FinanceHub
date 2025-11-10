export const formatCurrencyBRL = (amount: number): string => {
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