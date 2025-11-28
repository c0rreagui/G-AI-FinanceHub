import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Calendar, PlusCircle, PencilIcon, TrashIcon, LayoutGrid, List, ChevronDown } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ScheduledTransaction, TransactionType } from '../../types';
import { formatCurrencyBRL, formatDate } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useDialog } from '../../hooks/useDialog';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/skeletons/Skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { CalendarGrid } from '../ui/CalendarGrid';

const ScheduledTransactionCard: React.FC<{ item: ScheduledTransaction }> = ({ item }) => {
    const { deleteScheduledTransaction, mutatingIds } = useDashboardData();
    const { openDialog } = useDialog();
    const isMutating = mutatingIds.has(item.id);
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [isDragging, setIsDragging] = useState(false);
    const actionButtonsWidth = 160;

    const handleEdit = () => {
        openDialog('add-scheduling', { itemToEdit: item });
    };

    const handleDelete = () => {
        openDialog('confirmation', {
            title: 'Excluir Agendamento',
            message: `Tem certeza que deseja excluir o agendamento "${item.description}"? Esta ação não pode ser desfeita.`,
            confirmText: 'Sim, Excluir',
            confirmVariant: 'destructive',
            onConfirm: () => deleteScheduledTransaction(item.id),
        });
    };
    
    const desktopHoverActions = (
         <div className="absolute inset-y-0 right-6 flex items-center z-20 gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
            <button
                onClick={handleEdit}
                disabled={isMutating}
                className="p-2 w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Editar"
            >
                <PencilIcon className="w-4 h-4" />
            </button>
            <button
                onClick={handleDelete}
                disabled={isMutating}
                className="p-2 w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Excluir"
            >
                <TrashIcon className="w-4 h-4" />
            </button>
        </div>
    );
    
    const mobileSwipeActions = (
        <div className="absolute inset-y-0 right-0 flex items-center z-0 rounded-2xl overflow-hidden">
            <button
                onClick={handleEdit}
                disabled={isMutating}
                className="flex flex-col items-center justify-center h-full w-20 bg-indigo-600/90 text-white hover:bg-indigo-600 transition-colors"
            >
                <PencilIcon className="w-5 h-5" />
                <span className="text-xs mt-1">Editar</span>
            </button>
            <button
                onClick={handleDelete}
                disabled={isMutating}
                className="flex flex-col items-center justify-center h-full w-20 bg-red-600/90 text-white hover:bg-red-600 transition-colors"
            >
                <TrashIcon className="w-5 h-5" />
                <span className="text-xs mt-1">Excluir</span>
            </button>
        </div>
    );


    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative group transition-opacity ${isMutating ? 'opacity-50 pointer-events-none' : ''}`}
        >
            {!isDesktop && mobileSwipeActions}
            
            <motion.div
              className="relative z-10 w-full"
              drag={!isDesktop ? "x" : false}
              dragConstraints={{ left: -actionButtonsWidth, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
            >
                <div 
                    className="card group flex items-center gap-4 hover:border-white/20 hover:bg-white/10"
                    onClick={() => isDragging && handleEdit()} // Simple click can also trigger edit on mobile
                >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`} style={{backgroundColor: `${item.category.color}20`}}>
                        <item.category.icon className="w-6 h-6" style={{color: item.category.color}} />
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-center">
                            <h3 className="text-base font-semibold text-white">{item.description}</h3>
                            <span className={`font-semibold text-lg ${item.amount < 0 ? 'text-[oklch(var(--danger-oklch))]' : 'text-[oklch(var(--success-oklch))]'}`}>
                                {item.amount < 0 ? '' : '+'} {formatCurrencyBRL(item.amount)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                            {/* FIX: Corrected field name to snake_case to match database schema. */}
                            <span>Próximo vencimento: {formatDate(item.next_due_date)}</span>
                            <Badge color="blue">{item.frequency}</Badge>
                        </div>
                    </div>
                </div>
            </motion.div>
             {isDesktop && desktopHoverActions}
        </motion.div>
    );
}

const SchedulingViewSkeleton: React.FC = () => (
    <div className="mt-6 flex-grow space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
    </div>
);

type ViewMode = 'list' | 'calendar';

export const SchedulingView: React.FC = () => {
    const { scheduledTransactions, loading } = useDashboardData();
    const { openDialog } = useDialog();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const currentMonthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentDate);

    return (
        <div className="flex flex-col h-full">
            <PageHeader
                icon={Calendar}
                title="Agendamentos"
                breadcrumbs={['FinanceHub', 'Agendamentos']}
                actions={
                    <div className="flex items-center gap-2">
                        <div className="bg-[oklch(var(--card-oklch))] rounded-lg p-1 flex items-center border border-[oklch(var(--border-oklch))]">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                aria-label="Visualização em Lista"
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                aria-label="Visualização em Grade"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                        </div>
                        <Button onClick={() => openDialog('add-scheduling')}>
                            <PlusCircle className="w-4 h-4"/> <span className="hidden sm:inline">Novo Agendamento</span><span className="sm:hidden">Novo</span>
                        </Button>
                    </div>
                }
            />
            {loading ? (
                <SchedulingViewSkeleton />
            ) : (
                <div className="mt-6 flex-grow overflow-y-auto pr-2">
                    {scheduledTransactions.length > 0 ? (
                        <>
                            {viewMode === 'list' ? (
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {scheduledTransactions.map(item => (
                                            <ScheduledTransactionCard key={item.id} item={item} />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }}
                                    className="h-full flex flex-col"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white capitalize">{currentMonthName}</h3>
                                        <div className="flex gap-2">
                                            <Button onClick={prevMonth} size="sm" variant="secondary" className="px-2">
                                                <ChevronDown className="w-5 h-5 rotate-90" />
                                            </Button>
                                            <Button onClick={nextMonth} size="sm" variant="secondary" className="px-2">
                                                <ChevronDown className="w-5 h-5 -rotate-90" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CalendarGrid items={scheduledTransactions} currentDate={currentDate} />
                                </motion.div>
                            )}
                        </>
                    ) : (
                        <EmptyState
                            icon={Calendar}
                            title="Nenhum Agendamento"
                            description="Adicione transações recorrentes, como aluguel ou assinaturas, para gerenciá-las aqui."
                        >
                            <Button onClick={() => openDialog('add-scheduling')}>
                                <PlusCircle className="w-4 h-4 mr-2"/> Criar Agendamento
                            </Button>
                        </EmptyState>
                    )}
                </div>
            )}
        </div>
    );
};