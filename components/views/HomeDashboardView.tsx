import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, Reorder } from 'framer-motion';
import { DailyTipCard } from '../dashboard/DailyTipCard';
import { MonthlySummaryChart } from '../ui/charts/MonthlySummaryChart';
import { FinancialHeatMap } from '../ui/charts/FinancialHeatMap';
import { HealthScoreGauge } from '../dashboard/HealthScoreGauge';
import { MonthlyChallengesCard } from '../dashboard/MonthlyChallengesCard';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useDialog } from '../../hooks/useDialog';
import { useToast } from '../../hooks/useToast';
import { useLayout, WidgetId } from '../../hooks/useLayout';
import { LayoutGrid, RotateCcw, Info, Target } from '../Icons';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrencyBRL } from '../../utils/formatters';

// Micro-components
import { GreetingHeader } from '../dashboard/GreetingHeader';

// Widgets
import { BalanceWidget } from '../dashboard/widgets/BalanceWidget';
import { ChartsWidget } from '../dashboard/widgets/ChartsWidget';
import { HealthWidget } from '../dashboard/widgets/HealthWidget';
import { QuickActionsWidget } from '../dashboard/widgets/QuickActionsWidget';
import { RecentTransactionsWidget } from '../dashboard/widgets/RecentTransactionsWidget';
import { GoalsWidget } from '../dashboard/widgets/GoalsWidget';

import { ViewType } from '../../types';

interface HomeDashboardViewProps {
    setCurrentView: (view: ViewType) => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({ setCurrentView }) => {
    const { user } = useAuth();
    const { summary, monthlyChartData, transactions, goals, savingsSuggestion, dueSoonBills, healthScore } = useDashboardData();
    const { openDialog } = useDialog();
    const { showToast } = useToast();
    const { layout, setLayout, isEditMode, toggleEditMode, resetLayout } = useLayout();
    const { zenMode, density, hiddenModules } = useTheme();
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

        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, []);

    const renderWidget = (widgetId: WidgetId) => {
        switch (widgetId) {
            case 'balance':
                return <BalanceWidget summary={summary} />;
            case 'charts':
                return <ChartsWidget monthlyChartData={monthlyChartData} transactions={transactions} />;
            case 'health':
                return <HealthWidget healthScore={healthScore} />;
            case 'quick-actions':
                return <QuickActionsWidget transactions={transactions} setCurrentView={setCurrentView} />;
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
                    <GoalsWidget 
                        hiddenModules={hiddenModules} 
                        firstGoal={firstGoal} 
                        setCurrentView={setCurrentView} 
                        openDialog={openDialog} 
                        containerSpacing={containerSpacing} 
                    />
                );
            case 'challenges':
                return !hiddenModules.includes('challenges') ? <MonthlyChallengesCard /> : null;
            case 'recent_transactions':
                return <RecentTransactionsWidget transactions={transactions} setCurrentView={setCurrentView} />;
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
            className={`p-4 md:p-8 max-w-7xl mx-auto ${containerSpacing}`}
        >
            <div className="flex justify-between items-center mb-8">
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
                                        {dueSoonBills.map(b => `${b.description} (${formatCurrencyBRL(Math.abs(b.amount))})`).join(', ')}
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

                {showSavingsSuggestion && savingsSuggestion && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start justify-between">
                        <div className="flex gap-3">
                            <Target className="w-5 h-5 text-blue-400 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-blue-400">Sugestão de Economia</h4>
                                <p className="text-sm text-blue-300/80 mt-1">{savingsSuggestion}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowSavingsSuggestion(false)} className="text-blue-400 hover:text-blue-300" aria-label="Fechar sugestão de economia">
                            <span className="sr-only">Fechar</span>
                            ×
                        </button>
                    </div>
                )}
            </div>

            {/* DRAGGABLE GRID */}
            <ReorderGroup 
                axis="y" 
                values={layout} 
                onReorder={setLayout} 
                className={`grid grid-cols-1 md:grid-cols-4 ${gridGap}`}
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
                                ${widget.colSpan.md === 4 ? 'md:col-span-4' : widget.colSpan.md === 2 ? 'md:col-span-2' : 'md:col-span-1'}
                                ${widget.colSpan.lg === 4 ? 'lg:col-span-4' : widget.colSpan.lg === 2 ? 'lg:col-span-2' : widget.colSpan.lg === 3 ? 'lg:col-span-3' : 'lg:col-span-1'}
                                ${isEditMode ? 'cursor-move ring-2 ring-yellow-500/50 rounded-lg bg-card/50' : ''}
                            `}
                        >
                            {content}
                        </Reorder.Item>
                    );
                })}
            </ReorderGroup>
        </MotionDiv>
    );
};