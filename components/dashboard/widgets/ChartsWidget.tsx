import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/Tabs';
import { MonthlySummaryChart } from '../../ui/charts/MonthlySummaryChart';
import { FinancialHeatMap } from '../../ui/charts/FinancialHeatMap';
import { ExpenseDonutChart } from '../../ui/charts/ExpenseDonutChart';
import { CashFlowBarChart } from '../../ui/charts/CashFlowBarChart';
import { DailyBalanceChart } from '../../ui/charts/DailyBalanceChart';
import { MonthlyChartData, Transaction } from '../../../types';

interface ChartsWidgetProps {
    monthlyChartData: MonthlyChartData[];
    transactions: Transaction[];
}

export const ChartsWidget: React.FC<ChartsWidgetProps> = ({ monthlyChartData, transactions }) => {
    // Aggregate data for Donut Chart
    const expenseByCategory = transactions
        .filter(t => t.amount < 0)
        .reduce((acc, t) => {
            const category = (t.category as any)?.name || t.category || 'Outros';
            const categoryName = typeof category === 'string' ? category : 'Outros';
            acc[categoryName] = (acc[categoryName] || 0) + Math.abs(t.amount);
            return acc;
        }, {} as Record<string, number>);

    const donutData = Object.entries(expenseByCategory).map(([name, value], index) => ({
        name,
        value,
        color: `hsl(var(--chart-${(index % 5) + 1}))`
    })).sort((a, b) => b.value - a.value).slice(0, 5);

    // Mock Data for Daily Balance (since we need historical balance)
    const dailyBalanceData = Array.from({ length: 30 }, (_, i) => ({
        date: `${i + 1}/12`,
        balance: 10000 + Math.random() * 5000 - 2500
    }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 h-[400px]">
                <Tabs defaultValue="summary" className="h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <TabsList>
                            <TabsTrigger value="summary">Resumo</TabsTrigger>
                            <TabsTrigger value="cashflow">Fluxo</TabsTrigger>
                            <TabsTrigger value="expenses">Despesas</TabsTrigger>
                            <TabsTrigger value="daily">Saldo Diário</TabsTrigger>
                        </TabsList>
                    </div>
                    
                    <div className="flex-1 min-h-0 glass rounded-xl p-4 shadow-lg">
                        <TabsContent value="summary" className="h-full mt-0">
                            <MonthlySummaryChart data={monthlyChartData} />
                        </TabsContent>
                        <TabsContent value="cashflow" className="h-full mt-0">
                            <CashFlowBarChart data={monthlyChartData} />
                        </TabsContent>
                        <TabsContent value="expenses" className="h-full mt-0">
                            <ExpenseDonutChart data={donutData} />
                        </TabsContent>
                        <TabsContent value="daily" className="h-full mt-0">
                            <DailyBalanceChart data={dailyBalanceData} />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
            <div className="h-[400px]">
                <FinancialHeatMap transactions={transactions} />
            </div>
        </div>
    );
};
