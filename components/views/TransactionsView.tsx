// FIX: Implemented the TransactionsView component to display a list of transactions.
import React, { useState, useMemo } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { ArrowLeftRight, PlusCircle, Filter } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { formatCurrencyBRL, formatDate } from '../../utils/formatters';
import { Transaction, TransactionType } from '../../types';
import { Button } from '../ui/Button';
import { useDialog } from '../../hooks/useDialog';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { TransactionsViewSkeleton } from './skeletons/TransactionsViewSkeleton';
import { EmptyState } from '../ui/EmptyState';

const TransactionItem: React.FC<{ transaction: Transaction; onEdit: (tx: Transaction) => void }> = ({ transaction, onEdit }) => {
    const isExpense = transaction.type === TransactionType.DESPESA;
    // The amount in the hook is already negative for expenses
    const amount = transaction.amount;
    const isMobile = useMediaQuery('(max-width: 640px)');

    return (
        <li 
            className="flex items-center justify-between py-4 px-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
            onClick={() => onEdit(transaction)}
        >
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{backgroundColor: `${transaction.category.color}20`}}>
                    <transaction.category.icon className="w-5 h-5" style={{color: transaction.category.color}} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{transaction.description}</p>
                    <p className="text-sm text-gray-400">
                        {isMobile ? formatDate(transaction.date, 'short') : `${transaction.category.name} • ${formatDate(transaction.date, 'short')}`}
                    </p>
                </div>
            </div>
            <p className={`font-semibold text-right pl-2 ${transaction.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                {transaction.amount < 0 ? '' : '+'} {formatCurrencyBRL(amount)}
            </p>
        </li>
    );
};

export const TransactionsView: React.FC = () => {
    const { transactions, loading } = useDashboardData();
    const { openDialog } = useDialog();
    const [filter, setFilter] = useState('all'); // all, income, expenses

    const handleEditTransaction = (tx: Transaction) => {
        openDialog('add-transaction', { prefill: tx });
    }
    
    const filteredTransactions = useMemo(() => {
        if (filter === 'income') {
            return transactions.filter(t => t.type === TransactionType.RECEITA);
        }
        if (filter === 'expenses') {
            return transactions.filter(t => t.type === TransactionType.DESPESA);
        }
        return transactions;
    }, [transactions, filter]);

    return (
        <>
            <PageHeader 
                icon={ArrowLeftRight} 
                title="Transações" 
                breadcrumbs={['FinanceHub', 'Transações']}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" onClick={() => alert('Filtros ainda não implementados.')}><Filter className="w-4 h-4 mr-2"/> Filtrar</Button>
                        <Button onClick={() => openDialog('add-transaction')}><PlusCircle className="w-4 h-4 mr-2"/> Nova Transação</Button>
                    </div>
                }
            />
             {loading ? (
                <TransactionsViewSkeleton />
             ) : (
                <div className="mt-6 flex-grow overflow-y-auto pr-2">
                    {filteredTransactions.length > 0 ? (
                        <ul className="divide-y divide-white/10">
                            {filteredTransactions.map(t => <TransactionItem key={t.id} transaction={t} onEdit={handleEditTransaction} />)}
                        </ul>
                    ) : (
                        <EmptyState
                            icon={ArrowLeftRight}
                            title="Nenhuma Transação Encontrada"
                            description="Comece a registrar suas despesas e receitas para ver seu histórico financeiro aqui."
                        >
                            <Button onClick={() => openDialog('add-transaction')}>
                                <PlusCircle className="w-4 h-4 mr-2"/> Nova Transação
                            </Button>
                        </EmptyState>
                    )}
                </div>
             )}
        </>
    );
};