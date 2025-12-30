import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { useDashboardData } from '../../hooks/useDashboardData';
import { getMonthlyChallenges, calculateChallengeProgress } from '../../utils/challenges';
import { Trophy, CheckCircle } from 'lucide-react';

export const MonthlyChallengesCard: React.FC = () => {
    const { transactions } = useDashboardData();
    const challenges = getMonthlyChallenges();

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Desafios do Mês
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {challenges.map(challenge => {
                    const current = calculateChallengeProgress(challenge, transactions);
                    const progress = Math.min(100, (current / challenge.target) * 100);
                    const isCompleted = current >= challenge.target;

                    return (
                        <div key={challenge.id} className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                                <span className={isCompleted ? 'text-green-500 font-medium' : 'text-foreground'}>
                                    {challenge.title}
                                </span>
                                {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{challenge.description}</p>
                            <Progress value={progress} className="h-2" indicatorClassName={isCompleted ? 'bg-green-500' : 'bg-yellow-500'} />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>{challenge.unit === 'currency' ? `R$ ${current.toFixed(0)}` : current} / {challenge.unit === 'currency' ? `R$ ${challenge.target}` : challenge.target}</span>
                                <span>+{challenge.rewardXp} XP</span>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};
