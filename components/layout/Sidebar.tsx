// @ts-nocheck
import React, { useState } from 'react';
import { ViewType } from '../../types';
import { LayoutDashboard, ArrowLeftRight, PieChart, Target, TrendingDown, Calendar, Wrench, Settings, Terminal, Palette, Users, PiggyBank, Lightbulb, Zap, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardData } from '../../hooks/useDashboardData';
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
  { name: 'Família', view: 'social', icon: Users },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { isMutating } = useDashboardData();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <TooltipProvider delayDuration={300}>
        {/* @ts-ignore */}
        <motion.aside 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={cn(
                "hidden lg:flex flex-col h-full bg-card/50 border-r border-border backdrop-blur-xl z-50 transition-all duration-300 ease-in-out relative",
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
            {navigation.map((item) => {
                const isActive = currentView === item.view;
                const ButtonContent = (
                    <motion.button
                        key={item.name}
                        onClick={() => setCurrentView(item.view as ViewType)}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "relative w-full flex items-center h-12 rounded-xl transition-all duration-200 group/item",
                            isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                    >
                        {isActive && <motion.div layoutId="active-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />}
                        <div className={cn(
                            "w-14 flex items-center justify-center flex-shrink-0",
                            isActive && "text-primary"
                        )}>
                            <item.icon className={cn(
                                "w-5 h-5 transition-transform group-hover/item:scale-110",
                                isActive ? 'text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]' : ''
                            )} />
                        </div>
                        <span className={cn(
                            "transition-all duration-300 font-medium text-sm whitespace-nowrap overflow-hidden",
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
            
             <div className={cn("text-[10px] text-muted-foreground text-center mt-2 transition-opacity duration-300", isCollapsed ? "opacity-0" : "opacity-100")}>
                v4.0.0 Neon Genesis
            </div>
        </div>
        </motion.aside>
    </TooltipProvider>
  );
};