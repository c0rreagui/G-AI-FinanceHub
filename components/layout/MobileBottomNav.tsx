import React, { useState, useMemo } from 'react';
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
    Zap,
} from '../Icons';
import { useDialog } from '../../hooks/useDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomSheet } from '../ui/BottomSheet';
import { triggerHapticFeedback } from '../../utils/haptics';
import { useAuth } from '../../hooks/useAuth';

interface MobileBottomNavProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

interface NavItemProps {
    name: string;
    view?: ViewType;
    icon: React.ElementType;
    isActive: boolean;
    onClick: (view?: ViewType) => void;
}

const NavItem: React.FC<NavItemProps> = ({ name, view, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(view)}
      className="relative flex flex-col items-center justify-center gap-1 text-xs font-medium w-full"
      aria-label={name}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
      <span className={`transition-colors ${isActive ? 'text-white' : 'text-gray-400'}`}>{name}</span>
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
        { icon: ArrowDownLeft, label: 'Despesa', ariaLabel: 'Adicionar nova despesa', onClick: () => handleAction(() => openDialog('add-transaction', { prefill: { type: TransactionType.DESPESA } })) },
        { icon: ArrowUpRight, label: 'Receita', ariaLabel: 'Adicionar nova receita', onClick: () => handleAction(() => openDialog('add-transaction', { prefill: { type: TransactionType.RECEITA } })) },
        { icon: Target, label: 'Meta', ariaLabel: 'Adicionar nova meta', onClick: () => handleAction(() => openDialog('add-goal')) },
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
                          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
                          onClick={toggleOpen}
                        />
                        <div className="absolute bottom-24 flex flex-col items-center gap-4 z-50">
                            {actions.map((action, index) => (
                                <motion.div
                                    key={action.label}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 20, delay: index * 0.06 } }}
                                    exit={{ opacity: 0, y: 50, transition: { duration: 0.15 } }}
                                    className="flex items-center gap-3 w-40 justify-end"
                                >
                                    <span className="bg-[oklch(var(--card-oklch))] text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg">{action.label}</span>
                                    <button 
                                      onClick={action.onClick} 
                                      className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg"
                                      aria-label={action.ariaLabel}
                                    >
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
                aria-label={isOpen ? "Fechar ações rápidas" : "Abrir ações rápidas"}
                aria-expanded={isOpen}
            >
                <motion.div variants={{ open: { rotate: 45 }, closed: { rotate: 0 } }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    <PlusCircle className="w-8 h-8" />
                </motion.div>
            </motion.button>
        </div>
    );
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, setCurrentView }) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const { isDeveloper } = useAuth();

  const moreNavItems = useMemo(() => {
    // FIX: Explicitly type the array to ensure `item.view` is of type `ViewType`, not `string`.
    const items: { name: string; view: ViewType; icon: React.ElementType }[] = [
        { name: 'Dívidas', view: 'debts', icon: TrendingDown },
        { name: 'Agendamentos', view: 'scheduling', icon: Calendar },
        { name: 'Insights', view: 'insights', icon: Lightbulb },
        { name: 'Ferramentas', view: 'tools', icon: Wrench },
        { name: 'Ajustes', view: 'settings', icon: Settings },
    ];
    if (isDeveloper) {
        items.push({ name: 'DevTools', view: 'devtools', icon: Zap });
    }
    return items;
  }, [isDeveloper]);
  
  const handleMoreItemClick = (view: ViewType) => {
    setCurrentView(view);
    setIsMoreMenuOpen(false);
  }
  
  const isMoreActive = moreNavItems.some(item => item.view === currentView);

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
            <NavItem
                name="Mais"
                icon={MoreHorizontal}
                isActive={isMoreActive}
                onClick={() => setIsMoreMenuOpen(true)}
            />
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
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-gray-300 transition-colors ${item.view === 'devtools' ? 'bg-yellow-500/10 hover:bg-yellow-500/20' : 'bg-white/5 hover:bg-white/10'}`}
                >
                    <item.icon className={`w-8 h-8 ${item.view === 'devtools' ? 'text-yellow-400' : ''}`} />
                    <span className="text-sm font-medium">{item.name}</span>
                </button>
            ))}
        </div>
      </BottomSheet>
    </>
  );
};