import React, { useMemo } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { HomeIcon, PlusCircle, Target, Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { QuickActions } from '../ui/QuickActions';
import { GoalStatus, TransactionType, ViewType } from '../../types';
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
import { WealthFunnelChart } from '../ui/charts/WealthFunnelChart';

interface HomeDashboardViewProps {
    setCurrentView: (view: ViewType) => void;
}

const RecentTransactionsList: React.FC<{ transactions: any[] }> = ({ transactions }) => (
    <div className="card h-full">
        <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-400 to-indigo-600 rounded-full"/>
                Últimas Atividades
            </h3>
        </div>
        <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {transactions.slice(0, 5).map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-black/30 border border-white/10 text-xl">
                            <tx.category.icon className="w-5 h-5" style={{ color: tx.category.color }} />
                         </div>
                         <div>
                             <p className="text-sm font-medium text-white truncate max-w-[120px]">{tx.description}</p>
                             <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})}</p>
                         </div>
                    </div>
                    <span className={`text-sm font-bold font-mono ${tx.type === 'despesa' ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {tx.type === 'despesa' ? '-' : '+'} {formatCurrencyBRL(Math.abs(tx.amount))}
                    </span>
                </div>
            ))}
            {transactions.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-4">Nenhuma atividade recente.</p>
            )}
        </div>
    </div>
);

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({ setCurrentView }) => {
    const { summary, goals, monthlyChartData, loading, transactions } = useDashboardData();
    const { openDialog } = useDialog();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const firstGoal = useMemo(() => goals.find(g => g.status === GoalStatus.EM_ANDAMENTO), [goals]);

    const investmentAmount = useMemo(() => {
        const investmentKeywords = ['investimento', 'bolsa', 'cripto', 'poupança', 'aporte', 'tesouro', 'cdb', 'ações'];
        return Math.abs(transactions
            .filter(t => {
                if (t.type !== TransactionType.DESPESA) return false;
                const catName = t.category.name.toLowerCase();
                return investmentKeywords.some(keyword => catName.includes(keyword));
            })
            .reduce((acc, t) => acc + t.amount, 0));
    }, [transactions]);

    if (loading) return <HomeDashboardSkeleton />;
    
    return (
        <>
            <PageHeader icon={HomeIcon} title="Visão Geral" breadcrumbs={['FinanceHub', 'Dashboard']} />
            
            <motion.div 
                className="flex-grow overflow-y-auto pr-2 pb-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* ROW 1: KPIs (Bento Grid Style) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                     <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-1">
                        <UserProfileCard />
                     </motion.div>
                     <motion.div variants={itemVariants}>
                        <AnimatedSummaryCard title="Saldo Total" amount={summary.totalBalance} icon={Wallet} />
                     </motion.div>
                     <motion.div variants={itemVariants}>
                        <AnimatedSummaryCard title="Receitas" amount={summary.monthlyIncome} icon={ArrowUpRight} />
                     </motion.div>
                     <motion.div variants={itemVariants}>
                        <AnimatedSummaryCard title="Despesas" amount={Math.abs(summary.monthlyExpenses)} icon={ArrowDownLeft} />
                     </motion.div>
                </div>

                {/* ROW 2: Main Charts & Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Main Chart Area (2/3 width) */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 h-[400px]">
                        <MonthlySummaryChart data={monthlyChartData} />
                    </motion.div>

                    {/* Side Column (1/3 width) */}
                    <div className="space-y-6 flex flex-col h-full">
                        <motion.div variants={itemVariants} className="flex-1 min-h-[200px]">
                             <WealthFunnelChart 
                                income={summary.monthlyIncome} 
                                expenses={Math.abs(summary.monthlyExpenses)} 
                                investments={investmentAmount} 
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                             <QuickActions />
                        </motion.div>
                    </div>
                </div>

                {/* ROW 3: Secondary Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div variants={itemVariants}>
                        <UpcomingPayments />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <RecentTransactionsList transactions={transactions} />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                         {firstGoal ? (
                            <div className="card h-full flex flex-col justify-center">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-white">Meta em Foco</h3>
                                    <Target className="w-5 h-5 text-cyan-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-4">{firstGoal.name}</h2>
                                <p className="text-sm text-gray-400 mb-2 flex justify-between">
                                    <span>Progresso</span>
                                    <span>{((firstGoal.current_amount / firstGoal.target_amount) * 100).toFixed(0)}%</span>
                                </p>
                                <ProgressBar percentage={(firstGoal.current_amount / firstGoal.target_amount) * 100} color="primary" />
                                <p className="text-xs text-gray-500 mt-4 text-right">
                                    {formatCurrencyBRL(firstGoal.current_amount)} de {formatCurrencyBRL(firstGoal.target_amount)}
                                </p>
                            </div>
                        ) : (
                            <div className="card h-full flex flex-col items-center justify-center text-center p-6 border-dashed border-gray-700">
                                <Target className="w-12 h-12 text-gray-600 mb-3" />
                                <h3 className="text-white font-semibold">Sem Metas Ativas</h3>
                                <Button onClick={() => openDialog('add-goal')} variant="secondary" size="sm" className="mt-4">
                                    Definir Meta
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </div>
                
                <div className="mt-6">
                   <ProactiveInsightCard setCurrentView={setCurrentView} />
                </div>
            </motion.div>
        </>
    );
};