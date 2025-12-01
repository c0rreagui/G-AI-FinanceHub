import React from 'react';
import { HealthScoreGauge } from '../HealthScoreGauge';
import { MonthlyChallengesCard } from '../MonthlyChallengesCard';

interface HealthWidgetProps {
    healthScore: number;
}

export const HealthWidget: React.FC<HealthWidgetProps> = ({ healthScore }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <HealthScoreGauge score={healthScore} />
            <MonthlyChallengesCard />
        </div>
    );
};
