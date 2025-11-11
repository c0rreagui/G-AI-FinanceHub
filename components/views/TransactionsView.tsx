// components/views/TransactionsView.tsx
import React, { useState, useMemo } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { ArrowLeftRight, PlusCircle, FolderSync, PencilIcon, TrashIcon } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Transaction, TransactionType } from '../../types';
import { formatCurrencyBRL, groupTransactionsByDate } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { useDialog } from '../../hooks/useDialog';
import { TransactionsViewSkeleton } from './skeletons/TransactionsViewSkeleton';
import { EmptyState } from '../ui/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const TransactionItem: React.FC<{ 
    transaction: Transaction;
    isSelected: boolean;
    isMutating: boolean;
    onSelect: (id: string) => void;
    onEdit: (transaction: Transaction) => void;
    onDelete: (transactionId: string) => void;
}> = ({ transaction, isSelected, isMutating, onSelect, onEdit, onDelete }) => {
    const isExpense = transaction.type === TransactionType.DESPESA;
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [isDragging, setIsDragging] = useState(false);
    const amountColor = isExpense ? 'text-red-400' : 'text-green-400';
    const actionButtonsWidth = 160; // 2 buttons * 80px width
    const isSystemTransaction = !!transaction.goalContributionId || !!transaction.debtPaymentId;


    const desktopHoverActions = (
        <AnimatePresence>
            {isDesktop && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-y-0 right-4 flex items-center z-20 gap-2"
                >
                    <button
                        onClick={() => onEdit(transaction)}
                        disabled={isMutating || isSystemTransaction}
                        className="p-2 rounded-md text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Editar"
                        title={isSystemTransaction ? "Transações do sistema não podem ser editadas." : "Editar"}
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(transaction.id)}
                        disabled={isMutating || isSystemTransaction}
                        className="p-2 rounded-md text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Excluir"
                        title={isSystemTransaction ? "Transações do sistema não podem ser excluídas." : "Excluir"}
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const mobileSwipeActions = (
        <div className="absolute inset-y-0 right-0 flex items-center z-0">
            <button
                onClick={() => onEdit(transaction)}
                disabled={isMutating || isSystemTransaction}
                className="flex flex-col items-center justify-center h-full w-20 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                <PencilIcon className="w-5 h-5" />
                <span className="text-xs mt-1">Editar</span>
            </button>
            <button
                onClick={() => onDelete(transaction.id)}
                disabled={isMutating || isSystemTransaction}
                className="flex flex-col items-center justify-center h-full w-20 bg-red-600 text-white hover:bg-red-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                <TrashIcon className="w-5 h-5" />
                <span className="text-xs mt-1">Excluir</span>
            </button>
        </div>
    );
    
    return (
        <motion.li 
            layout 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
            className={`relative group rounded-lg overflow-hidden transition-all duration-300 ${isMutating ? 'opacity-50 pointer-events-none animate-pulse' : 'hover:bg-white/5'}`
        }>
            {!isDesktop && mobileSwipeActions}
            
            <motion.div
                className="relative group flex items-center justify-between py-3 px-2 bg-[oklch(var(--card-oklch))] w-full z-10"
                drag={!isDesktop && !isSystemTransaction ? "x" : false}
                dragConstraints={{ left: -actionButtonsWidth, right: 0 }}
                dragElastic={{ left: 0.1, right: 0.8 }}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
            >
                <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => !isDragging && onSelect(transaction.id)}>
                    <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-transparent pointer-events-none flex-shrink-0"
                        checked={isSelected}
                        readOnly
                    />
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`} style={{backgroundColor: `${transaction.category.color}20`}}>
                        <transaction.category.icon className="w-5 h-5" style={{color: transaction.category.color}} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{transaction.description}</p>
                        <p className="text-xs text-gray-400">{transaction.category.name}</p>
                    </div>
                </div>
                <div className="text-right pl-2">
                    <p className={`font-semibold text-sm ${amountColor} tabular-nums`}>
                        {isExpense ? '-' : '+'} {formatCurrencyBRL(Math.abs(transaction.amount))}
                    </p>
                </div>
            </motion.div>
            {isDesktop && desktopHoverActions}
        </motion.li>
    );
};

const DateHeader: React.FC<{ date: string }> = ({ date }) => (
    <div className="sticky top-0 bg-[oklch(var(--background-oklch)_/_0.8)] backdrop-blur-sm z-20 py-1.5 px-2">
      <h3 className="text-sm font-semibold text-gray-300">{date}</h3>
    </div>
);

export const TransactionsView: React.FC = () => {
    const { transactions, loading, deleteTransaction, mutatingIds } = useDashboardData();
    const { openDialog } = useDialog();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    
    const handleSelect = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleEdit = (transaction: Transaction) => {
        openDialog('add-transaction', { transactionToEdit: transaction });
    };

    const handleDelete = (transactionId: string) => {
        openDialog('confirmation', {
            title: 'Excluir Transação',
            message: 'Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.',
            confirmText: 'Sim, Excluir',
            confirmVariant: 'destructive',
            onConfirm: () => deleteTransaction(transactionId),
        });
    };

    const handleBulkRecategorize = () => {
        openDialog('bulk-recategorize', {
            transactionIds: selectedIds,
            onComplete: () => setSelectedIds([]), // Clear selection on complete
        });
    };
    
    const groupedTransactions = useMemo(() => groupTransactionsByDate(transactions), [transactions]);

    return (
        <div className="flex flex-col h-full">
            <PageHeader 
                icon={ArrowLeftRight} 
                title="Transações" 
                breadcrumbs={['FinanceHub', 'Transações']}
                actions={
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                             <Button onClick={handleBulkRecategorize} variant="secondary">
                                <FolderSync className="w-4 h-4"/>
                                Recategorizar ({selectedIds.length})
                            </Button>
                        )}
                        <Button onClick={() => openDialog('add-transaction')}>
                            <PlusCircle className="w-4 h-4"/> Nova Transação
                        </Button>
                    </div>
                }
            />
             {loading ? (
                <TransactionsViewSkeleton />
             ) : (
                <div className="flex-grow overflow-y-auto pr-2">
                    {transactions.length > 0 ? (
                        <div>
                            {Object.entries(groupedTransactions).map(([date, txs]: [string, Transaction[]]) => (
                                <div key={date}>
                                    <DateHeader date={date} />
                                    <ul className="divide-y divide-[oklch(var(--border-oklch))]">
                                        <AnimatePresence>
                                            {txs.map(tx => (
                                                <TransactionItem 
                                                    key={tx.id} 
                                                    transaction={tx}
                                                    isSelected={selectedIds.includes(tx.id)}
                                                    isMutating={mutatingIds.has(tx.id)}
                                                    onSelect={handleSelect}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={ArrowLeftRight}
                            title="Nenhuma Transação"
                            description="Adicione suas despesas e receitas para começar a ter controle sobre suas finanças."
                        >
                            <Button onClick={() => openDialog('add-transaction')}>
                                <PlusCircle className="w-4 h-4 mr-2"/> Adicionar Primeira Transação
                            </Button>
                        </EmptyState>
                    )}
                </div>
             )}
        </div>
    );
};