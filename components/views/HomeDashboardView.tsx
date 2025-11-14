import React, { useMemo } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { HomeIcon, PlusCircle, Target, Wallet, ArrowUpRight, ArrowDownLeft } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { QuickActions } from '../ui/QuickActions';
import { GoalStatus, ViewType } from '../../types';
import { UpcomingPayments } from '../ui/UpcomingPayments';
import { HomeDashboardSkeleton } from './skeletons/HomeDashboardSkeleton';
import { UserProfileCard } from '../ui/UserProfileCard';
import { AchievementsList } from '../ui/AchievementsList';
import { motion } from 'framer-motion';
import { MonthlySummaryChart } from '../ui/charts/MonthlySummaryChart';
import { AnimatedSummaryCard } from '../ui/AnimatedSummaryCard';
import { ProactiveInsightCard } from '../ui/ProactiveInsightCard';
import { formatCurrencyBRL } from '../../utils/formatters';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { useDialog } from '../../hooks/useDialog';

interface HomeDashboardViewProps {
    setCurrentView: (view: ViewType) => void;
}

const NoGoalCTA: React.FC = () => {
    const { openDialog } = useDialog();
    return (
        <div className="card text-center bg-cyan-900/20 border-cyan-500/30">
            <Target className="w-10 h-10 text-cyan-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">Defina seu Primeiro Objetivo</h3>
            <p className="mt-2 text-sm text-gray-300 max-w-xs mx-auto">Metas são o primeiro passo para realizar seus sonhos. Que tal começar agora?</p>
            <Button onClick={() => openDialog('add-goal')} className="mt-6 mx-auto">
                <PlusCircle className="w-4 h-4 mr-2" />
                Criar Nova Meta
            </Button>
        </div>
    );
};


export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({ setCurrentView }) => {
    const { summary, goals, monthlyChartData, loading } = useDashboardData();

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
    
    const firstGoal = useMemo(() => goals.find(g => g.status === GoalStatus.EM_ANDAMENTO), [goals]);

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
                <motion.div variants={itemVariants}><ProactiveInsightCard setCurrentView={setCurrentView} /></motion.div>
                <motion.div variants={itemVariants}><QuickActions /></motion.div>
                
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AnimatedSummaryCard title="Saldo Total" amount={summary.totalBalance} icon={Wallet} />
                    <AnimatedSummaryCard title="Receitas do Mês" amount={summary.monthlyIncome} icon={ArrowUpRight} />
                    <AnimatedSummaryCard title="Despesas do Mês" amount={Math.abs(summary.monthlyExpenses)} icon={ArrowDownLeft} />
                </motion.div>
                
                <motion.div variants={itemVariants}><UserProfileCard /></motion.div>

                <motion.div variants={itemVariants}>
                    <MonthlySummaryChart data={monthlyChartData} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    {firstGoal ? (
                        <div className="card">
                            <h2 className="text-xl font-semibold text-white mb-4">Meta Principal: {firstGoal.name}</h2>
                            <p className="text-sm text-gray-400 mt-2">
                                {/* FIX: Corrected field names to snake_case to match database schema. */}
                                {formatCurrencyBRL(firstGoal.current_amount)} de {formatCurrencyBRL(firstGoal.target_amount)}
                            </p>
                            {/* FIX: Corrected field names to snake_case to match database schema. */}
                            <ProgressBar percentage={(firstGoal.current_amount / firstGoal.target_amount) * 100} color="primary" />
                        </div>
                    ) : (
                        <NoGoalCTA />
                    )}
                </motion.div>
                
                <motion.div variants={itemVariants}><AchievementsList /></motion.div>
            </motion.div>
        </>
    );
};