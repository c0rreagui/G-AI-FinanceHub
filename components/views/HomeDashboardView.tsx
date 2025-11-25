import React, { useMemo } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { HomeIcon, Target, Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, Calendar } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { QuickActions } from '../ui/QuickActions';
import { GoalStatus, TransactionType, ViewType } from '../../types';
import { UpcomingPayments } from '../ui/UpcomingPayments';
import { HomeDashboardSkeleton } from './skeletons/HomeDashboardSkeleton';
import { UserProfileCard } from '../ui/UserProfileCard';
import { motion } from 'framer-motion';
import { MonthlySummaryChart } from '../ui/charts/MonthlySummaryChart';
import { ProactiveInsightCard } from '../ui/ProactiveInsightCard';
import { formatCurrencyBRL } from '../../utils/formatters';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { useDialog } from '../../hooks/useDialog';
import { WealthFunnelChart } from '../ui/charts/WealthFunnelChart';

interface HomeDashboardViewProps {
    setCurrentView: (view: ViewType) => void;
}

// Mini-widget para transações recentes
const RecentTransactionsWidget: React.FC<{ transactions: any[] }> = ({ transactions }) => (
    <div className="card h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Últimas</h3>
        </div>
        <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3 pr-1">
            {transactions.slice(0, 6).map(tx => (
                <div key={tx.id} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                            <tx.category.icon className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-slate-200 truncate w-24 sm:w-auto">{tx.description}</p>
                            <p className="text-[10px] text-slate-500">{new Date(tx.date).toLocaleDateString('pt-BR', {day:'2-digit', month:'short'})}</p>
                        </div>
                    </div>
                    <span className={`text-sm font-mono font-medium ${tx.type === 'despesa' ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {tx.type === 'despesa' ? '-' : '+'} {formatCurrencyBRL(Math.abs(tx.amount))}
                    </span>
                </div>
            ))}
             {transactions.length === 0 && <p className="text-xs text-slate-600 text-center mt-10">Sem atividade recente.</p>}
        </div>
    </div>
);

// Mini-widget KPI
const KPIWidget: React.FC<{ title: string, value: number, icon: any, trend?: string, colorClass: string }> = ({ title, value, icon: Icon, colorClass }) => (
    <div className="card flex flex-col justify-between relative overflow-hidden group">
        <div className={`absolute right-0 top-0 p-24 opacity-5 blur-3xl rounded-full -mr-10 -mt-10 transition-opacity group-hover:opacity-10 ${colorClass.replace('text-', 'bg-')}`}></div>
        <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Icon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
        </div>
        <div className="relative z-10">
            <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${colorClass}`}>
                {formatCurrencyBRL(value)}
            </span>
        </div>
    </div>
);

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({ setCurrentView }) => {
    const { summary, goals, monthlyChartData, loading, transactions } = useDashboardData();
    const { openDialog } = useDialog();

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } };

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
            <PageHeader icon={HomeIcon} title="Painel de Controle" breadcrumbs={['FinanceHub', 'Visão Geral']} />
            
            <motion.div 
                className="flex-grow overflow-y-auto pr-2 pb-20 custom-scrollbar"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* BENTO GRID LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1600px] mx-auto">
                    
                    {/* 1. PROFILE & GAMIFICATION (Top Left) */}
                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-1">
                        <UserProfileCard />
                    </motion.div>

                    {/* 2. KPIs (Top Row) */}
                    <motion.div variants={itemVariants} className="col-span-1">
                        <KPIWidget title="Saldo Atual" value={summary.totalBalance} icon={Wallet} colorClass="text-white" />
                    </motion.div>
                    <motion.div variants={itemVariants} className="col-span-1">
                        <KPIWidget title="Entradas" value={summary.monthlyIncome} icon={ArrowUpRight} colorClass="text-emerald-400" />
                    </motion.div>
                    <motion.div variants={itemVariants} className="col-span-1">
                        <KPIWidget title="Saídas" value={Math.abs(summary.monthlyExpenses)} icon={ArrowDownLeft} colorClass="text-rose-400" />
                    </motion.div>

                    {/* 3. MAIN CHART (Big Block - Middle Left) */}
                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 row-span-2 min-h-[400px]">
                        <MonthlySummaryChart data={monthlyChartData} />
                    </motion.div>

                    {/* 4. FUNNEL & GOAL (Side Column - Middle Right) */}
                    <motion.div variants={itemVariants} className="col-span-1 lg:col-span-1 row-span-1">
                         <WealthFunnelChart 
                            income={summary.monthlyIncome} 
                            expenses={Math.abs(summary.monthlyExpenses)} 
                            investments={investmentAmount} 
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} className="col-span-1 lg:col-span-1 row-span-1">
                         {firstGoal ? (
                            <div className="card h-full flex flex-col justify-center relative overflow-hidden">
                                {/* Background Decor */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                                
                                <div className="flex items-center justify-between mb-3 relative z-10">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Foco Principal</h3>
                                    <Target className="w-4 h-4 text-cyan-400" />
                                </div>
                                <h2 className="text-lg font-bold text-white mb-4 truncate relative z-10">{firstGoal.name}</h2>
                                <div className="relative z-10">
                                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                                        <span>{((firstGoal.current_amount / firstGoal.target_amount) * 100).toFixed(0)}%</span>
                                        <span>{formatCurrencyBRL(firstGoal.target_amount)}</span>
                                    </div>
                                    <ProgressBar percentage={(firstGoal.current_amount / firstGoal.target_amount) * 100} color="primary" />
                                </div>
                                <Button onClick={() => openDialog('add-value-to-goal', { goal: firstGoal })} size="sm" className="mt-4 w-full relative z-10">
                                    Aportar
                                </Button>
                            </div>
                        ) : (
                            <div className="card h-full flex flex-col items-center justify-center text-center p-6 border-dashed border-white/10">
                                <Target className="w-10 h-10 text-slate-600 mb-2" />
                                <p className="text-sm text-slate-500 mb-3">Sem meta ativa</p>
                                <Button onClick={() => openDialog('add-goal')} variant="secondary" size="sm">Nova Meta</Button>
                            </div>
                        )}
                    </motion.div>

                    {/* 5. BOTTOM ROW: Insights, Quick Actions, Recent */}
                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-1">
                        <QuickActions />
                        <div className="mt-4">
                            <ProactiveInsightCard setCurrentView={setCurrentView} />
                        </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-1 lg:col-span-1">
                        <UpcomingPayments />
                    </motion.div>

                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-1 lg:col-span-2">
                        <RecentTransactionsWidget transactions={transactions} />
                    </motion.div>

                </div>
            </motion.div>
        </>
    );
};