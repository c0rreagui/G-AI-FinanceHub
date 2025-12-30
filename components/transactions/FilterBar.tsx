import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DateRangePicker } from '../ui/DateRangePicker';
import { MultiSelect, Option } from '../ui/MultiSelect';
import { Category, Account } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';

interface FilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    startDate: string | null;
    endDate: string | null;
    onDateChange: (start: string | null, end: string | null) => void;
    selectedCategories: string[];
    onCategoriesChange: (categories: string[]) => void;
    categories: Category[];
    selectedAccounts?: string[];
    onAccountsChange?: (accounts: string[]) => void;
    accounts?: Account[];
    typeFilter: string;
    onTypeFilterChange: (type: string) => void;
    onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    searchTerm,
    onSearchChange,
    startDate,
    endDate,
    onDateChange,
    selectedCategories,
    onCategoriesChange,
    categories,
    selectedAccounts = [],
    onAccountsChange,
    accounts = [],
    typeFilter,
    onTypeFilterChange,
    onClearFilters
}) => {
    // Saved Filters State
    const [savedFilters, setSavedFilters] = React.useState<{ name: string, filter: any }[]>([]);
    const [selectedSavedFilter, setSelectedSavedFilter] = React.useState<string>("");

    React.useEffect(() => {
        const saved = localStorage.getItem('financehub_saved_filters');
        if (saved) {
            try {
                setSavedFilters(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved filters", e);
                localStorage.removeItem('financehub_saved_filters');
            }
        }
    }, []);

    const handleSaveFilter = () => {
        const name = prompt("Nome do filtro:");
        if (!name) return;

        const newFilter = {
            name,
            filter: {
                searchTerm,
                startDate,
                endDate,
                selectedCategories,
                selectedAccounts,
                typeFilter
            }
        };

        const newSavedFilters = [...savedFilters, newFilter];
        setSavedFilters(newSavedFilters);
        localStorage.setItem('financehub_saved_filters', JSON.stringify(newSavedFilters));
    };

    const handleLoadFilter = (filterName: string) => {
        const saved = savedFilters.find(f => f.name === filterName);
        if (saved) {
            setSelectedSavedFilter(filterName);
            const { filter } = saved;
            onSearchChange(filter.searchTerm);
            onDateChange(filter.startDate, filter.endDate);
            onCategoriesChange(filter.selectedCategories);
            if (onAccountsChange) onAccountsChange(filter.selectedAccounts || []);
            onTypeFilterChange(filter.typeFilter);
        }
    };

    const handleDeleteFilter = (e: React.MouseEvent, filterName: string) => {
        e.stopPropagation();
        if (confirm(`Excluir filtro "${filterName}"?`)) {
            const newSavedFilters = savedFilters.filter(f => f.name !== filterName);
            setSavedFilters(newSavedFilters);
            localStorage.setItem('financehub_saved_filters', JSON.stringify(newSavedFilters));
            if (selectedSavedFilter === filterName) setSelectedSavedFilter("");
        }
    };

    const categoryOptions: Option[] = categories.map(c => ({
        label: c.name,
        value: c.id
    }));

    const accountOptions: Option[] = accounts.map(a => ({
        label: a.name,
        value: a.id
    }));

    const hasActiveFilters = startDate || endDate || selectedCategories.length > 0 || selectedAccounts.length > 0 || typeFilter !== 'all';

    const applyQuickFilter = (type: 'today' | 'week' | 'month') => {
        const now = new Date();
        let start, end;

        switch (type) {
            case 'today':
                start = startOfDay(now);
                end = endOfDay(now);
                break;
            case 'week':
                start = startOfWeek(now, { weekStartsOn: 0 }); // Sunday start
                end = endOfWeek(now, { weekStartsOn: 0 });
                break;
            case 'month':
                start = startOfMonth(now);
                end = endOfMonth(now);
                break;
        }

        onDateChange(format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'));
    };

    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                {/* Mobile Filter Toggle */}
                <div className="flex items-center justify-between md:hidden">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="gap-2"
                    >
                        <Filter className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        {isExpanded ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                        {hasActiveFilters && <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{selectedCategories.length + (typeFilter !== 'all' ? 1 : 0)}</Badge>}
                    </Button>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Limpar
                        </Button>
                    )}
                </div>

                {/* Filters - Hidden on mobile unless expanded */}
                <div className={`flex-col xl:flex-row gap-4 ${isExpanded ? 'flex' : 'hidden md:flex'}`}>
                    {/* Search */}
                    <div className="relative flex-grow xl:max-w-xs">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar transações..."
                            className="pl-9 bg-background/50"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>

                    {/* Quick Filters & Date Range */}
                    <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <div className="flex bg-background/50 p-1 rounded-lg border border-input h-10 items-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => applyQuickFilter('today')}
                            >
                                Hoje
                            </Button>
                            <div className="w-px h-4 bg-border mx-1" />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => applyQuickFilter('week')}
                            >
                                Semana
                            </Button>
                            <div className="w-px h-4 bg-border mx-1" />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => applyQuickFilter('month')}
                            >
                                Mês
                            </Button>
                        </div>
                        <DateRangePicker
                            startDate={startDate}
                            endDate={endDate}
                            onChange={onDateChange}
                            className="bg-background/50 w-full sm:w-auto"
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex-grow xl:max-w-xs w-full">
                        <MultiSelect
                            options={categoryOptions}
                            selected={selectedCategories}
                            onChange={onCategoriesChange}
                            placeholder="Filtrar por categorias"
                            className="bg-background/50"
                        />
                    </div>

                    {/* Accounts */}
                    {accounts.length > 0 && onAccountsChange && (
                        <div className="flex-grow xl:max-w-xs w-full">
                            <MultiSelect
                                options={accountOptions}
                                selected={selectedAccounts}
                                onChange={onAccountsChange}
                                placeholder="Filtrar por contas"
                                className="bg-background/50"
                            />
                        </div>
                    )}

                    {/* Type Toggles */}
                    <div className="flex bg-background/50 p-1 rounded-lg border border-input h-10 items-center w-full sm:w-auto justify-center sm:justify-start">
                        <button
                            onClick={() => onTypeFilterChange('all')}
                            className={`px-3 py-1 text-sm rounded-md transition-all ${typeFilter === 'all' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Todas
                        </button>
                        <div className="w-px h-4 bg-border mx-1" />
                        <button
                            onClick={() => onTypeFilterChange('receita')}
                            className={`px-3 py-1 text-sm rounded-md transition-all ${typeFilter === 'receita' ? 'bg-success/10 text-success font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Receitas
                        </button>
                        <div className="w-px h-4 bg-border mx-1" />
                        <button
                            onClick={() => onTypeFilterChange('despesa')}
                            className={`px-3 py-1 text-sm rounded-md transition-all ${typeFilter === 'despesa' ? 'bg-destructive/10 text-destructive font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Despesas
                        </button>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClearFilters}
                            className="text-muted-foreground hover:text-destructive shrink-0"
                            title="Limpar filtros"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="flex gap-2 w-full sm:w-auto items-center">
                    <Button
                        variant="outline"
                        onClick={handleSaveFilter}
                        className="h-10 w-10 p-0"
                        title="Salvar Filtro Atual"
                    >
                        <Filter className="w-4 h-4" />
                    </Button>

                    {savedFilters.length > 0 && (
                        <div className="relative">
                            <select
                                className="h-10 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-[140px]"
                                value={selectedSavedFilter}
                                onChange={(e) => handleLoadFilter(e.target.value)}
                                title="Carregar filtro salvo"
                            >
                                <option value="">Meus Filtros</option>
                                {savedFilters.map(f => (
                                    <option key={f.name} value={f.name}>{f.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Active Filters Badges */}
                {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground self-center">Filtros ativos:</span>
                        {selectedCategories.map(catId => {
                            const cat = categories.find(c => c.id === catId);
                            return cat ? (
                                <Badge key={catId} variant="secondary" className="text-xs gap-1">
                                    {cat.name}
                                    <X
                                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                                        onClick={() => onCategoriesChange(selectedCategories.filter(id => id !== catId))}
                                    />
                                </Badge>
                            ) : null;
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
