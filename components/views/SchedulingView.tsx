import React, { useState, useMemo } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Calendar, PlusCircle, LayoutGrid, List, ChevronDown, Search, AlertTriangle } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ScheduledTransaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { useDialog } from '../../hooks/useDialog';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/skeletons/Skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarGrid } from '../ui/CalendarGrid';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { PrivacyMask } from '../ui/PrivacyMask';
import { ScheduledTransactionCard } from '@/components/transactions/ScheduledTransactionCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

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
            <Card>
                <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Total Mensal</p>
                    <PrivacyMask>
                        <p className={`text-xl font-mono font-bold ${totalMonthly >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {formatCurrency(totalMonthly)}
                        </p>
                    </PrivacyMask>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">A Pagar</p>
                    <PrivacyMask>
                        <p className="text-xl font-mono font-bold text-rose-400">{formatCurrency(expenses)}</p>
                    </PrivacyMask>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">A Receber</p>
                    <PrivacyMask>
                        <p className="text-xl font-mono font-bold text-emerald-400">{formatCurrency(income)}</p>
                    </PrivacyMask>
                </CardContent>
            </Card>
             <Card>
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
            <PageHeader setCurrentView={setCurrentView}
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
                                    className="pl-9 h-9 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                    aria-label="Mudar para visualização em lista"
                                    title="Lista"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setViewMode('calendar')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                    aria-label="Mudar para visualização em calendário"
                                    title="Calendário"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                            <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
                                <SelectTrigger className="w-[140px] h-9">
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="income">Receitas</SelectItem>
                                    <SelectItem value="expense">Despesas</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                                <SelectTrigger className="w-[140px] h-9">
                                    <SelectValue placeholder="Ordenar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date">Por Data</SelectItem>
                                    <SelectItem value="amount">Por Valor</SelectItem>
                                    <SelectItem value="name">Por Nome</SelectItem>
                                </SelectContent>
                            </Select>
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
                                                        <span className="bg-white/10 text-white text-xs px-1.5 py-0.5 rounded-full">{items.length}</span>
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
                                                <button 
                                                    onClick={prevMonth} 
                                                    className="p-2 hover:bg-white/10 rounded-md transition-colors"
                                                    aria-label="Mês anterior"
                                                >
                                                    <ChevronDown className="w-5 h-5 rotate-90" />
                                                </button>
                                                <button onClick={() => setCurrentDate(new Date())} className="px-3 text-xs font-medium hover:bg-white/10 rounded-md transition-colors">
                                                    Hoje
                                                </button>
                                                <button 
                                                    onClick={nextMonth} 
                                                    className="p-2 hover:bg-white/10 rounded-md transition-colors"
                                                    aria-label="Próximo mês"
                                                >
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
