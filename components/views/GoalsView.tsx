import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Target, PlusCircle, TrashIcon, Trophy } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Goal, GoalStatus } from '../../types';
import { formatCurrencyBRL, formatDate, formatDaysUntil } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import { useDialog } from '../../hooks/useDialog';
import { EmptyState } from '../ui/EmptyState';
import { GenericViewSkeleton } from './skeletons/GenericViewSkeleton';
import { motion } from 'framer-motion';
import { AnimatedCurrency } from '../ui/AnimatedCurrency';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Flex, Box, Grid } from '../ui/layout';
import { Text, Heading } from '../ui/typography';

const GoalCard: React.FC<{ goal: Goal }> = ({ goal }) => {
    const { openDialog } = useDialog();
    const { deleteGoal, mutatingIds } = useDashboardData();
    const progress = (goal.current_amount / goal.target_amount) * 100;
    const isCompleted = goal.status === GoalStatus.CONCLUIDO;
    const isMutating = mutatingIds.has(goal.id);
    const daysUntil = formatDaysUntil(goal.deadline);
    const remainingAmount = Math.max(0, goal.target_amount - goal.current_amount);

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
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={isMutating ? 'opacity-50 pointer-events-none' : ''}
        >
            <Card className={`h-full flex flex-col justify-between ${isCompleted ? 'border-success/50 bg-success/5' : ''}`}>
                <CardHeader className="pb-2">
                    <Flex justify="between" align="start">
                        <CardTitle>{goal.name}</CardTitle>
                        <Badge variant={isCompleted ? 'success' : 'secondary'}>
                            {isCompleted ? <Flex align="center" gap="xs"><Trophy className="w-3.5 h-3.5" /> Concluído</Flex> : 'Em Andamento'}
                        </Badge>
                    </Flex>
                    <Text size="xs" variant="muted">
                        Prazo final: {formatDate(goal.deadline, 'long')}
                    </Text>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Box>
                        <Flex justify="between" className="mb-2 text-sm">
                            <Text>
                                {isCompleted ? 'Concluído!' : <>Faltam <Text weight="bold" as="span"><AnimatedCurrency value={remainingAmount} /></Text></>}
                            </Text>
                            <Text variant="muted">{`${progress.toFixed(0)}%`}</Text>
                        </Flex>
                        <Progress value={progress} className="h-2" />
                        {!isCompleted && (
                            <Flex justify="end" className="mt-2">
                                <Badge variant="outline" className={daysUntil.color === 'red' ? 'text-destructive border-destructive' : ''}>
                                    {daysUntil.text}
                                </Badge>
                            </Flex>
                        )}
                    </Box>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleDelete}
                        disabled={isMutating}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <TrashIcon className="w-5 h-5"/>
                    </Button>
                    {!isCompleted && (
                        <Button onClick={() => openDialog('add-value-to-goal', { goal })} size="sm" disabled={isMutating}>
                            Adicionar Valor
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export const GoalsView: React.FC = () => {
    const { goals, loading } = useDashboardData();
    const { openDialog } = useDialog();

    return (
        <Flex direction="col" className="h-full">
            <PageHeader 
                icon={Target} 
                title="Metas" 
                breadcrumbs={['FinanceHub', 'Metas']}
                actions={<Button onClick={() => openDialog('add-goal')}><PlusCircle className="w-4 h-4 mr-2"/> Nova Meta</Button>}
            />
            {loading ? (
                <GenericViewSkeleton />
            ) : (
                <Box className="flex-grow overflow-y-auto pr-2">
                    {goals.length > 0 ? (
                        <Grid cols={1} className="md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {goals.map(goal => (
                                <GoalCard key={goal.id} goal={goal} />
                            ))}
                        </Grid>
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
                </Box>
            )}
        </Flex>
    );
};