import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { BudgetRing } from '../../ui/BudgetRing';
import { SpendingBar } from '../../ui/SpendingBar';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { TransactionType } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';

export const BudgetWidget: React.FC = () => {
    const { summary, transactions, categories } = useDashboardData();
    
    // Mock Budget Limit (In a real app, this would come from a settings context or API)
    const MONTHLY_LIMIT = 5000;
    const currentSpent = Math.abs(summary.monthlyExpenses);

    // Calculate spending by category for SpendingBar
    const expenses = transactions.filter(t => t.type === TransactionType.DESPESA);
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(t => {
        if (!categoryTotals[t.category.id]) {
            categoryTotals[t.category.id] = 0;
        }
        categoryTotals[t.category.id] += Math.abs(t.amount);
    });

    const spendingSegments = Object.entries(categoryTotals)
        .map(([catId, value]) => {
            const cat = categories.find(c => c.id === catId);
            return {
                label: cat?.name || 'Outros',
                value,
                color: cat?.color || '#94a3b8'
            };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, 4); // Top 4 categories

    return (
        <Card className="bg-card border-border h-full relative overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Orçamento Mensal
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-2xl font-bold text-foreground">
                            {formatCurrency(currentSpent)}
                        </span>
                        <p className="text-xs text-muted-foreground">
                            de {formatCurrency(MONTHLY_LIMIT)}
                        </p>
                    </div>
                    <BudgetRing 
                        spent={currentSpent} 
                        limit={MONTHLY_LIMIT} 
                        size={80} 
                        strokeWidth={6} 
                        showLabel={false}
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Top Categorias</span>
                        <span>{spendingSegments.reduce((acc, curr) => acc + curr.value, 0) / currentSpent * 100 < 100 ? 'Parcial' : 'Total'}</span>
                    </div>
                    <SpendingBar 
                        segments={spendingSegments} 
                        total={currentSpent} 
                        height={12}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {spendingSegments.map((seg, i) => {
                            return (
                                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded-md">
                                    <div 
                                        className="w-2 h-2 rounded-full" 
                                        ref={(el) => {
                                            if (el) el.style.backgroundColor = seg.color;
                                        }}
                                    />
                                    {seg.label}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
