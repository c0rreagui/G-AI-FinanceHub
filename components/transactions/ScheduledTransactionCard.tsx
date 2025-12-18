import React from 'react';
import { ScheduledTransaction, TransactionType, TransactionStatus } from '../../types';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useDialog } from '../../hooks/useDialog';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PrivacyMask } from '../ui/PrivacyMask';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../ui/Tooltip';
import { CheckCircle, PencilIcon, TrashIcon, MoreVertical, Clock } from '../Icons';
import { useMediaQuery } from '../../hooks/useMediaQuery';


export const ScheduledTransactionCard: React.FC<{ item: ScheduledTransaction }> = ({ item }) => {
    const { deleteScheduledTransaction, mutatingIds, addTransaction } = useDashboardData();
    const { openDialog } = useDialog();

    const isMutating = mutatingIds.has(item.id);
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    
    // Relative date calculation
    const daysUntilDue = Math.ceil((new Date(item.next_due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    let dateStatus = 'normal';
    let dateText = formatDate(item.next_due_date);
    
    if (daysUntilDue < 0) {
        dateStatus = 'overdue';
        dateText = `Atrasado (${Math.abs(daysUntilDue)}d)`;
    } else if (daysUntilDue === 0) {
        dateStatus = 'today';
        dateText = 'Hoje';
    } else if (daysUntilDue === 1) {
        dateStatus = 'soon';
        dateText = 'Amanhã';
    } else if (daysUntilDue <= 3) {
        dateStatus = 'soon';
        dateText = `Em ${daysUntilDue} dias`;
    }

    const handleEdit = () => openDialog('add-scheduling', { itemToEdit: item });
    
    const handleDelete = () => {
        openDialog('confirmation', {
            title: 'Excluir Agendamento',
            message: `Tem certeza que deseja excluir "${item.description}"?`,
            confirmText: 'Sim, Excluir',
            confirmVariant: 'destructive',
            onConfirm: () => deleteScheduledTransaction(item.id),
        });
    };

    const handlePayNow = () => {
         openDialog('confirmation', {
            title: 'Confirmar Pagamento',
            message: `Deseja lançar "${item.description}" como pago agora?`,
            confirmText: 'Lançar Pagamento',
            onConfirm: () => {
                addTransaction({
                    description: item.description,
                    amount: item.amount,
                    type: item.amount < 0 ? TransactionType.DESPESA : TransactionType.RECEITA,
                    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString(),
                    categoryId: item.category.id,
                    account_id: item.account_id || 'default',
                    status: TransactionStatus.COMPLETED,
                    created_at: new Date().toISOString(),
                    goal_contribution_id: null,
                    debt_payment_id: null,
                    investment_id: null
                });
            },
        });
    };

    return (
        <div 
            className={`group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 ${isMutating ? 'opacity-50 pointer-events-none' : ''}`}
        >
            {/* Status Indicator Strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                dateStatus === 'overdue' ? 'bg-red-500' : 
                dateStatus === 'today' ? 'bg-amber-500' : 
                dateStatus === 'soon' ? 'bg-yellow-500' : 'bg-transparent'
            }`} />

            <div className="p-4 flex items-center gap-4">
                {/* Icon */}
                {(() => {
                    const iconContainerStyle = { backgroundColor: `${item.category.color}20`, boxShadow: `0 0 15px ${item.category.color}10` };
                    const iconStyle = { color: item.category.color };
                    return (
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`} 
                            {...{ style: iconContainerStyle }}>
                            <item.category.icon className="w-6 h-6" 
                                {...{ style: iconStyle }} />
                        </div>
                    );
                })()}

                {/* Content */}
                <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-base font-bold text-white truncate pr-2">{item.description}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs h-5 px-1.5 border-white/10 bg-white/5">
                                    {item.frequency}
                                </Badge>
                                <span className={`text-xs font-medium flex items-center gap-1 ${
                                    dateStatus === 'overdue' ? 'text-red-400' : 
                                    dateStatus === 'today' ? 'text-amber-400' : 
                                    dateStatus === 'soon' ? 'text-yellow-400' : 'text-gray-400'
                                }`}>
                                    <Clock className="w-3 h-3" />
                                    {dateText}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <PrivacyMask>
                                <span className={`font-mono font-bold text-lg block ${item.amount < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {formatCurrency(item.amount)}
                                </span>
                            </PrivacyMask>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                                {item.amount < 0 ? 'Despesa' : 'Receita'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions (Desktop) */}
                {isDesktop && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-200">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10" onClick={handlePayNow}>
                                        <CheckCircle className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Lançar Agora</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10" onClick={handleEdit}>
                            <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={handleDelete}>
                            <TrashIcon className="w-4 h-4" />
                        </Button>
                    </div>
                )}
                
                {/* Mobile Menu Trigger (could be implemented as a dropdown) */}
                {!isDesktop && (
                     <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400" onClick={handleEdit}>
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
};
