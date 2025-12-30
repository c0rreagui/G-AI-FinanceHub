import React from 'react';
import { TransactionType } from '../../types';
import { ArrowDownLeft, ArrowUpRight } from '../Icons';
import { motion } from 'framer-motion';
import { triggerHapticFeedback } from '../../utils/haptics';

interface TypeToggleProps {
  selectedType: TransactionType;
  onTypeChange: (type: TransactionType) => void;
}

export const TypeToggle: React.FC<TypeToggleProps> = ({ selectedType, onTypeChange }) => {
    const handleTypeChange = (type: TransactionType) => {
        triggerHapticFeedback();
        onTypeChange(type);
    };

    return (
        <div role="radiogroup" aria-label="Tipo de transação">
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo
            </label>
            <div className="relative flex w-full bg-black/20 p-1 rounded-xl">
                {selectedType === TransactionType.DESPESA && (
                    <motion.div layoutId="toggle-bg" {...({ className: "absolute inset-1 rounded-lg bg-[oklch(var(--danger-oklch))]" } as any)} />
                )}
                {selectedType === TransactionType.RECEITA && (
                    <motion.div layoutId="toggle-bg" {...({ className: "absolute inset-1 rounded-lg bg-[oklch(var(--success-oklch))]" } as any)} />
                )}

                <button
                    type="button"
                    role="radio"
                    onClick={() => handleTypeChange(TransactionType.DESPESA)}
                    className={`relative w-1/2 flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-semibold transition-colors ${
                        selectedType === TransactionType.DESPESA ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    aria-checked={selectedType === TransactionType.DESPESA}
                >
                    <ArrowDownLeft className="w-4 h-4" />
                    Despesa
                </button>
                <button
                    type="button"
                    role="radio"
                    onClick={() => handleTypeChange(TransactionType.RECEITA)}
                    className={`relative w-1/2 flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-semibold transition-colors ${
                        selectedType === TransactionType.RECEITA ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    aria-checked={selectedType === TransactionType.RECEITA}
                >
                    <ArrowUpRight className="w-4 h-4" />
                    Receita
                </button>
            </div>
        </div>
    );
};