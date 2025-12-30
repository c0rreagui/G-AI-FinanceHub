import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, TransactionType } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { TrendingUp } from 'lucide-react';

interface BalanceEvolutionChartProps {
    transactions: Transaction[];
    dateRange?: { startDate: string | null; endDate: string | null; };
}

export const BalanceEvolutionChart: React.FC<BalanceEvolutionChartProps> = ({ transactions, dateRange }) => {
    const data = useMemo(() => {
        if (transactions.length === 0) return [];

        // Sort transactions by date ascending
        const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const evolution: { date: string; balance: number; rawDate: number }[] = [];
        let currentBalance = 0;

        // Group by day to avoid too many points
        const groupedByDay: { [key: string]: number } = {};

        sorted.forEach(tx => {
            const dateKey = new Date(tx.date).toISOString().split('T')[0];
            if (!groupedByDay[dateKey]) groupedByDay[dateKey] = 0;
            groupedByDay[dateKey] += tx.amount;
        });

        const dates = Object.keys(groupedByDay).sort((a, b) => a.localeCompare(b));

        dates.forEach(date => {
            currentBalance += groupedByDay[date];
            evolution.push({
                date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
                balance: currentBalance,
                rawDate: new Date(date).getTime()
            });
        });

        // Filter by date range IF provided
        if (dateRange?.startDate && dateRange?.endDate) {
            const start = new Date(dateRange.startDate).getTime();
            const end = new Date(dateRange.endDate).getTime() + (24 * 60 * 60 * 1000) - 1; // End of day
            return evolution.filter(p => p.rawDate >= start && p.rawDate <= end);
        }

        return evolution;
    }, [transactions, dateRange]);

    if (data.length === 0) return null;

    const lastBalance = data[data.length - 1].balance;
    const startBalance = data[0].balance;
    const growth = lastBalance - startBalance;
    const isPositive = growth >= 0;

    return (
        <Card className="h-[400px] flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                        Evolução Patrimonial
                    </CardTitle>
                    <div className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{formatCurrency(growth)} (Total)
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#666"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="#666"
                            fontSize={12}
                            tickFormatter={(val) => `R$${(val / 1000).toFixed(0)}k`}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                            formatter={(value: number) => [formatCurrency(value), 'Saldo Acumulado']}
                            labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="balance"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorBalance)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
