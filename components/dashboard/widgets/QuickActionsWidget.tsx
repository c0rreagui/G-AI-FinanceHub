import React from 'react';
import { QuickActions } from '../../ui/QuickActions';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { TransactionRow } from '../TransactionRow';
import { Transaction, ViewType } from '../../../types';

interface QuickActionsWidgetProps {
    transactions: Transaction[];
    setCurrentView: (view: ViewType) => void;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({ transactions, setCurrentView }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                 <QuickActions />
            </div>
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                        Últimas Transações
                        <Button variant="link" size="sm" className="h-auto p-0 text-cyan-400" onClick={() => setCurrentView('transactions')}>
                            Ver todas
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                        {transactions.slice(0, 4).map(tx => (
                            <TransactionRow key={tx.id} tx={tx} />
                        ))}
                        {transactions.length === 0 && (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                Nenhuma transação recente.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
