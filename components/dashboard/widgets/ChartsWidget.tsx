import React from 'react';
import { MonthlySummaryChart } from '../../ui/charts/MonthlySummaryChart';
import { FinancialHeatMap } from '../../ui/charts/FinancialHeatMap';
import { MonthlyChartData, Transaction } from '../../../types';

interface ChartsWidgetProps {
    monthlyChartData: MonthlyChartData[];
    transactions: Transaction[];
}

export const ChartsWidget: React.FC<ChartsWidgetProps> = ({ monthlyChartData, transactions }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2 h-[350px]">
                <MonthlySummaryChart data={monthlyChartData} />
            </div>
            <div className="h-[350px]">
                <FinancialHeatMap transactions={transactions} />
            </div>
        </div>
    );
};
