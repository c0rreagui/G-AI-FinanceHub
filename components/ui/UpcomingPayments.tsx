import React, { useState, useMemo, useEffect } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ScheduledTransaction, TransactionType } from '../../types';
import { formatCurrencyBRL, formatDaysUntil } from '../../utils/formatters';
import { Calendar, XIcon } from '../Icons';
import { Button } from './Button';
import { useDialog } from '../../hooks/useDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '../../services/loggingService';

const DISMISSED_PAYMENTS_KEY = 'financehub_dismissed_payments';

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
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-3"
        >
            <div className="flex items-center gap-4 flex-grow w-full">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.category.color}20` }}>
                    <item.category.icon className="w-5 h-5" style={{ color: item.category.color }} />
                </div>
                <div className="flex-grow min-w-0">
                    <p className="font-semibold text-white truncate">{item.description}</p>
                    <p className={`text-sm font-medium ${colorClasses[color]}`}>{text}</p>
                </div>
                <span className={`font-semibold text-right flex-shrink-0 ${isExpense ? 'text-[oklch(var(--danger-oklch))]' : 'text-[oklch(var(--success-oklch))]'}`}>
                    {formatCurrencyBRL(item.amount)}
                </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 self-end">
                <Button variant="secondary" size="sm" onClick={() => onLaunch(item)}>
                    Lançar
                </Button>
                <button onClick={() => onDismiss(item.id)} className="p-2 -m-1 text-gray-500 hover:text-white transition-colors rounded-full" aria-label={`Dispensar ${item.description}`}>
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
        </motion.li>
    );
};


export const UpcomingPayments: React.FC = () => {
    const { scheduledTransactions } = useDashboardData();
    const { openDialog } = useDialog();
    const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
        try {
            const storedIds = localStorage.getItem(DISMISSED_PAYMENTS_KEY);
            return storedIds ? JSON.parse(storedIds) : [];
        } catch (error) {
            logger.warn('Falha ao ler IDs dispensados do localStorage', { error });
            return [];
        }
    });

    // Efeito para sincronizar e limpar IDs dispensados que não existem mais
    useEffect(() => {
        const allScheduledIds = new Set(scheduledTransactions.map(t => t.id));
        const filteredDismissedIds = dismissedIds.filter(id => allScheduledIds.has(id));

        if (filteredDismissedIds.length !== dismissedIds.length) {
            setDismissedIds(filteredDismissedIds);
        }
    }, [scheduledTransactions, dismissedIds]);


    useEffect(() => {
        try {
            localStorage.setItem(DISMISSED_PAYMENTS_KEY, JSON.stringify(dismissedIds));
        } catch (error) {
            logger.warn('Falha ao salvar IDs dispensados no localStorage', { error });
        }
    }, [dismissedIds]);

    const upcomingPayments = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sevenDaysFromNow = new Date(today);
        sevenDaysFromNow.setDate(today.getDate() + 7);

        return scheduledTransactions
            .filter(item => {
                const dueDate = new Date(item.nextDueDate);
                dueDate.setHours(0, 0, 0, 0);
                // Inclui pagamentos vencidos (dueDate <= today) e os dos próximos 7 dias
                return (dueDate <= sevenDaysFromNow) && !dismissedIds.includes(item.id);
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
            },
            // A notificação só é dispensada após o salvamento bem-sucedido.
            onSaveSuccess: () => handleDismiss(item.id)
        });
    };

    return (
        <div className="card">
            <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">Central de Ações</h2>
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