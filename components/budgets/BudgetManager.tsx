
import React, { useState, useMemo } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Edit2, Trash2, PieChart, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
// Assuming we have Radix or similar, or I should use our UI Dialog
import { Dialog as UiDialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Budget } from '../../types';

interface BudgetWithSpending extends Budget {
    spent: number;
    percentage: number;
    categoryName: string;
    categoryColor: string;
    categoryIcon: any;
}

export const BudgetManager: React.FC = () => {
    const { budgets, transactions, categories, addBudget, updateBudget, deleteBudget, isMutating } = useDashboardData();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

    // Calculate spending per category for current month
    const budgetAnalysis = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const currentMonthExpenses = transactions.filter(t =>
            t.type === 'despesa' &&
            new Date(t.date).getMonth() === currentMonth &&
            new Date(t.date).getFullYear() === currentYear
        );

        const spendingByCategory = currentMonthExpenses.reduce((acc, t) => {
            const catId = t.category.id;
            acc[catId] = (acc[catId] || 0) + Math.abs(t.amount);
            return acc;
        }, {} as Record<string, number>);

        return budgets.map(budget => {
            const category = categories.find(c => c.id === budget.category_id);
            const spent = spendingByCategory[budget.category_id] || 0;
            const percentage = Math.min(100, (spent / budget.amount) * 100);

            return {
                ...budget,
                spent,
                percentage,
                categoryName: category?.name || 'Desconhecido',
                categoryColor: category?.color || '#cbd5e1',
                categoryIcon: category?.icon
            };
        }).sort((a, b) => b.percentage - a.percentage); // Most critical first
    }, [budgets, transactions, categories]);

    const handleSaveBudget = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const categoryId = formData.get('category') as string;
        const amount = Number.parseFloat(formData.get('amount') as string);

        if (!categoryId || Number.isNaN(amount)) return;

        if (editingBudget) {
            await updateBudget({ id: editingBudget.id, amount }); // Usually only amount changes or strictly category?
            // If category changes, we should ensure uniqueness. For simplicity, allow amount edit.
        } else {
            await addBudget({
                category_id: categoryId,
                amount,
                period: 'monthly'
            });
        }
        setIsAddDialogOpen(false);
        setEditingBudget(null);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja remover este orçamento?')) {
            await deleteBudget(id);
        }
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= 80) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                        Orçamentos Mensais
                    </h2>
                    <p className="text-muted-foreground">Planeje seus gastos e controle suas finanças.</p>
                </div>
                <UiDialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) setEditingBudget(null); }}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Plus className="w-4 h-4 mr-2" /> Novo Orçamento
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSaveBudget} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Categoria</Label>
                                {editingBudget ? (
                                    <div className="p-2 border rounded-md bg-muted text-muted-foreground">
                                        {categories.find(c => c.id === editingBudget.category_id)?.name}
                                    </div>
                                ) : (
                                    <Select name="category" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.filter(c => !budgets.some(b => b.category_id === c.id)).map(category => {
                                                const iconStyle = { color: category.color || 'currentColor' };
                                                return (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                {...{ style: iconStyle }}>{category.icon && React.createElement(category.icon, { size: 16 })}</span>
                                                            {category.name}
                                                        </div>
                                                    </SelectItem>
                                                );
                                            })}
                                            {categories.filter(c => !budgets.some(b => b.category_id === c.id)).length === 0 && (
                                                <div className="p-2 text-sm text-center text-muted-foreground">Todas as categorias já possuem orçamento.</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Limite Mensal (R$)</Label>
                                <Input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    defaultValue={editingBudget?.amount}
                                    required
                                    placeholder="Ex: 500.00"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isMutating}>
                                {isMutating ? 'Salvando...' : 'Salvar Orçamento'}
                            </Button>
                        </form>
                    </DialogContent>
                </UiDialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                    {budgetAnalysis.map((budget) => (
                        <motion.div
                            key={budget.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                        >
                            {(() => {
                                const stripeStyle = { backgroundColor: budget.categoryColor || 'transparent' };
                                const iconContainerStyle = { backgroundColor: `${budget.categoryColor}20`, color: budget.categoryColor };
                                const progressBarStyle = { width: `${Math.min(budget.percentage, 100)}%` };

                                return (
                                    <Card className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-card">
                                        <div
                                            className="absolute top-0 left-0 w-1 h-full"
                                            {...{ style: stripeStyle }}
                                        />
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-full"
                                                    {...{ style: iconContainerStyle }}>
                                                    {budget.categoryIcon && React.createElement(budget.categoryIcon, { size: 20 })}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base font-semibold">{budget.categoryName}</CardTitle>
                                                    <CardDescription className="text-xs">Mensal</CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => { setEditingBudget(budget); setIsAddDialogOpen(true); }}>
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => handleDelete(budget.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Gasto: <span className={budget.spent > budget.amount ? 'text-red-500 font-bold' : 'text-foreground'}>{formatCurrency(budget.spent)}</span></span>
                                                    <span className="font-medium">{formatCurrency(budget.amount)}</span>
                                                </div>
                                                <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className={`absolute top-0 left-0 h-full transition-all duration-500 ${getProgressColor(budget.percentage)}`}
                                                        {...{ style: progressBarStyle }}
                                                    />
                                                </div>
                                                {budget.percentage >= 80 && (
                                                    <div className={`flex items-center gap-1 text-xs ${budget.percentage >= 100 ? 'text-red-500 font-bold' : 'text-amber-500'}`}>
                                                        <AlertTriangle className="w-3 h-3" />
                                                        {budget.percentage >= 100 ? 'Orçamento estourado!' : 'Atenção: Limite próximo.'}
                                                    </div>
                                                )}
                                                {budget.percentage < 80 && (
                                                    <div className="text-xs text-muted-foreground">
                                                        Restam {formatCurrency(Math.max(0, budget.amount - budget.spent))}
                                                    </div>
                                                )}

                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })()}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {budgetAnalysis.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-8 bg-muted/20 border-2 border-dashed rounded-lg">
                        <div className="p-4 bg-muted rounded-full mb-4">
                            <PieChart className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Sem orçamentos definidos</h3>
                        <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                            Crie orçamentos para suas categorias de gastos e assuma o controle de suas finanças.
                        </p>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
                            Começar Agora
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
