import React, { useMemo } from 'react';
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
import { PrivacyMask } from '../ui/PrivacyMask';
import { AnimatedCurrency } from '../ui/AnimatedCurrency';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../ui/Tooltip';
import { Grid } from '../ui/Grid';
import { Flex } from '../ui/Flex';
import { Text, Heading } from '../ui/typography';
import { ProgressBar } from '../ui/ProgressBar';
import { ArrowUpRight, ArrowDownLeft, Info, Target, LayoutGrid, RotateCcw } from '../Icons';
import { formatCurrencyBRL } from '../../utils/formatters';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useDialog } from '../../hooks/useDialog';
import { ViewType, TransactionType } from '../../types';
import { useLayout, WidgetId } from '../../hooks/useLayout';

interface HomeDashboardViewProps {
    setCurrentView: (view: ViewType) => void;
}

const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({ setCurrentView }) => {
    const { summary, monthlyChartData, transactions, loading, goals, savingsSuggestion, dueSoonBills, healthScore } = useDashboardData();
    const { openDialog } = useDialog();
    const { layout, setLayout, isEditMode, toggleEditMode, resetLayout } = useLayout();
    const firstGoal = goals[0];
    
    // Calculate investment amount
    const investmentAmount = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return transactions
            .filter(t => {
                const tDate = new Date(t.date);
                const catName = (t.category?.name || '').toLowerCase();
                const isInvestment = ['investimento', 'aporte', 'aplicação', 'poupança', 'cdb', 'tesouro'].some(k => catName.includes(k));
                
                return t.type === TransactionType.DESPESA && 
                       isInvestment &&
                       tDate.getMonth() === currentMonth &&
                       tDate.getFullYear() === currentYear;
            })
            .reduce((acc, t) => acc + Math.abs(t.amount), 0);
    }, [transactions]);


    const { greetingName, zenMode, density, hiddenModules } = useTheme();

    // Greeting Logic
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        const name = greetingName || 'Família';
        if (hour < 12) return `Bom dia, ${name}!`;
        if (hour < 18) return `Boa tarde, ${name}!`;
        return `Boa noite, ${name}!`;
    }, [greetingName]);

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

    const [showSavingsSuggestion, setShowSavingsSuggestion] = React.useState(true);
    const [showDueBills, setShowDueBills] = React.useState(true);

    const renderWidget = (id: WidgetId) => {
        switch (id) {
            case 'daily_tip':
                return !zenMode && !hiddenModules.includes('tips') ? <DailyTipCard /> : null;
            case 'kpi_overview':
                return (
                    <div className={`grid grid-cols-1 gap-4`}>
                        <div id="balance-card">
                            <BalanceCard balance={summary.totalBalance} />
                        </div>
                        {!zenMode && (
                            <Grid cols={2} gap={density === 'compact' ? 'sm' : density === 'spacious' ? 'lg' : 'md'}>
                                <Card className="flex flex-col justify-center">
                                    <CardContent className="p-4">
                                        <div className="text-success mb-1"><ArrowUpRight className="w-5 h-5"/></div>
                                        <div className="flex items-center gap-1 mb-1">
                                            <Text size="xs" weight="bold" variant="muted" className="uppercase">Entradas</Text>
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
                        )}
                    </div>
                );
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
                <div>
                    <Heading size="h2" className="mb-1">{greeting}</Heading>
                    <Text variant="muted">Visão geral das suas finanças hoje.</Text>
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