
import React, { useMemo } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Lightbulb, Target, TrendingUp, Wallet } from '../Icons';
import { TransactionType, ViewType, GoalStatus } from '../../types';
import { formatCurrency, formatDaysUntil } from '../../utils/formatters';
import { Button } from './Button';

interface ProactiveInsightCardProps {
    setCurrentView: (view: ViewType) => void;
}

enum InsightType {
    HIGH_SPENDING = 'high_spending',
    INCOME_BOOST = 'income_boost',
    GOAL_DEADLINE = 'goal_deadline',
    EMPTY_STATE = 'empty_state'
}

interface Insight {
    type: InsightType;
    title: string;
    message: React.ReactNode;
    actionText: string;
    actionView: ViewType;
    icon: React.ElementType;
    iconColor: string;
    glowColor: string;
}

export const ProactiveInsightCard: React.FC<ProactiveInsightCardProps> = ({ setCurrentView }) => {
    const { transactions, goals, summary, monthlyChartData } = useDashboardData();

    const proactiveInsight = useMemo((): Insight | null => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Insight 1: Empty State
        if (transactions.length === 0) {
            return {
                type: InsightType.EMPTY_STATE,
                title: 'Vamos começar!',
                message: 'Adicione sua primeira transação para começar a ter controle sobre suas finanças.',
                actionText: 'Adicionar Transação',
                actionView: 'transactions',
                icon: Wallet,
                iconColor: 'text-cyan-300',
                glowColor: 'shadow-cyan-500/30'
            };
        }

        // Insight 2: Goal Deadline Approaching
        const upcomingGoal = goals
            .filter(g => g.status === GoalStatus.EM_ANDAMENTO)
            .map(g => ({ ...g, daysLeft: formatDaysUntil(g.deadline) }))
            .filter(g => g.daysLeft.color !== 'gray') // 'red' or 'yellow'
            .sort((a,b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];
        
        if (upcomingGoal) {
            return {
                type: InsightType.GOAL_DEADLINE,
                title: 'Foco na Meta!',
                message: <>Sua meta <span className="font-bold text-white">{upcomingGoal.name}</span> está com o prazo apertado. <span className={`font-semibold ${upcomingGoal.daysLeft.color === 'red' ? 'text-red-400' : 'text-yellow-400'}`}>{upcomingGoal.daysLeft.text}</span>!</>,
                actionText: 'Ver Metas',
                actionView: 'goals',
                icon: Target,
                iconColor: 'text-yellow-300',
                glowColor: 'shadow-yellow-500/30'
            };
        }

        // Insight 3: Income Boost
        const recentMonthsData = monthlyChartData.slice(-3, -1); // last 2 months before current
        if (recentMonthsData.length > 0) {
            const avgIncome = recentMonthsData.reduce((acc, month) => acc + month.receita, 0) / recentMonthsData.length;
            if (avgIncome > 100 && summary.monthlyIncome > avgIncome * 1.5) { // 50% increase
                return {
                    type: InsightType.INCOME_BOOST,
                    title: 'Parabéns!',
                    message: <>Sua receita este mês está <span className="font-bold text-green-400">significativamente maior</span> que a média. Ótima oportunidade para investir ou adiantar uma meta!</>,
                    actionText: 'Ver Insights',
                    actionView: 'insights',
                    icon: TrendingUp,
                    iconColor: 'text-green-400',
                    glowColor: 'shadow-green-500/30'
                };
            }
        }
        
        // Insight 4 (Fallback): Highest Spending Category
        const expensesThisMonth = transactions.filter(t => 
            t.type === TransactionType.DESPESA &&
            new Date(t.date).getMonth() === currentMonth &&
            new Date(t.date).getFullYear() === currentYear
        );
        if (expensesThisMonth.length > 0) {
            const spendingByCategory: { [key: string]: { name: string; color: string; total: number } } = {};
            expensesThisMonth.forEach(tx => {
                const id = tx.category.id;
                if (!spendingByCategory[id]) {
                    spendingByCategory[id] = { name: tx.category.name, color: tx.category.color, total: 0 };
                }
                spendingByCategory[id].total += Math.abs(tx.amount);
            });
            const highest = Object.values(spendingByCategory).sort((a, b) => b.total - a.total)[0];
            return {
                type: InsightType.HIGH_SPENDING,
                title: 'Fique de Olho',
                message: <>Sua maior despesa este mês foi com <span className="font-semibold" style={{color: highest.color}}>{highest.name}</span>, totalizando <span className="font-bold text-white">{formatCurrency(highest.total)}</span>.</>,
                actionText: 'Analisar Gastos',
                actionView: 'insights',
                icon: Lightbulb,
                iconColor: 'text-cyan-300',
                glowColor: 'shadow-cyan-500/30'
            };
        }

        return null;

    }, [transactions, goals, summary, monthlyChartData]);

    if (!proactiveInsight) {
        return null;
    }

    const { title, message, actionText, actionView, icon: Icon, iconColor, glowColor } = proactiveInsight;

    return (
        <div className="animated-border">
            <div className="card animated-border-content flex flex-col sm:flex-row items-start sm:items-center gap-4 !p-5 rounded-[15px]">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-cyan-500/10 shadow-lg ${glowColor}`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div className="flex-grow">
                    <h3 className="font-semibold text-white">{title}</h3>
                    <p className="text-sm text-gray-300 mt-1">{message}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setCurrentView(actionView)}>
                    {actionText}
                </Button>
            </div>
        </div>
    );
};
