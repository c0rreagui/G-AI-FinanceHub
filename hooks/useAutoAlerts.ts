import { useEffect, useRef } from 'react';
import { useDashboardData } from './useDashboardData';
import { useNotifications } from '../contexts/NotificationContext';
import { differenceInDays, parseISO } from 'date-fns';

/**
 * Hook que monitora dados do dashboard e gera notificações automáticas
 * para orçamentos, contas a pagar e metas
 */
export const useAutoAlerts = () => {
    const { budgets, scheduledTransactions, goals, transactions, categories } = useDashboardData();
    const { addNotification } = useNotifications();
    
    // Ref para rastrear notificações já enviadas (evita duplicatas)
    const sentAlerts = useRef<Set<string>>(new Set());

    // Auto-Alert para Orçamentos > 80%
    useEffect(() => {
        budgets.forEach(budget => {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            // Filtra transações do mês atual nesta categoria
            const monthlySpent = transactions
                .filter(tx => {
                    const txDate = new Date(tx.date);
                    return (
                        tx.category_id === budget.category_id &&
                        tx.type === 'despesa' &&
                        txDate.getMonth() === currentMonth &&
                        txDate.getFullYear() === currentYear
                    );
                })
                .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

            const percentage = (monthlySpent / budget.amount) * 100;
            const alertKey = `budget-${budget.id}-${currentMonth}-${currentYear}`;

            // Notifica se > 80% e ainda não foi notificado
            if (percentage >= 80 && !sentAlerts.current.has(alertKey)) {
                const category = categories.find(c => c.id === budget.category_id);
                const categoryName = category?.name || 'Categoria';
                addNotification({
                    title: `Orçamento de ${categoryName}`,
                    message: `Você já usou ${percentage.toFixed(0)}% do orçamento mensal (R$ ${monthlySpent.toFixed(2)} de R$ ${budget.amount.toFixed(2)})`,
                    type: percentage >= 100 ? 'alert' : 'warning'
                });
                sentAlerts.current.add(alertKey);
            }
        });
    }, [budgets, transactions, addNotification]);

    // Auto-Alert para Transações Agendadas (próximos 3 dias)
    useEffect(() => {
        const today = new Date();
        
        scheduledTransactions.forEach(scheduled => {
            if (!scheduled.next_due_date) return;

            const dueDate = parseISO(scheduled.next_due_date);
            const daysUntilDue = differenceInDays(dueDate, today);
            const alertKey = `scheduled-${scheduled.id}-${scheduled.next_due_date}`;

            // Notifica se vence nos próximos 3 dias e ainda não notificado
            if (daysUntilDue >= 0 && daysUntilDue <= 3 && !sentAlerts.current.has(alertKey)) {
                const daysText = daysUntilDue === 0 
                    ? 'hoje' 
                    : daysUntilDue === 1 
                        ? 'amanhã' 
                        : `em ${daysUntilDue} dias`;

                addNotification({
                    title: 'Pagamento Agendado',
                    message: `"${scheduled.description}" vence ${daysText} (R$ ${Math.abs(scheduled.amount).toFixed(2)})`,
                    type: daysUntilDue === 0 ? 'alert' : 'info'
                });
                sentAlerts.current.add(alertKey);
            }
        });
    }, [scheduledTransactions, addNotification]);

    // Auto-Alert para Milestones de Metas (25%, 50%, 75%, 100%)
    useEffect(() => {
        goals.forEach(goal => {
            if (!goal.current_amount || !goal.target_amount) return;

            const percentage = (goal.current_amount / goal.target_amount) * 100;
            const milestones = [25, 50, 75, 100];

            milestones.forEach(milestone => {
                const alertKey = `goal-${goal.id}-${milestone}`;

                // Se atingiu o milestone e ainda não foi notificado
                if (percentage >= milestone && !sentAlerts.current.has(alertKey)) {
                    const isComplete = milestone === 100;
                    
                    addNotification({
                        title: isComplete ? '🎉 Meta Atingida!' : `Meta ${milestone}% Completa`,
                        message: isComplete 
                            ? `Parabéns! Você completou a meta "${goal.name}"!`
                            : `Você atingiu ${milestone}% da meta "${goal.name}" (R$ ${goal.current_amount.toFixed(2)} de R$ ${goal.target_amount.toFixed(2)})`,
                        type: isComplete ? 'success' : 'tip'
                    });
                    sentAlerts.current.add(alertKey);
                }
            });
        });
    }, [goals, addNotification]);

    // Limpa alerts antigos (1x por dia)
    useEffect(() => {
        const cleanup = setInterval(() => {
            sentAlerts.current.clear();
        }, 24 * 60 * 60 * 1000); // 24 horas

        return () => clearInterval(cleanup);
    }, []);
};
