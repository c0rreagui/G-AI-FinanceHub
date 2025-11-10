import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { TrendingDown, PlusCircle } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { formatCurrencyBRL } from '../../utils/formatters';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { Debt, DebtStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { useDialog } from '../../hooks/useDialog';
import { GenericViewSkeleton } from './skeletons/GenericViewSkeleton';
import { EmptyState } from '../ui/EmptyState';

const DebtCard: React.FC<{ debt: Debt; onPay: (debt: Debt) => void; }> = ({ debt, onPay }) => {
    const progress = Math.min((debt.paidAmount / debt.totalAmount) * 100, 100);
    const remainingAmount = debt.totalAmount - debt.paidAmount;
    
    return (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex flex-col">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                     <h3 className="text-lg font-semibold text-white">{debt.name}</h3>
                     <Badge color={debt.status === DebtStatus.PAGA ? 'green' : 'red'}>{debt.status}</Badge>
                </div>
                 <p className="text-sm text-gray-400 mt-1">{debt.category}</p>
                 <div className="my-4">
                     <div className="flex justify-between text-white font-bold text-2xl">
                         <span>{formatCurrencyBRL(remainingAmount)}</span>
                     </div>
                     <div className="text-right text-gray-400 text-sm">
                         restantes de {formatCurrencyBRL(debt.totalAmount)}
                     </div>
                 </div>
                 <ProgressBar percentage={progress} color="red"/>
                 <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Pago: {formatCurrencyBRL(debt.paidAmount)}</span>
                    <span>Taxa de Juros: {debt.interestRate}% a.a.</span>
                 </div>
            </div>
            <div className="mt-6 flex gap-2">
                <Button variant="secondary" className="w-full" onClick={() => alert('Histórico de pagamentos ainda não implementado.')}>Histórico</Button>
                {debt.status === DebtStatus.ATIVA && <Button className="w-full" onClick={() => onPay(debt)}>Realizar Pagamento</Button>}
            </div>
        </div>
    );
};


export const DebtsView: React.FC = () => {
    const { debts, loading } = useDashboardData();
    const { openDialog } = useDialog();

    const handleOpenPayment = (debt: Debt) => {
        openDialog('add-payment-to-debt', { debt: debt });
    };

    return (
        <>
            <PageHeader 
                icon={TrendingDown} 
                title="Controle de Dívidas" 
                breadcrumbs={['FinanceHub', 'Dívidas']}
                actions={<Button onClick={() => openDialog('add-debt')}><PlusCircle className="w-4 h-4"/> Adicionar Dívida</Button>}
            />
             {loading ? (
                <GenericViewSkeleton />
             ) : (
                <div className="mt-6 flex-grow overflow-y-auto pr-2">
                     {debts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {debts.map(debt => (
                                <DebtCard key={debt.id} debt={debt} onPay={handleOpenPayment} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={TrendingDown}
                            title="Nenhuma Dívida Encontrada"
                            description="Parece que você está com as contas em dia. Parabéns!"
                        />
                    )}
                </div>
             )}
        </>
    );
};