import React, { useState, useMemo } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ScheduledTransaction, TransactionType } from '../../types';
import { formatCurrencyBRL, formatDaysUntil } from '../../utils/formatters';
import { Calendar, XIcon } from '../Icons';
import { Button } from './Button';
import { useDialog } from '../../hooks/useDialog';
import { motion, AnimatePresence } from 'framer-motion';

const UpcomingPaymentItem: React.FC<{ 
    item: ScheduledTransaction; 
    onDismiss: (id: string) => void;
    onLaunch: (item: ScheduledTransaction) => void;
}> = ({ item, onDismiss, onLaunch }) => {
    const { text, color } = formatDaysUntil(item.nextDueDate);
    const isExpense = item.type === TransactionType.DESPESA;

    const colorClasses = {
        red: 'text-[oklch(var(--danger-oklch))]',
        yellow: 'text-[oklch(var(--warning-oklch))]',
        gray: 'text-gray-400',
    };

    return (
        <motion.li
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
            className="flex items-center gap-4 py-3"
        >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.category.color}20` }}>
                <item.category.icon className="w-5 h-5" style={{ color: item.category.color }} />
            </div>
            <div className="flex-grow min-w-0">
                <p className="font-semibold text-white truncate">{item.description}</p>
                <p className={`text-sm font-medium ${colorClasses[color]}`}>{text}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`font-semibold text-right ${isExpense ? 'text-[oklch(var(--danger-oklch))]' : 'text-[oklch(var(--success-oklch))]'}`}>
                    {formatCurrencyBRL(item.amount)}
                </span>
                <Button variant="secondary" size="sm" onClick={() => onLaunch(item)}>
                    Lançar
                </Button>
                <button onClick={() => onDismiss(item.id)} className="p-1 text-gray-500 hover:text-white transition-colors">
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
        </motion.li>
    );
};


export const UpcomingPayments: React.FC = () => {
    const { scheduledTransactions } = useDashboardData();
    const { openDialog } = useDialog();
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);

    const upcomingPayments = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sevenDaysFromNow = new Date(today);
        sevenDaysFromNow.setDate(today.getDate() + 7);

        return scheduledTransactions
            .filter(item => {
                const dueDate = new Date(item.nextDueDate);
                dueDate.setHours(0, 0, 0, 0);
                return dueDate <= sevenDaysFromNow && !dismissedIds.includes(item.id);
            })
            .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime());
    }, [scheduledTransactions, dismissedIds]);

    if (upcomingPayments.length === 0) {
        return null;
    }
    
    const handleDismiss = (id: string) => {
        setDismissedIds(prev => [...prev, id]);
    };

    const handleLaunch = (item: ScheduledTransaction) => {
        openDialog('add-transaction', {
            prefill: {
                description: item.description,
                amount: Math.abs(item.amount),
                type: item.type,
                categoryId: item.categoryId,
                date: new Date().toISOString().split('T')[0], // Lança a transação com a data de hoje
            }
        });
        // Dispensa a notificação após o lançamento
        handleDismiss(item.id);
    };

    return (
        <div className="card">
            <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">Pagamentos Próximos</h2>
            </div>
            <ul className="divide-y divide-[oklch(var(--border-oklch))]">
                <AnimatePresence>
                    {upcomingPayments.map(item => (
                        <UpcomingPaymentItem 
                            key={item.id} 
                            item={item} 
                            onDismiss={handleDismiss}
                            onLaunch={handleLaunch}
                        />
                    ))}
                </AnimatePresence>
            </ul>
        </div>
    );
};
