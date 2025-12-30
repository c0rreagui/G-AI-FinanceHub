import React from 'react';
import { BudgetManager } from '../budgets/BudgetManager';
import { motion } from 'framer-motion';
import { PageHeader } from '../layout/PageHeader';
import { PieChart } from '../Icons';
import { ViewType } from '../../types';

interface BudgetsViewProps {
    setCurrentView: (view: ViewType) => void;
}

export const BudgetsView: React.FC<BudgetsViewProps> = ({ setCurrentView }) => {
    return (
        <div className="h-full flex flex-col space-y-6">
            <PageHeader
                setCurrentView={setCurrentView}
                icon={PieChart}
                title="Orçamentos"
                breadcrumbs={[{ label: 'FinanceHub' }, { label: 'Orçamentos', active: true }]}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <BudgetManager />
            </motion.div>
        </div>
    );
};

