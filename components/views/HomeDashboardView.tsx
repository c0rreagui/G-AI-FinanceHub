import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { HomeIcon, Lightbulb } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { QuickActions } from '../ui/QuickActions';
import { formatCurrencyBRL } from '../../utils/formatters';
import { ProgressBar } from '../ui/ProgressBar';
import { GoalStatus, TransactionType } from '../../types';
import { UpcomingPayments } from '../ui/UpcomingPayments';
import { HomeDashboardSkeleton } from './skeletons/HomeDashboardSkeleton';
import { UserProfileCard } from '../ui/UserProfileCard';
import { AchievementsList } from '../ui/AchievementsList';
import { motion } from 'framer-motion';
import { MonthlySummaryChart } from '../ui/charts/MonthlySummaryChart';
import { AnimatedSummaryCard } from '../ui/AnimatedSummaryCard';
import { ProactiveInsightCard } from '../ui/ProactiveInsightCard';

export const HomeDashboardView: React.FC = () => {
    const { summary, goals, transactions, monthlyChartData, loading } = useDashboardData();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      };
    
      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      };

    if (loading) {
        return (
            <>
                <PageHeader
                    icon={HomeIcon}
                    title="Início"
                    breadcrumbs={['FinanceHub', 'Início']}
                />
                <HomeDashboardSkeleton />
            </>
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
            <motion.div 
                className="mt-6 flex-grow overflow-y-auto pr-2 space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}><UpcomingPayments /></motion.div>
                <motion.div variants={itemVariants}><ProactiveInsightCard /></motion.div>
                <motion.div variants={itemVariants}><QuickActions /></motion.div>
                
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AnimatedSummaryCard title="Saldo Total" amount={summary.totalBalance} />
                    <AnimatedSummaryCard title="Receitas do Mês" amount={summary.monthlyIncome} />
                    <AnimatedSummaryCard title="Despesas do Mês" amount={Math.abs(summary.monthlyExpenses)} />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                    <MonthlySummaryChart data={monthlyChartData} />
                </motion.div>

                {firstGoal && (
                    <motion.div variants={itemVariants} className="card">
                        <h2 className="text-xl font-semibold text-white mb-4">Meta Principal: {firstGoal.name}</h2>
                        <p className="text-sm text-gray-400 mt-2">
                            {formatCurrencyBRL(firstGoal.currentAmount)} de {formatCurrencyBRL(firstGoal.targetAmount)}
                        </p>
                        <ProgressBar percentage={(firstGoal.currentAmount / firstGoal.targetAmount) * 100} color="primary" />
                    </motion.div>
                )}

                <motion.div variants={itemVariants}><UserProfileCard /></motion.div>
                <motion.div variants={itemVariants}><AchievementsList /></motion.div>
            </motion.div>
        </>
    );
};