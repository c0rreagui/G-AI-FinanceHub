import React, { useState } from 'react';
import { ViewType, TransactionType } from '../../types';
import {
    HomeIcon,
    ArrowLeftRight,
    Target,
    PlusCircle,
    TrendingDown,
    Calendar,
    Wrench,
    Settings,
    MoreHorizontal,
    XIcon,
    ArrowDownLeft,
    ArrowUpRight,
    Lightbulb,
} from '../Icons';
import { useDialog } from '../../hooks/useDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomSheet } from '../ui/BottomSheet';
import { triggerHapticFeedback } from '../../utils/haptics';

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
    // FIX: Lightbulb icon was not found, it is now imported correctly.
    { name: 'Insights', view: 'insights', icon: Lightbulb },
    { name: 'Ferramentas', view: 'tools', icon: Wrench },
    { name: 'Ajustes', view: 'settings', icon: Settings },
];

const SpeedDial: React.FC = () => {
    const { openDialog } = useDialog();
    const [isOpen, setIsOpen] = useState(false);

    const handleAction = (action: () => void) => {
        triggerHapticFeedback();
        action();
        setIsOpen(false);
    };

    const toggleOpen = () => {
        triggerHapticFeedback(20);
        setIsOpen(!isOpen);
    };
    
    const actions = [
        { icon: Target, label: 'Meta', onClick: () => handleAction(() => openDialog('add-goal')) },
        { icon: ArrowUpRight, label: 'Receita', onClick: () => handleAction(() => openDialog('add-transaction', { prefill: { type: TransactionType.RECEITA } })) },
        { icon: ArrowDownLeft, label: 'Despesa', onClick: () => handleAction(() => openDialog('add-transaction', { prefill: { type: TransactionType.DESPESA } })) },
    ];

    return (
        <div className="flex items-center justify-center">
             <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 bg-black/50 z-40" 
                          onClick={toggleOpen}
                        />
                        <div className="absolute bottom-24 flex flex-col items-center gap-4 z-50">
                            {actions.map((action, index) => (
                                <motion.div
                                    key={action.label}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                                    exit={{ opacity: 0, y: 50 }}
                                    className="flex items-center gap-3"
                                >
                                    <span className="bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-md">{action.label}</span>
                                    <button onClick={action.onClick} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg">
                                        <action.icon className="w-6 h-6" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </AnimatePresence>
            <motion.button 
                onClick={toggleOpen} 
                className="relative z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full text-white shadow-lg -translate-y-4"
                whileTap={{ scale: 0.9 }}
                animate={isOpen ? "open" : "closed"}
            >
                <motion.div variants={{ open: { rotate: 45 }, closed: { rotate: 0 } }}>
                    <PlusCircle className="w-8 h-8" />
                </motion.div>
            </motion.button>
        </div>
    );
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, setCurrentView }) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  const handleMoreItemClick = (view: ViewType) => {
    setCurrentView(view);
    setIsMoreMenuOpen(false);
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[oklch(var(--background-oklch)_/_0.75)] backdrop-blur-xl border-t border-[oklch(var(--border-oklch))] z-40">
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
            
            <SpeedDial />

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