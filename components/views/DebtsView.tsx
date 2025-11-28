// components/views/DebtsView.tsx
import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { TrendingDown, PlusCircle, TrashIcon, Trophy } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Debt, DebtStatus } from '../../types';
import { formatCurrencyBRL } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { useDialog } from '../../hooks/useDialog';
import { EmptyState } from '../ui/EmptyState';
import { GenericViewSkeleton } from './skeletons/GenericViewSkeleton';
import { motion } from 'framer-motion';
import { AnimatedCurrency } from '../ui/AnimatedCurrency';

const DebtCard: React.FC<{ debt: Debt }> = ({ debt }) => {
    const { openDialog } = useDialog();
    const { deleteDebt, mutatingIds } = useDashboardData();
    // FIX: Corrected field names to snake_case to match database schema.
    const progress = (debt.paid_amount / debt.total_amount) * 100;
    const isPaid = debt.status === DebtStatus.PAGA;
    const isMutating = mutatingIds.has(debt.id);

    const handleDelete = () => {
        openDialog('confirmation', {
            title: 'Excluir Dívida',
            message: `Tem certeza que deseja excluir a dívida "${debt.name}"? Todos os pagamentos feitos para esta dívida também serão removidos, e o valor retornará ao seu saldo.`,
            confirmText: 'Sim, Excluir',
            confirmVariant: 'destructive',
            onConfirm: () => deleteDebt(debt.id),
        });
    };

    return (
        <motion.div 
            className={`card flex flex-col justify-between transition-opacity ${isMutating ? 'opacity-50' : ''} ${isPaid ? 'card-completed' : ''}`}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
        >
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-white">{debt.name}</h3>
                    <Badge color={isPaid ? 'green' : 'red'}>
                        {isPaid ? <div className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> Paga</div> : 'Ativa'}
                    </Badge>
                </div>
                <div className="text-sm text-gray-400 mt-1 space-y-0.5">
                    {/* FIX: Corrected field name to snake_case to match database schema. */}
                    <p>Juros: <span className="font-medium text-gray-300">{debt.interest_rate}% a.a.</span></p>
                    <p>Categoria: <span className="font-medium text-gray-300">{debt.category}</span></p>
                </div>

                <div className="mt-4">
                    <div className="flex justify-between text-sm text-white mb-1">
                        <span className="truncate">
                            {/* FIX: Corrected field names to snake_case to match database schema. */}
                            Pago <span className="font-bold"><AnimatedCurrency value={debt.paid_amount} /></span> de {formatCurrencyBRL(debt.total_amount)}
                        </span>
                        <span className="text-gray-300 font-medium">{`${progress.toFixed(0)}%`}</span>
                    </div>
                    <ProgressBar percentage={progress} color={isPaid ? 'success' : 'danger'} />
                </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
                 <button 
                    onClick={handleDelete}
                    disabled={isMutating}
                    className="p-2 text-gray-500 hover:text-red-400 disabled:opacity-50"
                    aria-label="Excluir dívida"
                >
                    <TrashIcon className="w-5 h-5"/>
                </button>
                {!isPaid && (
                    <Button variant="primary" onClick={() => openDialog('add-payment-to-debt', { debt })} size="sm" disabled={isMutating}>
                        Realizar Pagamento
                    </Button>
                )}
            </div>
        </motion.div>
    );
};

export const DebtsView: React.FC = () => {
    const { debts, loading } = useDashboardData();
    const { openDialog } = useDialog();

    return (
        <div className="flex flex-col h-full">
            <PageHeader 
                icon={TrendingDown} 
                title="Dívidas" 
                breadcrumbs={['FinanceHub', 'Dívidas']}
                actions={<Button onClick={() => openDialog('add-debt')}><PlusCircle className="w-4 h-4"/> Nova Dívida</Button>}
            />
            {loading ? (
                <GenericViewSkeleton />
            ) : (
                <div className="flex-grow overflow-y-auto pr-2">
                    {debts.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {debts.map(debt => (
                                <DebtCard key={debt.id} debt={debt} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={TrendingDown}
                            title="Nenhuma Dívida Registrada"
                            description="Adicione suas dívidas, como empréstimos ou faturas de cartão, para gerenciá-las."
                        >
                            <Button onClick={() => openDialog('add-debt')}>
                                <PlusCircle className="w-4 h-4 mr-2"/> Adicionar Dívida
                            </Button>
                        </EmptyState>
                    )}
                </div>
            )}
        </div>
    );
};