import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Target, PlusCircle } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Button } from '../ui/Button';
import { useDialog } from '../../hooks/useDialog';
import { EmptyState } from '../ui/EmptyState';
import { GenericViewSkeleton } from './skeletons/GenericViewSkeleton';
import { Flex, Box, Grid } from '../ui/AppLayout';
import { GoalCard } from '../goals/GoalCard';

export const GoalsView: React.FC = () => {
    const { goals, loading } = useDashboardData();
    const { openDialog } = useDialog();

    return (
        <Flex direction="col" className="h-full">
            <PageHeader 
                icon={Target} 
                title="Metas" 
                breadcrumbs={['FinanceHub', 'Metas']}
                actions={<Button onClick={() => {}}><PlusCircle className="w-4 h-4 mr-2"/> Nova Meta</Button>}
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
                            action={
                                <Button onClick={() => openDialog('add-goal')}>
                                    <PlusCircle className="w-4 h-4 mr-2"/> Criar Primeira Meta
                                </Button>
                            }
                        />
                    )}
                </Box>
            )}
        </Flex>
    );
};