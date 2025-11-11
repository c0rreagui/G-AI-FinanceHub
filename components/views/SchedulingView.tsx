import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Calendar, PlusCircle } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ScheduledTransaction, TransactionType } from '../../types';
import { formatCurrencyBRL, formatDate } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useDialog } from '../../hooks/useDialog';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/skeletons/Skeleton';

const ScheduledTransactionCard: React.FC<{ item: ScheduledTransaction }> = ({ item }) => {
    const isExpense = item.type === TransactionType.DESPESA;

    return (
        <div className="card flex items-center gap-4">
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
                            {scheduledTransactions.map(item => (
                                <ScheduledTransactionCard key={item.id} item={item} />
                            ))}
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