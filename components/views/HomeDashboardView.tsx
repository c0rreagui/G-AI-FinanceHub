import React, { useMemo, useState, useEffect } from 'react';
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
import { TourGuide, TourStep } from '../ui/TourGuide';
import { SalaryCountdown } from '../dashboard/SalaryCountdown';
import { Sun, CloudRain, Cloud } from 'lucide-react';
import { GettingStartedChecklist } from '../dashboard/GettingStartedChecklist';
import { PrivacyToggle, PrivacyMask } from '../ui/PrivacyMask';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';
import { Info } from 'lucide-react';
import { UserLevelBar } from '../dashboard/UserLevelBar';
import { DailyTipCard } from '../dashboard/DailyTipCard';
import { MonthlyChallengesCard } from '../dashboard/MonthlyChallengesCard';

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
            <PrivacyMask>
                {tx.type === 'despesa' ? '-' : '+'} {formatCurrencyBRL(Math.abs(tx.amount))}
            </PrivacyMask>
        </span>
    </Flex>
);

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({ setCurrentView }) => {
    const { summary, goals, monthlyChartData, loading, transactions } = useDashboardData();
    const { openDialog } = useDialog();
    const [showTour, setShowTour] = useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
    const [lastScrollTop, setLastScrollTop] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!scrollRef.current) return;
            const scrollTop = scrollRef.current.scrollTop;
            // Only update if difference is significant to avoid jitter
            if (Math.abs(scrollTop - lastScrollTop) < 5) return;
            
            if (scrollTop > lastScrollTop && scrollTop > 50) {
                setScrollDirection('down');
            } else {
                setScrollDirection('up');
            }
            setLastScrollTop(scrollTop);
        };

        const element = scrollRef.current;
        element?.addEventListener('scroll', handleScroll);
        return () => element?.removeEventListener('scroll', handleScroll);
    }, [lastScrollTop]);

    // Greeting Logic
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia, Família!';
        if (hour < 18) return 'Boa tarde, Família!';
        return 'Boa noite, Família!';
    }, []);

    // Financial Weather Logic
    const financialWeather = useMemo(() => {
        if (summary.monthlyIncome === 0 && summary.monthlyExpenses === 0) return { icon: Cloud, color: 'text-gray-400', label: 'Neutro' };
        const ratio = Math.abs(summary.monthlyExpenses) / (summary.monthlyIncome || 1);
        if (ratio < 0.7) return { icon: Sun, color: 'text-yellow-400', label: 'Ensolarado' }; // Spending < 70% of income
        if (ratio < 0.9) return { icon: Cloud, color: 'text-gray-300', label: 'Nublado' }; // Spending < 90%
        return { icon: CloudRain, color: 'text-blue-400', label: 'Chuvoso' }; // Spending > 90%
    }, [summary]);

    // Check for first visit
    useEffect(() => {
        const hasSeenTour = localStorage.getItem('financehub_tour_seen');
        if (!hasSeenTour) {
            setShowTour(true);
        }
    }, []);

    const handleTourComplete = () => {
        setShowTour(false);
        localStorage.setItem('financehub_tour_seen', 'true');
    };

    const tourSteps: TourStep[] = [
        {
            targetId: 'balance-card',
            title: 'Saldo Total',
            content: 'Aqui você vê o saldo acumulado de todas as suas contas. É o seu termômetro financeiro!',
        },
        {
            targetId: 'quick-actions',
            title: 'Ações Rápidas',
            content: 'Botões práticos para adicionar transações, metas ou dívidas rapidamente.',
        },
        {
            targetId: 'monthly-chart',
            title: 'Resumo Mensal',
            content: 'Acompanhe a evolução das suas receitas e despesas ao longo do mês neste gráfico.',
        },
        {
            targetId: 'goals-section',
            title: 'Foco Principal',
            content: 'Sua meta mais importante aparece aqui para manter você motivado!',
        }
    ];

    const firstGoal = useMemo(() => goals.find(g => g.status === GoalStatus.EM_ANDAMENTO), [goals]);

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
            ref={scrollRef}
            initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            {...({ className: "flex flex-col h-full overflow-y-auto no-scrollbar pb-24 space-y-6 relative" } as any)}
        >
            <TourGuide 
                steps={tourSteps} 
                isOpen={showTour} 
                onClose={() => setShowTour(false)} 
                onComplete={handleTourComplete} 
            />

            {/* Header com Saudação Dinâmica e Clima - Sticky Smart */}
            <div className={`sticky top-0 z-20 transition-transform duration-300 ${scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-transparent h-32 pointer-events-none" />
                <Flex justify="between" align="end" className="px-1 relative z-10 pt-2">
                    <Box>
                        <Flex align="center" gap="sm" className="mb-1">
                            <Text size="sm" weight="medium" variant="muted">{greeting}</Text>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <financialWeather.icon className={`w-4 h-4 ${financialWeather.color}`} />
                                    </TooltipTrigger>
                                    <TooltipContent>Clima Financeiro: {financialWeather.label}</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Flex>
                        <Flex align="center" gap="md">
                            <Heading size="h2">Visão Geral</Heading>
                            <PrivacyToggle />
                            <div className="hidden md:block w-48">
                                <UserLevelBar />
                            </div>
                        </Flex>
                    </Box>
                    <Flex align="center" gap="md">
                        <div className="hidden lg:block w-64">
                            <SalaryCountdown />
                        </div>
                        <Button onClick={() => openDialog('add-transaction')} className="shadow-cyan-500/20">
                            <Zap className="w-4 h-4 mr-2" /> Novo Lançamento
                        </Button>
                    </Flex>
                </Flex>
            </div>

            {/* Checklist de Início */}
            <GettingStartedChecklist />

            {/* BENTO GRID PRINCIPAL */}
            {/* Daily Tip */}
            {/* @ts-ignore */}
            <motion.div variants={variants}>
                <DailyTipCard />
            </motion.div>

            <Grid cols={1} className="md:grid-cols-4 gap-4">
                
                {/* BLOCO 1: KPIs (Coluna Esquerda) */}
                {/* @ts-ignore */}
                <motion.div variants={variants} className="md:col-span-2 lg:col-span-1 grid grid-cols-1 gap-4">
                    <div id="balance-card">
                        <BalanceCard balance={summary.totalBalance} />
                    </div>
                    
                    <Grid cols={2} gap="md">
                         <Card className="flex flex-col justify-center">
                            <CardContent className="p-4">
                                <div className="text-success mb-1"><ArrowUpRight className="w-5 h-5"/></div>
                                <div className="flex items-center gap-1 mb-1">
                                    <Text size="xs" weight="bold" variant="muted" className="uppercase">Entradas</Text>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Info className="w-3 h-3 text-gray-500 hover:text-gray-300" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Soma de todas as suas receitas no mês atual.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="truncate" title={formatCurrencyBRL(summary.monthlyIncome)}>
                                    <Text size="lg" weight="bold" className="truncate">
                                        <PrivacyMask>
                                            <AnimatedCurrency value={summary.monthlyIncome}/>
                                        </PrivacyMask>
                                    </Text>
                                </div>
                            </CardContent>
                         </Card>
                         <Card className="flex flex-col justify-center">
                            <CardContent className="p-4">
                                <div className="text-destructive mb-1"><ArrowDownLeft className="w-5 h-5"/></div>
                                <div className="flex items-center gap-1 mb-1">
                                    <Text size="xs" weight="bold" variant="muted" className="uppercase">Saídas</Text>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Info className="w-3 h-3 text-gray-500 hover:text-gray-300" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Soma de todas as suas despesas no mês atual.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <div className="truncate" title={formatCurrencyBRL(Math.abs(summary.monthlyExpenses))}>
                                    <Text size="lg" weight="bold" className="truncate">
                                        <PrivacyMask>
                                            <AnimatedCurrency value={Math.abs(summary.monthlyExpenses)}/>
                                        </PrivacyMask>
                                    </Text>
                                </div>
                            </CardContent>
                         </Card>
                    </Grid>
                </motion.div>

                {/* BLOCO 2: Gráfico Principal (Centro Expandido) */}
                {/* @ts-ignore */}
                <motion.div variants={variants} className="md:col-span-2 lg:col-span-2 h-[320px] md:h-auto" id="monthly-chart">
                    <MonthlySummaryChart data={monthlyChartData} />
                </motion.div>

                {/* BLOCO 3: Funil (Direita) */}
                {/* @ts-ignore */}
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
                {/* @ts-ignore */}
                <motion.div variants={variants} className="space-y-4">
                    <div id="quick-actions">
                        <QuickActions />
                    </div>
                    <div id="goals-section">
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
                                        <PrivacyMask>
                                            <Text size="xs" variant="muted">{formatCurrencyBRL(firstGoal.current_amount)}</Text>
                                        </PrivacyMask>
                                        <PrivacyMask>
                                            <Text size="xs" variant="muted">{formatCurrencyBRL(firstGoal.target_amount)}</Text>
                                        </PrivacyMask>
                                    </Flex>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-dashed border-muted-foreground/20 flex flex-col items-center justify-center py-8 bg-transparent">
                                <Text size="sm" variant="muted" className="mb-3">Nenhuma meta definida</Text>
                                <Button size="sm" variant="secondary" onClick={() => openDialog('add-goal')}>Criar Meta</Button>
                            </Card>
                        )}
                    </div>
                </motion.div>

                {/* Desafios Mensais */}
                {/* @ts-ignore */}
                <motion.div variants={variants}>
                    <MonthlyChallengesCard />
                </motion.div>

                {/* Transações Recentes */}
                {/* @ts-ignore */}
                <motion.div variants={variants} className="lg:col-span-1">
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