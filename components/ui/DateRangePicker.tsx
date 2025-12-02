import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Button } from './Button';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../utils/utils';
import { Input } from './Input';

interface DateRangePickerProps {
    startDate: string | null;
    endDate: string | null;
    onChange: (start: string | null, end: string | null) => void;
    className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    startDate,
    endDate,
    onChange,
    className
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null, null);
    };

    const displayText = startDate && endDate 
        ? `${format(new Date(startDate), 'dd/MM/yy')} - ${format(new Date(endDate), 'dd/MM/yy')}`
        : startDate 
            ? `A partir de ${format(new Date(startDate), 'dd/MM/yy')}`
            : endDate
                ? `Até ${format(new Date(endDate), 'dd/MM/yy')}`
                : 'Filtrar por data';

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "justify-start text-left font-normal w-full md:w-[240px]",
                        !startDate && !endDate && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="truncate">{displayText}</span>
                    {(startDate || endDate) && (
                        <div 
                            role="button" 
                            onClick={handleClear}
                            className="ml-auto hover:bg-secondary rounded-full p-0.5"
                        >
                            <X className="h-3 w-3" />
                        </div>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 bg-popover border-border" align="start">
                <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Período</h4>
                        <p className="text-sm text-muted-foreground">
                            Selecione o intervalo de datas.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <label htmlFor="start-date" className="text-sm">Início</label>
                            <Input
                                id="start-date"
                                type="date"
                                className="col-span-2 h-8"
                                value={startDate || ''}
                                onChange={(e) => onChange(e.target.value || null, endDate)}
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <label htmlFor="end-date" className="text-sm">Fim</label>
                            <Input
                                id="end-date"
                                type="date"
                                className="col-span-2 h-8"
                                value={endDate || ''}
                                onChange={(e) => onChange(startDate, e.target.value || null)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                                const today = new Date().toISOString().split('T')[0];
                                onChange(today, today);
                                setIsOpen(false);
                            }}
                        >
                            Hoje
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                                const today = new Date();
                                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                                const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
                                onChange(firstDay, lastDay);
                                setIsOpen(false);
                            }}
                        >
                            Este Mês
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
