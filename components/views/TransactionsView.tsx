// components/views/TransactionsView.tsx
import React, { useState, useMemo } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { ArrowLeftRight, PlusCircle, FolderSync, PencilIcon, TrashIcon, LinkIcon, LockClosed } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Transaction, TransactionType, ViewType } from '../../types';
import { formatCurrencyBRL, groupTransactionsByDate } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { useDialog } from '../../hooks/useDialog';
import { TransactionsViewSkeleton } from './skeletons/TransactionsViewSkeleton';
import { EmptyState } from '../ui/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const SelectionHeader: React.FC<{
    selectedCount: number;
    totalSelectable: number;
    onSelectAll: () => void;
    onRecategorize: () => void;
}> = ({ selectedCount, totalSelectable, onSelectAll, onRecategorize }) => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-center justify-between p-2 mb-4 bg-cyan-900/30 border border-cyan-500/30 rounded-xl"
    >
        <div className="flex items-center gap-3">
            <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-600 text-cyan-400 focus:ring-cyan-500 bg-transparent"
                checked={selectedCount === totalSelectable && totalSelectable > 0}
                onChange={onSelectAll}
                aria-label="Selecionar todas as transações"
            />
            <span className="text-sm font-semibold text-white">{selectedCount} selecionada(s)</span>
        </div>
        <Button onClick={onRecategorize} size="sm">
            <FolderSync className="w-4 h-4" />
            Recategorizar
        </Button>
    </motion.div>
);


