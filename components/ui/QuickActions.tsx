import React from 'react';
import { useDialog } from '../../hooks/useDialog';
import { ArrowDownLeft, ArrowUpRight, Target } from '../Icons';
import { TransactionType } from '../../types';

const ActionButton: React.FC<{ icon: React.ElementType, title: string, ariaLabel: string, onClick: () => void, color: string }> = 
  ({ icon: Icon, title, ariaLabel, onClick, color }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-200 ${color} text-white font-semibold hover:opacity-90 shadow-lg`}
  >
    <Icon className="w-6 h-6" />
    <span>{title}</span>
  </button>
);

export const QuickActions: React.FC = () => {
  const { openDialog } = useDialog();
  return (
    <div className="grid grid-cols-3 gap-4">
      <ActionButton
        title="Despesa"
        ariaLabel="Adicionar nova despesa"
        icon={ArrowDownLeft}
        color="bg-red-500/80"
        onClick={() => openDialog('add-transaction', { prefill: { type: TransactionType.DESPESA } })}
      />
      <ActionButton
        title="Receita"
        ariaLabel="Adicionar nova receita"
        icon={ArrowUpRight}
        color="bg-green-500/80"
        onClick={() => openDialog('add-transaction', { prefill: { type: TransactionType.RECEITA } })}
      />
      <ActionButton
        title="Nova Meta"
        ariaLabel="Criar nova meta financeira"
        icon={Target}
        color="bg-cyan-500/80"
        onClick={() => openDialog('add-goal')}
      />
    </div>
  );
};