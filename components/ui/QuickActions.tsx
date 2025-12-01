import React, { useState, useEffect } from 'react';
import { useDialog } from '../../hooks/useDialog';
import { ArrowDownLeft, ArrowUpRight, Target, Settings, CheckSquare, Square, QrCode, Send } from 'lucide-react';
import { TransactionType } from '../../types';
import { Button } from './Button';

const ActionButton: React.FC<{ icon: React.ElementType, title: string, ariaLabel: string, onClick: () => void, color: string, isEditing: boolean, isVisible: boolean, onToggle: () => void }> = 
  ({ icon: Icon, title, ariaLabel, onClick, color, isEditing, isVisible, onToggle }) => {
  
  if (!isVisible && !isEditing) return null;

  return (
    <div className="relative group">
        <button
            onClick={isEditing ? onToggle : onClick}
            aria-label={ariaLabel}
            className={`w-full flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-200 ${isVisible ? color : 'bg-gray-800/50 border-2 border-dashed border-gray-600'} text-white font-semibold hover:opacity-90 shadow-lg ${isEditing ? 'cursor-pointer' : ''}`}
        >
            <Icon className={`w-6 h-6 ${!isVisible ? 'opacity-50' : ''}`} />
            <span className={!isVisible ? 'opacity-50' : ''}>{title}</span>
        </button>
        {isEditing && (
            <div className="absolute top-2 right-2 pointer-events-none">
                {isVisible ? <CheckSquare className="w-5 h-5 text-white drop-shadow-md" /> : <Square className="w-5 h-5 text-gray-400" />}
            </div>
        )}
    </div>
  );
};

export const QuickActions: React.FC = () => {
  const { openDialog } = useDialog();
  const [isEditing, setIsEditing] = useState(false);
  const STORAGE_KEY = 'financehub_quick_actions';
  const [visibleActions, setVisibleActions] = useState<{ [key: string]: boolean }>(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { expense: true, income: true, goal: true, scan: true, transfer: true };
  });

  useEffect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleActions));
  }, [visibleActions]);

  const toggleAction = (key: string) => {
      setVisibleActions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Ações Rápidas</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} className="h-6 px-2 text-xs text-muted-foreground hover:text-white">
                <Settings className="w-3 h-3 mr-1" />
                {isEditing ? 'Concluir' : 'Editar'}
            </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
        <ActionButton
            title="Despesa"
            ariaLabel="Adicionar nova despesa"
            icon={ArrowDownLeft}
            color="bg-red-500/80"
            onClick={() => openDialog('add-expense')}
            isEditing={isEditing}
            isVisible={visibleActions.expense}
            onToggle={() => toggleAction('expense')}
        />
        <ActionButton
            title="Receita"
            ariaLabel="Adicionar nova receita"
            icon={ArrowUpRight}
            color="bg-green-500/80"
            onClick={() => openDialog('add-income')}
            isEditing={isEditing}
            isVisible={visibleActions.income}
            onToggle={() => toggleAction('income')}
        />
        <ActionButton
            title="Nova Meta"
            ariaLabel="Criar nova meta financeira"
            icon={Target}
            color="bg-cyan-500/80"
            onClick={() => openDialog('add-goal')}
            isEditing={isEditing}
            isVisible={visibleActions.goal}
            onToggle={() => toggleAction('goal')}
        />
        <ActionButton
            title="Investir"
            ariaLabel="Novo aporte de investimento"
            icon={QrCode} // TODO: Change icon to something more appropriate like TrendingUp
            color="bg-violet-500/80"
            onClick={() => openDialog('add-investment')}
            isEditing={isEditing}
            isVisible={visibleActions.scan}
            onToggle={() => toggleAction('scan')}
        />
        <ActionButton
            title="Transferir"
            ariaLabel="Realizar transferência"
            icon={Send}
            color="bg-blue-500/80"
            onClick={() => alert('Funcionalidade em breve!')}
            isEditing={isEditing}
            isVisible={visibleActions.transfer}
            onToggle={() => toggleAction('transfer')}
        />
        </div>
    </div>
  );
};