const TransactionItem: React.FC<{ 
    transaction: Transaction;
    isSelected: boolean;
    isMutating: boolean;
    isInSelectionMode: boolean;
    onSelect: (id: string) => void;
    onEdit: (transaction: Transaction) => void;
    onDelete: (transactionId: string) => void;
    setCurrentView: (view: ViewType) => void;
}> = React.memo(({ transaction, isSelected, isMutating, isInSelectionMode, onSelect, onEdit, onDelete, setCurrentView }) => {
    const isExpense = transaction.type === TransactionType.DESPESA;
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [isDragging, setIsDragging] = useState(false);
    const amountColor = isExpense ? 'text-red-400' : 'text-green-400';
    const actionButtonsWidth = 160; // 2 buttons * 80px width
    // FIX: Corrected field names to snake_case to match database schema.
    const isSystemTransaction = !!transaction.goal_contribution_id || !!transaction.debt_payment_id;
    
    const handleLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Previne que o clique selecione a linha
        // FIX: Corrected field names to snake_case to match database schema.
        if (transaction.goal_contribution_id) {
            setCurrentView('goals');
        // FIX: Corrected field names to snake_case to match database schema.
        } else if (transaction.debt_payment_id) {
            setCurrentView('debts');
        }
    };
    
    const handleContainerClick = () => {
        if (!isDragging && !isSystemTransaction) {
            onSelect(transaction.id);
        }
    }

    const desktopHoverActions = (
        <AnimatePresence>
            {isDesktop && !isInSelectionMode && (
                <motion.div 
                    className="absolute inset-y-0 right-6 flex items-center z-20 gap-2 opacity-20 group-hover:opacity-100 transition-opacity"
                >
                    <button
                        onClick={() => onEdit(transaction)}
                        disabled={isMutating || isSystemTransaction}
                        className="p-2 w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Editar"
                        title={isSystemTransaction ? "Transações do sistema não podem ser editadas." : "Editar"}
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(transaction.id)}
                        disabled={isMutating || isSystemTransaction}
                        className="p-2 w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="absolute inset-y-0 right-0 flex items-center z-0 rounded-2xl overflow-hidden">
            <button
                onClick={() => onEdit(transaction)}
                disabled={isMutating || isSystemTransaction}
                className="flex flex-col items-center justify-center h-full w-20 bg-indigo-600/90 text-white hover:bg-indigo-600 transition-colors disabled:bg-gray-700/80 disabled:cursor-not-allowed"
                title={isSystemTransaction ? "Transações do sistema não podem ser editadas." : "Editar"}
            >
                <PencilIcon className="w-5 h-5" />
                <span className="text-xs mt-1">Editar</span>
            </button>
            <button
                onClick={() => onDelete(transaction.id)}
                disabled={isMutating || isSystemTransaction}
                className="flex flex-col items-center justify-center h-full w-20 bg-red-600/90 text-white hover:bg-red-600 transition-colors disabled:bg-gray-700/80 disabled:cursor-not-allowed"
                title={isSystemTransaction ? "Transações do sistema não podem ser excluídas." : "Excluir"}
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
            className={`relative group ${isMutating ? 'opacity-50 pointer-events-none' : ''}`}
        >
            {!isDesktop && !isInSelectionMode && mobileSwipeActions}
            
            <motion.div
                className="relative z-10 w-full"
                drag={!isDesktop && !isSystemTransaction && !isInSelectionMode ? "x" : false}
                dragConstraints={{ left: -actionButtonsWidth, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
            >
                <div 
                  className={`group flex items-center justify-between p-4 bg-white/5 border rounded-2xl backdrop-blur-xl transition-all duration-300 ${isSystemTransaction && isInSelectionMode ? 'opacity-60' : ''} ${isSelected ? 'border-cyan-500/80 shadow-lg' : 'border-white/10 hover:border-white/20 hover:bg-white/10'}`}
                  onClick={handleContainerClick}
                  title={isSystemTransaction && isInSelectionMode ? 'Transações do sistema não podem ser selecionadas.' : ''}
                >
                    <div className="flex items-center gap-4 flex-1 cursor-pointer">
                        <input
                            type="checkbox"
                            aria-hidden={!isInSelectionMode}
                            className={`h-5 w-5 rounded border-gray-600 text-cyan-400 focus:ring-cyan-500 bg-transparent pointer-events-none flex-shrink-0 disabled:opacity-50 disabled:border-gray-700 transition-opacity ${isInSelectionMode ? 'opacity-100' : 'opacity-0'}`}
                            checked={isSelected}
                            disabled={isSystemTransaction}
                            readOnly
                        />
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`} style={{backgroundColor: `${transaction.category.color}20`}}>
                            <transaction.category.icon className="w-5 h-5" style={{color: transaction.category.color}} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-white truncate">{transaction.description}</p>
                                {isSystemTransaction && (
                                    <div className="flex items-center gap-1.5 flex-shrink-0" title="Transação de sistema não pode ser editada.">
                                        <LockClosed className="w-3 h-3 text-gray-500"/>
                                        <button onClick={handleLinkClick} title="Ir para a meta/dívida vinculada" className="transition-transform hover:scale-110">
                                            <LinkIcon className="w-3.5 h-3.5 text-gray-500 hover:text-cyan-400" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-400">{transaction.category.name}</p>
                        </div>
                    </div>
                    <div className="text-right pl-4">
                        <p className={`font-semibold text-sm ${amountColor} tabular-nums`}>
                            {isExpense ? '-' : '+'} {formatCurrencyBRL(Math.abs(transaction.amount))}
                        </p>
                    </div>
                </div>
            </motion.div>
            {isDesktop && !isInSelectionMode && desktopHoverActions}
        </motion.li>
    );
});

const DateHeader: React.FC<{ date: string }> = ({ date }) => (
    <div className="sticky top-0 bg-oklch-background/90 backdrop-blur-lg z-20 py-1.5 px-2 -mx-2">
      <h3 className="text-sm font-semibold text-gray-300">{date}</h3>
    </div>
);

interface TransactionsViewProps {
    setCurrentView: (view: ViewType) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ setCurrentView }) => {
    const { transactions, loading, deleteTransaction, mutatingIds } = useDashboardData();
    const { openDialog } = useDialog();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const selectableTransactions = useMemo(() => 
        // FIX: Corrected field names to snake_case to match database schema.
        transactions.filter(tx => !tx.goal_contribution_id && !tx.debt_payment_id),
    [transactions]);
    
    const handleSelect = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === selectableTransactions.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(selectableTransactions.map(t => t.id));
        }
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
    const isInSelectionMode = selectedIds.length > 0;

    return (
        <div className="flex flex-col h-full">
            <PageHeader 
                icon={ArrowLeftRight} 
                title="Transações" 
                breadcrumbs={['FinanceHub', 'Transações']}
                actions={
                    <div className="flex items-center gap-2">
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
                            <AnimatePresence>
                                {isInSelectionMode && (
                                    <SelectionHeader 
                                        selectedCount={selectedIds.length}
                                        totalSelectable={selectableTransactions.length}
                                        onSelectAll={handleSelectAll}
                                        onRecategorize={handleBulkRecategorize}
                                    />
                                )}
                            </AnimatePresence>
                            {Object.entries(groupedTransactions).map(([date, txs]: [string, Transaction[]]) => (
                                <div key={date}>
                                    <DateHeader date={date} />
                                    <ul className="space-y-2 py-2">
                                        <AnimatePresence>
                                            {txs.map(tx => (
                                                <TransactionItem 
                                                    key={tx.id} 
                                                    transaction={tx}
                                                    isSelected={selectedIds.includes(tx.id)}
                                                    isMutating={mutatingIds.has(tx.id)}
                                                    isInSelectionMode={isInSelectionMode}
                                                    onSelect={handleSelect}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                    setCurrentView={setCurrentView}
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