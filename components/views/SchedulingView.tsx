import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Calendar, PlusCircle } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ScheduledTransaction, TransactionType } from '../../types';
import { formatCurrencyBRL, formatDate } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LoadingSpinner } from '../LoadingSpinner';
import { useDialog } from '../../hooks/useDialog';

const ScheduledTransactionCard: React.FC<{ item: ScheduledTransaction }> = ({ item }) => {
    const isExpense = item.type === TransactionType.DESPESA;

    return (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex items-center gap-4">
             <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`} style={{backgroundColor: `${item.category.color}20`}}>
                <item.category.icon className="w-6 h-6" style={{color: item.category.color}} />
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-white">{item.description}</h3>
                     <span className={`font-semibold text-lg ${isExpense ? 'text-red-400' : 'text-green-400'}`}>
                        {isExpense ? '-' : '+'} {formatCurrencyBRL(item.amount)}
                    </span>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                    <span>Próximo vencimento: {formatDate(item.nextDueDate)}</span>
                    <Badge color="blue">{item.frequency}</Badge>
                </div>
            </div>
        </div>
    );
}

export const SchedulingView: React.FC = () => {
    const { scheduledTransactions, loading } = useDashboardData();
    const { openDialog } = useDialog();

    return (
        <>
            <PageHeader
                icon={Calendar}
                title="Agendamentos"
                breadcrumbs={['FinanceHub', 'Agendamentos']}
                actions={<Button onClick={() => openDialog('add-scheduling')}><PlusCircle className="w-4 h-4 mr-2"/> Novo Agendamento</Button>}
            />
            {loading ? (
                <div className="flex-grow flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="mt-6 flex-grow overflow-y-auto pr-2">
                    {scheduledTransactions.length > 0 ? (
                        <div className="space-y-4">
                            {scheduledTransactions.map(item => (
                                <ScheduledTransactionCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            <p>Nenhum agendamento encontrado.</p>
                            <p className="text-sm mt-2">Adicione transações recorrentes para gerenciá-las aqui.</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};