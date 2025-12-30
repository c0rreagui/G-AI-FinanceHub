import React from 'react';
import { Card, CardContent } from '../../ui/Card';
import { QuickActions } from '../../ui/QuickActions';
import { Flex } from '../../ui/Flex';
import { Text, Heading } from '../../ui/AppTypography';
import { Target, Plus } from 'lucide-react';
import { PrivacyMask } from '../../ui/PrivacyMask';
import { Button } from '../../ui/Button';
import { formatCurrency } from '../../../utils/formatters';
import { Goal, ViewType } from '../../../types';
import { EmptyState } from '../../ui/EmptyState';

interface GoalsWidgetProps {
    hiddenModules: string[];
    goals: Goal[];
    setCurrentView: (view: ViewType) => void;
    openDialog: (dialog: any) => void;
    containerSpacing: string;
}

const GoalDonut: React.FC<{ percentage: number; color: string }> = ({ percentage, color }) => {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-slate-700"
                />
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke={color}
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <span className="absolute text-xs font-bold text-white">{Math.round(percentage)}%</span>
        </div>
    );
};

export const GoalsWidget: React.FC<GoalsWidgetProps> = ({ hiddenModules, goals, setCurrentView, openDialog, containerSpacing }) => {
    const topGoals = goals.slice(0, 3);

    return (
        <div className={containerSpacing}>
            <div id="quick-actions">
                <QuickActions />
            </div>
            {!hiddenModules.includes('goals') && (
                <div id="goals-section">
                    <div className="flex items-center justify-between mb-4">
                        <Heading size="h4" className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-400" />
                            Metas Prioritárias
                        </Heading>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentView('goals')} className="text-xs text-muted-foreground hover:text-white">
                            Ver todas
                        </Button>
                    </div>

                    {topGoals.length > 0 ? (
                        <div className="space-y-3">
                            {topGoals.map((goal, index) => (
                                <Card 
                                    key={goal.id} 
                                    className="relative overflow-hidden group cursor-pointer border-slate-700/50 hover:border-purple-500/30 transition-all hover:-translate-y-1" 
                                    onClick={() => setCurrentView('goals')}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex-1 min-w-0 mr-4">
                                            <Text size="sm" className="font-medium text-white truncate mb-1">{goal.name}</Text>
                                            <Flex justify="start" gap="2" className="text-xs text-muted-foreground">
                                                <PrivacyMask>
                                                    <span>{formatCurrency(goal.current_amount)}</span>
                                                </PrivacyMask>
                                                <span>/</span>
                                                <PrivacyMask>
                                                    <span>{formatCurrency(goal.target_amount)}</span>
                                                </PrivacyMask>
                                            </Flex>
                                        </div>
                                        <GoalDonut 
                                            percentage={Math.min((goal.current_amount / goal.target_amount) * 100, 100)} 
                                            color={index === 0 ? "#a855f7" : index === 1 ? "#ec4899" : "#3b82f6"} 
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                            <Button 
                                variant="outline" 
                                className="w-full border-dashed border-slate-700 text-muted-foreground hover:text-white hover:border-slate-600"
                                onClick={() => openDialog('add-goal')}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Nova Meta
                            </Button>
                        </div>

                    ) : (
                        <EmptyState 
                            title="Nenhuma meta definida" 
                            description="Crie objetivos para organizar seus sonhos financeiros." 
                            icon={Target}
                            action={
                                <Button size="sm" variant="secondary" onClick={() => openDialog('add-goal')}>
                                    Criar Meta
                                </Button>
                            }
                            className="border-dashed border border-muted-foreground/20 rounded-xl"
                        />
                    )}
                </div>
            )}
        </div>
    );
};
