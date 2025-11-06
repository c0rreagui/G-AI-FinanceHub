import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { ArrowLeftRight, ArrowDownLeft, ArrowUpRight, PlusCircle, CreditCard, Filter, MoreHorizontal } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { formatCurrencyBRL, formatDate } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { Transaction, TransactionType } from '../../types';

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const isExpense = transaction.type === TransactionType.DESPESA;
  return (
    <div className="flex items-center space-x-4 py-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{backgroundColor: `${transaction.category.color}20`}}>
        <transaction.category.icon className="w-5 h-5" style={{color: transaction.category.color}} />
      </div>
      <div className="flex-1">
        <p className="font-medium text-white">{transaction.description}</p>
        <p className="text-sm text-gray-400">
          {formatDate(transaction.date, 'long')}
          {transaction.installment && ` (${transaction.installment.current}/${transaction.installment.total})`}
        </p>
      </div>
      <div className={`text-right font-semibold ${isExpense ? 'text-red-400' : 'text-green-400'}`}>
        {isExpense ? '-' : '+'} {formatCurrencyBRL(Math.abs(transaction.amount))}
      </div>
    </div>
  );
};

export const TransactionsView: React.FC = () => {
    const { summary, transactions, creditCards, invoices } = useDashboardData();
    const mainCard = creditCards[0];
    const mainInvoice = invoices.find(inv => inv.cardId === mainCard.id);

    const groupedTransactions = transactions.reduce((acc, tx) => {
        const date = new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(tx);
        return acc;
    }, {} as Record<string, Transaction[]>);

    return (
        <>
            <PageHeader 
                icon={ArrowLeftRight} 
                title="Transações" 
                breadcrumbs={['FinanceHub', 'Transações']} 
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="secondary"><Filter className="w-4 h-4 mr-2"/> Filtrar</Button>
                        <Button><PlusCircle className="w-4 h-4 mr-2"/> Adicionar</Button>
                    </div>
                }
            />
            <div className="mt-6 flex-grow overflow-y-auto pr-2">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Principal - Lista de Transações */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                            <h3 className="text-sm font-medium text-gray-400">Saldo em Contas</h3>
                            <p className="text-2xl font-semibold text-white mt-1">{formatCurrencyBRL(summary.totalBalance)}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                            <h3 className="text-sm font-medium text-gray-400">Receitas no Mês</h3>
                            <p className="text-2xl font-semibold text-green-400 mt-1">{formatCurrencyBRL(summary.monthlyIncome)}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                            <h3 className="text-sm font-medium text-gray-400">Despesas no Mês</h3>
                            <p className="text-2xl font-semibold text-red-400 mt-1">{formatCurrencyBRL(Math.abs(summary.monthlyExpenses))}</p>
                        </div>
                    </div>
                  
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
                       <h2 className="text-lg font-semibold text-white mb-4">Histórico de Transações</h2>
                        <div className="space-y-4">
                            {Object.entries(groupedTransactions).map(([date, txs]) => (
                                <div key={date}>
                                    <h3 className="text-sm font-semibold text-gray-400 my-2">{date}</h3>
                                    <div className="divide-y divide-white/10">
                                        {txs.map(tx => <TransactionItem key={tx.id} transaction={tx} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Coluna Direita - Cartão de Crédito */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-white">Cartão de Crédito</h2>
                            <MoreHorizontal className="text-gray-400"/>
                        </div>
                        {mainCard && mainInvoice && (
                          <div className="mt-4">
                            <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg text-white">
                               <div className="flex justify-between items-start">
                                 <div>
                                   <p className="text-sm">{mainCard.name}</p>
                                   <p className="text-xs opacity-70">{mainCard.flag}</p>
                                 </div>
                                 <CreditCard className="w-8 h-8 opacity-80" />
                               </div>
                                <p className="text-2xl font-bold tracking-wider mt-6">&#x2022;&#x2022;&#x2022;&#x2022; 1234</p>
                            </div>
                            <div className="mt-6 space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-300">Fatura Atual</span>
                                        <span className="font-semibold text-white">{formatCurrencyBRL(mainInvoice.totalAmount)}</span>
                                    </div>
                                    <ProgressBar percentage={(mainInvoice.totalAmount / mainCard.limit) * 100} />
                                    <div className="flex justify-between text-xs mt-1 text-gray-400">
                                        <span>Fecha em {mainInvoice.closingDate.substring(8, 10)}/{mainInvoice.closingDate.substring(5, 7)}</span>
                                        <span>Limite: {formatCurrencyBRL(mainCard.limit)}</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <Badge color="yellow">Status: {mainInvoice.status}</Badge>
                                </div>
                                <h3 className="text-base font-semibold text-white pt-4 border-t border-white/10">Próximas Parcelas</h3>
                                <div className="space-y-3 text-sm">
                                  {mainInvoice.transactions.filter(t => t.installment && t.installment.total > 1).map(t => (
                                      <div key={t.id} className="flex justify-between">
                                        <span className="text-gray-300">{t.description} ({t.installment?.current}/{t.installment?.total})</span>
                                        <span className="text-white font-medium">{formatCurrencyBRL(Math.abs(t.amount))}</span>
                                      </div>
                                  ))}
                                </div>
                            </div>
                          </div>
                        )}
                    </div>
                </div>
              </div>
            </div>
        </>
    );
};