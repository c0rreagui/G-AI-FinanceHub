import React from 'react';
import { HealthScoreGauge } from '../HealthScoreGauge';

interface HealthWidgetProps {
    healthScore: number;
}

export const HealthWidget: React.FC<HealthWidgetProps> = ({ healthScore }) => {
    return (
        <HealthScoreGauge score={healthScore} />
    );
};
