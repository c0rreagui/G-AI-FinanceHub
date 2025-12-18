import React from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ScheduledTransaction, TransactionType } from '../../types';
import { formatCurrency, formatDaysUntil } from '../../utils/formatters';
import { Calendar, Check } from 'lucide-react';
import { useDialog } from '../../hooks/useDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';

const UpcomingPaymentItem: React.FC<{ item: ScheduledTransaction }> = ({ item }) => {
    const { openDialog } = useDialog();
    const daysUntil = formatDaysUntil(item.next_due_date);
    const amountColor = item.amount < 0 ? 'text-red-400' : 'text-green-400';
    const isToday = daysUntil.text.toLowerCase().includes('hoje');

    const handlePay = () => {
        openDialog('add-transaction', { 
            prefill: { 
                description: item.description,
                amount: Math.abs(item.amount),
                type: item.amount < 0 ? TransactionType.DESPESA : TransactionType.RECEITA,
                category_id: item.category.id,
                date: new Date().toISOString()
            } 
        });
    };

    return (
        <div className="flex items-center justify-between py-3 group">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: `${item.category.color}20` }}>
                    <item.category.icon className="w-5 h-5" style={{ color: item.category.color }} />
                </div>
                <div>
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                        {item.description}
                        {isToday && (
                            <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded font-bold uppercase tracking-wide animate-pulse">
                                Hoje
                            </span>
                        )}
                    </p>
                    <p className={`text-xs font-semibold ${daysUntil.color === 'red' ? 'text-red-400' : daysUntil.color === 'yellow' ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {daysUntil.text}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <p className={`text-sm font-semibold tabular-nums ${amountColor}`}>
                    {formatCurrency(item.amount)}
                </p>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button 
                                onClick={handlePay}
                                className="w-8 h-8 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                                aria-label="Pagar agora"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Marcar como pago</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
};

export const UpcomingPayments: React.FC = () => {
    const { scheduledTransactions, loading } = useDashboardData();

    const upcoming = scheduledTransactions
        .filter(t => new Date(t.next_due_date) >= new Date(new Date().setHours(0,0,0,0)))
        .sort((a, b) => new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime())
        .slice(0, 3);

    if (loading || upcoming.length === 0) {
        return null;
    }

    return (
        <div className="card bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-cyan-300" />
                Próximos Vencimentos
            </h2>
            <div className="divide-y divide-white/5">
                {upcoming.map(item => (
                    <UpcomingPaymentItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};
