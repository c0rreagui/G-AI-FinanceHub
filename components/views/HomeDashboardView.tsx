import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, Reorder } from 'framer-motion';
import { ProactiveInsightCard } from '../ui/ProactiveInsightCard';
import { MonthlySummaryChart } from '../ui/charts/MonthlySummaryChart';
import { FinancialHeatMap } from '../ui/charts/FinancialHeatMap';
import { HealthScoreGauge } from '../dashboard/HealthScoreGauge';
import { MonthlyChallengesCard } from '../dashboard/MonthlyChallengesCard';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useDialog } from '../../hooks/useDialog';
import { useToast } from '../../hooks/useToast';
import { useLayout, WidgetId } from '../../hooks/useLayout';
import { LayoutGrid, RotateCcw, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatters';

// Micro-components
import { GreetingHeader } from '../dashboard/GreetingHeader';
import { DashboardOnboardingTour } from '../onboarding/DashboardOnboardingTour';

// Widgets
import { BalanceWidget } from '../dashboard/widgets/BalanceWidget';
import { ChartsWidget } from '../dashboard/widgets/ChartsWidget';
import { HealthWidget } from '../dashboard/widgets/HealthWidget';
import { QuickActionsWidget } from '../dashboard/widgets/QuickActionsWidget';
import { RecentTransactionsWidget } from '../dashboard/widgets/RecentTransactionsWidget';
import { GoalsWidget } from '../dashboard/widgets/GoalsWidget';
import { BudgetWidget } from '../dashboard/widgets/BudgetWidget';
import { Skeleton } from '../ui/Skeleton';

import { ViewType } from '../../types';

interface HomeDashboardViewProps {
    setCurrentView: (view: ViewType) => void;
    onNotificationClick?: () => void;
    unreadCount?: number;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({ setCurrentView, onNotificationClick, unreadCount }) => {
    const { user } = useAuth();
    const { summary, monthlyChartData, transactions, goals, budgets, categories, savingsSuggestion, dueSoonBills, healthScore, loading } = useDashboardData();
    const { openDialog } = useDialog();
    const { showToast } = useToast();
    const { layout, setLayout, isEditMode, toggleEditMode, resetLayout } = useLayout();
    const { zenMode, density, hiddenModules } = useTheme();
    const firstGoal = goals[0];

    const [showSavingsSuggestion, setShowSavingsSuggestion] = useState(true);
    const [showDueBills, setShowDueBills] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

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

    // Pull to Refresh Simulation
    const handlePullToRefresh = async () => {
        if (globalThis.scrollY === 0) {
            setIsRefreshing(true);
            // Simulate data fetch
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsRefreshing(false);
            showToast('Dados atualizados!', { type: 'success' });
        }
    };

    // Konami Code Easter Egg
    useEffect(() => {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;

        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    // Trigger a fun toast instead of alert
                    showToast('🚀 GOD MODE ENABLED', {
                        description: 'Just kidding, but nice try! Have some confetti!',
                        type: 'success'
                    });
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        };

        globalThis.addEventListener('keydown', handleKeydown);
        // Add touch listener for pull to refresh simulation on mobile
        globalThis.addEventListener('touchstart', handlePullToRefresh); // Simplified for demo

        return () => {
            globalThis.removeEventListener('keydown', handleKeydown);
            globalThis.removeEventListener('touchstart', handlePullToRefresh);
        };
    }, []);

    const renderWidget = (widgetId: WidgetId) => {
        if (loading) {
            switch (widgetId) {
                case 'balance':
                    return <Skeleton className="h-[140px] w-full rounded-xl bg-card/50" />;
                case 'charts':
                    return <Skeleton className="h-[300px] w-full rounded-xl bg-card/50" />;
                case 'health':
                    return (
                        <div className="flex gap-4 h-full">
                            <Skeleton className="h-[300px] w-full rounded-xl bg-card/50" />
                        </div>
                    );
                case 'quick-actions':
                    return <Skeleton className="h-[100px] w-full rounded-xl bg-card/50" />;
                case 'daily_tip':
                    return !zenMode && !hiddenModules.includes('tips') ? <Skeleton className="h-[160px] w-full rounded-xl bg-card/50" /> : null;
                case 'monthly_chart':
                    return !zenMode && !hiddenModules.includes('chart') ? <Skeleton className="h-[320px] w-full rounded-xl bg-card/50" /> : null;
                case 'wealth_health':
                    return !zenMode && !hiddenModules.includes('investments') ? (
                        <div className="flex flex-col gap-4 h-full">
                            <Skeleton className="h-[200px] w-full rounded-xl bg-card/50" />
                            <Skeleton className="h-[320px] w-full rounded-xl bg-card/50" />
                        </div>
                    ) : null;
                case 'quick_actions_goals':
                    return <Skeleton className="h-[300px] w-full rounded-xl bg-card/50" />;
                case 'challenges':
                    return !hiddenModules.includes('challenges') ? <Skeleton className="h-[200px] w-full rounded-xl bg-card/50" /> : null;
                case 'recent_transactions':
                    return <Skeleton className="h-[400px] w-full rounded-xl bg-card/50" />;
                case 'budget_tracker':
                    return <Skeleton className="h-[250px] w-full rounded-xl bg-card/50" />;
                default:
                    return null;
            }
        }

        switch (widgetId) {
            case 'balance':
                return <div id="dashboard-balance-step"><BalanceWidget summary={summary} /></div>;
            case 'charts':
                return <div id="dashboard-charts-step"><ChartsWidget monthlyChartData={monthlyChartData} transactions={transactions} /></div>;
            case 'health':
                return <div id="dashboard-health-step"><HealthWidget healthScore={healthScore} /></div>;
            case 'quick-actions':
                return <QuickActionsWidget transactions={transactions} setCurrentView={setCurrentView} />;
            case 'daily_tip':
                return null; // Movido para notificações
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
                    <GoalsWidget
                        hiddenModules={hiddenModules}
                        goals={goals}
                        setCurrentView={setCurrentView}
                        openDialog={openDialog}
                        containerSpacing={containerSpacing}
                    />
                );
            case 'challenges':
                return !hiddenModules.includes('challenges') ? <MonthlyChallengesCard /> : null;
            case 'recent_transactions':
                return <div id="dashboard-recent-step"><RecentTransactionsWidget transactions={transactions} setCurrentView={setCurrentView} /></div>;
            case 'budget_tracker':
                return <div id="dashboard-budget-step"><BudgetWidget /></div>;
            default:
                return null;
        }
    };

    // Cast framer-motion components to any to avoid strict type issues with custom props
    const MotionDiv = motion.div as any;
    const ReorderGroup = Reorder.Group as any;

    return (
        <MotionDiv
            initial="hidden"
            animate="visible"
            variants={variants}
            className={`p-4 md:p-6 lg:p-8 max-w-7xl mx-auto ${containerSpacing}`}
        >
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <GreetingHeader
                    user={user}
                    setCurrentView={setCurrentView}
                    onNotificationClick={onNotificationClick}
                    unreadCount={unreadCount}
                />
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant={isEditMode ? "default" : "outline"}
                        size="sm"
                        onClick={toggleEditMode}
                        className={isEditMode ? "bg-primary hover:bg-primary/90" : ""}
                    >
                        <LayoutGrid className="w-4 h-4 mr-2" />
                        {isEditMode ? 'Salvar' : 'Personalizar'}
                    </Button>
                    {isEditMode && (
                        <Button variant="ghost" size="sm" onClick={resetLayout}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restaurar
                        </Button>
                    )}
                    <Button id="dashboard-new-transaction-step" variant="default" size="sm" onClick={() => openDialog('add-transaction')}>
                        + Nova Transação
                    </Button>
                </div>
            </div>

            {/* PROACTIVE INSIGHTS */}
            <div className="mb-4">
                <ProactiveInsightCard setCurrentView={setCurrentView} />
            </div>

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
                                        {dueSoonBills.map(b => `${b.description} (${formatCurrency(Math.abs(b.amount))})`).join(', ')}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setShowDueBills(false)} className="text-red-400 hover:text-red-300" aria-label="Fechar alerta de contas">
                            <span className="sr-only">Fechar</span>
                            ×
                        </button>
                    </div>
                )}

                {/* Sugestões de economia movidas para notificações */}

                {/* Budget Alerts */}
                {budgets.length > 0 && (() => {
                    const now = new Date();
                    const currentMonth = now.getMonth();
                    const currentYear = now.getFullYear();
                    const currentMonthExpenses = transactions.filter(t =>
                        t.type === 'despesa' &&
                        new Date(t.date).getMonth() === currentMonth &&
                        new Date(t.date).getFullYear() === currentYear &&
                        !t.deleted_at
                    );
                    const spendingByCategory = currentMonthExpenses.reduce((acc, t) => {
                        acc[t.category.id] = (acc[t.category.id] || 0) + Math.abs(t.amount);
                        return acc;
                    }, {} as Record<string, number>);

                    const criticalBudgets = budgets.filter(b => {
                        const spent = spendingByCategory[b.category_id] || 0;
                        return spent >= b.amount * 0.9;
                    });

                    if (criticalBudgets.length === 0) return null;

                    return (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start justify-between">
                            <div className="flex gap-3">
                                <Info className="w-5 h-5 text-amber-400 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-amber-400">Atenção ao Orçamento</h4>
                                    <p className="text-sm text-amber-300/80 mt-1">
                                        Você atingiu 90% ou mais do limite em {criticalBudgets.length} categorias:
                                        <br />
                                        <span className="text-xs opacity-70">
                                            {criticalBudgets.map(b => {
                                                const catName = categories.find(c => c.id === b.category_id)?.name || 'Categoria';
                                                return `${catName}`;
                                            }).join(', ')}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            {/* Dismiss button logic could be added here state-wise if needed */}
                        </div>
                    );
                })()}
            </div>

            {/* DRAGGABLE GRID */}
            <ReorderGroup
                axis="y"
                values={layout}
                onReorder={setLayout}
                className={`grid grid-cols-1 md:grid-cols-3 ${gridGap}`}
            >
                {layout.map((widget) => {
                    const content = renderWidget(widget.id);
                    if (!content) return null;

                    return (
                        <Reorder.Item
                            key={widget.id}
                            value={widget}
                            drag={isEditMode}
                            className={`
                                ${(() => {
                                    if (widget.colSpan.md === 4) return 'md:col-span-4';
                                    if (widget.colSpan.md === 2) return 'md:col-span-2';
                                    return 'md:col-span-1';
                                })()}
                                ${(() => {
                                    if (widget.colSpan.lg === 4) return 'lg:col-span-4';
                                    if (widget.colSpan.lg === 2) return 'lg:col-span-2';
                                    if (widget.colSpan.lg === 3) return 'lg:col-span-3';
                                    return 'lg:col-span-1';
                                })()}
                                ${isEditMode ? 'cursor-move ring-2 ring-yellow-500/50 rounded-lg bg-card/50' : ''}
                            `}
                        >
                            {content}
                        </Reorder.Item>
                    );
                })}
            </ReorderGroup>
            {/* ONBOARDING TOUR */}
            <DashboardOnboardingTour />
        </MotionDiv>
    );
};