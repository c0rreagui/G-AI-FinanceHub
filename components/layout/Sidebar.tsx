import React from 'react';
import { ViewType } from '../../types';
import { HomeIcon, ArrowLeftRight, Lightbulb, Target, TrendingDown, Calendar, Wrench, Settings, Zap, Users } from '../Icons';
import { motion } from 'framer-motion';
import { useDashboardData } from '../../hooks/useDashboardData';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const navigation = [
  { name: 'Início', view: 'home', icon: HomeIcon },
  { name: 'Transações', view: 'transactions', icon: ArrowLeftRight },
  { name: 'Metas', view: 'goals', icon: Target },
  { name: 'Dívidas', view: 'debts', icon: TrendingDown },
  { name: 'Agenda', view: 'scheduling', icon: Calendar },
  { name: 'Insights', view: 'insights', icon: Lightbulb },
  { name: 'Tools', view: 'tools', icon: Wrench },
  { name: 'Família', view: 'social', icon: Users },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { isMutating } = useDashboardData();

  return (
    <aside className="hidden lg:flex flex-col w-20 hover:w-64 transition-all duration-300 ease-in-out h-full bg-[oklch(var(--card-oklch)_/_0.3)] border-r border-white/5 backdrop-blur-xl z-50 group overflow-hidden">
      <div className="h-20 flex items-center justify-center group-hover:justify-start group-hover:px-6 shrink-0">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20 flex-shrink-0 ${isMutating ? 'animate-pulse' : ''}`} />
        <span className="ml-3 font-bold text-xl text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            FinanceHub
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-4">
        {navigation.map((item) => {
            const isActive = currentView === item.view;
            return (
                <button
                    key={item.name}
                    onClick={() => setCurrentView(item.view as ViewType)}
                    className={`relative w-full flex items-center h-12 rounded-xl transition-all duration-200 group/item overflow-hidden ${isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_#22d3ee]" />}
                    <div className="w-14 flex items-center justify-center flex-shrink-0">
                        <item.icon className={`w-6 h-6 transition-transform group-hover/item:scale-110 ${isActive ? 'text-cyan-400' : ''}`} />
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium text-sm whitespace-nowrap">
                        {item.name}
                    </span>
                </button>
            );
        })}
      </nav>

      <div className="p-3 mt-auto mb-4 space-y-2">
         <button onClick={() => setCurrentView('devtools')} className="w-full flex items-center h-12 rounded-xl text-yellow-500/70 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors">
             <div className="w-14 flex items-center justify-center flex-shrink-0"><Zap className="w-5 h-5" /></div>
             <span className="opacity-0 group-hover:opacity-100 transition-opacity font-medium text-sm whitespace-nowrap">DevTools</span>
         </button>
         <button onClick={() => setCurrentView('settings')} className="w-full flex items-center h-12 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
             <div className="w-14 flex items-center justify-center flex-shrink-0"><Settings className="w-5 h-5" /></div>
             <span className="opacity-0 group-hover:opacity-100 transition-opacity font-medium text-sm whitespace-nowrap">Ajustes</span>
         </button>
      </div>
    </aside>
  );
};