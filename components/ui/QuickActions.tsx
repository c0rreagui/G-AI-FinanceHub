import React, { useState, useEffect } from 'react';
import { useDialog } from '../../hooks/useDialog';
import { ArrowDownLeft, ArrowUpRight, Target, Settings, CheckSquare, Square, QrCode, Send, Plus, Bot } from 'lucide-react';
import { TransactionType } from '../../types';
import { Button } from './Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';

const ActionButton: React.FC<{ icon: React.ElementType, title: string, ariaLabel: string, onClick: () => void, color: string, isEditing: boolean, isVisible: boolean, onToggle: () => void, shortcut?: string }> =
    ({ icon: Icon, title, ariaLabel, onClick, color, isEditing, isVisible, onToggle, shortcut }) => {

        if (!isVisible && !isEditing) return null;

        const content = (
            <div className="relative group flex flex-col items-center gap-2">
                <button
                    onClick={isEditing ? onToggle : onClick}
                    aria-label={ariaLabel}
                    className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-200 ${isVisible ? color : 'bg-gray-800/50 border-2 border-dashed border-gray-600'} text-white shadow-lg hover:scale-110 hover:shadow-xl hover:brightness-110 active:scale-95 ${isEditing ? 'cursor-pointer' : ''}`}
                >
                    <Icon className={`w-6 h-6 ${!isVisible ? 'opacity-50' : ''}`} />
                </button>
                <span className={`text-xs font-medium text-gray-400 group-hover:text-white transition-colors ${!isVisible ? 'opacity-50' : ''}`}>{title}</span>

                {isEditing && (
                    <div className="absolute -top-1 -right-1 pointer-events-none z-10">
                        {isVisible ? <CheckSquare className="w-5 h-5 text-white drop-shadow-md bg-black rounded-sm" /> : <Square className="w-5 h-5 text-gray-400 bg-black rounded-sm" />}
                    </div>
                )}
            </div>
        );

        if (isEditing) return content;

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {content}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{ariaLabel}</p>
                        {shortcut && <span className="text-xs text-gray-400 ml-2">({shortcut})</span>}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
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

    // Keyboard Shortcut 'N' for New Transaction (Expense by default or open dialog choice)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey && !e.altKey && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                openDialog('add-transaction', { prefill: { type: TransactionType.DESPESA } });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [openDialog]);

    const toggleAction = (key: string) => {
        setVisibleActions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Ações Rápidas
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} className="h-6 px-2 text-xs text-muted-foreground hover:text-white">
                    <Settings className="w-3 h-3 mr-1" />
                    {isEditing ? 'Concluir' : 'Editar'}
                </Button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 justify-items-center">
                <ActionButton
                    title="Despesa"
                    ariaLabel="Adicionar nova despesa"
                    icon={ArrowDownLeft}
                    color="bg-gradient-to-br from-red-500 to-rose-600"
                    onClick={() => openDialog('add-transaction', { prefill: { type: TransactionType.DESPESA } })}
                    isEditing={isEditing}
                    isVisible={visibleActions.expense}
                    onToggle={() => toggleAction('expense')}
                    shortcut="N"
                />
                <ActionButton
                    title="Receita"
                    ariaLabel="Adicionar nova receita"
                    icon={ArrowUpRight}
                    color="bg-gradient-to-br from-emerald-500 to-green-600"
                    onClick={() => openDialog('add-transaction', { prefill: { type: TransactionType.RECEITA } })}
                    isEditing={isEditing}
                    isVisible={visibleActions.income}
                    onToggle={() => toggleAction('income')}
                />
                <ActionButton
                    title="Nova Meta"
                    ariaLabel="Criar nova meta financeira"
                    icon={Target}
                    color="bg-gradient-to-br from-cyan-500 to-blue-600"
                    onClick={() => openDialog('add-goal')}
                    isEditing={isEditing}
                    isVisible={visibleActions.goal}
                    onToggle={() => toggleAction('goal')}
                />
                <ActionButton
                    title="Investir"
                    ariaLabel="Novo aporte de investimento"
                    icon={QrCode}
                    color="bg-gradient-to-br from-violet-500 to-purple-600"
                    onClick={() => openDialog('add-investment')}
                    isEditing={isEditing}
                    isVisible={visibleActions.scan}
                    onToggle={() => toggleAction('scan')}
                />
                <ActionButton
                    title="Transferir"
                    ariaLabel="Realizar transferência"
                    icon={Send}
                    color="bg-gradient-to-br from-blue-500 to-indigo-600"
                    onClick={() => alert('Funcionalidade em breve!')}
                    isEditing={isEditing}
                    isVisible={visibleActions.transfer}
                    onToggle={() => toggleAction('transfer')}
                />
                <ActionButton
                    title="Assistente IA"
                    ariaLabel="Abrir Assistente Financeiro"
                    icon={Bot}
                    color="bg-gradient-to-br from-indigo-500 to-violet-600"
                    onClick={() => openDialog('ai-chat')}
                    isEditing={isEditing}
                    isVisible={true}
                    onToggle={() => { }}
                />
            </div>
        </div>
    );
};