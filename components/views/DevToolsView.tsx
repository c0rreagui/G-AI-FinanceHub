// components/views/DevToolsView.tsx
import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Zap, PlusCircle, TrashIcon, Bell, AlertTriangle, ArrowLeftRight, Target, TrendingDown } from '../Icons';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useDialog } from '../../hooks/useDialog';
import { useToast } from '../../hooks/useToast';
import { Input } from '../ui/Input';
import { ViewType } from '../../types';
import { Card, CardContent } from '../ui/Card';

const StateInspector: React.FC = () => {
    const { transactions, goals, debts, scheduledTransactions, summary, userLevel } = useDashboardData();
    const dataToShow = { summary, userLevel };

    return (
        <Card className="p-4">
            <h2 className="text-lg font-semibold text-white mb-3">Live State Inspector</h2>
            <ul className="space-y-2 text-sm">
                <li className="flex justify-between items-center">
                    <span className="text-muted-foreground">Transações:</span>
                    <span className="font-mono font-semibold text-white">{transactions.length}</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="text-muted-foreground">Metas:</span>
                    <span className="font-mono font-semibold text-white">{goals.length}</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="text-muted-foreground">Dívidas:</span>
                    <span className="font-mono font-semibold text-white">{debts.length}</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="text-muted-foreground">Agendamentos:</span>
                    <span className="font-mono font-semibold text-white">{scheduledTransactions.length}</span>
                </li>
            </ul>
            <details className="mt-4">
                <summary className="cursor-pointer text-xs text-muted-foreground hover:text-white">Ver dados computados (JSON)</summary>
                <pre className="mt-2 bg-black/30 p-2 rounded-md text-xs whitespace-pre-wrap font-mono text-cyan-200/80">
                    <code>{JSON.stringify(dataToShow, null, 2)}</code>
                </pre>
            </details>
        </Card>
    );
};

interface DevToolsViewProps {
    setCurrentView: (view: ViewType) => void;
}

export const DevToolsView: React.FC<DevToolsViewProps> = (props) => {
    const { addMockData, clearAllUserData } = useDashboardData();
    const { openDialog } = useDialog();
    const { showToast } = useToast();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleSeed = () => {
        addMockData();
        showToast('Dados de exemplo carregados!', { type: 'success' });
    };

    const handleClear = () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 3000);
            return;
        }
        clearAllUserData();
        setConfirmDelete(false);
        showToast('Todos os dados foram apagados.', { type: 'error' });
    };

    return (
        <div className="space-y-6 pb-24">
            <PageHeader
                title="Developer Tools"
                subtitle="Utilitários para debug e testes"
                icon={<Zap className="w-6 h-6 text-yellow-400" />}
            />

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <Card className="space-y-4 p-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            Ações Rápidas
                        </h2>
                        <div className="grid gap-3">
                            <Button onClick={handleSeed} variant="outline" className="justify-start">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Popular com Dados de Exemplo
                            </Button>
                            <Button
                                onClick={handleClear}
                                variant={confirmDelete ? "destructive" : "outline"}
                                className={`justify-start ${confirmDelete ? 'animate-pulse' : ''}`}
                            >
                                <TrashIcon className="w-4 h-4 mr-2" />
                                {confirmDelete ? 'Confirmar Limpeza Total?' : 'Limpar Todos os Dados'}
                            </Button>
                        </div>
                    </Card>

                    <Card className="space-y-4 p-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Target className="w-5 h-5 text-cyan-400" />
                            Testar Modais
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="ghost" size="sm" onClick={() => openDialog('add-transaction')}>
                                Nova Transação
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openDialog('add-goal')}>
                                Nova Meta
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openDialog('add-debt')}>
                                Nova Dívida
                            </Button>
                            <Button variant="ghost" size="sm" disabled title="Em breve">
                                Editar Perfil
                            </Button>
                        </div>
                    </Card>

                    <Card className="space-y-4 p-4">
                         <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Target className="w-5 h-5 text-pink-400" />
                            Design System
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Visualize e teste os componentes do novo Design System.
                        </p>
                        <Button onClick={() => props.setCurrentView('design-system')} className="w-full bg-gradient-to-r from-pink-500 to-violet-500 border-0">
                            <Target className="w-4 h-4 mr-2" /> Abrir Design System Showcase
                        </Button>
                    </Card>
                </div>

                <div className="space-y-6">
                    <StateInspector />
                    
                    <Card className="space-y-4 p-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Bell className="w-5 h-5 text-blue-400" />
                            Testar Toasts
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" size="sm" onClick={() => showToast('Notificação de Sucesso', { type: 'success' })}>
                                Sucesso
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => showToast('Algo deu errado', { type: 'error' })}>
                                Erro
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => showToast('Aviso importante', { type: 'info' })}>
                                Aviso
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => showToast('Informação do sistema', { type: 'info' })}>
                                Info
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};