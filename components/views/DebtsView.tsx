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

const DebtCard: React.FC<{ debt: Debt }> = ({ debt }) => {
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
                <Button variant="secondary" className="w-full">Histórico</Button>
                {debt.status === DebtStatus.ATIVA && <Button className="w-full">Realizar Pagamento</Button>}
            </div>
        </div>
    );
};


export const DebtsView: React.FC = () => {
    const { debts } = useDashboardData();
    const { openDialog } = useDialog();

    return (
        <>
            <PageHeader 
                icon={TrendingDown} 
                title="Controle de Dívidas" 
                breadcrumbs={['FinanceHub', 'Dívidas']}
                actions={<Button onClick={() => openDialog('add-debt')}><PlusCircle className="w-4 h-4 mr-2"/> Adicionar Dívida</Button>}
            />
             <div className="mt-6 flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {debts.map(debt => (
                        <DebtCard key={debt.id} debt={debt} />
                    ))}
                </div>
            </div>
        </>
    );
};