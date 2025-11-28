import React, { useState, useMemo } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { ArrowLeftRight, PlusCircle, FolderSync, Search } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Transaction, ViewType } from '../../types';
import { Button } from '../ui/Button';
import { useDialog } from '../../hooks/useDialog';
import { TransactionsViewSkeleton } from './skeletons/TransactionsViewSkeleton';
import { EmptyState } from '../ui/EmptyState';
import { TransactionsTable } from '../transactions/TransactionsTable';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Flex, Box, Grid } from '../ui/layout';
import { Card, CardContent } from '../ui/Card';

interface TransactionsViewProps {
    setCurrentView: (view: ViewType) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ setCurrentView }) => {
    const { transactions, loading, deleteTransaction, mutatingIds } = useDashboardData();
    const { openDialog } = useDialog();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  tx.category.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'all' || tx.type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [transactions, searchTerm, typeFilter]);

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
            onComplete: () => setSelectedIds([]),
        });
    };

    return (
        <Flex direction="col" className="h-full space-y-6">
            <PageHeader 
                icon={ArrowLeftRight} 
                title="Transações" 
                breadcrumbs={['FinanceHub', 'Transações']}
                actions={
                    <Button onClick={() => openDialog('add-transaction')}>
                        <PlusCircle className="w-4 h-4 mr-2"/> Nova Transação
                    </Button>
                }
            />

             {loading ? (
                <TransactionsViewSkeleton />
             ) : (
                <Flex direction="col" className="flex-grow overflow-hidden gap-4">
                    {/* Filters Bar */}
                    <Card>
                        <CardContent className="p-4">
                            <Grid cols={1} className="md:grid-cols-4 gap-4">
                                <div className="md:col-span-2 relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Buscar transações..." 
                                        className="pl-9"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os tipos</SelectItem>
                                        <SelectItem value="receita">Receitas</SelectItem>
                                        <SelectItem value="despesa">Despesas</SelectItem>
                                    </SelectContent>
                                </Select>
                                {selectedIds.length > 0 && (
                                    <Button variant="secondary" onClick={handleBulkRecategorize}>
                                        <FolderSync className="w-4 h-4 mr-2" />
                                        Recategorizar ({selectedIds.length})
                                    </Button>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Table Area */}
                    <div className="flex-grow overflow-auto rounded-md border bg-card">
                        {filteredTransactions.length > 0 ? (
                            <TransactionsTable 
                                transactions={filteredTransactions}
                                selectedIds={selectedIds}
                                onSelect={handleSelect}
                                onSelectAll={handleSelectAll}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                isMutating={(id) => mutatingIds.has(id)}
                            />
                        ) : (
                            <EmptyState
                                icon={ArrowLeftRight}
                                title={searchTerm ? "Nenhum resultado encontrado" : "Nenhuma Transação"}
                                description={searchTerm ? "Tente ajustar seus filtros de busca." : "Adicione suas despesas e receitas para começar a ter controle sobre suas finanças."}
                            >
                                {!searchTerm && (
                                    <Button onClick={() => openDialog('add-transaction')}>
                                        <PlusCircle className="w-4 h-4 mr-2"/> Adicionar Primeira Transação
                                    </Button>
                                )}
                            </EmptyState>
                        )}
                    </div>
                </Flex>
             )}
        </Flex>
    );
};