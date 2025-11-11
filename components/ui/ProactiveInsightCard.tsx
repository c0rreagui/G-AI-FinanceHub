import React, { useMemo } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Lightbulb, TrendingDown } from '../Icons';
import { TransactionType } from '../../types';
import { formatCurrencyBRL } from '../../utils/formatters';
import { Button } from './Button';

export const ProactiveInsightCard: React.FC = () => {
    const { transactions } = useDashboardData();

    const highestSpendingCategory = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const expensesThisMonth = transactions.filter(t => 
            t.type === TransactionType.DESPESA &&
            new Date(t.date).getMonth() === currentMonth &&
            new Date(t.date).getFullYear() === currentYear
        );

        if (expensesThisMonth.length === 0) {
            return null;
        }

        const spendingByCategory: { [key: string]: { name: string; icon: React.ElementType; color: string; total: number } } = {};

        expensesThisMonth.forEach(tx => {
            const id = tx.category.id;
            if (!spendingByCategory[id]) {
                spendingByCategory[id] = { 
                    name: tx.category.name,
                    icon: tx.category.icon,
                    color: tx.category.color,
                    total: 0 
                };
            }
            spendingByCategory[id].total += Math.abs(tx.amount);
        });

        const highest = Object.values(spendingByCategory).sort((a, b) => b.total - a.total)[0];
        
        return highest;

    }, [transactions]);

    if (!highestSpendingCategory) {
        return null;
    }

    const { name, icon: Icon, color, total } = highestSpendingCategory;

    return (
        <div className="card flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-cyan-900/20 border-cyan-500/30">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-cyan-500/20">
                <Lightbulb className="w-6 h-6 text-cyan-300" />
            </div>
            <div className="flex-grow">
                <h3 className="font-semibold text-white">Insight Rápido</h3>
                <p className="text-sm text-gray-300 mt-1">
                    Sua maior despesa este mês foi com <span className="font-semibold" style={{color: color}}>{name}</span>, totalizando <span className="font-bold text-white">{formatCurrencyBRL(total)}</span>.
                </p>
            </div>
            <Button variant="secondary" size="sm">
                Analisar Gastos
            </Button>
        </div>
    );
};
