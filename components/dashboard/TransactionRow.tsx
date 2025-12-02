import React from 'react';
import { Transaction, TransactionType } from '../../types';
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock } from 'lucide-react';
import { Text } from '../ui/typography';
import { PrivacyMask } from '../ui/PrivacyMask';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';

interface TransactionRowProps {
    tx: Transaction;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({ tx }) => {
    const isExpense = tx.type === TransactionType.DESPESA;
    const colorClass = isExpense ? 'text-rose-500' : 'text-emerald-500';
    const isPending = new Date(tx.date) > new Date();

    return (
        <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors group cursor-default">
            <div className="flex items-center gap-3">
                <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" 
                    style={{ backgroundColor: `${tx.category.color}20` }}
                >
                    {tx.category.icon ? (
                        <tx.category.icon className="w-5 h-5" style={{ color: tx.category.color }} />
                    ) : (
                        isExpense ? <ArrowDownLeft className="w-5 h-5 text-rose-500" /> : <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                    )}
                </div>
                <div>
                    <Text size="sm" weight="medium" className="text-white group-hover:text-cyan-200 transition-colors">{tx.description}</Text>
                    <div className="flex items-center gap-2">
                        <Text size="xs" variant="muted" className="capitalize">{formatRelativeTime(tx.date)}</Text>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    {isPending ? (
                                        <Clock className="w-3 h-3 text-amber-500" />
                                    ) : (
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500/50" />
                                    )}
                                </TooltipTrigger>
                                <TooltipContent>
                                    {isPending ? 'Pendente' : 'Concluído'}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
            <PrivacyMask>
                <Text size="sm" weight="bold" className={colorClass}>
                    {isExpense ? '-' : '+'}{formatCurrency(Math.abs(tx.amount))}
                </Text>
            </PrivacyMask>
        </div>
    );
};
