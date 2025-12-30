import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { TransactionRow } from '../TransactionRow';
import { Text } from '../../ui/AppTypography';
import { Transaction, ViewType } from '../../../types';
import { EmptyState } from '../../ui/EmptyState';
import { Clock } from 'lucide-react';

interface RecentTransactionsWidgetProps {
    transactions: Transaction[];
    setCurrentView: (view: ViewType) => void;
}

export const RecentTransactionsWidget: React.FC<RecentTransactionsWidgetProps> = ({ transactions, setCurrentView }) => {
    return (
        <Card className="h-full glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Últimas Atividades</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setCurrentView('transactions')} className="text-xs text-primary hover:text-primary/80 h-8">
                    Ver todas
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-1 stagger-container">
                    {transactions.slice(0, 5).map(tx => (
                        <div key={tx.id} className="transaction-hover rounded-lg">
                            <TransactionRow tx={tx} />
                        </div>
                    ))}
                    {transactions.length === 0 && (
                        <EmptyState 
                            title="Sem movimentações" 
                            description="Suas transações recentes aparecerão aqui."
                            icon={Clock}
                            className="py-8"
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
