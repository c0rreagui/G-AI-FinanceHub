import React from 'react';
import { Card, CardContent } from '../../ui/Card';
import { QuickActions } from '../../ui/QuickActions';
import { Flex } from '../../ui/Flex';
import { Text, Heading } from '../../ui/typography';
import { Target } from '../../Icons';
import { ProgressBar } from '../../ui/ProgressBar';
import { PrivacyMask } from '../../ui/PrivacyMask';
import { Button } from '../../ui/Button';
import { formatCurrencyBRL } from '../../../utils/formatters';
import { Goal, ViewType } from '../../../types';

interface GoalsWidgetProps {
    hiddenModules: string[];
    firstGoal: Goal | undefined;
    setCurrentView: (view: ViewType) => void;
    openDialog: (dialog: any) => void;
    containerSpacing: string;
}

export const GoalsWidget: React.FC<GoalsWidgetProps> = ({ hiddenModules, firstGoal, setCurrentView, openDialog, containerSpacing }) => {
    return (
        <div className={containerSpacing}>
            <div id="quick-actions">
                <QuickActions />
            </div>
            {!hiddenModules.includes('goals') && (
                <div id="goals-section">
                    {firstGoal ? (
                        <Card className="relative overflow-hidden group cursor-pointer border-none bg-card" onClick={() => setCurrentView('goals')}>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <CardContent className="p-5">
                                <Flex justify="between" align="center" className="mb-3">
                                    <Text size="sm" className="text-purple-300 font-medium">Foco Principal</Text>
                                    <Target className="w-4 h-4 text-purple-400" />
                                </Flex>
                                <Heading size="h4" className="mb-4">{firstGoal.name}</Heading>
                                <ProgressBar percentage={(firstGoal.current_amount / firstGoal.target_amount) * 100} color="primary" />
                                <Flex justify="between" className="mt-2">
                                    <PrivacyMask>
                                        <Text size="xs" variant="muted">{formatCurrencyBRL(firstGoal.current_amount)}</Text>
                                    </PrivacyMask>
                                    <PrivacyMask>
                                        <Text size="xs" variant="muted">{formatCurrencyBRL(firstGoal.target_amount)}</Text>
                                    </PrivacyMask>
                                </Flex>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-dashed border-muted-foreground/20 flex flex-col items-center justify-center py-8 bg-transparent">
                            <Text size="sm" variant="muted" className="mb-3">Nenhuma meta definida</Text>
                            <Button size="sm" variant="secondary" onClick={() => openDialog('add-goal')}>Criar Meta</Button>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};
