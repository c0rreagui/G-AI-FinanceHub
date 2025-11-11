// components/views/GoalsView.tsx
import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Target, PlusCircle, TrashIcon } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Goal, GoalStatus } from '../../types';
import { formatCurrencyBRL, formatDate, formatDaysUntil } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { useDialog } from '../../hooks/useDialog';
import { EmptyState } from '../ui/EmptyState';
import { GenericViewSkeleton } from './skeletons/GenericViewSkeleton';
import { motion } from 'framer-motion';

const GoalCard: React.FC<{ goal: Goal }> = ({ goal }) => {
    const { openDialog } = useDialog();
    const { deleteGoal, mutatingIds } = useDashboardData();
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const isCompleted = goal.status === GoalStatus.CONCLUIDO;
    const isMutating = mutatingIds.has(goal.id);
    const daysUntil = formatDaysUntil(goal.deadline);


    const handleDelete = () => {
        openDialog('confirmation', {
            title: 'Excluir Meta',
            message: `Tem certeza que deseja excluir a meta "${goal.name}"? Todas as contribuições feitas para esta meta também serão removidas, e o valor retornará ao seu saldo.`,
            confirmText: 'Sim, Excluir',
            confirmVariant: 'destructive',
            onConfirm: () => deleteGoal(goal.id),
        });
    };

    return (
        <motion.div 
            className={`card flex flex-col justify-between transition-opacity ${isMutating ? 'opacity-50' : ''}`}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
        >
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-white">{goal.name}</h3>
                    <Badge color={isCompleted ? 'green' : 'blue'}>
                        {isCompleted ? 'Concluído' : 'Em Andamento'}
                    </Badge>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                    Prazo final: {formatDate(goal.deadline, 'long')}
                </p>
                <div className="mt-4">
                    <div className="flex justify-between text-sm text-white mb-1">
                        <span>{formatCurrencyBRL(goal.currentAmount)}</span>
                        <span className="text-gray-400">{formatCurrencyBRL(goal.targetAmount)}</span>
                    </div>
                    <ProgressBar percentage={progress} color={isCompleted ? 'success' : 'primary'} />
                    {!isCompleted && (
                         <div className="mt-2 text-right">
                             <Badge color={daysUntil.color}>{daysUntil.text}</Badge>
                         </div>
                    )}
                </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
                <button 
                    onClick={handleDelete}
                    disabled={isMutating}
                    className="p-2 text-gray-500 hover:text-red-400 disabled:opacity-50"
                    aria-label="Excluir meta"
                >
                    <TrashIcon className="w-5 h-5"/>
                </button>
                {!isCompleted && (
                    <Button onClick={() => openDialog('add-value-to-goal', { goal })} size="sm" disabled={isMutating}>
                        Adicionar Valor
                    </Button>
                )}
            </div>
        </motion.div>
    );
};

export const GoalsView: React.FC = () => {
    const { goals, loading } = useDashboardData();
    const { openDialog } = useDialog();

    return (
        <div className="flex flex-col h-full">
            <PageHeader 
                icon={Target} 
                title="Metas" 
                breadcrumbs={['FinanceHub', 'Metas']}
                actions={<Button onClick={() => openDialog('add-goal')}><PlusCircle className="w-4 h-4"/> Nova Meta</Button>}
            />
            {loading ? (
                <GenericViewSkeleton />
            ) : (
                <div className="flex-grow overflow-y-auto pr-2">
                    {goals.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {goals.map(goal => (
                                <GoalCard key={goal.id} goal={goal} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Target}
                            title="Nenhuma Meta Cadastrada"
                            description="Crie metas para economizar para um carro, uma viagem ou qualquer outro objetivo."
                        >
                            <Button onClick={() => openDialog('add-goal')}>
                                <PlusCircle className="w-4 h-4 mr-2"/> Criar Primeira Meta
                            </Button>
                        </EmptyState>
                    )}
                </div>
            )}
        </div>
    );
};