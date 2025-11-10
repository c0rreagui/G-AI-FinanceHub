import React, { useEffect } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Target, PlusCircle } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { formatCurrencyBRL } from '../../utils/formatters';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { Goal, GoalStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { useDialog } from '../../hooks/useDialog';
import { GenericViewSkeleton } from './skeletons/GenericViewSkeleton';
import { EmptyState } from '../ui/EmptyState';
// FIX: Import Variants type from framer-motion.
import { motion, Variants } from 'framer-motion';

const GoalCard: React.FC<{ goal: Goal, onAddValue: (goal: Goal) => void, isJustUpdated?: boolean }> = ({ goal, onAddValue, isJustUpdated }) => {
    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const isCompleted = goal.status === GoalStatus.CONCLUIDA;

    // FIX: Explicitly typed cardVariants with Variants to fix type error.
    const cardVariants: Variants = {
        rest: { 
            scale: 1, 
            borderColor: "rgba(255, 255, 255, 0.1)"
        },
        updated: {
            scale: [1, 1.02, 1],
            borderColor: ["rgba(255, 255, 255, 0.1)", "rgba(139, 92, 246, 0.7)", "rgba(255, 255, 255, 0.1)"],
            transition: { duration: 0.8, ease: "easeInOut" }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            animate={isJustUpdated ? "updated" : "rest"}
            className="bg-white/5 border backdrop-blur-xl rounded-2xl p-6 flex flex-col shadow-lg"
        >
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
                {!isCompleted && <Button className="w-full" onClick={() => onAddValue(goal)}>Adicionar Valor</Button>}
            </div>
        </motion.div>
    );
};

export const GoalsView: React.FC = () => {
    const { goals, loading, lastUpdatedGoalId, clearLastUpdatedGoalId } = useDashboardData();
    const { openDialog } = useDialog();

    useEffect(() => {
        if (lastUpdatedGoalId) {
            const timer = setTimeout(() => {
                clearLastUpdatedGoalId();
            }, 1000); // Duração um pouco maior que a animação para garantir
            return () => clearTimeout(timer);
        }
    }, [lastUpdatedGoalId, clearLastUpdatedGoalId]);

    const handleOpenAddValue = (goal: Goal) => {
        openDialog('add-value-to-goal', { goal: goal });
    };

    return (
        <>
            <PageHeader 
                icon={Target} 
                title="Minhas Metas" 
                breadcrumbs={['FinanceHub', 'Metas']}
                actions={<Button onClick={() => openDialog('add-goal')}><PlusCircle className="w-4 h-4"/> Nova Meta</Button>}
            />
            {loading ? (
                 <GenericViewSkeleton />
            ) : (
                <div className="mt-6 flex-grow overflow-y-auto pr-2">
                    {goals.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {goals.map(goal => (
                                <GoalCard 
                                    key={goal.id} 
                                    goal={goal} 
                                    onAddValue={handleOpenAddValue} 
                                    isJustUpdated={goal.id === lastUpdatedGoalId}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Target}
                            title="Nenhuma Meta Cadastrada"
                            description="Defina suas metas financeiras para começar a economizar para o que é importante para você."
                        >
                             <Button onClick={() => openDialog('add-goal')}><PlusCircle className="w-4 h-4 mr-2"/> Criar Primeira Meta</Button>
                        </EmptyState>
                    )}
                </div>
            )}
        </>
    );
};
