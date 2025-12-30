import React, { useMemo } from 'react';
import { ScheduledTransaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { motion } from 'framer-motion';

interface CalendarGridProps {
    items: ScheduledTransaction[];
    currentDate: Date;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ items, currentDate }) => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Dom, 1 = Seg...

    // Mapeia itens por dia do mês selecionado (currentDate)
    const itemsByDay = useMemo(() => {
        const map = new Map<number, ScheduledTransaction[]>();
        items.forEach(item => {
            const date = new Date(item.next_due_date);
            // Filtra apenas itens do mês/ano passados na prop
            if (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
                const day = date.getDate();
                if (!map.has(day)) map.set(day, []);
                map.get(day)?.push(item);
            }
        });
        return map;
    }, [items, currentDate]);

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptySlots = Array.from({ length: firstDayOfMonth }, (_, i) => i);
    
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

    return (
        <div className="grid grid-cols-7 gap-2 text-sm">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-center text-gray-400 font-bold py-2">{d}</div>
            ))}
            
            {emptySlots.map(i => <div key={`empty-${i}`} className="aspect-square" />)}

            {daysArray.map(day => {
                const dayItems = itemsByDay.get(day) || [];
                const isToday = isCurrentMonth && day === today.getDate();
                
                return (
                    <motion.div 
                        key={day}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        {...({ className: `aspect-square rounded-xl border flex flex-col items-center justify-start pt-1 overflow-hidden relative transition-colors ${isToday ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'border-white/5 bg-white/5 hover:border-white/20'}` } as any)}
                    >
                        <span className={`text-xs font-bold mb-1 ${isToday ? 'text-cyan-400' : 'text-gray-400'}`}>{day}</span>
                        
                        <div className="flex flex-col gap-1 w-full px-1 overflow-y-auto no-scrollbar max-h-[70%]">
                            {dayItems.map(item => (
                                <div key={item.id} className="w-full h-1.5 rounded-full" style={{ backgroundColor: item.category.color }} title={`${item.description} - ${formatCurrency(item.amount)}`} />
                            ))}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};