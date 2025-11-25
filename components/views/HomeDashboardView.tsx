import React, { useMemo } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { HomeIcon, Target, Wallet, ArrowUpRight, ArrowDownLeft, Zap } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { QuickActions } from '../ui/QuickActions';
import { GoalStatus, TransactionType, ViewType } from '../../types';
import { HomeDashboardSkeleton } from './skeletons/HomeDashboardSkeleton';
import { motion } from 'framer-motion';
import { MonthlySummaryChart } from '../ui/charts/MonthlySummaryChart';
import { formatCurrencyBRL } from '../../utils/formatters';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { useDialog } from '../../hooks/useDialog';
import { WealthFunnelChart } from '../ui/charts/WealthFunnelChart';
import { AnimatedCurrency } from '../ui/AnimatedCurrency';

interface HomeDashboardViewProps {
    setCurrentView: (view: ViewType) => void;
}

// --- WIDGETS INTERNOS ---
const KPIBlock: React.FC<{ title: string, value: number, icon: any, color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="card flex flex-col justify-between h-32 group">
        <div className="flex justify-between items-start">
            <span className="text-label">{title}</span>
            <div className={`p-2 rounded-full bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div>
            <div className="text-2xl font-bold text-white tracking-tight tabular-nums">
                <AnimatedCurrency value={value} />
            </div>
        </div>
    </div>
);

const TransactionRow: React.FC<{ tx: any }> = ({ tx }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] px-2 -mx-2 rounded-lg transition-colors">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg border border-white/10">
                <tx.category.icon className="w-5 h-5" style={{ color: tx.category.color }} />
            </div>
            <div>
                <p className="text-sm font-medium text-white truncate max-w-[120px]">{tx.description}</p>
                <p className="text-[10px] text-gray-400">{new Date(tx.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})}</p>
            </div>
        </div>
        <span className={`text-sm font-mono font-bold ${tx.type === 'despesa' ? 'text-[oklch(var(--danger-oklch))]' : 'text-[oklch(var(--success-oklch))]'}`}>
            {tx.type === 'despesa' ? '-' : '+'} {formatCurrencyBRL(Math.abs(tx.amount))}
        </span>
    </div>
);

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({ setCurrentView }) => {
    const { summary, goals, monthlyChartData, loading, transactions } = useDashboardData();
    const { openDialog } = useDialog();

    const firstGoal = useMemo(() => goals.find(g => g.status === GoalStatus.EM_ANDAMENTO), [goals]);

    // Lógica de Investimentos Robusta (Keywords)
    const investmentAmount = useMemo(() => {
        const keywords = ['investimento', 'bolsa', 'cripto', 'b3', 'cdb', 'tesouro', 'selic', 'corretora', 'binance', 'nuinvest'];
        return Math.abs(transactions
            .filter(t => t.type === TransactionType.DESPESA && keywords.some(k => t.category.name.toLowerCase().includes(k) || t.description.toLowerCase().includes(k)))
            .reduce((acc, t) => acc + t.amount, 0));
    }, [transactions]);

    if (loading) return <HomeDashboardSkeleton />;

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="flex flex-col h-full overflow-y-auto no-scrollbar pb-24"
        >
            {/* Header com Saudação Dinâmica */}
            <div className="flex justify-between items-end mb-6 px-1">
                <div>
                    <p className="text-gray-400 text-sm font-medium">Bem-vindo de volta</p>
                    <h1 className="text-3xl font-bold text-white">Visão Geral</h1>
                </div>
                <Button onClick={() => openDialog('add-transaction')} className="shadow-cyan-500/20">
                    <Zap className="w-4 h-4 mr-2" /> Novo Lançamento
                </Button>
            </div>

            {/* BENTO GRID PRINCIPAL */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                
                {/* BLOCO 1: KPIs (Coluna Esquerda) */}
                <motion.div variants={variants} className="md:col-span-2 lg:col-span-1 grid grid-cols-1 gap-4">
                    <div className="card bg-gradient-to-br from-cyan-900/40 to-blue-900/20 !border-cyan-500/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <span className="text-label text-cyan-200">Saldo Total</span>
                        <div className="mt-2 text-balance-lg text-white">
                            <AnimatedCurrency value={summary.totalBalance} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="card !p-4 flex flex-col justify-center">
                            <div className="text-green-400 mb-1"><ArrowUpRight className="w-5 h-5"/></div>
                            <span className="text-[10px] uppercase text-gray-500 font-bold">Entradas</span>
                            <span className="font-bold text-white text-lg"><AnimatedCurrency value={summary.monthlyIncome}/></span>
                         </div>
                         <div className="card !p-4 flex flex-col justify-center">
                            <div className="text-red-400 mb-1"><ArrowDownLeft className="w-5 h-5"/></div>
                            <span className="text-[10px] uppercase text-gray-500 font-bold">Saídas</span>
                            <span className="font-bold text-white text-lg"><AnimatedCurrency value={Math.abs(summary.monthlyExpenses)}/></span>
                         </div>
                    </div>
                </motion.div>

                {/* BLOCO 2: Gráfico Principal (Centro Expandido) */}
                <motion.div variants={variants} className="md:col-span-2 lg:col-span-2 h-[320px] md:h-auto">
                    <MonthlySummaryChart data={monthlyChartData} />
                </motion.div>

                {/* BLOCO 3: Funil (Direita) */}
                <motion.div variants={variants} className="md:col-span-4 lg:col-span-1 h-[320px] md:h-auto">
                    <WealthFunnelChart 
                        income={summary.monthlyIncome} 
                        expenses={Math.abs(summary.monthlyExpenses)} 
                        investments={investmentAmount} 
                    />
                </motion.div>
            </div>

            {/* GRID SECUNDÁRIO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Ações Rápidas & Metas */}
                <motion.div variants={variants} className="space-y-4">
                    <QuickActions />
                    {firstGoal ? (
                        <div className="card relative overflow-hidden group cursor-pointer" onClick={() => setCurrentView('goals')}>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-label text-purple-300">Foco Principal</span>
                                <Target className="w-4 h-4 text-purple-400" />
                            </div>
                            <h3 className="font-bold text-white mb-4">{firstGoal.name}</h3>
                            <ProgressBar percentage={(firstGoal.current_amount / firstGoal.target_amount) * 100} color="primary" />
                            <div className="flex justify-between mt-2 text-xs text-gray-400">
                                <span>{formatCurrencyBRL(firstGoal.current_amount)}</span>
                                <span>{formatCurrencyBRL(firstGoal.target_amount)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="card border-dashed border-gray-700 flex flex-col items-center justify-center py-8">
                            <p className="text-sm text-gray-500 mb-3">Nenhuma meta definida</p>
                            <Button size="sm" variant="secondary" onClick={() => openDialog('add-goal')}>Criar Meta</Button>
                        </div>
                    )}
                </motion.div>

                {/* Transações Recentes */}
                <motion.div variants={variants} className="card lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white">Últimas Atividades</h3>
                        <button onClick={() => setCurrentView('transactions')} className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">Ver todas</button>
                    </div>
                    <div className="space-y-1">
                        {transactions.slice(0, 5).map(tx => (
                            <TransactionRow key={tx.id} tx={tx} />
                        ))}
                        {transactions.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Sem movimentações recentes.</p>}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};