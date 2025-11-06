import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { ArrowLeftRight, PlusCircle, Filter, CreditCard as CreditCardIcon } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { formatCurrencyBRL, formatDate } from '../../utils/formatters';
import { Transaction, TransactionType } from '../../types';
import { Button } from '../ui/Button';
import { useDialog } from '../../hooks/useDialog';
import { LoadingSpinner } from '../LoadingSpinner';

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isExpense = transaction.type === TransactionType.DESPESA;
    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="p-4">
                <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{backgroundColor: `${transaction.category.color}20`}}>
                        <transaction.category.icon className="w-5 h-5" style={{color: transaction.category.color}} />
                    </div>
                    <div>
                        <p className="font-semibold text-white">{transaction.description}</p>
                        <p className="text-sm text-gray-400">{transaction.category.name}</p>
                    </div>
                </div>
            </td>
            <td className="p-4 text-right">
                 <p className={`font-semibold text-base ${isExpense ? 'text-red-400' : 'text-green-400'}`}>
                    {isExpense ? '' : '+'} {formatCurrencyBRL(transaction.amount)}
                </p>
            </td>
            <td className="p-4 text-gray-300 hidden md:table-cell">
                {transaction.cardName ? (
                    <div className="flex items-center gap-2">
                        <CreditCardIcon className="w-5 h-5 text-gray-400"/>
                        <span>{transaction.cardName}</span>
                    </div>
                ) : (
                    <span>-</span>
                )}
            </td>
            <td className="p-4 text-right text-gray-300">{formatDate(transaction.date)}</td>
        </tr>
    );
};


export const TransactionsView: React.FC = () => {
    const { transactions, loading } = useDashboardData();
    const { openDialog } = useDialog();
    
    return (
        <>
            <PageHeader
                icon={ArrowLeftRight}
                title="Transações"
                breadcrumbs={['FinanceHub', 'Transações']}
                actions={
                    <div className="flex gap-2">
                        <Button variant="secondary"><Filter className="w-4 h-4 mr-2"/> Filtrar</Button>
                        <Button onClick={() => openDialog('add-transaction')}><PlusCircle className="w-4 h-4 mr-2"/> Nova Transação</Button>
                    </div>
                }
            />
            {loading ? (
                <div className="flex-grow flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="mt-6 flex-grow overflow-y-auto pr-2">
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4">
                        <table className="w-full text-left">
                            <thead className="border-b border-white/10 text-sm text-gray-400">
                                <tr>
                                    <th className="p-4 font-semibold">Descrição</th>
                                    <th className="p-4 font-semibold text-right">Valor</th>
                                    <th className="p-4 font-semibold hidden md:table-cell">Cartão</th>
                                    <th className="p-4 font-semibold text-right">Data</th>
                                </tr>
                            </thead>
                             <tbody className="divide-y divide-white/10">
                                {transactions.length > 0 ? (
                                    transactions.map(t => <TransactionRow key={t.id} transaction={t} />)
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center text-gray-400 py-8">
                                            <p>Nenhuma transação encontrada.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};