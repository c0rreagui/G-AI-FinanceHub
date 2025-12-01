import React, { useMemo, useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, Reorder } from 'framer-motion';
import { DailyTipCard } from '../dashboard/DailyTipCard';
import { HealthScoreGauge } from '../dashboard/HealthScoreGauge';
import { BalanceCard } from '../dashboard/BalanceCard';
import { MonthlySummaryChart } from '../ui/charts/MonthlySummaryChart';
import { WealthFunnelChart } from '../ui/charts/WealthFunnelChart';
import { FinancialHeatMap } from '../ui/charts/FinancialHeatMap';
import { QuickActions } from '../ui/QuickActions';
import { MonthlyChallengesCard } from '../dashboard/MonthlyChallengesCard';
import { TransactionRow } from '../dashboard/TransactionRow';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { PrivacyMask } from '../ui/PrivacyMask';
import { formatCurrencyBRL } from '../../utils/formatters';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';
import { Text, Heading } from '../ui/typography';
import { ProgressBar } from '../ui/ProgressBar';
import { Flex } from '../ui/Flex';
import { AnimatedCurrency } from '../ui/AnimatedCurrency';
import { TransactionType } from '../../types';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useDialog } from '../../hooks/useDialog';
import { useLayout, WidgetId } from '../../hooks/useLayout';
import { 
    Sun, Moon, CloudRain, Bell, Settings, TrendingUp, 
    ArrowUpRight, ArrowDownLeft, Target, Info, LayoutGrid, RotateCcw 
} from '../Icons';

import { useAuth } from '../../hooks/useAuth';

interface HomeDashboardViewProps {
    setCurrentView: (view: any) => void;
}

// --- Micro-Components ---

const TypingEffect: React.FC<{ text: string }> = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 50);
        return () => clearInterval(timer);
    }, [text]);

    return <span>{displayedText}</span>;
};

const CountUp: React.FC<{ value: number, duration?: number }> = ({ value, duration = 2 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        const totalFrames = Math.round(duration * 60);
        const easeOutQuad = (t: number) => t * (2 - t);
        let frame = 0;

        const counter = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            setCount(start + (end - start) * progress);

            if (frame === totalFrames) {
                clearInterval(counter);
            }
        }, 1000 / 60);

        return () => clearInterval(counter);
    }, [value, duration]);

    return <>{formatCurrencyBRL(count)}</>;
};

const GreetingHeader: React.FC<{ user: any }> = ({ user }) => {
    const [greeting, setGreeting] = useState('');
    const [icon, setIcon] = useState(<Sun className="w-6 h-6 text-yellow-400" />);
    const today = new Date();
    const dateStr = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Bom dia');
            setIcon(<Sun className="w-6 h-6 text-yellow-400 animate-spin-slow" />);
        } else if (hour < 18) {
            setGreeting('Boa tarde');
            setIcon(<Sun className="w-6 h-6 text-orange-400" />);
        } else {
            setGreeting('Boa noite');
            setIcon(<Moon className="w-6 h-6 text-indigo-400" />);
        }
    }, []);

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px] group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                             {/* Placeholder Avatar */}
                             <span className="text-xl font-bold text-white">
                                {user?.name?.charAt(0) || 'D'}
                             </span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-black rounded-full"></div>
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                        <TypingEffect text={`${greeting}, ${user?.name || 'Dev'}!`} /> {icon}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                         <span className="capitalize">{dateStr}</span>
                         <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                         <span className="flex items-center gap-1">
                            <CloudRain className="w-3 h-3 text-blue-400" /> 24°C
                         </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Notificações</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:rotate-90 transition-transform duration-500">
                    <Settings className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};

