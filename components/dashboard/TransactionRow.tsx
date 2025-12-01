import React from 'react';
import { Transaction, TransactionType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Text } from '../ui/typography';
import { PrivacyMask } from '../ui/PrivacyMask';

interface TransactionRowProps {
    tx: Transaction;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({ tx }) => {
    const isExpense = tx.type === TransactionType.DESPESA;
    const Icon = isExpense ? ArrowDownLeft : ArrowUpRight;
    const colorClass = isExpense ? 'text-destructive' : 'text-success';

    return (
        <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-muted ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div>
                    <Text size="sm" weight="medium">{tx.description}</Text>
                    <Text size="xs" variant="muted">{formatDate(tx.date)}</Text>
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
