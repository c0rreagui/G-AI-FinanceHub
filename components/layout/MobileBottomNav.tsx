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
    ArrowDownLeft,
    ArrowUpRight,
    Lightbulb,
    Zap,
} from '../Icons';
import { Users, PiggyBank, SlidersHorizontal } from 'lucide-react';
import { useDialog } from '../../hooks/useDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomSheet } from '../ui/BottomSheet';
import { triggerHapticFeedback } from '../../utils/haptics';
import { useAuth } from '../../hooks/useAuth';
import { useScrollDirection } from '../../hooks/useScrollDirection';

// Type workaround for motion components with className
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

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
        onClick={() => {
            triggerHapticFeedback();
            onClick(view);
        }}
        className="relative flex flex-col items-center justify-center gap-1 text-xs font-medium w-full transition-transform active:scale-95"
        aria-label={name}
        aria-current={isActive ? 'page' : undefined}
    >
        <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
        <span className={`transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{name}</span>
        {isActive && (
            <MotionDiv
                layoutId="mobile-active-nav"
                className="absolute -bottom-2 h-1 w-8 bg-primary rounded-full"
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
                        <MotionDiv
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/95 z-[80]"
                            onClick={toggleOpen}
                        />
                        <div className="absolute bottom-24 flex flex-col items-center gap-4 z-[90]">
                            {actions.map((action, index) => (
                                <MotionDiv
                                    key={action.label}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 20, delay: index * 0.06 } }}
                                    exit={{ opacity: 0, y: 50, transition: { duration: 0.15 } }}
                                    className="flex items-center gap-3 w-40 justify-end"
                                >
                                    <span className="bg-card text-foreground text-xs font-semibold px-2 py-1 rounded-md shadow-lg border border-border">{action.label}</span>
                                    <button
                                        onClick={action.onClick}
                                        className="w-12 h-12 rounded-full bg-popover border border-border text-popover-foreground flex items-center justify-center shadow-lg hover:bg-muted/50"
                                        aria-label={action.ariaLabel}
                                    >
                                        <action.icon className="w-6 h-6" />
                                    </button>
                                </MotionDiv>
                            ))}
                        </div>
                    </>
                )}
            </AnimatePresence>
            <MotionButton
                onClick={toggleOpen}
                className="relative z-[90] flex items-center justify-center w-14 h-14 bg-gradient-to-r from-primary to-blue-600 rounded-full text-primary-foreground shadow-lg -translate-y-4"
                whileTap={{ scale: 0.9 }}
                animate={isOpen ? "open" : "closed"}
                aria-label={isOpen ? "Fechar ações rápidas" : "Abrir ações rápidas"}
                aria-expanded={isOpen}
            >
                <MotionDiv variants={{ open: { rotate: 45 }, closed: { rotate: 0 } }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                    <PlusCircle className="w-8 h-8" />
                </MotionDiv>
            </MotionButton>
        </div>
    );
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, setCurrentView }) => {
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const { isDeveloper } = useAuth();
    const scrollDirection = useScrollDirection();
    const isVisible = scrollDirection === 'up' || scrollDirection === null; // Show initially or when scrolling up

    const moreNavItems = useMemo(() => {
        const items: { name: string; view: ViewType; icon: React.ElementType }[] = [
            { name: 'Dívidas', view: 'debts', icon: TrendingDown },
            { name: 'Investimentos', view: 'investments', icon: PiggyBank },
            { name: 'Agenda', view: 'scheduling', icon: Calendar },
            { name: 'Insights', view: 'insights', icon: Lightbulb },
            { name: 'Tools', view: 'tools', icon: Wrench },
            { name: 'Família', view: 'social', icon: Users },
            { name: 'Ajustes', view: 'settings', icon: SlidersHorizontal },
        ];
        if (isDeveloper) {
            items.push({ name: 'DevTools', view: 'devtools', icon: Zap });
        }
        return items;
    }, [isDeveloper]);

    const handleMoreItemClick = (view: ViewType) => {
        triggerHapticFeedback();
        setCurrentView(view);
        setIsMoreMenuOpen(false);
    }

    const isMoreActive = moreNavItems.some(item => item.view === currentView);

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <MotionDiv
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed bottom-0 left-0 right-0 h-24 pb-8 bg-background border-t border-border z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
                    >
                        <div className="grid grid-cols-5 h-full items-center">
                            <NavItem
                                {...mainNavItems[0]}
                                isActive={currentView === mainNavItems[0].view}
                                onClick={(v) => v && setCurrentView(v)}
                            />
                            <NavItem
                                {...mainNavItems[1]}
                                isActive={currentView === mainNavItems[1].view}
                                onClick={(v) => v && setCurrentView(v)}
                            />

                            <SpeedDial />

                            <NavItem
                                {...mainNavItems[2]}
                                isActive={currentView === mainNavItems[2].view}
                                onClick={(v) => v && setCurrentView(v)}
                            />
                            <NavItem
                                name="Mais"
                                icon={MoreHorizontal}
                                isActive={isMoreActive}
                                onClick={() => {
                                    triggerHapticFeedback();
                                    setIsMoreMenuOpen(true);
                                }}
                            />
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>

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
                            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-colors relative ${currentView === item.view
                                ? 'bg-primary/20 ring-2 ring-primary/50'
                                : item.view === 'devtools'
                                    ? 'bg-yellow-500/10 hover:bg-yellow-500/20'
                                    : 'bg-muted/50 hover:bg-muted'
                                } ${currentView === item.view ? 'text-primary' : 'text-muted-foreground'}`}
                        >
                            <item.icon className={`w-8 h-8 ${currentView === item.view ? 'text-primary' : item.view === 'devtools' ? 'text-yellow-400' : ''}`} />
                            <span className="text-sm font-medium">{item.name}</span>
                        </button>
                    ))}
                </div>
            </BottomSheet>
        </>
    );
};