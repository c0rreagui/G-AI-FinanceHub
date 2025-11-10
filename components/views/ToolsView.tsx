import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Tool } from '../Icons';
import { ReceiptScanner } from '../tools/ReceiptScanner';

export const ToolsView: React.FC = () => {
    return (
        <>
            <PageHeader
                icon={Tool}
                title="Ferramentas"
                breadcrumbs={['FinanceHub', 'Ferramentas']}
            />
            <div className="mt-6 flex-grow overflow-y-auto pr-2 space-y-6">
                <ReceiptScanner />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 opacity-50">
                        <h3 className="text-lg font-semibold text-white">Calculadora de Juros Compostos</h3>
                        <p className="text-sm text-gray-400 mt-2">Calcule o crescimento dos seus investimentos ao longo do tempo. (Em breve)</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 opacity-50">
                        <h3 className="text-lg font-semibold text-white">Conversor de Moedas</h3>
                        <p className="text-sm text-gray-400 mt-2">Veja as taxas de câmbio mais recentes e converta valores. (Em breve)</p>
                    </div>
                </div>
            </div>
        </>
    );
};