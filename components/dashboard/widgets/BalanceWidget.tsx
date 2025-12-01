import React from 'react';
import { BalanceCard } from '../BalanceCard';
import { KPICard } from '../KPICard';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { SummaryData } from '../../../types';

interface BalanceWidgetProps {
    summary: SummaryData;
}

export const BalanceWidget: React.FC<BalanceWidgetProps> = ({ summary }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            <BalanceCard balance={summary.totalBalance} className="md:col-span-1 h-full" />
            <KPICard
                title="Receitas (Mês)"
                value={summary.monthlyIncome}
                trend={12}
                icon={ArrowUpRight}
                color="bg-emerald-500"
            />
            <KPICard
                title="Despesas (Mês)"
                value={Math.abs(summary.monthlyExpenses)}
                trend={-5}
                icon={ArrowDownLeft}
                color="bg-rose-500"
            />
        </div>
    );
};
