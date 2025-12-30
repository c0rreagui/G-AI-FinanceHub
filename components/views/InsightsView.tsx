import React, { useMemo } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { useDashboardData } from '../../hooks/useDashboardData';
import { BalanceEvolutionChart } from '../ui/charts/BalanceEvolutionChart';
import { LoadingSpinner } from '../LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { Lightbulb, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { exportToCSV } from '../../utils/export';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import { InvestmentSuggestions } from '../dashboard/InvestmentSuggestions';

import { formatCurrency } from '../../utils/formatters';
import { TransactionType } from '../../types';
import { CategoryBreakdownChart } from '../ui/charts/CategoryBreakdownChart';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { DateRangePicker } from '../ui/DateRangePicker';
import { ReportProvider, useReport } from '../../contexts/ReportContext';

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        const containerStyle = { borderColor: payload[0].color };
        return (

            <div className="bg-background/95 backdrop-blur-sm border rounded-xl shadow-xl p-4 min-w-[200px]" {...{ style: containerStyle }}>
                <p className="font-bold text-white mb-2">{label}</p>
                {payload.map((entry, index) => {
                    const entryStyle = { color: entry.color };
                    return (
                        <p key={entry.name || index} className="text-sm font-medium"
                            {...{ style: entryStyle }}>
                            {entry.name}: {formatCurrency(entry.value)}
                        </p>
                    );
                })}
            </div>
        );
    }
    return null;
};

const InsightsContent: React.FC<{ setCurrentView: (view: ViewType) => void }> = ({ setCurrentView }) => {
    const { transactions: allTransactions, categories, loading } = useDashboardData();
    const { dateRange, setDateRange, filterTransactions } = useReport();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const transactions = useMemo(() => filterTransactions(allTransactions), [allTransactions, filterTransactions]);

    const categoryAnalysis = useMemo(() => {
        if (!transactions.length) return [];

        const analysis: { [key: string]: { name: string; receita: number; despesa: number } } = {};

        transactions.forEach(tx => {
            const categoryName = tx.category?.name || 'Outros';
            if (!analysis[categoryName]) {
                analysis[categoryName] = { name: categoryName, receita: 0, despesa: 0 };
            }

            if (tx.type === TransactionType.RECEITA) {
                analysis[categoryName].receita += tx.amount;
            } else {
                analysis[categoryName].despesa += Math.abs(tx.amount);
            }
        });

        return Object.values(analysis)
            .filter(item => item.receita > 0 || item.despesa > 0)
            .sort((a, b) => (b.receita + b.despesa) - (a.receita + a.despesa))
            .slice(0, 10); // Top 10 categories
    }, [transactions]);

    const handleExport = () => {
        if (!transactions.length) return;
        const filename = `relatorio-${dateRange.startDate || 'inicio'}-ate-${dateRange.endDate || 'fim'}.csv`;
        exportToCSV(transactions, filename);
    };

    return (
        <>
            <PageHeader setCurrentView={setCurrentView}
                icon={Lightbulb}
                title="Insights e Análises"
                breadcrumbs={[{ label: 'FinanceHub' }, { label: 'Insights', active: true }]}
            >
                <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
                    <DateRangePicker
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                        onChange={(start, end) => setDateRange({ startDate: start, endDate: end })}
                    />
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        disabled={transactions.length === 0}
                        className="w-full md:w-auto"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar CSV
                    </Button>
                </div>
            </PageHeader>
            {loading ? (
                <div className="flex-grow flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="mt-6 flex-grow flex flex-col overflow-y-auto pr-2 pb-20 space-y-6">
                    {transactions.length > 0 ? (
                        <>
                            <InvestmentSuggestions />
                            <BalanceEvolutionChart transactions={allTransactions} dateRange={dateRange} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="h-[400px]">
                                    <div className="h-full bg-card rounded-xl border border-white/5 p-4 flex flex-col">
                                        <h3 className="text-lg font-semibold text-white mb-4">Distribuição de Despesas</h3>
                                        <CategoryBreakdownChart transactions={transactions} categories={categories} />
                                    </div>
                                </div>

                                {categoryAnalysis.length > 0 && (
                                    <div className="h-[400px]">
                                        <div className="h-full bg-card rounded-xl border border-white/5 p-4 flex flex-col">
                                            <h3 className="text-lg font-semibold text-white mb-4">Fluxo por Categoria</h3>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={categoryAnalysis}
                                                    layout="vertical"
                                                    margin={{ top: 5, right: isMobile ? 5 : 30, left: 20, bottom: 20 }}
                                                    barCategoryGap="20%"
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" horizontal={false} />
                                                    <XAxis
                                                        type="number"
                                                        tick={{ fill: '#d1d5db', fontSize: 12 }}
                                                        stroke="rgba(255, 255, 255, 0.2)"
                                                        tickFormatter={(value) => formatCurrency(Number(value))}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
                                                    <YAxis
                                                        type="category"
                                                        dataKey="name"
                                                        tick={{ fill: '#d1d5db', fontSize: 12 }}
                                                        stroke="rgba(255, 255, 255, 0.2)"
                                                        width={isMobile ? 100 : 120}
                                                        tickLine={false}
                                                        axisLine={false}
                                                    />
                                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                                                    <Legend
                                                        wrapperStyle={{ bottom: 0, left: 20 }}
                                                        iconType="circle"
                                                        formatter={(value) => <span className="text-gray-300 capitalize">{value}</span>}
                                                    />
                                                    <Bar dataKey="receita" name="Receita" fill="#4ade80" radius={[0, 4, 4, 0]} />
                                                    <Bar dataKey="despesa" name="Despesa" fill="#f87171" radius={[0, 4, 4, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col">
                            <EmptyState
                                icon={Lightbulb}
                                title={allTransactions.length === 0 ? "Sem Dados para Análise" : "Nenhum dado neste período"}
                                description={allTransactions.length === 0
                                    ? "Adicione algumas transações para começar a gerar insights sobre seus hábitos financeiros."
                                    : "Tente selecionar um intervalo de datas diferente para visualizar seus insights."}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

import { ViewType } from '../../types';

interface InsightsViewProps {
    setCurrentView: (view: ViewType) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ setCurrentView }) => {
    return (
        <ReportProvider>
            <InsightsContent setCurrentView={setCurrentView} />
        </ReportProvider>
    );
};
