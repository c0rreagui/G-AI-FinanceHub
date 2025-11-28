import React, { useMemo } from 'react';
import { Target, ArrowUpRight, ArrowDownLeft, Zap } from '../Icons';
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
import { Grid, Flex, Box } from '../ui/layout';
import { Heading, Text } from '../ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { BalanceCard } from '../dashboard/BalanceCard';
import { Avatar, AvatarFallback } from '../ui/Avatar';

interface HomeDashboardViewProps {
    setCurrentView: (view: ViewType) => void;
}

const TransactionRow: React.FC<{ tx: any }> = ({ tx }) => (
    <Flex align="center" justify="between" className="py-3 border-b border-border/50 last:border-0 hover:bg-muted/50 px-2 -mx-2 rounded-lg transition-colors">
        <Flex align="center" gap="sm">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-lg border border-white/10">
                <tx.category.icon className="w-5 h-5" style={{ color: tx.category.color }} />
            </div>
            <Box>
                <Text weight="medium" className="truncate max-w-[120px] block">{tx.description}</Text>
                <Text size="xs" variant="muted">{new Date(tx.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})}</Text>
            </Box>
        </Flex>
        <span className={`text-sm font-mono font-bold ${tx.type === 'despesa' ? 'text-destructive' : 'text-success'}`}>
            {tx.type === 'despesa' ? '-' : '+'} {formatCurrencyBRL(Math.abs(tx.amount))}
        </span>
    </Flex>
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
            className="flex flex-col h-full overflow-y-auto no-scrollbar pb-24 space-y-6"
        >
            {/* Header com Saudação Dinâmica */}
            <Flex justify="between" align="end" className="px-1">
                <Box>
                    <Text size="sm" weight="medium" variant="muted">Bem-vindo de volta</Text>
                    <Heading size="h2">Visão Geral</Heading>
                </Box>
                <Button onClick={() => openDialog('add-transaction')} className="shadow-cyan-500/20">
                    <Zap className="w-4 h-4 mr-2" /> Novo Lançamento
                </Button>
            </Flex>

            {/* BENTO GRID PRINCIPAL */}
            <Grid cols={1} className="md:grid-cols-4 gap-4">
                
                {/* BLOCO 1: KPIs (Coluna Esquerda) */}
                <motion.div variants={variants} className="md:col-span-2 lg:col-span-1 grid grid-cols-1 gap-4">
                    <BalanceCard balance={summary.totalBalance} />
                    
                    <Grid cols={2} gap="md">
                         <Card className="flex flex-col justify-center">
                            <CardContent className="p-4">
                                <div className="text-success mb-1"><ArrowUpRight className="w-5 h-5"/></div>
                                <Text size="xs" weight="bold" variant="muted" className="uppercase">Entradas</Text>
                                <Text size="lg" weight="bold"><AnimatedCurrency value={summary.monthlyIncome}/></Text>
                            </CardContent>
                         </Card>
                         <Card className="flex flex-col justify-center">
                            <CardContent className="p-4">
                                <div className="text-destructive mb-1"><ArrowDownLeft className="w-5 h-5"/></div>
                                <Text size="xs" weight="bold" variant="muted" className="uppercase">Saídas</Text>
                                <Text size="lg" weight="bold"><AnimatedCurrency value={Math.abs(summary.monthlyExpenses)}/></Text>
                            </CardContent>
                         </Card>
                    </Grid>
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
            </Grid>

            {/* GRID SECUNDÁRIO */}
            <Grid cols={1} className="lg:grid-cols-3 gap-4">
                
                {/* Ações Rápidas & Metas */}
                <motion.div variants={variants} className="space-y-4">
                    <QuickActions />
                    {firstGoal ? (
                        <Card className="relative overflow-hidden group cursor-pointer border-none bg-card" onClick={() => setCurrentView('goals')}>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <CardContent className="p-5">
                                <Flex justify="between" align="center" className="mb-3">
                                    <Text size="sm" className="text-purple-300 font-medium">Foco Principal</Text>
                                    <Target className="w-4 h-4 text-purple-400" />
                                </Flex>
                                <Heading size="h4" className="mb-4">{firstGoal.name}</Heading>
                                <ProgressBar percentage={(firstGoal.current_amount / firstGoal.target_amount) * 100} color="primary" />
                                <Flex justify="between" className="mt-2">
                                    <Text size="xs" variant="muted">{formatCurrencyBRL(firstGoal.current_amount)}</Text>
                                    <Text size="xs" variant="muted">{formatCurrencyBRL(firstGoal.target_amount)}</Text>
                                </Flex>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-dashed border-muted-foreground/20 flex flex-col items-center justify-center py-8 bg-transparent">
                            <Text size="sm" variant="muted" className="mb-3">Nenhuma meta definida</Text>
                            <Button size="sm" variant="secondary" onClick={() => openDialog('add-goal')}>Criar Meta</Button>
                        </Card>
                    )}
                </motion.div>

                {/* Transações Recentes */}
                <motion.div variants={variants} className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Últimas Atividades</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setCurrentView('transactions')} className="text-xs text-cyan-400 hover:text-cyan-300 h-8">
                                Ver todas
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {transactions.slice(0, 5).map(tx => (
                                    <TransactionRow key={tx.id} tx={tx} />
                                ))}
                                {transactions.length === 0 && <Text variant="muted" align="center" className="py-4">Sem movimentações recentes.</Text>}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </Grid>
        </motion.div>
    );
};