import React from 'react';
import { Target, TrashIcon, Trophy } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Goal, GoalStatus } from '../../types';
import { formatDate, formatDaysUntil, formatCurrency } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import { useDialog } from '../../hooks/useDialog';
// import { motion } from 'framer-motion';
// import { AnimatedCurrency } from '../ui/AnimatedCurrency';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Flex, Box } from '../ui/AppLayout';
import { Text } from '../ui/AppTypography';
import { triggerConfetti } from '../ui/Confetti';

export const GoalCard: React.FC<{ goal: Goal }> = ({ goal }) => {
    const { openDialog } = useDialog();
    const { deleteGoal, mutatingIds } = useDashboardData();
    const progress = (goal.current_amount / goal.target_amount) * 100;
    const isCompleted = goal.status === GoalStatus.CONCLUIDO;
    const isMutating = mutatingIds.has(goal.id);
    const daysUntil = formatDaysUntil(goal.deadline);
    const remainingAmount = Math.max(0, goal.target_amount - goal.current_amount);
    
    const [coverImage, setCoverImage] = React.useState<string | null>(() => {
        return localStorage.getItem(`goal_cover_${goal.id}`);
    });

    const handleSetCover = () => {
        const url = prompt("Cole a URL da imagem de capa:");
        if (url) {
            setCoverImage(url);
            localStorage.setItem(`goal_cover_${goal.id}`, url);
        } else if (url === '') {
            setCoverImage(null);
            localStorage.removeItem(`goal_cover_${goal.id}`);
        }
    };

    const handleDelete = () => {
        openDialog('confirmation', {
            title: 'Excluir Meta',
            message: `Tem certeza que deseja excluir a meta "${goal.name}"? Todas as contribuições feitas para esta meta também serão removidas, e o valor retornará ao seu saldo.`,
            confirmText: 'Sim, Excluir',
            confirmVariant: 'destructive',
            onConfirm: () => deleteGoal(goal.id),
        });
    };

    React.useEffect(() => {
        if (isCompleted) {
            const hasCelebrated = sessionStorage.getItem(`celebrated_goal_${goal.id}`);
            if (!hasCelebrated) {
                triggerConfetti();
                sessionStorage.setItem(`celebrated_goal_${goal.id}`, 'true');
            }
        }
    }, [isCompleted, goal.id]);

    return (
        <div 
            className={isMutating ? 'opacity-50 pointer-events-none' : ''}
        >
            <Card className={`h-full flex flex-col justify-between overflow-hidden group relative ${isCompleted ? 'border-success/50 bg-success/5' : ''}`}>
                
                {/* Cover Image */}
                <div className="h-32 bg-muted/30 relative group-hover:h-32 transition-all duration-300">
                    {coverImage ? (
                        <img src={coverImage} alt={goal.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-900/20 to-blue-900/20">
                            <Target className="w-12 h-12 text-muted-foreground/20" />
                        </div>
                    )}
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white text-xs h-6 px-2"
                        onClick={handleSetCover}
                    >
                        {coverImage ? 'Alterar Capa' : 'Adicionar Capa'}
                    </Button>
                </div>

                <CardHeader className="pb-2 pt-4">
                    <Flex justify="between" align="start">
                        <CardTitle className="line-clamp-1" title={goal.name}>{goal.name}</CardTitle>
                        <Badge variant={isCompleted ? 'success' : 'secondary'}>
                            {isCompleted ? <Flex align="center" gap="xs"><Trophy className="w-3.5 h-3.5" /> Concluído</Flex> : 'Em Andamento'}
                        </Badge>
                    </Flex>
                    <Text size="xs" variant="muted">
                        Prazo final: {formatDate(goal.deadline, "d 'de' MMMM 'de' yyyy")}
                    </Text>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Box>
                        <Flex justify="between" className="mb-2 text-sm">
                            <Text>
                                {isCompleted ? 'Concluído!' : <>Faltam <Text weight="bold" as="span">{/* <AnimatedCurrency value={remainingAmount} /> */}{formatCurrency(remainingAmount)}</Text></>}
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
        </div>
    );
};
