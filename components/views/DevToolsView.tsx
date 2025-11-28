// components/views/DevToolsView.tsx
import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Zap, PlusCircle, TrashIcon, Bell, AlertTriangle, ArrowLeftRight, Target, TrendingDown } from '../Icons';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useDialog } from '../../hooks/useDialog';
import { useToast } from '../../hooks/useToast';
import { Input } from '../ui/Input';

const StateInspector: React.FC = () => {
    const { transactions, goals, debts, scheduledTransactions, summary, userLevel } = useDashboardData();
    const dataToShow = { summary, userLevel };

    return (
        <div className="card">
            <h2 className="text-lg font-semibold text-white mb-3">Live State Inspector</h2>
            <ul className="space-y-2 text-sm">
                <li className="flex justify-between items-center">
                    <span className="text-gray-400">Transações:</span>
                    <span className="font-mono font-semibold text-white">{transactions.length}</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="text-gray-400">Metas:</span>
                    <span className="font-mono font-semibold text-white">{goals.length}</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="text-gray-400">Dívidas:</span>
                    <span className="font-mono font-semibold text-white">{debts.length}</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="text-gray-400">Agendamentos:</span>
                    <span className="font-mono font-semibold text-white">{scheduledTransactions.length}</span>
                </li>
            </ul>
            <details className="mt-4">
                <summary className="cursor-pointer text-xs text-gray-500 hover:text-white">Ver dados computados (JSON)</summary>
                <pre className="mt-2 bg-black/30 p-2 rounded-md text-xs whitespace-pre-wrap font-mono text-cyan-200/80">
                    <code>{JSON.stringify(dataToShow, null, 2)}</code>
                </pre>
            </details>
        </div>
    );
}

import { ViewType } from '../../types';

interface DevToolsViewProps {
    setCurrentView: (view: ViewType) => void;
}

export const DevToolsView: React.FC<DevToolsViewProps> = (props) => {
    const {
        addMockData, clearAllUserData, isMutating,
        addMockTransactions, addMockGoals, addMockDebts,
        clearTable, forceError
    } = useDashboardData();
    const { openDialog } = useDialog();
    const { showToast } = useToast();

    const [txCount, setTxCount] = useState('20');
    const [goalCount, setGoalCount] = useState('3');
    const [debtCount, setDebtCount] = useState('2');

    const handleClearTable = (tableName: 'transactions' | 'goals' | 'debts' | 'scheduled_transactions', friendlyName: string) => {
        openDialog('confirmation', {
            title: `Limpar ${friendlyName}`,
            message: `Tem certeza que deseja apagar TODOS os registros de ${friendlyName}? Esta ação é irreversível.`,
            confirmVariant: 'destructive',
            onConfirm: () => clearTable(tableName),
        });
    };

    const handleClearAll = () => {
        openDialog('confirmation', {
            title: 'Limpar Todos os Dados',
            message: 'Tem certeza que deseja apagar TODOS os dados do usuário, incluindo categorias? Esta ação é irreversível.',
            confirmText: 'Sim, Apagar Tudo',
            confirmVariant: 'destructive',
            onConfirm: clearAllUserData,
        });
    };

    return (
        <div className="flex flex-col h-full">
            <PageHeader
                icon={Zap}
                title="Ferramentas de Desenvolvedor"
                breadcrumbs={['FinanceHub', 'DevTools']}
            />
            <div className="mt-6 flex-grow overflow-y-auto pr-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* COLUNA 1: DADOS E ESTADO */}
                <div className="space-y-6">
                    <StateInspector />

                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-3">Data Seeding</h2>
                        <p className="text-sm text-gray-400 mb-4">Gere dados fictícios granulares para popular o banco de dados.</p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Input id="tx-count" label="" type="number" value={txCount} onChange={e => setTxCount(e.target.value)} className="w-20" />
                                <Button onClick={() => addMockTransactions(Number(txCount))} disabled={isMutating} className="flex-1">
                                    <PlusCircle className="w-4 h-4" /> Gerar Transações
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input id="goal-count" label="" type="number" value={goalCount} onChange={e => setGoalCount(e.target.value)} className="w-20" />
                                <Button onClick={() => addMockGoals(Number(goalCount))} disabled={isMutating} className="flex-1">
                                    <PlusCircle className="w-4 h-4" /> Gerar Metas
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input id="debt-count" label="" type="number" value={debtCount} onChange={e => setDebtCount(e.target.value)} className="w-20" />
                                <Button onClick={() => addMockDebts(Number(debtCount))} disabled={isMutating} className="flex-1">
                                    <PlusCircle className="w-4 h-4" /> Gerar Dívidas
                                </Button>
                            </div>
                            <Button onClick={addMockData} disabled={isMutating} variant="secondary">
                                Adicionar Pacote Padrão Completo
                            </Button>
                        </div>
                    </div>
                </div>

                {/* COLUNA 2: TESTES E AÇÕES DESTRUTIVAS */}
                <div className="space-y-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-3">Component & UI Tests</h2>
                        <div className="space-y-2">
                            <Button onClick={() => props.setCurrentView('design-system')} className="w-full bg-gradient-to-r from-pink-500 to-violet-500 border-0">
                                <Target className="w-4 h-4" /> Abrir Design System Showcase
                            </Button>
                            <Button onClick={() => showToast('Operação bem-sucedida!', { description: 'Este é um toast de sucesso.', type: 'success' })} className="w-full">
                                <Bell className="w-4 h-4" /> Disparar Toast de Sucesso
                            </Button>
                            <Button onClick={() => showToast('Atenção Necessária', { description: 'Este é um toast de informação.', type: 'info' })} variant="secondary" className="w-full">
                                <Bell className="w-4 h-4" /> Disparar Toast de Informação
                            </Button>
                            <Button onClick={() => showToast('Falha na Operação', { description: 'Este é um toast de erro.', type: 'error' })} variant="secondary" className="w-full">
                                <Bell className="w-4 h-4" /> Disparar Toast de Erro
                            </Button>
                            <Button onClick={forceError} variant="destructive" className="w-full">
                                <AlertTriangle className="w-4 h-4" /> Forçar Erro Global (Testar ErrorBoundary)
                            </Button>
                        </div>
                    </div>

                    <div className="card border-red-500/30 bg-red-900/10">
                        <h2 className="text-lg font-semibold text-red-200 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Zona de Perigo
                        </h2>
                        <p className="text-sm text-red-300/80 mt-1 mb-4">Ações nesta seção são destrutivas e não podem ser desfeitas.</p>
                        <div className="space-y-2">
                            <Button onClick={() => handleClearTable('transactions', 'Transações')} variant="secondary" className="w-full">
                                <TrashIcon className="w-4 h-4" /> Limpar Transações
                            </Button>
                            <Button onClick={() => handleClearTable('goals', 'Metas')} variant="secondary" className="w-full">
                                <TrashIcon className="w-4 h-4" /> Limpar Metas
                            </Button>
                            <Button onClick={() => handleClearTable('debts', 'Dívidas')} variant="secondary" className="w-full">
                                <TrashIcon className="w-4 h-4" /> Limpar Dívidas
                            </Button>
                            <div className="border-t border-red-500/20 my-2 !mt-4 !mb-2"></div>
                            <Button onClick={handleClearAll} variant="destructive" className="w-full">
                                <TrashIcon className="w-4 h-4" /> Limpar TODOS os Dados
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};