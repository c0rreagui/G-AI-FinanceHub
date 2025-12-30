// @ts-nocheck
import React, { useState } from 'react';
import { ViewType } from '../../types';
import { LayoutDashboard, ArrowLeftRight, PieChart, Target, TrendingDown, Calendar, Wrench, Settings, Users, PiggyBank, Lightbulb, Zap, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useAuth } from '../../hooks/useAuth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';
import { Gamification } from '../ui/Gamification';
import { cn } from '../../utils/utils';

interface SidebarProps {
    currentView: ViewType;
    setCurrentView: (view: ViewType) => void;
}

const navigation = [
    { name: 'Início', view: 'home', icon: LayoutDashboard },
    { name: 'Transações', view: 'transactions', icon: ArrowLeftRight },
    { name: 'Orçamentos', view: 'budgets', icon: PieChart },
    { name: 'Metas', view: 'goals', icon: Target },
    { name: 'Dívidas', view: 'debts', icon: TrendingDown },
    { name: 'Investimentos', view: 'investments', icon: PiggyBank },
    { name: 'Agenda', view: 'scheduling', icon: Calendar },
    { name: 'Insights', view: 'insights', icon: Lightbulb },
    { name: 'Tools', view: 'tools', icon: Wrench },
    { name: 'Família', view: 'social', icon: Users, requireProfile: true },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
    const { isMutating } = useDashboardData();
    const { isGuest } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <TooltipProvider delayDuration={300}>
            {/* @ts-ignore */}
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={cn(
                    "hidden lg:flex flex-col h-full bg-background/95 backdrop-blur-xl border-r border-white/10 z-50 transition-all duration-300 ease-in-out relative shadow-[10px_0_30px_-10px_rgba(0,0,0,0.5)]",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                <div className={cn("h-20 flex items-center shrink-0 transition-all duration-300", isCollapsed ? "justify-center" : "px-6")}>
                    <div className="relative group cursor-pointer">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/20 flex-shrink-0 ${isMutating ? 'animate-pulse' : ''}`}>
                            <div className="absolute inset-0 bg-white/30 rounded-full animate-[shimmer_2s_infinite] opacity-0 group-hover:opacity-100" />
                        </div>
                    </div>
                    <span className={cn(
                        "ml-3 font-bold text-xl text-foreground transition-all duration-300 whitespace-nowrap overflow-hidden",
                        isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}>
                        FinanceHub
                    </span>
                </div>

                <nav className="flex-1 px-3 space-y-2 mt-4 overflow-y-auto custom-scrollbar overflow-x-hidden">
                    {navigation.filter(item => !item.requireProfile || !isGuest).map((item) => {
                        const isActive = currentView === item.view;
                        const ButtonContent = (
                            <motion.button
                                key={item.name}
                                onClick={() => setCurrentView(item.view as ViewType)}
                                whileTap={{ scale: 0.98 }}
                                aria-label={item.name}
                                className={cn(
                                    "relative w-full flex items-center h-11 rounded-lg transition-all duration-300 group/item mb-1 overflow-hidden",
                                    isActive
                                        ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary shadow-[inset_2px_0_0_0_hsl(var(--primary))]'
                                        : 'text-muted-foreground/80 hover:text-foreground hover:bg-white/5'
                                )}
                            >
                                {/* Glow effect for active state */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-primary/5 blur-md" />
                                )}

                                <div className={cn(
                                    "w-14 flex items-center justify-center flex-shrink-0 z-10",
                                    isActive && "text-primary"
                                )}>
                                    <item.icon
                                        strokeWidth={1.5}
                                        className={cn(
                                            "w-5 h-5 transition-transform duration-300 group-hover/item:scale-110",
                                            isActive ? 'text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]' : ''
                                        )} />
                                </div>
                                <span className={cn(
                                    "transition-all duration-300 font-medium text-sm whitespace-nowrap overflow-hidden tracking-wide z-10",
                                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                                )}>
                                    {item.name}
                                </span>
                            </motion.button>
                        );

                        return isCollapsed ? (
                            <Tooltip key={item.name}>
                                <TooltipTrigger asChild>
                                    {ButtonContent}
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-popover border-border text-popover-foreground">
                                    {item.name}
                                </TooltipContent>
                            </Tooltip>
                        ) : ButtonContent;
                    })}
                </nav>

                <div className="p-3 mt-auto mb-4 space-y-2">
                    {!isCollapsed && (
                        <div className="mb-4">
                            <Gamification level={12} currentXP={8450} nextLevelXP={10000} />
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        aria-label={isCollapsed ? "Expandir menu" : "Colapsar menu"}
                        className="w-full flex items-center h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors justify-center"
                    >
                        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : (
                            <div className="flex items-center w-full px-4">
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                <span className="text-sm font-medium">Colapsar</span>
                            </div>
                        )}
                    </button>

                    <div className="h-px bg-border my-2 mx-2" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button onClick={() => setCurrentView('devtools')} className="w-full flex items-center h-12 rounded-xl text-yellow-500/70 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors">
                                <div className="w-14 flex items-center justify-center flex-shrink-0"><Zap className="w-5 h-5" /></div>
                                <span className={cn("transition-all duration-300 font-medium text-sm whitespace-nowrap overflow-hidden", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>DevTools</span>
                            </button>
                        </TooltipTrigger>
                        {isCollapsed && <TooltipContent side="right">DevTools</TooltipContent>}
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button onClick={() => setCurrentView('settings')} className="w-full flex items-center h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                                <div className="w-14 flex items-center justify-center flex-shrink-0"><Settings className="w-5 h-5" /></div>
                                <span className={cn("transition-all duration-300 font-medium text-sm whitespace-nowrap overflow-hidden", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>Ajustes</span>
                            </button>
                        </TooltipTrigger>
                        {isCollapsed && <TooltipContent side="right">Ajustes</TooltipContent>}
                    </Tooltip>

                    <div className={cn("text-xs text-muted-foreground text-center mt-2 transition-opacity duration-300", isCollapsed ? "opacity-0" : "opacity-100")}>
                        v4.0.0 Neon Genesis
                    </div>
                </div>
            </motion.aside>
        </TooltipProvider>
    );
};