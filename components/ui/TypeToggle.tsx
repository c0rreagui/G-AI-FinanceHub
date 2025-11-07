import React from 'react';
import { TransactionType } from '../../types';
import { ArrowDownLeft, ArrowUpRight } from '../Icons';

interface TypeToggleProps {
  selectedType: TransactionType;
  onTypeChange: (type: TransactionType) => void;
}

export const TypeToggle: React.FC<TypeToggleProps> = ({ selectedType, onTypeChange }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo
            </label>
            <div className="flex w-full bg-black/20 p-1 rounded-lg">
                <button
                    type="button"
                    onClick={() => onTypeChange(TransactionType.DESPESA)}
                    className={`w-1/2 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-colors ${
                        selectedType === TransactionType.DESPESA ? 'bg-red-500/80 text-white' : 'text-gray-400 hover:bg-white/5'
                    }`}
                    aria-pressed={selectedType === TransactionType.DESPESA}
                >
                    <ArrowDownLeft className="w-4 h-4" />
                    Despesa
                </button>
                <button
                    type="button"
                    onClick={() => onTypeChange(TransactionType.RECEITA)}
                    className={`w-1/2 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-colors ${
                        selectedType === TransactionType.RECEITA ? 'bg-green-500/80 text-white' : 'text-gray-400 hover:bg-white/5'
                    }`}
                    aria-pressed={selectedType === TransactionType.RECEITA}
                >
                    <ArrowUpRight className="w-4 h-4" />
                    Receita
                </button>
            </div>
        </div>
    );
};