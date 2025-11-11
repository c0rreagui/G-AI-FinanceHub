// components/views/InsightsView.tsx
import React, { useMemo } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Lightbulb } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { formatCurrencyBRL } from '../../utils/formatters';
import { TransactionType } from '../../types';
import { LoadingSpinner } from '../LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { EmptyState } from '../ui/EmptyState';

// Tooltip customizado para exibir receitas e despesas formatadas.
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const receitaPayload = payload.find((p: any) => p.dataKey === 'receita');
      const despesaPayload = payload.find((p: any) => p.dataKey === 'despesa');
      
      return (
        <div className="bg-black/50 border border-white/20 backdrop-blur-md p-3 rounded-lg text-sm">
          <p className="label font-semibold text-white">{`${label}`}</p>
          {receitaPayload && receitaPayload.value > 0 && (
            <p className="text-green-400">{`Receita: ${formatCurrencyBRL(receitaPayload.value)}`}</p>
          )}
          {despesaPayload && despesaPayload.value > 0 && (
            <p className="text-red-400">{`Despesa: ${formatCurrencyBRL(despesaPayload.value)}`}</p>
          )}
        </div>
      );
    }
    return null;
};

interface CategoryAnalysisData {
    name: string;
    receita: number;
    despesa: number;
    total: number;
}

export const InsightsView: React.FC = () => {
    const { transactions, loading } = useDashboardData();

    // Analisa as transações dos últimos 6 meses e agrupa por categoria
    const categoryAnalysis = useMemo((): CategoryAnalysisData[] => {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const relevantTransactions = transactions.filter(t => new Date(t.date) >= sixMonthsAgo);

        const analysis: { [key: string]: { name: string; receita: number; despesa: number } } = {};

        relevantTransactions.forEach(tx => {
            const { category } = tx;
            if (!analysis[category.id]) {
                analysis[category.id] = { name: category.name, receita: 0, despesa: 0 };
            }
            if (tx.type === TransactionType.RECEITA) {
                analysis[category.id].receita += tx.amount;
            } else {
                analysis[category.id].despesa += Math.abs(tx.amount);
            }
        });

        return Object.values(analysis)
            .map(item => ({ ...item, total: item.receita + item.despesa }))
            .filter(item => item.total > 0)
            .sort((a, b) => b.despesa - a.despesa) // Prioriza o sort por despesa
            .slice(0, 15);

    }, [transactions]);

    return (
        <>
            <PageHeader 
                icon={Lightbulb} 
                title="Insights & Análises" 
                breadcrumbs={['FinanceHub', 'Insights']} 
            />
            {loading ? (
                <div className="flex-grow flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="mt-6 flex-grow flex flex-col overflow-y-auto pr-2">
                     {transactions.length > 0 && categoryAnalysis.length > 0 ? (
                        <div className="card h-[500px] md:h-[700px] flex-grow">
                            <h3 className="text-lg font-semibold text-white mb-4">Fluxo por Categoria (Últimos 6 Meses)</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                    data={categoryAnalysis} 
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                                    barCategoryGap="20%"
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" horizontal={false} />
                                    <XAxis 
                                        type="number"
                                        tick={{ fill: '#d1d5db', fontSize: 12 }} 
                                        stroke="rgba(255, 255, 255, 0.2)"
                                        tickFormatter={(value) => formatCurrencyBRL(Number(value))}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis 
                                        type="category" 
                                        dataKey="name" 
                                        tick={{ fill: '#d1d5db', fontSize: 12 }} 
                                        stroke="rgba(255, 255, 255, 0.2)"
                                        width={120} // Mais espaço para nomes de categoria
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                                    <Legend 
                                        wrapperStyle={{ bottom: -5, left: 20 }}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-gray-300 capitalize">{value}</span>}
                                    />
                                    <Bar dataKey="receita" name="Receita" fill="oklch(var(--success-oklch))" radius={4} />
                                    <Bar dataKey="despesa" name="Despesa" fill="oklch(var(--danger-oklch))" radius={4} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex-grow">
                            <EmptyState
                                icon={Lightbulb}
                                title="Sem Dados para Análise"
                                description="Adicione algumas transações para começar a gerar insights sobre seus hábitos financeiros."
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};