import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';

interface FinancialHeatMapProps {
    transactions: Transaction[];
}

export const FinancialHeatMap: React.FC<FinancialHeatMapProps> = ({ transactions }) => {
    // 1. Process data: Group expenses by date (last 30-60 days?)
    // Let's show the current month or last 5 weeks.
    // A simple grid of 7 columns (days) x 5 rows (weeks).

    const heatmapData = useMemo(() => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 34); // Last 35 days (5 weeks)

        const days = [];
        for (let i = 0; i < 35; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dailyExpenses = transactions
                .filter(t => t.type === TransactionType.DESPESA && t.date.startsWith(dateStr))
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            
            days.push({
                date: date,
                dateStr: dateStr,
                value: dailyExpenses,
                intensity: 0 // Will calculate relative to max
            });
        }

        const maxVal = Math.max(...days.map(d => d.value));
        return days.map(d => ({
            ...d,
            intensity: maxVal > 0 ? d.value / maxVal : 0
        }));
    }, [transactions]);

    const getColor = (intensity: number) => {
        if (intensity === 0) return 'bg-muted';
        if (intensity < 0.2) return 'bg-emerald-900/40';
        if (intensity < 0.4) return 'bg-emerald-700/60';
        if (intensity < 0.6) return 'bg-emerald-600/80';
        if (intensity < 0.8) return 'bg-emerald-500';
        return 'bg-emerald-400';
    };

    // Group by weeks
    const weeks = [];
    for (let i = 0; i < 5; i++) {
        weeks.push(heatmapData.slice(i * 7, (i + 1) * 7));
    }

    const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    return (
        <div className="h-full flex flex-col min-h-[340px] bg-card border border-border rounded-2xl p-4 relative overflow-hidden shadow-sm">
             {/* Background Glow */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span className="w-1 h-4 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"></span>
                    Mapa de Gastos
                </h3>
                <span className="text-xs text-muted-foreground">Últimos 35 dias</span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center relative z-10">
                <div className="grid grid-cols-7 gap-2 mb-2 w-full max-w-[300px]">
                    {weekDays.map((d, i) => (
                        <div key={i} className="text-xs text-center text-muted-foreground font-medium">
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2 w-full max-w-[300px]">
                    {heatmapData.map((day) => (
                        <div 
                            key={day.dateStr}
                            className={`aspect-square rounded-md ${getColor(day.intensity)} transition-all hover:scale-110 cursor-pointer group relative`}
                        >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 min-w-[120px]">
                                <div className="bg-popover border border-border rounded-lg p-2 text-xs shadow-xl">
                                    <p className="font-bold text-popover-foreground mb-1">
                                        {day.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                    </p>
                                    <p className="text-emerald-500 font-mono">
                                        {formatCurrency(day.value)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <span>Menos</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-muted"></div>
                        <div className="w-3 h-3 rounded-sm bg-emerald-900/40"></div>
                        <div className="w-3 h-3 rounded-sm bg-emerald-600/80"></div>
                        <div className="w-3 h-3 rounded-sm bg-emerald-400"></div>
                    </div>
                    <span>Mais</span>
                </div>
            </div>
        </div>
    );
};
