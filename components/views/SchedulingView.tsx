import React, { useState, useMemo } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Calendar, PlusCircle, PencilIcon, TrashIcon, LayoutGrid, List, ChevronDown, Search, Filter, ArrowUpRight, ArrowDownLeft, CheckCircle, Clock, AlertTriangle, MoreVertical } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ScheduledTransaction, TransactionType } from '../../types';
import { formatCurrencyBRL, formatDate } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useDialog } from '../../hooks/useDialog';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/skeletons/Skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { CalendarGrid } from '../ui/CalendarGrid';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { PrivacyMask } from '../ui/PrivacyMask';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../ui/Tooltip';

// --- SUB-COMPONENTS ---

const SummaryWidget: React.FC<{ items: ScheduledTransaction[] }> = ({ items }) => {
    const totalMonthly = items.reduce((acc, item) => acc + item.amount, 0);
    const expenses = items.filter(i => i.amount < 0).reduce((acc, i) => acc + i.amount, 0);
    const income = items.filter(i => i.amount > 0).reduce((acc, i) => acc + i.amount, 0);
    const dueSoon = items.filter(i => {
        const days = Math.ceil((new Date(i.next_due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return days >= 0 && days <= 7;
    }).length;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
                <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Total Mensal</p>
                    <PrivacyMask>
                        <p className={`text-xl font-mono font-bold ${totalMonthly >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {formatCurrencyBRL(totalMonthly)}
                        </p>
                    </PrivacyMask>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
                <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">A Pagar</p>
                    <PrivacyMask>
                        <p className="text-xl font-mono font-bold text-rose-400">{formatCurrencyBRL(expenses)}</p>
                    </PrivacyMask>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
                <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">A Receber</p>
                    <PrivacyMask>
                        <p className="text-xl font-mono font-bold text-emerald-400">{formatCurrencyBRL(income)}</p>
                    </PrivacyMask>
                </CardContent>
            </Card>
             <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50">
                <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Vencendo (7d)</p>
                    <div className="flex items-center gap-2">
                        <p className="text-xl font-mono font-bold text-amber-400">{dueSoon}</p>
                        {dueSoon > 0 && <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const ScheduledTransactionCard: React.FC<{ item: ScheduledTransaction }> = ({ item }) => {
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
                    date: new Date().toISOString(),
                    categoryId: item.category.id,
                });
            },
        });
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            {...({ className: `group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 ${isMutating ? 'opacity-50 pointer-events-none' : ''}` } as any)}
        >
            {/* Status Indicator Strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                dateStatus === 'overdue' ? 'bg-red-500' : 
                dateStatus === 'today' ? 'bg-amber-500' : 
                dateStatus === 'soon' ? 'bg-yellow-500' : 'bg-transparent'
            }`} />

            <div className="p-4 flex items-center gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`} style={{backgroundColor: `${item.category.color}20`, boxShadow: `0 0 15px ${item.category.color}10`}}>
                    <item.category.icon className="w-6 h-6" style={{color: item.category.color}} />
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-base font-bold text-white truncate pr-2">{item.description}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-white/10 bg-white/5">
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
                                    {formatCurrencyBRL(item.amount)}
                                </span>
                            </PrivacyMask>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
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
        </motion.div>
    );
};

const SchedulingViewSkeleton: React.FC = () => (
    <div className="mt-6 flex-grow space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
    </div>
);

type ViewMode = 'list' | 'calendar';
type SortOption = 'date' | 'amount' | 'name';
type FilterType = 'all' | 'income' | 'expense';

export const SchedulingView: React.FC = () => {
    const { scheduledTransactions, loading } = useDashboardData();
    const { openDialog } = useDialog();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('date');
    const [filterType, setFilterType] = useState<FilterType>('all');

    // Calendar Navigation
    const nextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    const currentMonthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentDate);

    // Filtering & Sorting
    const filteredItems = useMemo(() => {
        let items = [...scheduledTransactions];

        // Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            items = items.filter(i => i.description.toLowerCase().includes(lower) || i.category.name.toLowerCase().includes(lower));
        }

        // Filter Type
        if (filterType === 'income') items = items.filter(i => i.amount > 0);
        if (filterType === 'expense') items = items.filter(i => i.amount < 0);

        // Sort
        items.sort((a, b) => {
            if (sortBy === 'date') return new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime();
            if (sortBy === 'amount') return Math.abs(b.amount) - Math.abs(a.amount);
            if (sortBy === 'name') return a.description.localeCompare(b.description);
            return 0;
        });

        return items;
    }, [scheduledTransactions, searchTerm, filterType, sortBy]);

    // Grouping for List View
    const groupedItems = useMemo(() => {
        const groups: { [key: string]: ScheduledTransaction[] } = {
            'Atrasados': [],
            'Hoje': [],
            'Próximos 7 Dias': [],
            'Este Mês': [],
            'Futuro': []
        };

        const today = new Date();
        today.setHours(0,0,0,0);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        filteredItems.forEach(item => {
            const dueDate = new Date(item.next_due_date);
            dueDate.setHours(0,0,0,0);

            if (dueDate < today) groups['Atrasados'].push(item);
            else if (dueDate.getTime() === today.getTime()) groups['Hoje'].push(item);
            else if (dueDate <= nextWeek) groups['Próximos 7 Dias'].push(item);
            else if (dueDate.getMonth() === today.getMonth() && dueDate.getFullYear() === today.getFullYear()) groups['Este Mês'].push(item);
            else groups['Futuro'].push(item);
        });

        return groups;
    }, [filteredItems]);

    return (
        <div className="flex flex-col h-full space-y-6 pb-20">
            <PageHeader
                icon={Calendar}
                title="Agendamentos"
                subtitle="Gerencie suas contas fixas e recorrentes"
                breadcrumbs={['FinanceHub', 'Agendamentos']}
                actions={
                    <Button onClick={() => openDialog('add-scheduling')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-900/20">
                        <PlusCircle className="w-4 h-4 mr-2"/> Novo Agendamento
                    </Button>
                }
            />

            {loading ? (
                <SchedulingViewSkeleton />
            ) : (
                <>
                    <SummaryWidget items={scheduledTransactions} />

                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card/50 p-3 rounded-xl border border-white/5 backdrop-blur-sm sticky top-0 z-30">
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input 
                                    placeholder="Buscar agendamento..." 
                                    className="pl-9 bg-black/20 border-white/10 h-9 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex bg-black/20 rounded-lg p-1 border border-white/10">
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setViewMode('calendar')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                            <select 
                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as FilterType)}
                            >
                                <option value="all">Todos</option>
                                <option value="income">Receitas</option>
                                <option value="expense">Despesas</option>
                            </select>

                            <select 
                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                            >
                                <option value="date">Por Data</option>
                                <option value="amount">Por Valor</option>
                                <option value="name">Por Nome</option>
                            </select>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                        {scheduledTransactions.length > 0 ? (
                            <>
                                {viewMode === 'list' ? (
                                    <div className="space-y-8">
                                        {Object.entries(groupedItems).map(([group, items]) => (
                                            items.length > 0 && (
                                                <div key={group} className="space-y-3">
                                                    <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                                                        group === 'Atrasados' ? 'text-red-400' : 
                                                        group === 'Hoje' ? 'text-amber-400' : 'text-gray-400'
                                                    }`}>
                                                        {group}
                                                        <span className="bg-white/10 text-white text-[10px] px-1.5 py-0.5 rounded-full">{items.length}</span>
                                                    </h3>
                                                    <AnimatePresence>
                                                        {items.map(item => (
                                                            <ScheduledTransactionCard key={item.id} item={item} />
                                                        ))}
                                                    </AnimatePresence>
                                                </div>
                                            )
                                        ))}
                                        {filteredItems.length === 0 && (
                                            <div className="text-center py-12 text-gray-500">
                                                <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                <p>Nenhum agendamento encontrado para os filtros atuais.</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }} 
                                        animate={{ opacity: 1, y: 0 }}
                                        {...({ className: "h-full flex flex-col bg-card/30 rounded-2xl border border-white/5 p-4" } as any)}
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-white capitalize flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-blue-400" />
                                                {currentMonthName}
                                            </h3>
                                            <div className="flex gap-1 bg-black/20 rounded-lg p-1">
                                                <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-md transition-colors">
                                                    <ChevronDown className="w-5 h-5 rotate-90" />
                                                </button>
                                                <button onClick={() => setCurrentDate(new Date())} className="px-3 text-xs font-medium hover:bg-white/10 rounded-md transition-colors">
                                                    Hoje
                                                </button>
                                                <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-md transition-colors">
                                                    <ChevronDown className="w-5 h-5 -rotate-90" />
                                                </button>
                                            </div>
                                        </div>
                                        <CalendarGrid items={filteredItems} currentDate={currentDate} />
                                    </motion.div>
                                )}
                            </>
                        ) : (
                            <EmptyState
                                icon={Calendar}
                                title="Nenhum Agendamento"
                                description="Adicione transações recorrentes, como aluguel ou assinaturas, para gerenciá-las aqui."
                            >
                                <Button onClick={() => openDialog('add-scheduling')}>
                                    <PlusCircle className="w-4 h-4 mr-2"/> Criar Agendamento
                                </Button>
                            </EmptyState>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};