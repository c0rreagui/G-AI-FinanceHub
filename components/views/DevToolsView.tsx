// components/views/DevToolsView.tsx
import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Zap } from '../Icons';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useDialog } from '../../hooks/useDialog';

export const DevToolsView: React.FC = () => {
    const { addMockData, clearAllUserData, isMutating } = useDashboardData();
    const { openDialog } = useDialog();

    const handleClearData = () => {
        openDialog('confirmation', {
            title: 'Limpar Todos os Dados',
            message: 'Tem certeza que deseja apagar TODOS os dados do usuário? Esta ação é irreversível.',
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
            <div className="mt-6 flex-grow overflow-y-auto pr-2 space-y-6">
                <div className="card">
                    <h2 className="text-lg font-semibold text-white">Gerenciamento de Dados</h2>
                    <p className="text-sm text-gray-400 mt-1 mb-4">Use estas ações para popular ou limpar o banco de dados para testes.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={addMockData} disabled={isMutating}>
                            Adicionar Dados Fictícios (Mock)
                        </Button>
                        <Button onClick={handleClearData} variant="destructive" disabled={isMutating}>
                            Limpar Todos os Dados do Usuário
                        </Button>
                    </div>
                </div>
                 <div className="card bg-yellow-900/20 border-yellow-500/30">
                    <h2 className="text-lg font-semibold text-yellow-200">Aviso</h2>
                    <p className="text-sm text-yellow-300 mt-1">
                        Estas ferramentas são destinadas apenas para desenvolvimento. Ações como "Limpar Todos os Dados" são destrutivas e não podem ser desfeitas.
                    </p>
                </div>
            </div>
        </div>
    );
};
