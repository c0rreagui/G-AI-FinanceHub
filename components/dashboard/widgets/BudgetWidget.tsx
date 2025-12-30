import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { BudgetRing } from '../../ui/BudgetRing';
import { SpendingBar } from '../../ui/SpendingBar';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { TransactionType } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';

export const BudgetWidget: React.FC = () => {
    const { summary, transactions, categories, budgets, monthlyBudgetLimit, setMonthlyBudgetLimit } = useDashboardData();
    const [isEditing, setIsEditing] = React.useState(false);
    const [tempLimit, setTempLimit] = React.useState('');

    // Logic: 
    // 1. User Preference (Local Storage)
    // 2. Sum of Budgets
    // 3. Monthly Income
    // 4. Fallback 5000
    const totalBudget = budgets.reduce((acc, curr) => acc + curr.amount, 0);

    const activeLimit = React.useMemo(() => {
        if (monthlyBudgetLimit > 0) return monthlyBudgetLimit;
        if (totalBudget > 0) return totalBudget;
        if (summary.monthlyIncome > 0) return summary.monthlyIncome;
        return 5000;
    }, [monthlyBudgetLimit, totalBudget, summary.monthlyIncome]);

    const handleEditClick = () => {
        setTempLimit(activeLimit.toString());
        setIsEditing(true);
    };

    const handleSave = () => {
        const val = parseFloat(tempLimit);
        if (!isNaN(val) && val > 0) {
            setMonthlyBudgetLimit(val);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') setIsEditing(false);
    }

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
        <Card className="bg-card border-border h-full relative overflow-hidden group">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Orçamento Mensal
                </CardTitle>
                <button
                    onClick={handleEditClick}
                    className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Editar Limite"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                </button>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-2xl font-bold text-foreground">
                            {formatCurrency(currentSpent)}
                        </span>

                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">de R$</span>
                                <input
                                    type="number"
                                    value={tempLimit}
                                    onChange={(e) => setTempLimit(e.target.value)}
                                    onBlur={handleSave}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                    aria-label="Limite de orçamento mensal"
                                    className="w-20 bg-transparent border-b border-primary text-xs focus:outline-none"
                                />
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                de {formatCurrency(activeLimit)}
                            </p>
                        )}
                    </div>
                    <BudgetRing
                        spent={currentSpent}
                        limit={activeLimit}
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
