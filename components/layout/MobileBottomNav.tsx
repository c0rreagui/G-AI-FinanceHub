import React, { useState } from 'react';
import { ViewType } from '../../types';
import {
    HomeIcon,
    ArrowLeftRight,
    Lightbulb,
    Target,
    PlusCircle,
    TrendingDown,
    Calendar,
    Wrench,
    Settings,
    MoreHorizontal,
} from '../Icons';
import { useDialog } from '../../hooks/useDialog';
import { motion } from 'framer-motion';
import { BottomSheet } from '../ui/BottomSheet';

interface MobileBottomNavProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

interface NavItemProps {
    name: string;
    view: ViewType;
    icon: React.ElementType;
    isActive: boolean;
    onClick: (view: ViewType) => void;
}

const NavItem: React.FC<NavItemProps> = ({ name, view, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(view)}
      className="relative flex flex-col items-center justify-center gap-1 text-xs font-medium w-full"
    >
      <Icon className={`w-6 h-6 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
      <span className={isActive ? 'text-white' : 'text-gray-400'}>{name}</span>
      {isActive && (
        <motion.div
          layoutId="mobile-active-nav"
          className="absolute -bottom-2 h-1 w-8 bg-cyan-500 rounded-full"
        />
      )}
    </button>
);

const mainNavItems: { name: string; view: ViewType; icon: React.ElementType }[] = [
  { name: 'Início', view: 'home', icon: HomeIcon },
  { name: 'Transações', view: 'transactions', icon: ArrowLeftRight },
  { name: 'Metas', view: 'goals', icon: Target },
];

const moreNavItems: { name: string; view: ViewType; icon: React.ElementType }[] = [
    { name: 'Dívidas', view: 'debts', icon: TrendingDown },
    { name: 'Agendamentos', view: 'scheduling', icon: Calendar },
    { name: 'Insights', view: 'insights', icon: Lightbulb },
    { name: 'Ferramentas', view: 'tools', icon: Wrench },
    { name: 'Ajustes', view: 'settings', icon: Settings },
]

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, setCurrentView }) => {
  const { openDialog } = useDialog();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  const handleMoreItemClick = (view: ViewType) => {
    setCurrentView(view);
    setIsMoreMenuOpen(false);
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[oklch(var(--background-oklch)_/_0.75)] backdrop-blur-xl border-t border-[oklch(var(--border-oklch))] z-50">
        <div className="grid grid-cols-5 h-full items-center">
            <NavItem 
                {...mainNavItems[0]}
                isActive={currentView === mainNavItems[0].view}
                onClick={setCurrentView}
            />
             <NavItem 
                {...mainNavItems[1]}
                isActive={currentView === mainNavItems[1].view}
                onClick={setCurrentView}
            />
            
            <div className="flex items-center justify-center">
                <button onClick={() => openDialog('add-transaction')} className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full text-white shadow-lg -translate-y-4">
                    <PlusCircle className="w-8 h-8" />
                </button>
            </div>

            <NavItem 
                {...mainNavItems[2]}
                isActive={currentView === mainNavItems[2].view}
                onClick={setCurrentView}
            />
            <button
                onClick={() => setIsMoreMenuOpen(true)}
                className="relative flex flex-col items-center justify-center gap-1 text-xs font-medium w-full text-gray-400"
            >
                <MoreHorizontal className="w-6 h-6" />
                <span>Mais</span>
            </button>
        </div>
      </div>
      
      <BottomSheet
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        title="Mais Opções"
      >
        <div className="grid grid-cols-3 gap-4 mt-4">
            {moreNavItems.map(item => (
                <button
                    key={item.view}
                    onClick={() => handleMoreItemClick(item.view)}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
                >
                    <item.icon className="w-8 h-8" />
                    <span className="text-sm font-medium">{item.name}</span>
                </button>
            ))}
        </div>
      </BottomSheet>
    </>
  );
};
