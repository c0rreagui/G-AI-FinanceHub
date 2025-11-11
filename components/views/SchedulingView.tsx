import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Calendar, PlusCircle, PencilIcon, TrashIcon } from '../Icons';
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
                            <span>Próximo vencimento: {formatDate(item.nextDueDate)}</span>
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


export const SchedulingView: React.FC = () => {
    const { scheduledTransactions, loading } = useDashboardData();
    const { openDialog } = useDialog();

    return (
        <>
            <PageHeader
                icon={Calendar}
                title="Agendamentos"
                breadcrumbs={['FinanceHub', 'Agendamentos']}
                actions={<Button onClick={() => openDialog('add-scheduling')}><PlusCircle className="w-4 h-4"/> Novo Agendamento</Button>}
            />
            {loading ? (
                <SchedulingViewSkeleton />
            ) : (
                <div className="mt-6 flex-grow overflow-y-auto pr-2">
                    {scheduledTransactions.length > 0 ? (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {scheduledTransactions.map(item => (
                                    <ScheduledTransactionCard key={item.id} item={item} />
                                ))}
                            </AnimatePresence>
                        </div>
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
        </>
    );
};