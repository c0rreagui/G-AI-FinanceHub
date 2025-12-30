import React from 'react';
import { BudgetManager } from '../budgets/BudgetManager';
import { motion } from 'framer-motion';
import { PageHeader } from '../layout/PageHeader';
import { PieChart } from '../Icons';

export const BudgetsView: React.FC = () => {
    return (
        <div className="h-full flex flex-col space-y-6">
            <PageHeader 
                icon={<PieChart className="w-8 h-8 text-cyan-300" />}
                title="Orçamentos" 
                subtitle="Defina limites para suas categorias e acompanhe seus gastos em tempo real."
                breadcrumbs={['FinanceHub', 'Orçamentos']}
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
