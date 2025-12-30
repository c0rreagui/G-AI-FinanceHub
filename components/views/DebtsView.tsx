import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { TrendingDown, PlusCircle, TrashIcon, Trophy } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Debt, DebtStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import { useDialog } from '../../hooks/useDialog';
import { EmptyState } from '../ui/EmptyState';
import { GenericViewSkeleton } from './skeletons/GenericViewSkeleton';
import { motion } from 'framer-motion';
import { AnimatedCurrency } from '../ui/AnimatedCurrency';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Flex, Box, Grid } from '../ui/AppLayout';
import { Text } from '../ui/AppTypography';

const DebtCard: React.FC<{ debt: Debt }> = ({ debt }) => {
    const { openDialog } = useDialog();
    const { deleteDebt, mutatingIds } = useDashboardData();
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
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            {...({ className: isMutating ? 'opacity-50 pointer-events-none' : '' } as any)}
        >
            <Card className={`h-full flex flex-col justify-between ${isPaid ? 'border-success/50 bg-success/5' : ''}`}>
                <CardHeader className="pb-2">
                    <Flex justify="between" align="start">
                        <CardTitle>{debt.name}</CardTitle>
                        <Badge variant={isPaid ? 'success' : 'destructive'}>
                            {isPaid ? <Flex align="center" gap="xs"><Trophy className="w-3.5 h-3.5" /> Paga</Flex> : 'Ativa'}
                        </Badge>
                    </Flex>
                    <div className="space-y-1 mt-1">
                        <Text size="xs" variant="muted">
                            Juros: <Text as="span" weight="medium" className="text-foreground">{debt.interest_rate}% a.a.</Text>
                        </Text>
                        <Text size="xs" variant="muted">
                            Categoria: <Text as="span" weight="medium" className="text-foreground">{debt.category}</Text>
                        </Text>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Box>
                        <Flex justify="between" className="mb-2 text-sm">
                            <Text className="truncate">
                                Pago <Text weight="bold" as="span"><AnimatedCurrency value={debt.paid_amount} /></Text> de {formatCurrency(debt.total_amount)}
                            </Text>
                            <Text variant="muted">{`${progress.toFixed(0)}%`}</Text>
                        </Flex>
                        <Progress value={progress} className="h-2" />
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
                    {!isPaid && (
                        <Button variant="default" onClick={() => openDialog('add-payment-to-debt', { debt })} size="sm" disabled={isMutating}>
                            Realizar Pagamento
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export const DebtsView: React.FC = () => {
    const { debts, loading } = useDashboardData();
    const { openDialog } = useDialog();

    return (
        <Flex direction="col" className="h-full">
            <PageHeader setCurrentView={setCurrentView} 
                icon={TrendingDown} 
                title="Dívidas" 
                breadcrumbs={['FinanceHub', 'Dívidas']}
                actions={<Button onClick={() => openDialog('add-debt')}><PlusCircle className="w-4 h-4 mr-2"/> Nova Dívida</Button>}
            />
            {loading ? (
                <GenericViewSkeleton />
            ) : (
                <Box className="flex-grow overflow-y-auto pr-2">
                    {debts.length > 0 ? (
                         <Grid cols={1} className="md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {debts.map(debt => (
                                <DebtCard key={debt.id} debt={debt} />
                            ))}
                        </Grid>
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
                </Box>
            )}
        </Flex>
    );
};
