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
import { motion, AnimatePresence } from 'framer-motion';

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
      <Icon className={`w-6 h-6 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
      <span className={isActive ? 'text-white' : 'text-gray-400'}>{name}</span>
      {isActive && (
        <motion.div
          layoutId="mobile-active-nav"
          className="absolute -bottom-2 h-1 w-8 bg-indigo-500 rounded-full"
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
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/30 backdrop-blur-xl border-t border-white/10 z-50">
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
                <button onClick={() => openDialog('add-transaction')} className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-white shadow-lg -translate-y-4">
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
      
      <AnimatePresence>
        {isMoreMenuOpen && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMoreMenuOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]"
                />
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-xl border-t border-white/10 z-[60] p-4 rounded-t-2xl pb-6"
                >
                    <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-4"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {moreNavItems.map(item => (
                             <button
                                key={item.view}
                                onClick={() => handleMoreItemClick(item.view)}
                                className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg text-gray-300 hover:bg-white/10"
                            >
                                <item.icon className="w-6 h-6" />
                                <span className="text-xs">{item.name}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </>
  );
};