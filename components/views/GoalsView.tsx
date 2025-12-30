import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../layout/PageHeader';
import { Target, PlusCircle } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Button } from '../ui/Button';
import { useDialog } from '../../hooks/useDialog';
import { EmptyState } from '../ui/EmptyState';
import { GenericViewSkeleton } from './skeletons/GenericViewSkeleton';
import { Flex, Box } from '../ui/AppLayout';
import { GoalCard } from '../goals/GoalCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { BudgetManager } from '../budgets/BudgetManager';

// Stagger animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};
export const GoalsView: React.FC = () => {
    const { goals, loading } = useDashboardData();
    const { openDialog } = useDialog();
    const [activeTab, setActiveTab] = useState('goals');

    if (loading) {
        return (
            <Flex direction="col" className="h-full">
                <PageHeader 
                    icon={Target} 
                    title="Planejamento" 
                    breadcrumbs={['FinanceHub', 'Planejamento']}
                />
                <GenericViewSkeleton />
            </Flex>
        );
    }

    return (
        <Flex direction="col" className="h-full space-y-6">
            <PageHeader 
                icon={Target} 
                title="Planejamento Financeiro" 
                breadcrumbs={['FinanceHub', 'Metas e Orçamentos']}
            />
            
            <Box className="flex-grow overflow-y-auto pr-2">
                <Tabs defaultValue="goals" value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="goals">Metas</TabsTrigger>
                        <TabsTrigger value="budgets">Orçamentos</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="goals" className="space-y-6 outline-none">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Minhas Metas</h2>
                                <p className="text-muted-foreground">Defina e acompanhe seus objetivos financeiros.</p>
                            </div>
                            <Button onClick={() => openDialog('add-goal')} className="bg-primary text-primary-foreground hidden md:flex">
                                <PlusCircle className="w-4 h-4 mr-2"/> Nova Meta
                            </Button>
                             {/* Mobile Button shown via fixed FAB or similar if needed, but for now hidden on small screens? 
                                Actually the previous view had it in PageHeader. 
                                Let's keep it visible everywhere or responsive. 
                                'hidden md:flex' might hide it on mobile. Let's make it 'flex'.
                             */}
                             <Button onClick={() => openDialog('add-goal')} className="bg-primary text-primary-foreground flex md:hidden">
                                <PlusCircle className="w-4 h-4"/>
                            </Button>
                        </div>

                        {goals.length > 0 ? (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {goals.map(goal => (
                                    <motion.div key={goal.id} variants={itemVariants}>
                                        <GoalCard goal={goal} />
                                    </motion.div>
                                ))}
                            </motion.div>
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
                    </TabsContent>
                    
                    <TabsContent value="budgets" className="outline-none">
                        <BudgetManager />
                    </TabsContent>
                </Tabs>
            </Box>
        </Flex>
    );
};