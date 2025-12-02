import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DateRangePicker } from '../ui/DateRangePicker';
import { MultiSelect, Option } from '../ui/MultiSelect';
import { Category } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface FilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    startDate: string | null;
    endDate: string | null;
    onDateChange: (start: string | null, end: string | null) => void;
    selectedCategories: string[];
    onCategoriesChange: (categories: string[]) => void;
    categories: Category[];
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
    typeFilter,
    onTypeFilterChange,
    onClearFilters
}) => {
    const categoryOptions: Option[] = categories.map(c => ({
        label: c.name,
        value: c.id
    }));

    const hasActiveFilters = startDate || endDate || selectedCategories.length > 0 || typeFilter !== 'all';

    return (
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-grow md:max-w-xs">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar transações..." 
                            className="pl-9 bg-background/50"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>

                    {/* Date Range */}
                    <DateRangePicker 
                        startDate={startDate} 
                        endDate={endDate} 
                        onChange={onDateChange}
                        className="bg-background/50"
                    />

                    {/* Categories */}
                    <div className="flex-grow md:max-w-xs">
                        <MultiSelect
                            options={categoryOptions}
                            selected={selectedCategories}
                            onChange={onCategoriesChange}
                            placeholder="Filtrar por categorias"
                            className="bg-background/50"
                        />
                    </div>

                    {/* Type Toggles (Visual only for now, can be expanded) */}
                    <div className="flex bg-background/50 p-1 rounded-lg border border-input h-10 items-center">
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
                            className="text-muted-foreground hover:text-destructive"
                            title="Limpar filtros"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                
                {/* Active Filters Badges (Optional, for better visibility) */}
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
