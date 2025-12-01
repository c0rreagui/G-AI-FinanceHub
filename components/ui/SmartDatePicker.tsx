import React from 'react';
import { Input } from './Input';

interface SmartDatePickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export const SmartDatePicker: React.FC<SmartDatePickerProps> = ({ value, onChange, label }) => {
    const today = new Date().toISOString().split('T')[0];
    
    const setDateOffset = (days: number) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        onChange(date.toISOString().split('T')[0]);
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium text-slate-400">{label}</label>}
            <Input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-slate-900/50 border-white/10 focus:border-white/20"
            />
            <div className="flex gap-2">
                <button 
                    type="button"
                    onClick={() => setDateOffset(-1)}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                    Ontem
                </button>
                <button 
                    type="button"
                    onClick={() => onChange(today)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${value === today ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'}`}
                >
                    Hoje
                </button>
                <button 
                    type="button"
                    onClick={() => setDateOffset(1)}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                    Amanhã
                </button>
            </div>
        </div>
    );
};
