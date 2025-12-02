import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { TransactionRow } from '../TransactionRow';
import { Text } from '../../ui/AppTypography';
import { Transaction, ViewType } from '../../../types';

interface RecentTransactionsWidgetProps {
    transactions: Transaction[];
    setCurrentView: (view: ViewType) => void;
}

export const RecentTransactionsWidget: React.FC<RecentTransactionsWidgetProps> = ({ transactions, setCurrentView }) => {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Últimas Atividades</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setCurrentView('transactions')} className="text-xs text-primary hover:text-primary/80 h-8">
                    Ver todas
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    {transactions.slice(0, 5).map(tx => (
                        <TransactionRow key={tx.id} tx={tx} />
                    ))}
                    {transactions.length === 0 && <Text variant="muted" align="center" className="py-4">Sem movimentações recentes.</Text>}
                </div>
            </CardContent>
        </Card>
    );
};
