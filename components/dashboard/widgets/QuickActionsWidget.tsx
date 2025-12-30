import React from 'react';
import { QuickActions } from '../../ui/QuickActions';
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
