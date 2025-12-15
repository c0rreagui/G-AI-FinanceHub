import React from 'react';
import { BudgetManager } from '../budgets/BudgetManager';
import { motion } from 'framer-motion';

export const BudgetsView: React.FC = () => {
    return (
        <div className="container mx-auto p-4 md:p-8 pb-24 space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Orçamentos</h1>
                <p className="text-muted-foreground">
                    Defina limites para suas categorias e acompanhe seus gastos em tempo real.
                </p>
            </header>

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
