import React, { useState, useMemo } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { ArrowLeftRight, Filter, PlusCircle, XIcon } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Transaction, TransactionType } from '../../types';
import { formatCurrencyBRL, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../LoadingSpinner';
import { Button } from '../ui/Button';
import { useDialog } from '../../hooks/useDialog';

const TransactionListItem: React.FC<{ 
    transaction: Transaction, 
    onDelete: (id: string) => void,
    onEdit: (transaction: Transaction) => void
}> = ({ transaction, onDelete, onEdit }) => {
    const isExpense = transaction.amount < 0;
    const amount = transaction.amount;

    return (
        <div className="bg-white/5 p-4 rounded-lg flex items-center gap-4 group">
            <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer" 
                style={{ backgroundColor: `${transaction.category.color}20` }}
                onClick={() => onEdit(transaction)}
            >
                <transaction.category.icon className="w-6 h-6" style={{ color: transaction.category.color }} />
            </div>
            <div 
                className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 items-center cursor-pointer"
                onClick={() => onEdit(transaction)}
            >
                <div>
                    <p className="font-semibold text-white truncate">{transaction.description}</p>
                    <p className="text-sm text-gray-400">{transaction.category.name}</p>
                </div>
                <div className="hidden md:block">
                    <p className="text-gray-300">{formatDate(transaction.date, 'short')}</p>
                </div>
                <div className="hidden md:block">
                     <p className="text-gray-300">Conta Principal</p>
                </div>
                <p className={`font-semibold text-right ${isExpense ? 'text-red-400' : 'text-green-400'}`}>
                    {isExpense ? '' : '+'} {formatCurrencyBRL(amount)}
                </p>
            </div>
            <button 
                onClick={() => onDelete(transaction.id)}
                className="p-1 rounded-full text-gray-600 hover:text-red-400 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Deletar transação"
            >
                <XIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export const TransactionsView: React.FC = () => {
    const { transactions, loading, deleteTransaction } = useDashboardData();
    const { openDialog } = useDialog();
    const [filterText, setFilterText] = useState('');
    const [showFilter, setShowFilter] = useState(false);

    const filteredTransactions = useMemo(() => {
        if (!filterText) return transactions;
        return transactions.filter(t => 
            t.description.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [transactions, filterText]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja deletar esta transação?")) {
            await deleteTransaction(id);
            // O hook agora cuida de mostrar o erro, se houver.
        }
    };
    
    const handleEdit = (transaction: Transaction) => {
        openDialog('add-transaction', { prefill: transaction });
    };

    return (
        <>
            <PageHeader
                icon={ArrowLeftRight}
                title="Transações"
                breadcrumbs={['FinanceHub', 'Transações']}
                actions={
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => setShowFilter(!showFilter)}>
                            <Filter className="w-4 h-4" /> 
                            {showFilter ? 'Fechar Filtro' : 'Filtrar'}
                        </Button>
                        <Button onClick={() => openDialog('add-transaction')}><PlusCircle className="w-4 h-4" /> Nova Transação</Button>
                    </div>
                }
            />
            {showFilter && (
                 <div className="mt-4 bg-black/20 p-4 rounded-lg flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <input 
                        type="text"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        placeholder="Filtrar por descrição..."
                        className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                    />
                    {filterText && (
                        <button onClick={() => setFilterText('')} className="text-gray-400 hover:text-white">
                            <XIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )}
            {loading ? (
                <div className="flex-grow flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="mt-6 flex-grow overflow-y-auto pr-2">
                    {filteredTransactions.length > 0 ? (
                        <div className="space-y-3">
                            {filteredTransactions.map(item => (
                                <TransactionListItem 
                                    key={item.id} 
                                    transaction={item} 
                                    onDelete={handleDelete} 
                                    onEdit={handleEdit}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            <p>Nenhuma transação encontrada.</p>
                             {filterText ? (
                                <p className="text-sm mt-2">Tente um termo de busca diferente.</p>
                             ) : (
                                <p className="text-sm mt-2">Clique em "Nova Transação" para adicionar a primeira.</p>
                             )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};