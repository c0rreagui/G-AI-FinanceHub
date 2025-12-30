import React from 'react';
import { QuickActions } from '../../ui/QuickActions';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { TransactionRow } from '../TransactionRow';
import { Transaction, ViewType } from '../../../types';

interface QuickActionsWidgetProps {
    transactions: Transaction[];
    setCurrentView: (view: ViewType) => void;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({ transactions, setCurrentView }) => {
    return (
        <QuickActions />
    );
};
