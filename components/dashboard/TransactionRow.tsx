import React from 'react';
import { Transaction, TransactionType } from '../../types';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { CheckCircle2, Clock } from 'lucide-react';
import { Text } from '../ui/AppTypography';
import { PrivacyMask } from '../ui/PrivacyMask';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';
import { MerchantLogo } from '../ui/MerchantLogo';

interface TransactionRowProps {
    tx: Transaction;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({ tx }) => {
    const isExpense = tx.type === TransactionType.DESPESA;
    const colorClass = isExpense ? 'text-rose-500' : 'text-emerald-500';
    const isPending = new Date(tx.date) > new Date();

    return (
        <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors group cursor-default">
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                    <MerchantLogo 
                        merchantName={tx.description} 
                        categoryColor={tx.category.color} 
                        size="md" 
                    />
                </div>
                <div>
                    <Text size="sm" weight="medium" className="text-foreground group-hover:text-primary transition-colors">{tx.description}</Text>
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
