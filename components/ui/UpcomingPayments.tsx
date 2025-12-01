// components/ui/UpcomingPayments.tsx
import React from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ScheduledTransaction } from '../../types';
import { formatCurrency, formatDaysUntil } from '../../utils/formatters';
import { Calendar } from '../Icons';

const UpcomingPaymentItem: React.FC<{ item: ScheduledTransaction }> = ({ item }) => {
    // FIX: Corrected field name to snake_case to match database schema.
    const daysUntil = formatDaysUntil(item.next_due_date);
    const amountColor = item.amount < 0 ? 'text-red-400' : 'text-green-400';

    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.category.color}20` }}>
                    <item.category.icon className="w-4 h-4" style={{ color: item.category.color }} />
                </div>
                <div>
                    <p className="text-sm font-medium text-white">{item.description}</p>
                    <p className={`text-xs font-semibold ${daysUntil.color === 'red' ? 'text-red-400' : daysUntil.color === 'yellow' ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {daysUntil.text}
                    </p>
                </div>
            </div>
            <p className={`text-sm font-semibold tabular-nums ${amountColor}`}>
                {formatCurrency(item.amount)}
            </p>
        </div>
    )
};

export const UpcomingPayments: React.FC = () => {
    const { scheduledTransactions, loading } = useDashboardData();

    const upcoming = scheduledTransactions
        // FIX: Corrected field name to snake_case to match database schema.
        .filter(t => new Date(t.next_due_date) >= new Date())
        // FIX: Corrected field name to snake_case to match database schema.
        .sort((a, b) => new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime())
        .slice(0, 3);

    if (loading || upcoming.length === 0) {
        return null;
    }

    return (
        <div className="card">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-300" />
                Próximos Vencimentos
            </h2>
            <div className="mt-2 divide-y divide-[oklch(var(--border-oklch))]">
                {upcoming.map(item => (
                    <UpcomingPaymentItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};
