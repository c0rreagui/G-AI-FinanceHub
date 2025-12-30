import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useDialog } from '../../hooks/useDialog';
import { motion, AnimatePresence } from 'framer-motion';

export const GettingStartedChecklist: React.FC = () => {
    const { transactions, goals, debts } = useDashboardData();
    const { openDialog } = useDialog();

    const steps = useMemo(() => [
        {
            id: 'first-transaction',
            label: 'Adicionar primeira transação',
            completed: transactions.length > 0,
            action: () => openDialog('add-transaction'),
            cta: 'Adicionar'
        },
        {
            id: 'first-goal',
            label: 'Criar uma meta de economia',
            completed: goals.length > 0,
            action: () => openDialog('add-goal'),
            cta: 'Criar Meta'
        },
        {
            id: 'first-debt',
            label: 'Registrar dívidas (se houver)',
            completed: debts.length > 0 || localStorage.getItem('financehub_debts_skipped') === 'true',
            action: () => openDialog('add-debt'),
            cta: 'Registrar',
            skippable: true
        }
    ], [transactions, goals, debts, openDialog]);

    const completedCount = steps.filter(s => s.completed).length;
    const progress = (completedCount / steps.length) * 100;
    const isFullyComplete = progress === 100;

    const handleSkip = (stepId: string) => {
        if (stepId === 'first-debt') {
            localStorage.setItem('financehub_debts_skipped', 'true');
            // Force re-render logic if needed, or simple reload for now as this is a quick win
            window.location.reload(); 
        }
    };

    if (isFullyComplete) return null;

    return (
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-blue-100">Primeiros Passos</CardTitle>
                    <span className="text-sm font-medium text-blue-200">{completedCount}/{steps.length}</span>
                </div>
                <Progress value={progress} className="h-2 bg-blue-950" indicatorClassName="bg-blue-400" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {steps.map((step) => (
                        <div key={step.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                {step.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                ) : (
                                    <Circle className="w-5 h-5 text-blue-400/50" />
                                )}
                                <span className={`text-sm ${step.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                    {step.label}
                                </span>
                            </div>
                            {!step.completed && (
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {step.skippable && (
                                        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => handleSkip(step.id)}>
                                            Pular
                                        </Button>
                                    )}
                                    <Button size="sm" className="h-7 text-xs" onClick={step.action}>
                                        {step.cta} <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
