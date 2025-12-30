import React, { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { ArrowLeftRight, PlusCircle, FolderSync, Upload, Trash2 } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Transaction, ViewType } from '../../types';
import { Button } from '../ui/Button';
import { useDialog } from '../../hooks/useDialog';
import { TransactionsViewSkeleton } from './skeletons/TransactionsViewSkeleton';
import { EmptyState } from '../ui/EmptyState';
import { TransactionsTable } from '../transactions/TransactionsTable';
import { FilterBar } from '../transactions/FilterBar';
import { BulkActionsBar } from '../transactions/BulkActionsBar';
import { SmartReclassificationDialog } from '../transactions/SmartReclassificationDialog';
import { TrashDialog } from '../transactions/TrashDialog';
import { AuditLogDialog } from '../dashboard/AuditLogDialog';
import { History } from 'lucide-react';
import { groupTransactionsByDate, GroupBy } from '../../utils/dateGrouping';

import { Flex } from '../ui/AppLayout';

interface TransactionsViewProps {
    setCurrentView: (view: ViewType) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ setCurrentView }) => {
    const { transactions, accounts, loading, deleteTransaction, mutatingIds, categories, toggleTransactionStar } = useDashboardData();
    const { openDialog } = useDialog();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if input/textarea is focused
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

            if (e.key.toLowerCase() === 'n') {
                e.preventDefault();
                openDialog('add-transaction');
            }
        };

        globalThis.addEventListener('keydown', handleKeyDown);
        return () => globalThis.removeEventListener('keydown', handleKeyDown);
    }, [openDialog]);

    // Advanced Filters State
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [groupBy, setGroupBy] = useState<GroupBy>('none');

    const [isReclassifyOpen, setIsReclassifyOpen] = useState(false);
    const [isTrashOpen, setIsTrashOpen] = useState(false);
    const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            // Search Logic
            const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tx.category.name.toLowerCase().includes(searchTerm.toLowerCase());

            // Type Logic
            let matchesType = true;
            if (typeFilter === 'all') {
                matchesType = true;
            } else if (typeFilter === 'receita') {
                matchesType = tx.type === 'receita';
            } else if (typeFilter === 'despesa') {
                matchesType = tx.type === 'despesa';
            }

            // Date Range Logic
            let matchesDate = true;
            if (startDate && endDate) {
                const txDate = new Date(tx.date).toISOString().split('T')[0];
                matchesDate = txDate >= startDate && txDate <= endDate;
            } else if (startDate) {
                const txDate = new Date(tx.date).toISOString().split('T')[0];
                matchesDate = txDate >= startDate;
            } else if (endDate) {
                const txDate = new Date(tx.date).toISOString().split('T')[0];
                matchesDate = txDate <= endDate;
            }

            // Category Logic
            let matchesCategory = true;
            if (selectedCategories.length > 0) {
                matchesCategory = selectedCategories.includes(tx.category_id);
            }

            // Account Logic
            let matchesAccount = true;
            if (selectedAccounts.length > 0) {
                matchesAccount = selectedAccounts.includes(tx.account_id);
            }

            return matchesSearch && matchesType && matchesDate && matchesCategory && matchesAccount;
        });
    }, [transactions, searchTerm, typeFilter, startDate, endDate, selectedCategories, selectedAccounts]);

    const selectableTransactions = useMemo(() =>
        filteredTransactions.filter(tx => !tx.goal_contribution_id && !tx.debt_payment_id),
        [filteredTransactions]);

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

    const handleDuplicate = (transaction: Transaction) => {
        openDialog('add-transaction', {
            prefill: {
                type: transaction.type,
                description: `${transaction.description} (cópia)`,
                amount: Math.abs(transaction.amount),
                category_id: transaction.category_id,
                notes: transaction.notes,
                account_id: transaction.account_id,
                status: transaction.status,
                exclude_from_reports: transaction.exclude_from_reports,
                reconciled: false,
            }
        });
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



    const handleClearFilters = () => {
        setSearchTerm('');
        setTypeFilter('all');
        setStartDate(null);
        setEndDate(null);
        setSelectedCategories([]);
        setSelectedAccounts([]);
    };

    return (
        <Flex direction="col" className="h-full space-y-6">
            <PageHeader
                icon={ArrowLeftRight}
                title="Transações"
                breadcrumbs={['FinanceHub', 'Transações']}
                setCurrentView={setCurrentView}
                actions={
                    <Flex gap="sm">
                        <Button variant="outline" onClick={() => setIsReclassifyOpen(true)} title="Reclassificação Inteligente">
                            <FolderSync className="w-4 h-4 mr-2" />
                            Reclassificar
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setIsTrashOpen(true)} title="Lixeira">
                            <Trash2 className="w-5 h-5 text-muted-foreground hover:text-red-500 transition-colors" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setIsAuditLogOpen(true)} title="Histórico de Alterações">
                            <History className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                        </Button>
                        <Button variant="outline" onClick={() => openDialog('import-transactions')}>
                            <Upload className="w-4 h-4 mr-2" /> Importar
                        </Button>
                        <Button onClick={() => openDialog('add-transaction')}>
                            <PlusCircle className="w-4 h-4 mr-2" /> Nova Transação
                        </Button>
                    </Flex>
                }
            />

            {loading ? (
                <TransactionsViewSkeleton />
            ) : (
                <Flex direction="col" className="flex-grow overflow-hidden gap-4">
                    {/* Filters Bar */}
                    <FilterBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        startDate={startDate}
                        endDate={endDate}
                        onDateChange={(start, end) => { setStartDate(start); setEndDate(end); }}
                        selectedCategories={selectedCategories}
                        onCategoriesChange={setSelectedCategories}
                        categories={categories}
                        selectedAccounts={selectedAccounts}
                        onAccountsChange={setSelectedAccounts}
                        accounts={accounts}
                        typeFilter={typeFilter}
                        onTypeFilterChange={setTypeFilter}
                        onClearFilters={handleClearFilters}
                    />



                    {/* Date Grouping Control (Item 118) */}
                    <div className="flex items-center gap-3 px-1 mb-2">
                        <label htmlFor="grouping-select" className="text-sm font-medium text-muted-foreground">
                            Agrupar por:
                        </label>
                        <select
                            id="grouping-select"
                            title="Selecione como agrupar as transações"
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                            className="bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="none">Sem agrupamento</option>
                            <option value="day">Dia</option>
                            <option value="week">Semana</option>
                            <option value="month">Mês</option>
                        </select>
                    </div>

                    {/* Table Area */}
                    <div className="flex-grow overflow-auto rounded-md border bg-card">
                        {filteredTransactions.length > 0 ? (
                            <TransactionsTable
                                transactions={filteredTransactions}
                                groupBy={groupBy}
                                groupedData={groupBy !== 'none' ? groupTransactionsByDate(filteredTransactions, groupBy) : []}
                                selectedIds={selectedIds}
                                onSelect={handleSelect}
                                onSelectAll={handleSelectAll}
                                onEdit={handleEdit}
                                onDuplicate={handleDuplicate}
                                onDelete={handleDelete}
                                onComments={(tx) => openDialog('transaction-comments', { transaction: tx })}
                                isMutating={(id) => mutatingIds.has(id)}
                                onToggleStar={toggleTransactionStar}
                            />
                        ) : (
                            <EmptyState
                                icon={ArrowLeftRight}
                                title={searchTerm ? "Nenhum resultado encontrado" : "Nenhuma Transação"}
                                description={searchTerm ? "Tente ajustar seus filtros de busca." : "Adicione suas despesas e receitas para começar a ter controle sobre suas finanças."}
                            >
                                {!searchTerm && (
                                    <Button onClick={() => openDialog('add-transaction')}>
                                        <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Primeira Transação
                                    </Button>
                                )}
                            </EmptyState>
                        )}
                    </div>
                </Flex>
            )}

            {/* Mobile FAB */}
            <div className="md:hidden fixed bottom-24 right-6 z-[80]">
                <Button
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-glow bg-primary hover:bg-primary/90 transition-all active:scale-95"
                    onClick={() => openDialog('add-transaction')}
                >
                    <PlusCircle className="h-6 w-6 text-primary-foreground" />
                </Button>
            </div>

            <BulkActionsBar selectedIds={selectedIds} onClearSelection={() => setSelectedIds([])} />

            <SmartReclassificationDialog
                isOpen={isReclassifyOpen}
                onClose={() => setIsReclassifyOpen(false)}
                onSuccess={() => {
                    // Optional: refresh data if needed, but bulkUpdateTransactions already does it
                }}
            />

            <TrashDialog
                open={isTrashOpen}
                onOpenChange={setIsTrashOpen}
            />

            <AuditLogDialog
                isOpen={isAuditLogOpen}
                onClose={() => setIsAuditLogOpen(false)}
            />
        </Flex>
    );
};