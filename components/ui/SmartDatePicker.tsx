import { Button } from './Button';
import { Input } from './Input';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO, isSameDay, subDays, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../utils/utils';

interface SmartDatePickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export const SmartDatePicker: React.FC<SmartDatePickerProps> = ({ value, onChange, label }) => {
    const handleQuickDate = (date: Date) => {
        onChange(format(date, 'yyyy-MM-dd'));
    };

    const currentDate = value ? parseISO(value) : new Date();

    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium text-muted-foreground">{label}</label>}
            <div className="relative">
                <Input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="pl-10" // Make room for the icon
                />
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                        "flex-1 text-xs",
                        isSameDay(currentDate, subDays(new Date(), 1)) && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    onClick={() => handleQuickDate(subDays(new Date(), 1))}
                >
                    Ontem
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                        "flex-1 text-xs",
                        isSameDay(currentDate, new Date()) && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    onClick={() => handleQuickDate(new Date())}
                >
                    Hoje
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                        "flex-1 text-xs",
                        isSameDay(currentDate, addDays(new Date(), 1)) && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    onClick={() => handleQuickDate(addDays(new Date(), 1))}
                >
                    Amanhã
                </Button>
            </div>
        </div>
    );
};