const KPICard: React.FC<{ title: string; value: number; trend: number; icon: any; color: string }> = ({ title, value, trend, icon: Icon, color }) => (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group overflow-hidden relative">
        <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:opacity-10 transition-opacity`} />
        <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl ${color} bg-opacity-10`}>
                    <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
                </div>
                {trend !== 0 && (
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">{title}</p>
            <PrivacyMask>
                <h3 className="text-2xl font-bold text-white font-mono tracking-tight">
                    <CountUp value={value} />
                </h3>
            </PrivacyMask>

            {/* Sparkline Mock */}
            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden flex items-end gap-[1px] opacity-50">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-full rounded-t-sm ${color.replace('bg-', 'bg-')}`}
                        style={{ height: `${Math.random() * 100}%`, opacity: 0.3 + (i/20)*0.7 }}
                    />
                ))}
            </div>
        </CardContent>
    </Card>
);

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({ setCurrentView }) => {
    const { user } = useAuth();
    const { summary, monthlyChartData, transactions, loading, goals, savingsSuggestion, dueSoonBills, healthScore } = useDashboardData();
    const { openDialog } = useDialog();
    const { layout, setLayout, isEditMode, toggleEditMode, resetLayout } = useLayout();
    const { greetingName, zenMode, density, hiddenModules } = useTheme();
    const firstGoal = goals[0];

    const [showSavingsSuggestion, setShowSavingsSuggestion] = useState(true);
    const [showDueBills, setShowDueBills] = useState(true);

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Density Logic
    const gridGap = {
        compact: 'gap-2',
        comfortable: 'gap-4',
        spacious: 'gap-8'
    }[density];

    const containerSpacing = {
        compact: 'space-y-3',
        comfortable: 'space-y-6',
        spacious: 'space-y-10'
    }[density];

    // Konami Code Easter Egg
    useEffect(() => {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;

        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    alert('🚀 GOD MODE ENABLED (Just kidding, but nice try!)');
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, []);

    const renderWidget = (widgetId: WidgetId) => {
        switch (widgetId) {
            case 'balance':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                        <BalanceCard balance={summary.totalBalance} className="md:col-span-1 h-full" />
                        <KPICard
                            title="Receitas (Mês)"
                            value={summary.monthlyIncome}
                            trend={12}
                            icon={ArrowUpRight}
                            color="bg-emerald-500"
                        />
                        <KPICard
                            title="Despesas (Mês)"
                            value={Math.abs(summary.monthlyExpenses)}
                            trend={-5}
                            icon={ArrowDownLeft}
                            color="bg-rose-500"
                        />
                    </div>
                );
            case 'charts':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        <div className="lg:col-span-2 h-[350px]">
                            <MonthlySummaryChart data={monthlyChartData} />
                        </div>
                        <div className="h-[350px]">
                            <FinancialHeatMap transactions={transactions} />
                        </div>
                    </div>
                );
            case 'health':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        <HealthScoreGauge score={healthScore} />
                        <MonthlyChallengesCard />
                    </div>
                );
            case 'quick-actions':
                 return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                             <QuickActions />
                        </div>
                        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                                    Últimas Transações
                                    <Button variant="link" size="sm" className="h-auto p-0 text-cyan-400" onClick={() => setCurrentView('transactions')}>
                                        Ver todas
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-white/5">
                                    {transactions.slice(0, 4).map(tx => (
                                        <TransactionRow key={tx.id} tx={tx} />
                                    ))}
                                    {transactions.length === 0 && (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            Nenhuma transação recente.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                 );
            case 'daily_tip':
                return !zenMode && !hiddenModules.includes('tips') ? <DailyTipCard /> : null;
            case 'monthly_chart':
                return !zenMode && !hiddenModules.includes('chart') ? (
                    <div className="h-[320px] md:h-auto" id="monthly-chart">
                        <MonthlySummaryChart data={monthlyChartData} />
                    </div>
                ) : null;
            case 'wealth_health':
                return !zenMode && !hiddenModules.includes('investments') ? (
                    <div className="flex flex-col gap-4 h-full">
                        <div className="h-[200px]">
                            <HealthScoreGauge score={healthScore} />
                        </div>
                        <div className="h-[320px] md:h-auto flex-1">
                            <FinancialHeatMap transactions={transactions} />
                        </div>
                    </div>
                ) : null;
            case 'quick_actions_goals':
                return (
                    <div className={containerSpacing}>
                        <div id="quick-actions">
                            <QuickActions />
                        </div>
                        {!hiddenModules.includes('goals') && (
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
                        )}
                    </div>
                );
            case 'challenges':
                return !hiddenModules.includes('challenges') ? <MonthlyChallengesCard /> : null;
            case 'recent_transactions':
                return (
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
                );
            default:
                return null;
        }
    };

    return (
        // @ts-ignore
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            {...{ className: `p-4 md:p-8 max-w-7xl mx-auto ${containerSpacing}` } as any}
        >
            <Flex justify="between" align="center" className="mb-8">
                <div className="w-full">
                    <GreetingHeader user={user} />
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant={isEditMode ? "default" : "ghost"} 
                        size="sm" 
                        onClick={toggleEditMode}
                        className={isEditMode ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}
                    >
                        <LayoutGrid className="w-4 h-4 mr-2" />
                        {isEditMode ? 'Salvar Layout' : 'Personalizar'}
                    </Button>
                    {isEditMode && (
                        <Button variant="outline" size="sm" onClick={resetLayout}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restaurar
                        </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => openDialog('add-transaction')}>
                        Nova Transação
                    </Button>
                </div>
            </Flex>

            {/* ALERTS SECTION */}
            <div className="space-y-4">
                {showDueBills && dueSoonBills.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start justify-between">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-red-400 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-red-400">Contas a Vencer</h4>
                                <p className="text-sm text-red-300/80 mt-1">
                                    Você tem {dueSoonBills.length} conta(s) vencendo nos próximos 3 dias.
                                    <br />
                                    <span className="text-xs opacity-70">
                                        {dueSoonBills.map(b => `${b.description} (${formatCurrencyBRL(Math.abs(b.amount))})`).join(', ')}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setShowDueBills(false)} className="text-red-400 hover:text-red-300">
                            <span className="sr-only">Fechar</span>
                            ×
                        </button>
                    </div>
                )}

                {showSavingsSuggestion && savingsSuggestion && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start justify-between">
                        <div className="flex gap-3">
                            <Target className="w-5 h-5 text-blue-400 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-blue-400">Sugestão de Economia</h4>
                                <p className="text-sm text-blue-300/80 mt-1">{savingsSuggestion}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowSavingsSuggestion(false)} className="text-blue-400 hover:text-blue-300">
                            <span className="sr-only">Fechar</span>
                            ×
                        </button>
                    </div>
                )}
            </div>

            {/* DRAGGABLE GRID */}
            <Reorder.Group 
                axis="y" 
                values={layout} 
                onReorder={setLayout} 
                {...({ className: `grid grid-cols-1 md:grid-cols-4 ${gridGap}` } as any)}
            >
                {layout.map((widget) => {
                    const content = renderWidget(widget.id);
                    if (!content) return null;

                    return (
                        <Reorder.Item 
                            key={widget.id} 
                            value={widget}
                            drag={isEditMode}
                            // @ts-ignore
                            className={`
                                ${widget.colSpan.md === 4 ? 'md:col-span-4' : widget.colSpan.md === 2 ? 'md:col-span-2' : 'md:col-span-1'}
                                ${widget.colSpan.lg === 4 ? 'lg:col-span-4' : widget.colSpan.lg === 2 ? 'lg:col-span-2' : widget.colSpan.lg === 3 ? 'lg:col-span-3' : 'lg:col-span-1'}
                                ${isEditMode ? 'cursor-move ring-2 ring-yellow-500/50 rounded-lg bg-card/50' : ''}
                            `}
                        >
                            {content}
                        </Reorder.Item>
                    );
                })}
            </Reorder.Group>
        </motion.div>
    );
};