import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Target, PlusCircle } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { formatCurrencyBRL } from '../../utils/formatters';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { Goal, GoalStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { useDialog } from '../../hooks/useDialog';

const GoalCard: React.FC<{ goal: Goal }> = ({ goal }) => {
    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const isCompleted = goal.status === GoalStatus.CONCLUIDA;

    return (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex flex-col">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-white">{goal.name}</h3>
                    <Badge color={isCompleted ? 'green' : 'blue'}>{goal.status}</Badge>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                    Prazo final: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                </p>
                <div className="my-4">
                    <div className="flex justify-between text-white font-bold text-2xl">
                        <span>{formatCurrencyBRL(goal.currentAmount)}</span>
                    </div>
                    <div className="text-right text-gray-400 text-sm">
                        de {formatCurrencyBRL(goal.targetAmount)}
                    </div>
                </div>
                <ProgressBar percentage={progress} color={isCompleted ? 'green' : 'indigo'}/>
            </div>
            <div className="mt-6 flex gap-2">
                <Button variant="secondary" className="w-full">Ver Detalhes</Button>
                {!isCompleted && <Button className="w-full">Adicionar Valor</Button>}
            </div>
        </div>
    );
};

export const GoalsView: React.FC = () => {
    const { goals } = useDashboardData();
    const { openDialog } = useDialog();

    return (
        <>
            <PageHeader 
                icon={Target} 
                title="Minhas Metas" 
                breadcrumbs={['FinanceHub', 'Metas']}
                actions={<Button onClick={() => openDialog('add-goal')}><PlusCircle className="w-4 h-4 mr-2"/> Nova Meta</Button>}
            />
            <div className="mt-6 flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => (
                        <GoalCard key={goal.id} goal={goal} />
                    ))}
                </div>
            </div>
        </>
    );
};