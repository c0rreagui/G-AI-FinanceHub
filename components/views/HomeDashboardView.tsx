import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { HomeIcon } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { LoadingSpinner } from '../LoadingSpinner';
import { QuickActions } from '../ui/QuickActions';
import { formatCurrencyBRL } from '../../utils/formatters';
import { ProgressBar } from '../ui/ProgressBar';
import { GoalStatus } from '../../types';

const SummaryCard: React.FC<{ title: string; amount: number; }> = ({ title, amount }) => (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
        <p className="text-gray-300">{title}</p>
        <p className="text-3xl font-bold text-white mt-2">{formatCurrencyBRL(amount)}</p>
    </div>
);

export const HomeDashboardView: React.FC = () => {
    const { summary, goals, loading } = useDashboardData();

    if (loading) {
        return (
            <div className="flex-grow flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }
    
    const firstGoal = goals.find(g => g.status === GoalStatus.EM_ANDAMENTO);

    return (
        <>
            <PageHeader
                icon={HomeIcon}
                title="Início"
                breadcrumbs={['FinanceHub', 'Início']}
            />
            <div className="mt-6 flex-grow overflow-y-auto pr-2 space-y-6">
                {/* 1. Quick Actions */}
                <QuickActions />

                {/* 2. Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SummaryCard title="Saldo Atual" amount={summary.totalBalance} />
                    <SummaryCard title="Receitas do Mês" amount={summary.monthlyIncome} />
                    <SummaryCard title="Despesas do Mês" amount={Math.abs(summary.monthlyExpenses)} />
                </div>

                {/* 3. Goal Progress */}
                {firstGoal && (
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Meta Principal: {firstGoal.name}</h2>
                        <p className="text-sm text-gray-400 mt-2">
                            {formatCurrencyBRL(firstGoal.currentAmount)} de {formatCurrencyBRL(firstGoal.targetAmount)}
                        </p>
                        <ProgressBar percentage={(firstGoal.currentAmount / firstGoal.targetAmount) * 100} color="indigo" />
                    </div>
                )}
            </div>
        </>
    );
};